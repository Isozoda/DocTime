import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  className?: string;
}

export function StarRating({ rating, max = 5, size = 16, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <span key={i} className="relative inline-flex">
            <Star
              style={{ width: size, height: size }}
              className="text-amber-300 fill-amber-300 opacity-30"
            />
            {(filled || partial) && (
              <Star
                style={{
                  width: size,
                  height: size,
                  clipPath: partial ? `inset(0 ${100 - (rating % 1) * 100}% 0 0)` : undefined,
                }}
                className="absolute inset-0 text-amber-400 fill-amber-400"
              />
            )}
          </span>
        );
      })}
    </div>
  );
}
