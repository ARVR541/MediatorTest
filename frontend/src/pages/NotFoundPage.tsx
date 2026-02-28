import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl">
      <Card className="text-center">
        <h1 className="heading-font text-4xl text-accentDeep">404</h1>
        <p className="mt-2 text-muted">Страница не найдена.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>На главную</Button>
        </Link>
      </Card>
    </div>
  );
}
