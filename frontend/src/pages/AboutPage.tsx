import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';

export function AboutPage() {
  const { data: page, isLoading, isError } = useQuery({
    queryKey: ['page', 'about'],
    queryFn: () => publicApi.page('about'),
  });

  useMeta({
    title: page?.meta_title ?? 'О нас | Медиаторы Ямала',
    description: page?.meta_description ?? 'Миссия, стандарты и документы Ассоциации медиации и права ЯНАО.',
  });

  if (isLoading) {
    return <Skeleton className="h-80" />;
  }

  if (isError || !page) {
    return <EmptyState title="Не удалось загрузить страницу" description="Попробуйте обновить страницу позже." />;
  }

  const blocks = page.content.split('\n\n');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-font text-4xl text-accentDeep">{page.title}</h1>
        <p className="mt-3 max-w-3xl text-muted">{page.summary}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {blocks.map((block, index) => (
          <Card key={index}>
            <p className="text-sm text-muted">{block}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="heading-font text-2xl text-accentDeep">Ключевые ценности</h2>
        <ul className="mt-4 grid gap-2 text-sm text-muted md:grid-cols-2">
          <li>Гарантия качества и профессиональной этики</li>
          <li>Строгая конфиденциальность информации</li>
          <li>Экономия времени и финансов сторон</li>
          <li>Сопровождение на всех этапах процесса</li>
          <li>Доступные цены и прозрачные условия</li>
          <li>Быстрое решение конфликтов без эскалации</li>
        </ul>
      </Card>
    </div>
  );
}
