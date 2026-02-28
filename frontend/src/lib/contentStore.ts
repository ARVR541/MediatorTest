import type { CaseStudy, Document, FaqItem, PageContent, Service, Specialist } from '@/types/models';

export const services: Service[] = [
  {
    id: 1,
    name: 'Корпоративная медиация',
    slug: 'korporativnaia-mediaciia',
    summary: 'Разрешение корпоративных конфликтов с гарантией качества и конфиденциальности.',
    description:
      'Сопровождаем конфликты между участниками бизнеса, руководством и командами. Обеспечиваем профессиональное сопровождение на всех этапах и сокращаем издержки на судебные процессы.',
    price_from: 35000,
    duration_minutes: 120,
    is_popular: true,
    sort_order: 1,
  },
  {
    id: 2,
    name: 'Семейные споры',
    slug: 'semeinye-spory',
    summary: 'Медиация по семейным и межличностным вопросам в безопасном и уважительном формате.',
    description:
      'Помогаем выстроить диалог по вопросам развода, общения с детьми, имущественных и эмоционально сложных разногласий. Фокус на сохранении отношений и быстром достижении договорённостей.',
    price_from: 12000,
    duration_minutes: 90,
    is_popular: true,
    sort_order: 2,
  },
  {
    id: 3,
    name: 'Трудовые конфликты',
    slug: 'trudovye-konflikty',
    summary: 'Урегулирование споров между работодателем и сотрудниками без эскалации.',
    description:
      'Снижаем репутационные и кадровые риски, помогаем сторонам зафиксировать прозрачные договорённости, учитывающие правовые и организационные интересы.',
    price_from: 18000,
    duration_minutes: 90,
    is_popular: true,
    sort_order: 3,
  },
  {
    id: 4,
    name: 'Коммерческие споры',
    slug: 'kommercheskie-spory',
    summary: 'Досудебное урегулирование между контрагентами и партнёрами.',
    description:
      'Позволяем сохранить деловые отношения, ускорить принятие решений и избежать затяжных судебных разбирательств. Ориентируемся на экономию времени и финансов.',
    price_from: 28000,
    duration_minutes: 120,
    is_popular: true,
    sort_order: 4,
  },
  {
    id: 5,
    name: 'Специальные программы',
    slug: 'spetsialnye-programmy',
    summary: 'Корпоративные и социальные программы по профилактике конфликтов.',
    description:
      'Разрабатываем программы под задачи организаций, учреждений и НКО: регламенты коммуникаций, тренинги и комплексное внедрение медиативного подхода.',
    price_from: 60000,
    duration_minutes: 180,
    is_popular: false,
    sort_order: 5,
  },
  {
    id: 6,
    name: 'Обучение и супервизия',
    slug: 'obuchenie-i-superviziia',
    summary: 'Программы для специалистов, студентов и молодых медиаторов.',
    description:
      'Проводим семинары, практикумы и супервизию кейсов. Повышаем качество практики и правовую грамотность через разбор реальных сценариев.',
    price_from: 9000,
    duration_minutes: 120,
    is_popular: false,
    sort_order: 6,
  },
];

const servicesById = new Map(services.map((service) => [service.id, service]));

type SpecialistSeed = Omit<Specialist, 'services'> & { service_ids: number[] };

