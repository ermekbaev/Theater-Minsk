'use client';

import { Performance, EMOTIONS_MAP } from '@/data/types';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface EmotionRadarProps {
  profile: Performance['emotionProfile'];
  secondProfile?: Performance['emotionProfile'];
  height?: number;
}

const EmotionRadar = ({ profile, secondProfile, height = 250 }: EmotionRadarProps) => {
  const data = profile.map((ep) => {
    const second = secondProfile?.find((s) => s.emotion === ep.emotion);
    return {
      emotion: EMOTIONS_MAP[ep.emotion].label,
      value: ep.score,
      ...(second ? { value2: second.score } : {}),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis
          dataKey="emotion"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontFamily: 'Inter' }}
        />
        <Radar
          name="Эмоции"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        {secondProfile && (
          <Radar
            name="Сравнение"
            dataKey="value2"
            stroke="hsl(var(--accent))"
            fill="hsl(var(--accent))"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        )}
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontFamily: 'Inter',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default EmotionRadar;
