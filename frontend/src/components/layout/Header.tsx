import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { publicApi } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';

const navigation = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О нас' },
  { to: '/services', label: 'Услуги' },
  { to: '/team', label: 'Команда' },
  { to: '/mediation', label: 'Медиация' },
  { to: '/documents', label: 'Документы' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contacts', label: 'Контакты' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const navigate = useNavigate();

  const { data: suggestions = [] } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => publicApi.search(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
  });

  const hasSuggestions = useMemo(() => suggestions.length > 0, [suggestions]);
  const canUsePortal = typeof document !== 'undefined';

  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-accentDeep/10 bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link to="/" className="focus-ring rounded-md">
            <span className="heading-font text-xl text-accentDeep">Медиаторы Ямала</span>
          </Link>

          <button
            type="button"
            className="focus-ring inline-flex items-center gap-2 rounded-md border border-accentDeep/20 bg-white px-3 py-2 text-sm font-semibold text-accentDeep"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="site-burger-menu"
            aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span>{isMenuOpen ? '✕' : '☰'}</span>
            <span>Меню</span>
          </button>
        </div>
      </header>

      {canUsePortal
        ? createPortal(
            <>
              {isMenuOpen ? (
                <div className="fixed inset-0 z-[100]">
                  <button
                    type="button"
                    className="h-full w-full bg-accentDeep/60 backdrop-blur-sm"
                    aria-label="Закрыть меню"
                    onClick={() => setIsMenuOpen(false)}
                  />
                </div>
              ) : null}

              <div
                id="site-burger-menu"
                className={clsx(
                  'fixed right-0 top-0 z-[110] h-full w-full max-w-sm transform border-l border-accentDeep/20 bg-white p-5 shadow-[0_24px_80px_-24px_rgba(19,50,76,0.55)] transition-transform duration-300',
                  isMenuOpen ? 'translate-x-0' : 'translate-x-full',
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="heading-font text-2xl text-accentDeep">Навигация</span>
                  <button
                    type="button"
                    className="focus-ring rounded-md p-2 text-accentDeep"
                    aria-label="Закрыть меню"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <form
                  className="relative"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (query.trim()) {
                      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                      setIsSearchFocused(false);
                      setIsMenuOpen(false);
                    }
                  }}
                >
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => window.setTimeout(() => setIsSearchFocused(false), 120)}
                    aria-label="Поиск по сайту"
                    className="focus-ring w-full rounded-lg border border-accentDeep/20 bg-white px-3 py-2 text-sm"
                    placeholder="Поиск по услугам, специалистам, событиям"
                  />

                  {isSearchFocused && debouncedQuery.length >= 2 ? (
                    <div className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-accentDeep/20 bg-white shadow-card">
                      {hasSuggestions ? (
                        <ul className="max-h-80 overflow-auto py-2">
                          {suggestions.map((item) => (
                            <li key={`${item.type}-${item.id}`}>
                              <Link
                                className="block px-3 py-2 text-sm hover:bg-accentDeep/10"
                                to={item.url}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <p className="font-semibold text-accentDeep">{item.title}</p>
                                <p className="text-xs text-muted">{item.summary}</p>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="px-3 py-3 text-sm text-muted">Ничего не найдено.</p>
                      )}
                    </div>
                  ) : null}
                </form>

                <nav className="mt-6 grid gap-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        clsx(
                          'focus-ring rounded-lg px-3 py-2 text-sm transition',
                          isActive ? 'bg-accentDeep text-white' : 'text-accentDeep hover:bg-accentDeep/10',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}

                  <NavLink
                    to="/booking"
                    onClick={() => setIsMenuOpen(false)}
                    className="focus-ring mt-2 rounded-lg bg-accentDeep px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-accentDeep/90"
                  >
                    Онлайн-запись
                  </NavLink>
                </nav>
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}
