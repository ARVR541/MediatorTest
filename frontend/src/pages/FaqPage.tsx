import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';

export function FaqPage() {
  useMeta({
    title: 'FAQ по медиации | Медиаторы Ямала',
    description: 'Ответы на часто задаваемые вопросы о процедуре медиации.',
  });

  const [openedId, setOpenedId] = useState<number | null>(null);

  const { data: faq = [], isLoading, isError } = useQuery({
    queryKey: ['faq'],
    queryFn: publicApi.faq,
  });

  if (isLoading) {
    return <Skeleton className="h-80" />;
  }

  if (isError) {
    return <EmptyState title="Не удалось загрузить FAQ" description="Попробуйте позже." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="heading-font text-4xl text-accentDeep">FAQ по медиации</h1>
      <div className="grid gap-3">
        {faq.map((item) => {
          const isOpen = openedId === item.id;
          return (
            <Card key={item.id}>
              <button
                type="button"
                className="focus-ring flex w-full items-center justify-between gap-4 text-left"
                onClick={() => setOpenedId(isOpen ? null : item.id)}
              >
                <span className="font-semibold text-accentDeep">{item.question}</span>
                <span className="text-accentGold">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen ? <p className="mt-3 text-sm text-muted">{item.answer}</p> : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
