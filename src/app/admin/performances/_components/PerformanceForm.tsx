'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, X } from 'lucide-react';

const EMOTIONS = [
  { key: 'joy', label: 'Радость' },
  { key: 'melancholy', label: 'Меланхолия' },
  { key: 'tension', label: 'Напряжение' },
  { key: 'passion', label: 'Страсть' },
  { key: 'wonder', label: 'Удивление' },
  { key: 'sadness', label: 'Грусть' },
];

const GENRES = ['Драма', 'Комедия', 'Трагедия', 'Мюзикл', 'Опера', 'Балет', 'Спектакль'];

type Theater = { id: string; name: string; shortName: string };

type FormData = {
  title: string;
  theaterId: string;
  genre: string;
  duration: string;
  director: string;
  synopsis: string;
  imageUrl: string;
  heroImageUrl: string;
  premiere: string;
  emotionProfile: { emotion: string; score: number }[];
  targetAudience: string[];
  cast: string[];
};

type Props = {
  theaters: Theater[];
  initialData?: FormData & { id?: string };
  mode: 'create' | 'edit';
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PerformanceForm({ theaters, initialData, mode }: Props) {
  const router = useRouter();

  const defaultEmotions = EMOTIONS.map((e) => ({
    emotion: e.key,
    score: initialData?.emotionProfile?.find((ep) => ep.emotion === e.key)?.score ?? 50,
  }));

  const [form, setForm] = useState<FormData>({
    title: initialData?.title ?? '',
    theaterId: initialData?.theaterId ?? (theaters[0]?.id ?? ''),
    genre: initialData?.genre ?? GENRES[0],
    duration: initialData?.duration ?? '',
    director: initialData?.director ?? '',
    synopsis: initialData?.synopsis ?? '',
    imageUrl: initialData?.imageUrl ?? '',
    heroImageUrl: initialData?.heroImageUrl ?? '',
    premiere: initialData?.premiere ?? '',
    emotionProfile: defaultEmotions,
    targetAudience: initialData?.targetAudience ?? [],
    cast: initialData?.cast ?? [],
  });

  const [audienceInput, setAudienceInput] = useState('');
  const [castInput, setCastInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const posterRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLInputElement>(null);

  function setField<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setEmotion(emotion: string, score: number) {
    setForm((prev) => ({
      ...prev,
      emotionProfile: prev.emotionProfile.map((e) =>
        e.emotion === emotion ? { ...e, score } : e
      ),
    }));
  }

  async function handleImageUpload(file: File, field: 'imageUrl' | 'heroImageUrl') {
    const base64 = await fileToBase64(file);
    setField(field, base64);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url = mode === 'create'
      ? '/api/admin/performances'
      : `/api/admin/performances/${initialData?.id}`;

    const res = await fetch(url, {
      method: mode === 'create' ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      setError((await res.json()).error ?? 'Ошибка сохранения');
      return;
    }

    router.push('/admin/performances');
    router.refresh();
  }

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}

      {/* Основная информация */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Основная информация</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Название *</label>
            <input className={inputClass} value={form.title} onChange={(e) => setField('title', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Театр *</label>
            <select className={inputClass} value={form.theaterId} onChange={(e) => setField('theaterId', e.target.value)} required>
              {theaters.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Жанр *</label>
            <select className={inputClass} value={form.genre} onChange={(e) => setField('genre', e.target.value)}>
              {GENRES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Длительность *</label>
            <input className={inputClass} placeholder="2 ч 30 мин" value={form.duration} onChange={(e) => setField('duration', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Режиссёр *</label>
            <input className={inputClass} value={form.director} onChange={(e) => setField('director', e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Дата премьеры *</label>
            <input className={inputClass} placeholder="15 января 2024" value={form.premiere} onChange={(e) => setField('premiere', e.target.value)} required />
          </div>
        </div>
        <div>
          <label className={labelClass}>Описание *</label>
          <textarea
            className={inputClass}
            rows={4}
            value={form.synopsis}
            onChange={(e) => setField('synopsis', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Изображения */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Изображения</h2>
        <div className="grid grid-cols-2 gap-6">
          {(['imageUrl', 'heroImageUrl'] as const).map((field) => (
            <div key={field}>
              <label className={labelClass}>{field === 'imageUrl' ? 'Постер *' : 'Главное изображение'}</label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-rose-400 transition-colors"
                onClick={() => (field === 'imageUrl' ? posterRef : heroRef).current?.click()}
              >
                {form[field] ? (
                  <div className="relative">
                    <Image src={form[field]} alt="preview" width={200} height={120} className="mx-auto rounded object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setField(field, ''); }}
                      className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Нажмите для выбора файла</p>
                )}
              </div>
              <input
                ref={field === 'imageUrl' ? posterRef : heroRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, field);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Эмоциональный профиль */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Эмоциональный профиль</h2>
        <div className="space-y-3">
          {EMOTIONS.map(({ key, label }) => {
            const score = form.emotionProfile.find((e) => e.emotion === key)?.score ?? 50;
            return (
              <div key={key} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 w-28 shrink-0">{label}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={score}
                  onChange={(e) => setEmotion(key, Number(e.target.value))}
                  className="flex-1 accent-rose-600"
                />
                <span className="text-sm font-medium text-gray-900 w-8 text-right">{score}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Актёрский состав */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Актёрский состав</h2>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Имя актёра"
            value={castInput}
            onChange={(e) => setCastInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (castInput.trim()) { setField('cast', [...form.cast, castInput.trim()]); setCastInput(''); }
              }
            }}
          />
          <button
            type="button"
            onClick={() => { if (castInput.trim()) { setField('cast', [...form.cast, castInput.trim()]); setCastInput(''); } }}
            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.cast.map((name, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
              {name}
              <button type="button" onClick={() => setField('cast', form.cast.filter((_, j) => j !== i))}>
                <X size={12} className="text-gray-500 hover:text-red-500" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Целевая аудитория */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Целевая аудитория</h2>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Тег аудитории"
            value={audienceInput}
            onChange={(e) => setAudienceInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (audienceInput.trim()) { setField('targetAudience', [...form.targetAudience, audienceInput.trim()]); setAudienceInput(''); }
              }
            }}
          />
          <button
            type="button"
            onClick={() => { if (audienceInput.trim()) { setField('targetAudience', [...form.targetAudience, audienceInput.trim()]); setAudienceInput(''); } }}
            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.targetAudience.map((tag, i) => (
            <span key={i} className="flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm">
              {tag}
              <button type="button" onClick={() => setField('targetAudience', form.targetAudience.filter((_, j) => j !== i))}>
                <X size={12} className="hover:text-red-700" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-rose-700 text-white rounded-lg text-sm font-medium hover:bg-rose-800 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Сохранение...' : mode === 'create' ? 'Создать постановку' : 'Сохранить изменения'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
