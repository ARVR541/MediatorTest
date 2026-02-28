import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';

export function ServicesPage() {
  useMeta({
    title: 'Услуги медиации | Медиаторы Ямала',
    description: 'Корпоративная, семейная, трудовая и коммерческая медиация в ЯНАО.',
  });

  const { data: services = [], isLoading, isError } = useQuery({
    queryKey: ['services-page'],
    queryFn: publicApi.services,
  });

  if (isLoading) {
    return <Skeleton className="h-80" />;
  }

  if (isError) {
    return <EmptyState title="Не удалось загрузить услуги" description="Повторите попытку позже." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="heading-font text-4xl text-accentDeep">Услуги</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <Card key={service.id}>
            <h2 className="heading-font text-2xl text-accentDeep">{service.name}</h2>
            <p className="mt-2 text-sm text-muted">{service.summary}</p>
            <p className="mt-3 text-sm text-muted">{service.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-accentDeep">от {service.price_from.toLocaleString('ru-RU')} ₽</span>
              <span className="text-muted">{service.duration_minutes} мин</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