const specialistsSeed: SpecialistSeed[] = [
  {
    id: 1,
    full_name: 'Лаба Елена Халитовна',
    slug: 'alina-sergeevna-petrova',
    title: 'Старший медиатор по корпоративным спорам',
    summary: '15+ лет в правовом сопровождении и альтернативном разрешении споров.',
    bio: 'Сопровождает сложные корпоративные конфликты, ведёт переговорные стратегии для бизнеса в ЯНАО. Специализируется на многосторонних переговорах.',
    photo_url: '/files/specialists/2026-02-26 23.28.17',
    experience_years: 15,
    certifications: ['Федеральный медиатор', 'Сертификат по переговорным стратегиям'],
    availability_note: 'Будни с 10:00 до 17:00',
    is_active: true,
    service_ids: [1, 4],
  },
  {
    id: 2,
    full_name: 'Игорь Павлович Романов',
    slug: 'igor-pavlovich-romanov',
    title: 'Медиатор по трудовым и корпоративным конфликтам',
    summary: 'Эксперт по внутренним трудовым спорам и переговорам в компаниях.',
    bio: 'Работает с конфликтами в организациях, помогает выстраивать устойчивые регламенты взаимодействия между работодателем и персоналом.',
    experience_years: 12,
    certifications: ['Профессиональный медиатор', 'Курс по конфликтологии'],
    availability_note: 'Будни с 11:00 до 18:00',
    is_active: true,
    service_ids: [3, 1],
  },
  {
    id: 3,
    full_name: 'Наталья Викторовна Соколова',
    slug: 'natalia-viktorovna-sokolova',
    title: 'Семейный медиатор',
    summary: 'Сопровождение семейных и межличностных конфликтов с акцентом на безопасность сторон.',
    bio: 'Помогает семьям достигать рабочих соглашений без эскалации. Практика в вопросах бракоразводных процессов и договорённостей о детях.',
    experience_years: 10,
    certifications: ['Семейная медиация', 'Психология конфликта'],
    availability_note: 'Будни и суббота до 16:00',
    is_active: true,
    service_ids: [2],
  },
  {
    id: 4,
    full_name: 'Дмитрий Андреевич Волков',
    slug: 'dmitrii-andreevich-volkov',
    title: 'Медиатор коммерческих споров',
    summary: 'Опыт в b2b-конфликтах, договорных и претензионных кейсах.',
    bio: 'Фокусируется на быстром урегулировании споров между контрагентами с сохранением деловых отношений и прозрачной фиксацией договорённостей.',
    experience_years: 9,
    certifications: ['Коммерческая медиация', 'Бизнес-переговоры'],
    availability_note: 'Будни 10:00–18:00',
    is_active: true,
    service_ids: [4],
  },
  {
    id: 5,
    full_name: 'Марина Олеговна Крылова',
    slug: 'marina-olegovna-krylova',
    title: 'Медиатор специальных программ',
    summary: 'Проектирует программы профилактики конфликтов для организаций и НКО.',
    bio: 'Разрабатывает и внедряет комплексные медиативные программы: от диагностики рисков до обучения команд и супервизии внедрения.',
    experience_years: 11,
    certifications: ['Управление конфликтами', 'Оргразвитие'],
    availability_note: 'Будни 09:30–17:30',
    is_active: true,
    service_ids: [5, 6],
  },
  {
    id: 6,
    full_name: 'Светлана Игоревна Баранова',
    slug: 'svetlana-igorevna-baranova',
    title: 'Тренер-медиатор',
    summary: 'Обучение специалистов и студентов практикам медиации.',
    bio: 'Проводит учебные курсы, практикумы и разборы кейсов для начинающих и практикующих специалистов в ЯНАО.',
    experience_years: 8,
    certifications: ['Педагогика дополнительного образования', 'Медиация в образовании'],
    availability_note: 'По расписанию программ',
    is_active: true,
    service_ids: [6],
  },
  {
    id: 7,
    full_name: 'Руслан Тимурович Ахметов',
    slug: 'ruslan-timurovich-akhmetov',
    title: 'Медиатор по межличностным конфликтам',
    summary: 'Работа с эмоционально сложными переговорами и восстановлением диалога.',
    bio: 'Специализируется на межличностных конфликтах и сложных коммуникациях. Помогает сторонам выработать реалистичные и выполнимые соглашения.',
    experience_years: 7,
    certifications: ['Медиация базовый курс', 'Ненасильственная коммуникация'],
    availability_note: 'Будни после 12:00',
    is_active: true,
    service_ids: [2, 3],
  },
  {
    id: 8,
    full_name: 'Елена Аркадьевна Миронова',
    slug: 'elena-arkadevna-mironova',
    title: 'Медиатор по социальным проектам',
    summary: 'Сопровождение общественных и межведомственных конфликтов.',
    bio: 'Работает с муниципальными и общественными структурами, координирует переговоры в проектах с высокой социальной значимостью.',
    experience_years: 13,
    certifications: ['Социальная медиация', 'Публичные коммуникации'],
    availability_note: 'Будни 10:00–16:00',
    is_active: true,
    service_ids: [5, 1],
  },
];

