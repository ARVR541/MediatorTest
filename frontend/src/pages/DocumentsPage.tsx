import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';

const categoryLabels: Record<string, string> = {
  charter: 'Устав',
  membership: 'Членство',
  standards: 'Стандарты',
  agreements: 'Договоры и формы',
  methods: 'Методики',
};

export function DocumentsPage() {
  useMeta({
    title: 'Документы и база знаний | Медиаторы Ямала',
    description: 'Устав, правила членства, стандарты работы, договоры и методические материалы.',
  });

  const [category, setCategory] = useState('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['documents', category],
    queryFn: () => publicApi.documents(category === 'all' ? undefined : category),
  });

  const documents = data?.documents ?? [];

  const tabs = [
    { key: 'all', label: 'Все' },
    ...(data?.categories?.map((item) => ({ key: item.key, label: categoryLabels[item.key] ?? item.key })) ?? []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="heading-font text-4xl text-accentDeep">Документы и база знаний</h1>
        <Tabs items={tabs} value={category} onChange={setCategory} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : isError ? (
        <EmptyState title="Ошибка загрузки" description="Попробуйте позже." />
      ) : documents.length === 0 ? (
        <EmptyState title="Документы не найдены" description="В выбранной категории пока нет материалов." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map((document) => (
            <Card key={document.id}>
              <p className="text-xs uppercase tracking-wide text-accentGold">{categoryLabels[document.category] ?? document.category}</p>
              <h2 className="heading-font mt-1 text-2xl text-accentDeep">{document.title}</h2>
              <p className="mt-2 text-sm text-muted">{document.summary}</p>
              <a
                href={document.download_url}
                target="_blank"
                rel="noreferrer"
                className="focus-ring mt-4 inline-block text-sm font-semibold text-accentDeep underline-offset-4 hover:underline"
              >
                Скачать {document.file_name}
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
