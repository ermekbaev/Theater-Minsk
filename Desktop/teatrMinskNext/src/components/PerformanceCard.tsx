'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, MapPin } from 'lucide-react';
import { Performance } from '@/data/types';
import StarRating from './StarRating';

interface PerformanceCardProps {
  performance: Performance;
  index: number;
}

const PerformanceCard = ({ performance, index }: PerformanceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/performance/${performance.id}`} className="group block">
        <div className="overflow-hidden rounded-lg bg-card shadow-sm transition-shadow duration-300 hover:shadow-lg">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={performance.imageUrl}
              alt={performance.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <span className="inline-block rounded-sm bg-primary px-2 py-0.5 font-body text-xs font-medium text-primary-foreground">
                {performance.genre}
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-primary-foreground leading-tight">
                {performance.title}
              </h3>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin size={14} />
              <span className="truncate font-body text-sm">{performance.theater}</span>
            </div>
            <div className="flex items-center justify-between">
              <StarRating rating={performance.rating} size={14} />
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock size={13} />
                <span className="font-body text-xs">{performance.duration}</span>
              </div>
            </div>
            <p className="font-body text-xs text-muted-foreground">
              {performance.reviewCount} отзывов
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PerformanceCard;