export const specialists: Specialist[] = specialistsSeed.map(({ service_ids, ...specialist }) => ({
  ...specialist,
  services: service_ids
    .map((id) => servicesById.get(id))
    .filter((value): value is Service => Boolean(value)),
}));

export const documents: Document[] = [
  {
    id: 1,
    title: 'Устав Ассоциации медиации и права ЯНАО',
    slug: 'ustav-associacii-mediacii-i-prava-ianao',
    category: 'charter',
    summary: 'Базовый учредительный документ организации.',
    file_name: 'ustav-associacii-mediacii-i-prava-ianao.txt',
    download_url: '/files/documents/ustav-associacii-mediacii-i-prava-ianao.txt',
  },
  {
    id: 2,
    title: 'Положение о правлении Ассоциации',
    slug: 'polozenie-o-pravlenii-associacii',
    category: 'charter',
    summary: 'Регламент структуры управления и полномочий.',
    file_name: 'polozenie-o-pravlenii-associacii.txt',
    download_url: '/files/documents/polozenie-o-pravlenii-associacii.txt',
  },
  {
    id: 3,
    title: 'Правила членства для физических лиц',
    slug: 'pravila-clenstva-dlia-fiziceskix-lic',
    category: 'membership',
    summary: 'Критерии вступления, права и обязанности члена Ассоциации.',
    file_name: 'pravila-clenstva-dlia-fiziceskix-lic.txt',
    download_url: '/files/documents/pravila-clenstva-dlia-fiziceskix-lic.txt',
  },
  {
    id: 4,
    title: 'Правила членства для организаций',
    slug: 'pravila-clenstva-dlia-organizacii',
    category: 'membership',
    summary: 'Порядок вступления и взаимодействия для юридических лиц.',
    file_name: 'pravila-clenstva-dlia-organizacii.txt',
    download_url: '/files/documents/pravila-clenstva-dlia-organizacii.txt',
  },
  {
    id: 5,
    title: 'Стандарт проведения медиативной сессии',
    slug: 'standart-provedeniia-mediativnoi-sessii',
    category: 'standards',
    summary: 'Пошаговый стандарт качества процедуры медиации.',
    file_name: 'standart-provedeniia-mediativnoi-sessii.txt',
    download_url: '/files/documents/standart-provedeniia-mediativnoi-sessii.txt',
  },
  {
    id: 6,
    title: 'Этический кодекс медиатора Ассоциации',
    slug: 'eticeskii-kodeks-mediatora-associacii',
    category: 'standards',
    summary: 'Профессиональные нормы поведения и конфиденциальности.',
    file_name: 'eticeskii-kodeks-mediatora-associacii.txt',
    download_url: '/files/documents/eticeskii-kodeks-mediatora-associacii.txt',
  },
  {
    id: 7,
    title: 'Форма соглашения о проведении медиации',
    slug: 'forma-soglaseniia-o-provedenii-mediacii',
    category: 'agreements',
    summary: 'Типовой шаблон соглашения между сторонами и медиатором.',
    file_name: 'forma-soglaseniia-o-provedenii-mediacii.txt',
    download_url: '/files/documents/forma-soglaseniia-o-provedenii-mediacii.txt',
  },
  {
    id: 8,
    title: 'Шаблон медиативного соглашения',
    slug: 'sablon-mediativnogo-soglaseniia',
    category: 'agreements',
    summary: 'Форма итогового документа по результатам процедуры.',
    file_name: 'sablon-mediativnogo-soglaseniia.txt',
    download_url: '/files/documents/sablon-mediativnogo-soglaseniia.txt',
  },
  {
    id: 9,
    title: 'Форма согласия на обработку персональных данных',
    slug: 'forma-soglasiia-na-obrabotku-personalnyx-dannyx',
    category: 'agreements',
    summary: 'Обязательная форма согласия для участников процедур и мероприятий.',
    file_name: 'forma-soglasiia-na-obrabotku-personalnyx-dannyx.txt',
    download_url: '/files/documents/forma-soglasiia-na-obrabotku-personalnyx-dannyx.txt',
  },
  {
    id: 10,
    title: 'Методические рекомендации по семейной медиации',
    slug: 'metodiceskie-rekomendacii-po-semeinoi-mediacii',
    category: 'methods',
    summary: 'Практические подходы и ограничения в семейных спорах.',
    file_name: 'metodiceskie-rekomendacii-po-semeinoi-mediacii.txt',
    download_url: '/files/documents/metodiceskie-rekomendacii-po-semeinoi-mediacii.txt',
  },
  {
    id: 11,
    title: 'Методические рекомендации по корпоративной медиации',
    slug: 'metodiceskie-rekomendacii-po-korporativnoi-mediacii',
    category: 'methods',
    summary: 'Инструменты для урегулирования корпоративных конфликтов.',
    file_name: 'metodiceskie-rekomendacii-po-korporativnoi-mediacii.txt',
    download_url: '/files/documents/metodiceskie-rekomendacii-po-korporativnoi-mediacii.txt',
  },
  {
    id: 12,
    title: 'Методика оценки эффективности медиации',
    slug: 'metodika-ocenki-effektivnosti-mediacii',
    category: 'methods',
    summary: 'Подход к измерению качества и результата процедур.',
    file_name: 'metodika-ocenki-effektivnosti-mediacii.txt',
    download_url: '/files/documents/metodika-ocenki-effektivnosti-mediacii.txt',
  },
];

