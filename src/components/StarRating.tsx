import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
}

const StarRating = ({ rating, size = 16 }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? 'fill-accent text-accent'
              : 'text-border'
          }
        />
      ))}
      <span className="ml-1.5 font-body text-sm font-semibold text-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
