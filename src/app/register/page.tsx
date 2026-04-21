'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Theater, Eye, EyeOff } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') router.replace('/catalog');
  }, [status, router]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Ошибка регистрации');
      setLoading(false);
      return;
    }

    // Auto sign-in after registration
    await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    router.push('/catalog');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen">
      {/* Left - decorative */}
      <div className="hidden w-1/2 bg-foreground lg:block">
        <div className="flex h-full flex-col items-center justify-center px-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Theater size={48} className="mx-auto mb-6 text-accent" />
            <h2 className="font-display text-4xl font-bold text-primary-foreground">
              Театральный <span className="text-accent">гид</span>
            </h2>
            <p className="mt-4 max-w-sm font-body text-primary-foreground/60">
              Создайте аккаунт, чтобы оставлять отзывы и получать персональные рекомендации.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex w-full items-center justify-center bg-background px-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <Theater size={24} className="text-primary" />
            <span className="font-display text-xl font-bold text-foreground">
              Театральный <span className="text-primary">гид</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-foreground">Регистрация</h1>
          <p className="mt-2 font-body text-muted-foreground">
            Создайте аккаунт для полного доступа
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-body text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Создание аккаунта...' : 'Создать аккаунт'}
            </Button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
