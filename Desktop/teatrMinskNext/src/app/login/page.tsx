'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Theater, Eye, EyeOff } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/catalog';
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') router.replace('/catalog');
  }, [status, router]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError('Неверный email или пароль');
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
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

      <h1 className="font-display text-3xl font-bold text-foreground">Вход</h1>
      <p className="mt-2 font-body text-muted-foreground">
        Войдите в свой аккаунт, чтобы продолжить
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      <p className="mt-6 text-center font-body text-sm text-muted-foreground">
        Нет аккаунта?{' '}
        <Link href="/register" className="text-primary hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
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
              Откройте для себя мир театральных постановок Минска.
              Анализируйте, сравнивайте, выбирайте.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex w-full items-center justify-center bg-background px-6 lg:w-1/2">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
