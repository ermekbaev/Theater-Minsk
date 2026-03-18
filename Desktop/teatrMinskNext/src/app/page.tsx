'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Theater, Star, Sparkles, ArrowRight, Drama, Heart, Users, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/StarRating';
import { EMOTIONS_MAP } from '@/data/types';
import type { Performance } from '@/data/types';
import { useSession, signOut } from 'next-auth/react';

export default function LandingPage() {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [featured, setFeatured] = useState<Performance[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainOpen(true), 600);
    const t2 = setTimeout(() => setShowContent(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    fetch('/api/performances')
      .then((r) => r.json())
      .then((data: Performance[]) => setFeatured(data.slice(0, 4)));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-foreground">
      {/* ===== CURTAIN OVERLAY ===== */}
      <AnimatePresence>
        {!showContent && (
          <>
            {/* Left curtain */}
            <motion.div
              key="curtain-left"
              initial={{ x: 0 }}
              animate={curtainOpen ? { x: '-100%' } : { x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-1/2"
              style={{
                background: 'linear-gradient(135deg, hsl(345 72% 22%), hsl(345 72% 32%), hsl(345 60% 25%))',
                boxShadow: 'inset -30px 0 60px rgba(0,0,0,0.4)',
              }}
            >
              <div className="absolute inset-0 opacity-30" style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.15) 40px, rgba(0,0,0,0.15) 42px, transparent 42px, transparent 80px)',
              }} />
              <div className="absolute inset-0 opacity-20" style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.05) 60px, rgba(255,255,255,0.05) 62px)',
              }} />
            </motion.div>
            {/* Right curtain */}
            <motion.div
              key="curtain-right"
              initial={{ x: 0 }}
              animate={curtainOpen ? { x: '100%' } : { x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-y-0 right-0 z-50 w-1/2"
              style={{
                background: 'linear-gradient(-135deg, hsl(345 72% 22%), hsl(345 72% 32%), hsl(345 60% 25%))',
                boxShadow: 'inset 30px 0 60px rgba(0,0,0,0.4)',
              }}
            >
              <div className="absolute inset-0 opacity-30" style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.15) 40px, rgba(0,0,0,0.15) 42px, transparent 42px, transparent 80px)',
              }} />
            </motion.div>
            {/* Center logo during curtain */}
            <motion.div
              key="curtain-logo"
              initial={{ opacity: 1, scale: 1 }}
              animate={curtainOpen ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: curtainOpen ? 0.8 : 0 }}
              className="fixed inset-0 z-[60] flex items-center justify-center"
            >
              <div className="text-center">
                <Theater size={48} className="mx-auto mb-3 text-accent" />
                <span className="font-display text-4xl font-bold text-primary-foreground">
                  Театральный <span className="text-accent">гид</span>
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-theater.jpg"
            alt="Театральная сцена"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-foreground" />
        </div>

        {/* Top nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12"
        >
          <div className="flex items-center gap-2.5">
            <Theater size={28} className="text-accent" />
            <span className="font-display text-2xl font-bold text-primary-foreground">
              Театральный <span className="text-accent">гид</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <div className="flex items-center gap-1.5 font-body text-sm text-primary-foreground/80">
                  <UserCircle size={18} className="text-accent" />
                  <span className="max-w-[120px] truncate">{session.user?.name}</span>
                </div>
                <Button
                  variant="ghost"
                  className="gap-1.5 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut size={15} />
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/login">Войти</Link>
                </Button>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <Link href="/register">Регистрация</Link>
                </Button>
              </>
            )}
          </div>
        </motion.nav>

        {/* Hero content */}
        <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={showContent ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
            className="mb-6 flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles size={16} className="text-accent" />
            <span className="font-body text-sm text-primary-foreground/80">
              Подбор спектаклей по настроению
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-3xl font-display text-5xl font-bold leading-tight text-primary-foreground md:text-7xl"
          >
            Ваш проводник
            <br />
            в мир <span className="text-accent">театра</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-6 max-w-xl font-body text-lg leading-relaxed text-primary-foreground/70"
          >
            Анализируйте эмоциональные профили спектаклей, сравнивайте постановки
            и находите идеальное представление для любого настроения
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={showContent ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-base" asChild>
              <Link href={session ? '/catalog' : '/register'}>
                Начать бесплатно
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 text-base" asChild>
              <Link href="/catalog">Смотреть каталог</Link>
            </Button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={showContent ? { opacity: 1 } : {}}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ChevronDown size={28} className="text-primary-foreground/40" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative z-10 py-24 px-6" style={{ background: 'linear-gradient(180deg, hsl(20 14% 10%), hsl(20 14% 14%))' }}>
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              Всё для идеального <span className="text-accent">вечера в театре</span>
            </h2>
            <p className="mt-4 font-body text-primary-foreground/60">
              Инструменты, которые помогут вам найти именно тот спектакль
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Theater size={28} />,
                title: 'Каталог спектаклей',
                desc: '8+ постановок ведущих театров Минска с подробными описаниями, составом и фотографиями',
                color: 'bg-primary/10 text-primary',
              },
              {
                icon: <Heart size={28} />,
                title: 'Эмоциональный анализ',
                desc: 'Уникальные профили по 6 эмоциональным шкалам — узнайте, какие чувства вызовет спектакль',
                color: 'bg-destructive/10 text-destructive',
              },
              {
                icon: <Sparkles size={28} />,
                title: 'Подбор по настроению',
                desc: 'Выберите своё состояние — мы подберём спектакль, который идеально ему соответствует',
                color: 'bg-accent/10 text-accent-foreground',
              },
              {
                icon: <Star size={28} />,
                title: 'Рейтинг и отзывы',
                desc: 'Читайте отзывы других зрителей и составляйте своё мнение до покупки билета',
                color: 'bg-secondary/10 text-secondary-foreground',
              },
              {
                icon: <Drama size={28} />,
                title: 'Сравнение спектаклей',
                desc: 'Сравните два спектакля бок о бок по эмоциональным профилям и характеристикам',
                color: 'bg-primary/10 text-primary',
              },
              {
                icon: <Users size={28} />,
                title: 'Целевая аудитория',
                desc: 'Узнайте, для кого подходит каждый спектакль — семьи, пары, ценители классики',
                color: 'bg-accent/10 text-accent-foreground',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/10"
              >
                <div className={`mb-4 inline-flex rounded-lg p-3 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-display text-lg font-semibold text-primary-foreground">{f.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-primary-foreground/60">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PERFORMANCES ===== */}
      <section className="relative z-10 py-24 px-6" style={{ background: 'linear-gradient(180deg, hsl(20 14% 14%), hsl(20 14% 12%))' }}>
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              Популярные <span className="text-accent">спектакли</span>
            </h2>
            <p className="mt-4 font-body text-primary-foreground/60">
              Лучшие постановки по мнению наших пользователей
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <Link
                  href={`/performance/${p.id}`}
                  className="group block overflow-hidden rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/10"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block rounded-md bg-primary/90 px-2 py-0.5 font-body text-xs text-primary-foreground">
                        {p.genre}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-semibold text-primary-foreground line-clamp-1">{p.title}</h3>
                    <p className="mt-1 font-body text-xs text-primary-foreground/50 line-clamp-1">{p.theater}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <StarRating rating={p.rating} size={14} />
                      <span className="font-body text-xs text-primary-foreground/50">{p.reviewCount}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8" asChild>
              <Link href="/catalog">
                Смотреть весь каталог
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== EMOTION SHOWCASE ===== */}
      <section className="relative z-10 py-24 px-6" style={{ background: 'linear-gradient(180deg, hsl(20 14% 12%), hsl(20 14% 15%))' }}>
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
              6 измерений <span className="text-accent">эмоций</span>
            </h2>
            <p className="mt-4 font-body text-primary-foreground/60">
              Каждый спектакль оценивается по уникальным эмоциональным шкалам
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(EMOTIONS_MAP).map(([key, em], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex items-center gap-4 rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-5 backdrop-blur-sm"
              >
                <div
                  className="h-10 w-10 shrink-0 rounded-full"
                  style={{ backgroundColor: em.color }}
                />
                <div>
                  <h3 className="font-display text-base font-semibold text-primary-foreground">{em.label}</h3>
                  <p className="font-body text-xs text-primary-foreground/50">
                    {em.label === 'Радость' ? 'Позитив и веселье'
                      : em.label === 'Меланхолия' ? 'Ностальгия и грусть'
                      : em.label === 'Напряжение' ? 'Саспенс и тревога'
                      : em.label === 'Страсть' ? 'Любовь и драма'
                      : em.label === 'Восторг' ? 'Удивление и восхищение'
                      : 'Глубокая печаль'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative z-10 overflow-hidden py-24 px-6" style={{
        background: 'linear-gradient(135deg, hsl(345 72% 28%), hsl(345 72% 20%))',
      }}>
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/hero-theater.jpg" alt="" fill className="object-cover" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            Откройте для себя мир<br />минского <span className="text-accent">театра</span>
          </h2>
          <p className="mt-4 font-body text-primary-foreground/70">
            Зарегистрируйтесь бесплатно и получите доступ ко всем функциям платформы
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base" asChild>
              <Link href={session ? '/catalog' : '/register'}>
                Создать аккаунт
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 text-base" asChild>
              <Link href="/catalog">Посмотреть каталог</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 bg-foreground py-10 px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Theater size={22} className="text-accent" />
            <span className="font-display text-lg font-bold text-primary-foreground">
              Театральный <span className="text-accent">гид</span>
            </span>
          </div>
          <p className="font-body text-sm text-primary-foreground/50">
            © 2026 Театральный гид. Дипломный проект. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
