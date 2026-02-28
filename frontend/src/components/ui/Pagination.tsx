import { Button } from '@/components/ui/Button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <Button variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Назад
      </Button>
      <span className="text-sm text-muted">
        Страница {page} из {totalPages}
      </span>
      <Button variant="outline" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Вперёд
      </Button>
    </div>
  );
}
