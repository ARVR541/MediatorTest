import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InputField, TextareaField } from '@/components/ui/FormField';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';
import { parseApiError } from '@/lib/error';

const schema = z.object({
  full_name: z.string().min(2, 'Введите имя'),
  phone: z.string().min(6, 'Введите телефон'),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  message: z.string().min(5, 'Опишите запрос').max(2000, 'Слишком длинное сообщение'),
});

type FormValues = z.infer<typeof schema>;

export function ContactsPage() {
  useMeta({
    title: 'Контакты | Медиаторы Ямала',
    description: 'Свяжитесь с Ассоциацией медиации и права ЯНАО для консультации и записи.',
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      publicApi.createLead({
        ...values,
        type: 'contact',
        source: 'contacts_page',
      }),
    onSuccess: () => {
      form.reset();
    },
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <h1 className="heading-font text-4xl text-accentDeep">Контакты</h1>
        <div className="mt-6 space-y-4 text-sm text-muted">
          <p>
            <span className="block text-xs uppercase">Телефон</span>
            +7 (3492) 00-00-00
          </p>
          <p>
            <span className="block text-xs uppercase">Email</span>
            info@mediatoryamal.ru
          </p>
          <p>
            <span className="block text-xs uppercase">Адрес</span>
            ЯНАО, г. Салехард, ул. Примерная, 10
          </p>
          <p>
            <span className="block text-xs uppercase">Соцсети</span>
            VK / Telegram / YouTube (заглушки MVP)
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="heading-font text-3xl text-accentDeep">Форма обратной связи</h2>
        <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <InputField label="Имя" error={form.formState.errors.full_name?.message} {...form.register('full_name')} />
          <InputField label="Телефон" error={form.formState.errors.phone?.message} {...form.register('phone')} />
          <InputField label="Email" error={form.formState.errors.email?.message} {...form.register('email')} />
          <TextareaField label="Сообщение" rows={5} error={form.formState.errors.message?.message} {...form.register('message')} />

          {mutation.isError ? <p className="text-sm text-red-600">{parseApiError(mutation.error)}</p> : null}
          {mutation.isSuccess ? <p className="text-sm text-emerald-700">Сообщение отправлено. Спасибо за обращение.</p> : null}

          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Отправка...' : 'Отправить'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
