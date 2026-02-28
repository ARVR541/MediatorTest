import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { InputField, TextareaField } from '@/components/ui/FormField';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';
import { parseApiError } from '@/lib/error';

const audienceTabs: TabItem[] = [
  { key: 'business', label: 'Бизнес' },
  { key: 'family', label: 'Семьи' },
  { key: 'specialists', label: 'Специалисты' },
  { key: 'students', label: 'Студенты' },
];

const audienceContent: Record<string, { title: string; text: string; cta: string; link: string }> = {
  business: {
    title: 'Для бизнеса и организаций',
    text: 'Снижаем риски судебных споров, защищаем деловые отношения и экономим ресурсы компании через структурированную медиацию.',
    cta: 'Обсудить корпоративный кейс',
    link: '/booking',
  },
  family: {
    title: 'Для семей и физических лиц',
    text: 'Работаем с семейными и межличностными конфликтами в уважительном формате: конфиденциально, бережно и с юридически корректным результатом.',
    cta: 'Записаться на консультацию',
    link: '/booking',
  },
  specialists: {
    title: 'Для практикующих специалистов',
    text: 'Проводим супервизии и методические разборы для медиаторов, юристов и психологов, повышая качество практики.',
    cta: 'Смотреть FAQ',
    link: '/faq',
  },
  students: {
    title: 'Для студентов и молодых специалистов',
    text: 'Даем практический вход в профессию: от базовых техник до участия в учебных кейсах и семинарах.',
    cta: 'Оставить заявку',
    link: '/contacts',
  },
};

const leadSchema = z.object({
  full_name: z.string().min(2, 'Введите имя'),
  phone: z.string().min(6, 'Введите телефон'),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  message: z.string().min(5, 'Опишите запрос').max(2000, 'Слишком длинное сообщение'),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function HomePage() {
  useMeta({
    title: 'Медиаторы Ямала | Конфиденциальная медиация в ЯНАО',
    description:
      'Гарантия качества, конфиденциальность, экономия времени и финансов. Профессиональное сопровождение конфликтов для бизнеса и семей.',
  });

  const [tab, setTab] = useState('business');

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: publicApi.services,
  });

  const { data: cases = [], isLoading: casesLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: publicApi.cases,
  });

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  const leadMutation = useMutation({
    mutationFn: (values: LeadFormValues) =>
      publicApi.createLead({
        ...values,
        type: 'quick',
        source: 'home_quick_contact',
      }),
    onSuccess: () => {
      form.reset();
    },
  });

  const selectedAudience = audienceContent[tab];
  const popularServices = services.filter((service) => service.is_popular);

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-xl border border-accentDeep/20 bg-accentDeep px-6 py-16 text-white shadow-card md:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(176,141,87,0.35),transparent_40%),radial-gradient(circle_at_85%_70%,rgba(255,255,255,0.12),transparent_40%)]" />
        <motion.div
          className="relative z-10 max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm uppercase tracking-[0.25em] text-accentGold">Ассоциация медиации и права ЯНАО</p>
          <h1 className="heading-font mt-4 text-4xl leading-tight md:text-5xl">
            Быстрое решение конфликтов с гарантией качества и конфиденциальностью
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/90">
            Экономия времени и финансов, доступные цены и профессиональное сопровождение на всех этапах.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/booking" className="focus-ring rounded-lg bg-accentGold px-5 py-3 text-sm font-semibold text-accentDeep">
              Онлайн-запись
            </Link>
            <Link to="/mediation" className="focus-ring rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white">
              Как проходит медиация
            </Link>
          </div>
        </motion.div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="heading-font text-3xl text-accentDeep">Для кого мы работаем</h2>
          <Tabs items={audienceTabs} value={tab} onChange={setTab} />
        </div>
        <Card>
          <h3 className="heading-font text-2xl text-accentDeep">{selectedAudience.title}</h3>
          <p className="mt-2 text-muted">{selectedAudience.text}</p>
          <Link to={selectedAudience.link} className="focus-ring mt-4 inline-block text-sm font-semibold text-accentDeep underline-offset-4 hover:underline">
            {selectedAudience.cta}
          </Link>
        </Card>
      </section>

      <section>
        <h2 className="heading-font mb-5 text-3xl text-accentDeep">Кейсы «было / стало»</h2>
        {casesLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </div>
        ) : cases.length === 0 ? (
          <EmptyState title="Кейсы пока не добавлены" description="Скоро здесь появятся реальные сценарии без персональных данных." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {cases.slice(0, 4).map((item) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card>
                  <h3 className="heading-font text-xl text-accentDeep">{item.title}</h3>
                  <p className="mt-3 text-sm text-muted">{item.problem}</p>
                  <p className="mt-3 rounded-lg bg-accentDeep/5 p-3 text-sm text-accentDeep">{item.resolution}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="heading-font mb-5 text-3xl text-accentDeep">Популярные услуги</h2>
        {servicesLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {popularServices.map((service) => (
              <Card key={service.id}>
                <h3 className="heading-font text-xl text-accentDeep">{service.name}</h3>
                <p className="mt-2 text-sm text-muted">{service.summary}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-accentDeep">от {service.price_from.toLocaleString('ru-RU')} ₽</span>
                  <span className="text-muted">{service.duration_minutes} мин</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section id="quick-contact">
        <Card className="bg-white/90">
          <h2 className="heading-font text-3xl text-accentDeep">Быстрый контакт</h2>
          <p className="mt-2 text-muted">Оставьте запрос, и мы свяжемся с вами для подбора специалиста.</p>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit((values) => leadMutation.mutate(values))}>
            <InputField label="Имя" placeholder="Ваше имя" error={form.formState.errors.full_name?.message} {...form.register('full_name')} />
            <InputField label="Телефон" placeholder="+7 (___) ___-__-__" error={form.formState.errors.phone?.message} {...form.register('phone')} />
            <InputField label="Email" placeholder="mail@example.com" error={form.formState.errors.email?.message} {...form.register('email')} />
            <div className="md:col-span-2">
              <TextareaField
                label="Сообщение"
                rows={4}
                placeholder="Опишите ситуацию"
                error={form.formState.errors.message?.message}
                {...form.register('message')}
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-4">
              {leadMutation.isError ? <p className="text-sm text-red-600">{parseApiError(leadMutation.error)}</p> : null}
              {leadMutation.isSuccess ? <p className="text-sm text-emerald-700">Запрос отправлен. Мы свяжемся с вами.</p> : null}
              <Button type="submit" disabled={leadMutation.isPending}>
                {leadMutation.isPending ? 'Отправка...' : 'Отправить'}
              </Button>
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
}
