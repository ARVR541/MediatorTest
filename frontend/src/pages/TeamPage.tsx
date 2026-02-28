import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';

export function TeamPage() {
  useMeta({
    title: 'Команда медиаторов | Медиаторы Ямала',
    description: 'Профили специалистов Ассоциации: опыт, специализации, сертификаты и доступность.',
  });

  const { data: specialists = [], isLoading, isError } = useQuery({
    queryKey: ['specialists'],
    queryFn: publicApi.specialists,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-56" />
        <Skeleton className="h-56" />
      </div>
    );
  }

  if (isError) {
    return <EmptyState title="Ошибка загрузки" description="Не удалось получить список специалистов." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="heading-font text-4xl text-accentDeep">Команда медиаторов</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {specialists.map((specialist) => (
          <Card key={specialist.id}>
            <h2 className="heading-font text-2xl text-accentDeep">{specialist.full_name}</h2>
            <p className="text-sm text-accentGold">{specialist.title}</p>
            <p className="mt-2 text-sm text-muted">{specialist.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
              {specialist.services.slice(0, 3).map((service) => (
                <span key={service.id} className="rounded-full bg-accentDeep/10 px-3 py-1">
                  {service.name}
                </span>
              ))}
            </div>
            <Link to={`/team/${specialist.slug}`} className="focus-ring mt-4 inline-block text-sm font-semibold text-accentDeep underline-offset-4 hover:underline">
              Смотреть профиль
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
