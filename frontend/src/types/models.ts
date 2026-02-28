export interface Service {
  id: number;
  name: string;
  slug: string;
  summary: string;
  description: string;
  price_from: number;
  duration_minutes: number;
  is_popular: boolean;
  sort_order: number;
}

export interface Specialist {
  id: number;
  full_name: string;
  slug: string;
  title: string;
  summary: string;
  bio: string;
  photo_url?: string | null;
  experience_years: number;
  certifications: string[];
  availability_note: string | null;
  is_active: boolean;
  services: Service[];
}

export interface Partner {
  id: number;
  name: string;
  slug: string;
  type: 'lawyer' | 'psychologist' | 'business';
  summary: string;
  description: string;
  contacts: Record<string, string> | null;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  starts_at: string;
  ends_at: string;
  location: string;
  capacity: number;
  is_published: boolean;
  is_past: boolean;
  registrations_count?: number;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  full_name: string;
  email: string;
  phone: string;
  message?: string;
  consent: boolean;
  status: string;
}

export interface Document {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  file_name: string;
  download_url: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export interface CaseStudy {
  id: number;
  title: string;
  problem: string;
  resolution: string;
  sort_order: number;
  service?: Service;
}

export interface PageContent {
  id: number;
  key: string;
  title: string;
  summary: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
}

export interface Lead {
  id: number;
  type: 'quick' | 'contact';
  full_name: string;
  email?: string;
  phone: string;
  message?: string;
  source?: string;
  status: string;
}

export interface Appointment {
  id: number;
  service: Service;
  specialist: Specialist;
  appointment_at: string;
  full_name: string;
  email?: string;
  phone: string;
  message?: string;
  consent: boolean;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Slot {
  time: string;
  datetime: string;
  available: boolean;
}

export interface SearchResult {
  type: string;
  id: number;
  title: string;
  summary: string;
  url: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}
