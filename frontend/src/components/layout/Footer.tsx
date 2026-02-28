import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-accentDeep/10 bg-accentDeep text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <h3 className="heading-font text-2xl">Медиаторы Ямала</h3>
          <p className="mt-3 text-sm text-white/80">
            Гарантия качества, конфиденциальность и профессиональное сопровождение на всех этапах.
          </p>
        </div>

        <div>
          <h4 className="heading-font text-lg">Контакты</h4>
          <p className="mt-3 text-sm text-white/80">+7 (3492) 00-00-00</p>
          <p className="text-sm text-white/80">info@mediatoryamal.ru</p>
          <p className="text-sm text-white/80">ЯНАО, г. Салехард, ул. Примерная, 10</p>
        </div>

        <div>
          <h4 className="heading-font text-lg">Быстрые ссылки</h4>
          <div className="mt-3 grid gap-2 text-sm text-white/80">
            <Link className="hover:text-accentGold" to="/services">
              Услуги
            </Link>
            <Link className="hover:text-accentGold" to="/documents">
              Документы
            </Link>
            <Link className="hover:text-accentGold" to="/booking">
              Онлайн-запись
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/20 py-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} Ассоциация медиации и права ЯНАО
      </div>
    </footer>
  );
}