export const faqItems: FaqItem[] = [
  {
    id: 1,
    question: 'Что такое медиация?',
    answer:
      'Медиация — это добровольная процедура урегулирования спора при участии нейтрального посредника, который помогает сторонам выработать взаимоприемлемое решение.',
    sort_order: 1,
  },
  {
    id: 2,
    question: 'Чем медиация лучше суда?',
    answer:
      'Медиация обычно быстрее, дешевле и конфиденциальнее. Она позволяет сохранить рабочие и личные отношения, а также гибко сформулировать договорённости.',
    sort_order: 2,
  },
  {
    id: 3,
    question: 'Решение медиатора обязательно?',
    answer:
      'Медиатор не выносит решение за стороны. Обязательной становится только та договорённость, которую стороны добровольно подписали.',
    sort_order: 3,
  },
  {
    id: 4,
    question: 'Можно ли прийти без юриста?',
    answer:
      'Да, можно. При необходимости мы подключаем партнёров-юристов для дополнительной правовой проверки формулировок соглашения.',
    sort_order: 4,
  },
  {
    id: 5,
    question: 'Сколько длится процедура?',
    answer:
      'В зависимости от сложности кейса: от одной встречи до нескольких сессий. В среднем спор решается быстрее, чем в судебном порядке.',
    sort_order: 5,
  },
  {
    id: 6,
    question: 'Конфиденциальна ли информация?',
    answer:
      'Да. Конфиденциальность — базовый принцип нашей работы. Данные сторон и детали переговоров не разглашаются.',
    sort_order: 6,
  },
  {
    id: 7,
    question: 'Работаете ли вы с бизнесом?',
    answer:
      'Да. Мы сопровождаем корпоративные, коммерческие и трудовые конфликты, а также внедряем медиативные программы в организации.',
    sort_order: 7,
  },
  {
    id: 8,
    question: 'Есть ли онлайн-формат?',
    answer: 'Да. Доступны консультации и часть сессий в онлайн-формате, если это подходит всем участникам.',
    sort_order: 8,
  },
  {
    id: 9,
    question: 'Как записаться на медиацию?',
    answer:
      'Через страницу «Онлайн-запись»: выберите услугу, специалиста, дату и время, затем оставьте контактные данные и согласие.',
    sort_order: 9,
  },
  {
    id: 10,
    question: 'Можно ли отменить запись?',
    answer:
      'Да, при заблаговременном уведомлении. Статус записи можно уточнить по телефону или через форму обратной связи.',
    sort_order: 10,
  },
];

