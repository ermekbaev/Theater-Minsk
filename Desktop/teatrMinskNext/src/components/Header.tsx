'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Theater, LogIn, LogOut, UserCircle, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/catalog', label: 'Каталог' },
    { to: '/compare', label: 'Сравнение' },
  ];

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <Theater size={24} className="text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            Театральный <span className="text-primary">гид</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`font-body text-sm font-medium transition-colors ${
                pathname === link.to
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {status === 'loading' ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <UserCircle size={18} className="text-primary" />
                <span className="font-body font-medium max-w-[120px] truncate">
                  {session.user?.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <LogOut size={15} />
                Выйти
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="gap-1.5 font-body">
                <Link href="/login">
                  <LogIn size={15} />
                  Войти
                </Link>
              </Button>
              <Button size="sm" asChild className="font-body">
                <Link href="/register">Регистрация</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Меню"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-card"
          >
            <div className="flex flex-col px-4 py-3 gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md px-3 py-2.5 font-body text-sm font-medium transition-colors ${
                    pathname === link.to
                      ? 'bg-primary/5 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 border-t border-border pt-2">
                {status === 'loading' ? (
                  <div className="h-8 animate-pulse rounded-md bg-muted" />
                ) : session ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-foreground">
                      <UserCircle size={18} className="text-primary shrink-0" />
                      <span className="font-body font-medium truncate">{session.user?.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="gap-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <LogOut size={15} />
                      Выйти
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" asChild className="w-full justify-center gap-2 font-body">
                      <Link href="/login" onClick={() => setMenuOpen(false)}>
                        <LogIn size={15} />
                        Войти
                      </Link>
                    </Button>
                    <Button asChild className="w-full justify-center font-body">
                      <Link href="/register" onClick={() => setMenuOpen(false)}>
                        Регистрация
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
