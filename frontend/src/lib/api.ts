import type { Appointment, CaseStudy, Document, FaqItem, Lead, PageContent, SearchResult, Service, Slot, Specialist } from '@/types/models';
import { caseStudies, documents, faqItems, pagesByKey, services, specialists } from '@/lib/contentStore';

const FORMS_API_BASE_URL = import.meta.env.VITE_FORMS_API_BASE_URL ?? '/api';

function buildFormsUrl(path: string) {
  return `${FORMS_API_BASE_URL}${path}`;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { message?: string };
    return payload.message ?? 'Ошибка запроса';
  } catch {
    const text = await response.text();
    return text || 'Ошибка запроса';
  }
}

async function postForm<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(buildFormsUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(JSON.stringify({ message }));
  }

  return response.json() as Promise<T>;
}

function normalizeText(value: string) {
  return value.toLocaleLowerCase('ru-RU');
}

function includesQuery(target: string, query: string) {
  return normalizeText(target).includes(normalizeText(query));
}

function matchesAny(query: string, fields: string[]) {
  return fields.some((field) => includesQuery(field, query));
}

function nextId() {
  return Math.floor(Date.now() / 1000);
}

export const publicApi = {
  services: async (): Promise<Service[]> => services,

  specialists: async (): Promise<Specialist[]> => specialists.filter((specialist) => specialist.is_active),

  specialistBySlug: async (slug: string): Promise<Specialist> => {
    const specialist = specialists.find((item) => item.slug === slug && item.is_active);

    if (!specialist) {
      throw new Error(JSON.stringify({ message: 'Специалист не найден.' }));
    }

    return specialist;
  },

  documents: async (category?: string): Promise<{ documents: Document[]; categories: { key: string; count: number }[] }> => {
    const filteredDocuments = category ? documents.filter((item) => item.category === category) : documents;

    const categoryCounts = documents.reduce<Map<string, number>>((acc, item) => {
      acc.set(item.category, (acc.get(item.category) ?? 0) + 1);
      return acc;
    }, new Map());

    const categories = Array.from(categoryCounts.entries()).map(([key, count]) => ({ key, count }));

    return {
      documents: filteredDocuments,
      categories,
    };
  },

  faq: async (): Promise<FaqItem[]> => [...faqItems].sort((a, b) => a.sort_order - b.sort_order),

  cases: async (): Promise<CaseStudy[]> => [...caseStudies].sort((a, b) => a.sort_order - b.sort_order),

  page: async (key: string): Promise<PageContent> => {
    const page = pagesByKey.get(key);

    if (!page) {
      throw new Error(JSON.stringify({ message: 'Страница не найдена.' }));
    }

    return page;
  },

  createLead: async (payload: unknown): Promise<Lead> => {
    const response = await postForm<{ data?: Lead; message?: string }>('/leads', payload);

    if (response.data) {
      return response.data;
    }

    return {
      id: nextId(),
      type: 'quick',
      full_name: '',
      phone: '',
      status: 'new',
    };
  },

  availability: async (params: { service_id: number; specialist_id: number; date: string }): Promise<{ date: string; slots: Slot[] }> => {
    const selectedSpecialist = specialists.find((specialist) => specialist.id === params.specialist_id && specialist.is_active);

    if (!selectedSpecialist) {
      throw new Error(JSON.stringify({ message: 'Специалист не найден.' }));
    }

    const supportsService = selectedSpecialist.services.some((service) => service.id === params.service_id);
    if (!supportsService) {
      throw new Error(JSON.stringify({ message: 'Специалист не оказывает выбранную услугу.' }));
    }

    const date = new Date(`${params.date}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      throw new Error(JSON.stringify({ message: 'Некорректная дата.' }));
    }

    const day = date.getDay();
    if (day === 0 || day === 6) {
      return {
        date: params.date,
        slots: [],
      };
    }

    const slots: Slot[] = Array.from({ length: 8 }, (_, index) => {
      const hour = 10 + index;
      const datetime = new Date(date);
      datetime.setHours(hour, 0, 0, 0);

      return {
        time: `${hour.toString().padStart(2, '0')}:00`,
        datetime: datetime.toISOString(),
        available: true,
      };
    });

    return {
      date: params.date,
      slots,
    };
  },

  createAppointment: async (payload: unknown): Promise<Appointment> => {
    const response = await postForm<{ data?: Appointment }>('/appointments', payload);

    if (response.data) {
      return response.data;
    }

    throw new Error(JSON.stringify({ message: 'Не удалось создать запись.' }));
  },

  search: async (query: string): Promise<SearchResult[]> => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      return [];
    }

    const serviceResults: SearchResult[] = services
      .filter((item) => matchesAny(normalizedQuery, [item.name, item.summary]))
      .slice(0, 4)
      .map((item) => ({
        type: 'service',
        id: item.id,
        title: item.name,
        summary: item.summary,
        url: '/services',
      }));

    const specialistResults: SearchResult[] = specialists
      .filter((item) => item.is_active)
      .filter((item) => matchesAny(normalizedQuery, [item.full_name, item.summary]))
      .slice(0, 4)
      .map((item) => ({
        type: 'specialist',
        id: item.id,
        title: item.full_name,
        summary: item.summary,
        url: `/team/${item.slug}`,
      }));

    const documentResults: SearchResult[] = documents
      .filter((item) => matchesAny(normalizedQuery, [item.title, item.summary]))
      .slice(0, 4)
      .map((item) => ({
        type: 'document',
        id: item.id,
        title: item.title,
        summary: item.summary,
        url: '/documents',
      }));

    const pageResults: SearchResult[] = Array.from(pagesByKey.values())
      .filter((item) => matchesAny(normalizedQuery, [item.title, item.summary]))
      .slice(0, 4)
      .map((item) => ({
        type: 'page',
        id: item.id,
        title: item.title,
        summary: item.summary,
        url: `/${item.key}`,
      }));

    return [...serviceResults, ...specialistResults, ...documentResults, ...pageResults].slice(0, 12);
  },
};
