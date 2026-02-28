import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';

export function SpecialistPage() {
  const { slug = '' } = useParams();

  const { data: specialist, isLoading, isError } = useQuery({
    queryKey: ['specialist', slug],
    queryFn: () => publicApi.specialistBySlug(slug),
    enabled: Boolean(slug),
  });

  useMeta({
    title: specialist ? `${specialist.full_name} | Команда медиаторов` : 'Профиль специалиста',
    description: specialist?.summary,
  });

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  if (isError || !specialist) {
    return <EmptyState title="Специалист не найден" description="Проверьте корректность ссылки или вернитесь к списку команды." />;
  }

  return (
    <div className="space-y-6">
      <Link to="/team" className="text-sm text-muted hover:text-accentDeep">
        ← Назад к команде
      </Link>

      <Card>
        <h1 className="heading-font text-4xl text-accentDeep">{specialist.full_name}</h1>
        <p className="mt-1 text-lg text-accentGold">{specialist.title}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-accentDeep/5 p-4">
            <p className="text-xs uppercase text-muted">Опыт</p>
            <p className="mt-1 font-semibold text-accentDeep">{specialist.experience_years} лет</p>
          </div>
          <div className="rounded-lg bg-accentDeep/5 p-4">
            <p className="text-xs uppercase text-muted">Доступность</p>
            <p className="mt-1 font-semibold text-accentDeep">{specialist.availability_note ?? 'По согласованию'}</p>
          </div>
          <div className="rounded-lg bg-accentDeep/5 p-4">
            <p className="text-xs uppercase text-muted">Статус</p>
            <p className="mt-1 font-semibold text-accentDeep">{specialist.is_active ? 'Активно ведёт приём' : 'Временный перерыв'}</p>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">{specialist.bio}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="heading-font text-2xl text-accentDeep">Специализации</h2>
            <ul className="mt-3 grid gap-2 text-sm text-muted">
              {specialist.services.map((service) => (
                <li key={service.id}>• {service.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="heading-font text-2xl text-accentDeep">Сертификаты</h2>
            <ul className="mt-3 grid gap-2 text-sm text-muted">
              {specialist.certifications.map((cert, index) => (
                <li key={index}>• {cert}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
