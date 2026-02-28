import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q')?.trim() ?? '';

  useMeta({
    title: q ? `Поиск: ${q} | Медиаторы Ямала` : 'Поиск по сайту',
    description: 'Поиск по услугам, специалистам, мероприятиям и документам.',
  });

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['search-page', q],
    queryFn: () => publicApi.search(q),
    enabled: q.length >= 2,
  });

  if (q.length < 2) {
    return <EmptyState title="Введите запрос" description="Минимум 2 символа для поиска." />;
  }

  if (isLoading) {
    return <Skeleton className="h-80" />;
  }

  if (isError) {
    return <EmptyState title="Ошибка поиска" description="Повторите попытку чуть позже." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="heading-font text-4xl text-accentDeep">Результаты поиска: {q}</h1>

      {data.length === 0 ? (
        <EmptyState title="Ничего не найдено" description="Попробуйте уточнить запрос." />
      ) : (
        <div className="grid gap-3">
          {data.map((item) => (
            <Card key={`${item.type}-${item.id}`}>
              <p className="text-xs uppercase text-accentGold">{item.type}</p>
              <Link to={item.url} className="heading-font mt-1 block text-2xl text-accentDeep hover:underline">
                {item.title}
              </Link>
              <p className="mt-2 text-sm text-muted">{item.summary}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
