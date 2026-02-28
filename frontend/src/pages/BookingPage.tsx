import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stepper } from '@/components/ui/Stepper';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { InputField, TextareaField } from '@/components/ui/FormField';
import { publicApi } from '@/lib/api';
import { useMeta } from '@/hooks/useMeta';
import { parseApiError } from '@/lib/error';

const steps = ['Услуга', 'Специалист', 'Дата/время', 'Контакты', 'Подтверждение'];

const contactsSchema = z.object({
  full_name: z.string().min(2, 'Введите имя'),
  phone: z.string().min(6, 'Введите телефон'),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  message: z.string().max(2000, 'Слишком длинный текст').optional().or(z.literal('')),
  consent: z.boolean().refine((value) => value, 'Требуется согласие'),
});

type ContactsFormValues = z.infer<typeof contactsSchema>;

export function BookingPage() {
  useMeta({
    title: 'Онлайн-запись | Медиаторы Ямала',
    description: 'Пошаговая онлайн-запись на услуги медиации с выбором специалиста и времени.',
  });

  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [specialistId, setSpecialistId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [selectedDatetime, setSelectedDatetime] = useState<string | null>(null);

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: publicApi.services,
  });

  const { data: specialists = [], isLoading: specialistsLoading } = useQuery({
    queryKey: ['specialists'],
    queryFn: publicApi.specialists,
  });

  const filteredSpecialists = useMemo(() => {
    if (!serviceId) return [];
    return specialists.filter((specialist) => specialist.services.some((service) => service.id === serviceId));
  }, [specialists, serviceId]);

  const {
    data: availability,
    isLoading: availabilityLoading,
    isError: availabilityError,
    error: availabilityQueryError,
  } = useQuery({
    queryKey: ['availability', serviceId, specialistId, date],
    queryFn: () => publicApi.availability({ service_id: serviceId!, specialist_id: specialistId!, date }),
    enabled: Boolean(serviceId && specialistId && date),
  });

  const contactsForm = useForm<ContactsFormValues>({
    resolver: zodResolver(contactsSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      message: '',
      consent: false,
    },
  });

  const appointmentMutation = useMutation({
    mutationFn: (values: ContactsFormValues) =>
      publicApi.createAppointment({
        service_id: serviceId,
        specialist_id: specialistId,
        appointment_at: selectedDatetime,
        ...values,
      }),
    onSuccess: () => {
      setStep(5);
    },
  });

  const selectedService = services.find((service) => service.id === serviceId);
  const selectedSpecialist = specialists.find((specialist) => specialist.id === specialistId);

  return (
    <div className="space-y-6">
      <h1 className="heading-font text-4xl text-accentDeep">Онлайн-запись</h1>
      <Stepper steps={steps} currentStep={step} />

      {step === 1 ? (
        <Card>
          <h2 className="heading-font text-3xl text-accentDeep">1. Выберите услугу</h2>
          {servicesLoading ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => {
                    setServiceId(service.id);
                    setSpecialistId(null);
                    setDate('');
                    setSelectedDatetime(null);
                    setStep(2);
                  }}
                  className="focus-ring rounded-lg border border-accentDeep/20 bg-white p-4 text-left transition hover:border-accentDeep/40"
                >
                  <p className="font-semibold text-accentDeep">{service.name}</p>
                  <p className="mt-1 text-sm text-muted">{service.summary}</p>
                </button>
              ))}
            </div>
          )}
        </Card>
      ) : null}

      {step === 2 ? (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="heading-font text-3xl text-accentDeep">2. Выберите специалиста</h2>
            <Button variant="ghost" onClick={() => setStep(1)}>
              Назад
            </Button>
          </div>

          {specialistsLoading ? (
            <Skeleton className="mt-4 h-32" />
          ) : filteredSpecialists.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="Нет доступных специалистов"
                description="Для выбранной услуги пока нет специалистов. Выберите другую услугу."
                actionLabel="Выбрать услугу"
                onAction={() => setStep(1)}
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {filteredSpecialists.map((specialist) => (
                <button
                  key={specialist.id}
                  type="button"
                  onClick={() => {
                    setSpecialistId(specialist.id);
                    setDate('');
                    setSelectedDatetime(null);
                    setStep(3);
                  }}
                  className="focus-ring rounded-lg border border-accentDeep/20 bg-white p-4 text-left transition hover:border-accentDeep/40"
                >
                  <p className="font-semibold text-accentDeep">{specialist.full_name}</p>
                  <p className="text-sm text-accentGold">{specialist.title}</p>
                  <p className="mt-2 text-sm text-muted">{specialist.summary}</p>
                </button>
              ))}
            </div>
          )}
        </Card>
      ) : null}

      {step === 3 ? (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="heading-font text-3xl text-accentDeep">3. Выберите дату и время</h2>
            <Button variant="ghost" onClick={() => setStep(2)}>
              Назад
            </Button>
          </div>

          <div className="mt-4 max-w-xs">
            <InputField
              label="Дата"
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(event) => {
                setDate(event.target.value);
                setSelectedDatetime(null);
              }}
            />
          </div>

          {!date ? <p className="mt-3 text-sm text-muted">Выберите дату для загрузки доступных слотов.</p> : null}

          {date ? (
            <div className="mt-4">
              {availabilityLoading ? (
                <Skeleton className="h-32" />
              ) : availabilityError ? (
                <p className="text-sm text-red-600">{parseApiError(availabilityQueryError)}</p>
              ) : availability && availability.slots.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {availability.slots.map((slot) => (
                    <button
                      key={slot.datetime}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedDatetime(slot.datetime)}
                      className={`focus-ring rounded-lg border px-3 py-2 text-sm transition ${
                        slot.available
                          ? selectedDatetime === slot.datetime
                            ? 'border-accentDeep bg-accentDeep text-white'
                            : 'border-accentDeep/20 bg-white text-accentDeep hover:border-accentDeep/60'
                          : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">На выбранную дату свободных слотов нет.</p>
              )}
            </div>
          ) : null}

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setStep(4)} disabled={!selectedDatetime}>
              Продолжить
            </Button>
          </div>
        </Card>
      ) : null}

      {step === 4 ? (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="heading-font text-3xl text-accentDeep">4. Контактные данные</h2>
            <Button variant="ghost" onClick={() => setStep(3)}>
              Назад
            </Button>
          </div>

          <div className="mt-4 rounded-lg bg-accentDeep/5 p-4 text-sm text-muted">
            <p>
              Услуга: <span className="font-semibold text-accentDeep">{selectedService?.name}</span>
            </p>
            <p>
              Специалист: <span className="font-semibold text-accentDeep">{selectedSpecialist?.full_name}</span>
            </p>
            <p>
              Слот: <span className="font-semibold text-accentDeep">{selectedDatetime ? new Date(selectedDatetime).toLocaleString('ru-RU') : ''}</span>
            </p>
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={contactsForm.handleSubmit((values) => appointmentMutation.mutate(values))}>
            <InputField label="Имя" error={contactsForm.formState.errors.full_name?.message} {...contactsForm.register('full_name')} />
            <InputField label="Телефон" error={contactsForm.formState.errors.phone?.message} {...contactsForm.register('phone')} />
            <InputField label="Email" error={contactsForm.formState.errors.email?.message} {...contactsForm.register('email')} />
            <div className="md:col-span-2">
              <TextareaField label="Комментарий" rows={4} error={contactsForm.formState.errors.message?.message} {...contactsForm.register('message')} />
            </div>

            <label className="md:col-span-2 flex items-start gap-2 text-sm text-muted">
              <input type="checkbox" className="mt-1" {...contactsForm.register('consent')} />
              <span>Я согласен(а) на обработку персональных данных и условия онлайн-записи.</span>
            </label>
            {contactsForm.formState.errors.consent ? (
              <p className="md:col-span-2 text-xs text-red-600">{contactsForm.formState.errors.consent.message}</p>
            ) : null}

            <div className="md:col-span-2 flex items-center justify-between gap-4">
              {appointmentMutation.isError ? <p className="text-sm text-red-600">{parseApiError(appointmentMutation.error)}</p> : null}
              <Button type="submit" disabled={appointmentMutation.isPending}>
                {appointmentMutation.isPending ? 'Создаём запись...' : 'Подтвердить запись'}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {step === 5 ? (
        <Card>
          <h2 className="heading-font text-3xl text-accentDeep">5. Подтверждение</h2>
          <p className="mt-3 text-muted">Заявка создана. Статус вашей записи: pending. Мы свяжемся для подтверждения деталей.</p>
          <div className="mt-4 rounded-lg bg-accentGold/20 p-4 text-sm text-accentDeep">
            <p>Услуга: {selectedService?.name}</p>
            <p>Специалист: {selectedSpecialist?.full_name}</p>
            <p>Дата и время: {selectedDatetime ? new Date(selectedDatetime).toLocaleString('ru-RU') : ''}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => window.location.assign('/')}>На главную</Button>
            <Button
              variant="outline"
              onClick={() => {
                setStep(1);
                setServiceId(null);
                setSpecialistId(null);
                setDate('');
                setSelectedDatetime(null);
                contactsForm.reset();
                appointmentMutation.reset();
              }}
            >
              Создать новую запись
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
