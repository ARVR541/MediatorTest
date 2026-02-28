import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';

const timeline = [
  { step: '01', title: 'Первичная консультация', description: 'Уточняем запрос, оцениваем контекст и определяем формат работы.' },
  { step: '02', title: 'Подготовка сторон', description: 'Фиксируем правила процесса, роли, рамки конфиденциальности и ожидания.' },
  { step: '03', title: 'Медиативные сессии', description: 'Структурируем переговоры, выявляем интересы и формируем варианты решений.' },
  { step: '04', title: 'Соглашение', description: 'Фиксируем договорённости в понятном и юридически выверенном виде.' },
  { step: '05', title: 'Пост-сопровождение', description: 'Проверяем устойчивость исполнения и при необходимости проводим корректирующую встречу.' },
];

export function MediationPage() {
  const { data: page, isLoading, isError } = useQuery({
    queryKey: ['page', 'mediation'],
    queryFn: () => publicApi.page('mediation'),
  });

  useMeta({
    title: page?.meta_title ?? 'Медиация | Медиаторы Ямала',
    description: page?.meta_description ?? 'Что такое медиация, её преимущества и этапы процедуры.',
  });

  if (isLoading) {
    return <Skeleton className="h-80" />;
  }

  if (isError || !page) {
    return <EmptyState title="Раздел недоступен" description="Попробуйте открыть страницу позже." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="heading-font text-4xl text-accentDeep">{page.title}</h1>
      <p className="max-w-3xl text-muted">{page.summary}</p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h2 className="heading-font text-2xl text-accentDeep">Виды</h2>
          <p className="mt-2 text-sm text-muted">Семейная, корпоративная, трудовая, коммерческая и социальная медиация.</p>
        </Card>
        <Card>
          <h2 className="heading-font text-2xl text-accentDeep">Преимущества</h2>
          <p className="mt-2 text-sm text-muted">Конфиденциальность, скорость, доступные цены и сохранение отношений.</p>
        </Card>
        <Card>
          <h2 className="heading-font text-2xl text-accentDeep">Сопровождение</h2>
          <p className="mt-2 text-sm text-muted">Профессиональное ведение процесса на всех этапах — от запроса до результата.</p>
        </Card>
      </div>

      <Card>
        <h2 className="heading-font text-3xl text-accentDeep">Этапы процесса</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {timeline.map((item) => (
            <div key={item.step} className="rounded-lg border border-accentDeep/10 bg-white p-4">
              <p className="text-xs font-semibold text-accentGold">Шаг {item.step}</p>
              <h3 className="mt-1 text-sm font-semibold text-accentDeep">{item.title}</h3>
              <p className="mt-2 text-xs text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