const serviceBySlug = new Map(services.map((service) => [service.slug, service]));

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: 'Конфликт совладельцев в торговой компании',
    problem: 'Было: спор о распределении управленческих полномочий, риск блокировки операционной деятельности.',
    resolution: 'Стало: подписано медиативное соглашение с новым регламентом принятия решений и зон ответственности.',
    sort_order: 1,
    service: serviceBySlug.get('korporativnaia-mediaciia'),
  },
  {
    id: 2,
    title: 'Семейный спор о порядке общения с ребёнком',
    problem: 'Было: высокая эмоциональная напряжённость и отсутствие рабочих договорённостей между родителями.',
    resolution: 'Стало: согласован график общения и механизм корректировок без повторной эскалации.',
    sort_order: 2,
    service: serviceBySlug.get('semeinye-spory'),
  },
  {
    id: 3,
    title: 'Трудовой спор в производственной компании',
    problem: 'Было: претензии сотрудников к условиям премирования и угрозы массовых жалоб.',
    resolution: 'Стало: согласована прозрачная модель оценки KPI и порядок обратной связи.',
    sort_order: 3,
    service: serviceBySlug.get('trudovye-konflikty'),
  },
  {
    id: 4,
    title: 'Коммерческий спор между подрядчиком и заказчиком',
    problem: 'Было: взаимные претензии по срокам и объёму работ, риск судебного иска.',
    resolution: 'Стало: подписан график доработок и этапный порядок закрытия обязательств.',
    sort_order: 4,
    service: serviceBySlug.get('kommercheskie-spory'),
  },
  {
    id: 5,
    title: 'Конфликт в команде муниципального проекта',
    problem: 'Было: межведомственные разногласия тормозили запуск социальной программы.',
    resolution: 'Стало: выстроен единый протокол коммуникации и согласованы контрольные точки проекта.',
    sort_order: 5,
    service: serviceBySlug.get('spetsialnye-programmy'),
  },
  {
    id: 6,
    title: 'Спор между отделами в крупной компании',
    problem: 'Было: регулярные внутренние конфликты и рост операционных задержек.',
    resolution: 'Стало: внедрён стандарт внутренних переговоров и медиативный регламент эскалации.',
    sort_order: 6,
    service: serviceBySlug.get('spetsialnye-programmy'),
  },
  {
    id: 7,
    title: 'Семейный имущественный спор',
    problem: 'Было: стороны не могли договориться о распределении имущества после развода.',
    resolution: 'Стало: достигнут баланс интересов, подготовлено юридически корректное соглашение.',
    sort_order: 7,
    service: serviceBySlug.get('semeinye-spory'),
  },
  {
    id: 8,
    title: 'Претензионный спор между поставщиками',
    problem: 'Было: взаимные финансовые претензии, репутационные риски и разрыв сотрудничества.',
    resolution: 'Стало: реструктурирован график платежей и сохранено стратегическое партнёрство.',
    sort_order: 8,
    service: serviceBySlug.get('kommercheskie-spory'),
  },
];

export const pages: PageContent[] = [
  {
    id: 1,
    key: 'about',
    title: 'О нас',
    summary: 'Ассоциация медиации и права ЯНАО работает на стыке правовой экспертизы и практики конструктивного диалога.',
    content:
      'Миссия: формировать устойчивую культуру мирного урегулирования конфликтов в ЯНАО.\n\nМы обеспечиваем гарантию качества, конфиденциальность, экономию времени и финансов, профессиональное сопровождение на всех этапах и доступные цены.\n\nДокументы и стандарты: устав, правила членства, этический кодекс, регламенты медиативных процедур.\n\nЧленство: для специалистов, организаций и партнёров, разделяющих стандарты профессиональной медиации.',
    meta_title: 'О нас | Медиаторы Ямала',
    meta_description: 'Миссия, стандарты, документы и правила членства Ассоциации медиации и права ЯНАО.',
  },
  {
    id: 2,
    key: 'mediation',
    title: 'Что такое медиация',
    summary: 'Медиация — это профессиональная и конфиденциальная процедура, позволяющая быстрее и гибче разрешать споры.',
    content:
      'Виды: семейная, корпоративная, трудовая, коммерческая, социальная.\n\nПреимущества перед судом: скорость, конфиденциальность, контролируемые расходы и сохранение отношений.\n\nЭтапы процесса: диагностика запроса, подготовка сторон, переговорные сессии, фиксация соглашения, пост-сопровождение.\n\nКаждый кейс сопровождается медиатором с профильной специализацией и правовой поддержкой при необходимости.',
    meta_title: 'Медиация | Принципы и этапы',
    meta_description: 'Виды медиации, преимущества перед судом и этапы процедуры для бизнеса и физических лиц.',
  },
];

export const pagesByKey = new Map(pages.map((page) => [page.key, page]));
