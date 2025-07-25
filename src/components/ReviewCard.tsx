import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { Review } from "@/entities/review";
import RatingStar from "./RatingStar";

interface Props {
  review: Review;
}

export default function ReviewCard({ review }: Props) {
  return (
    <Card className="flex flex-col gap-4 bg-white rounded-md text-black p-4">
      <header className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-8 items-center">
          {/* 닉네임부분 */}
          <span className="text-lg font-bold">{review.userId}</span>

          {/* 별점부분 */}
          <RatingStar rating={review.rating} digit={0} />
        </div>

        <div className="flex flex-row gap-2">
          <Button size="icon" variant="secondary">
            <PencilIcon />
          </Button>

          <Button size="icon" variant="destructive">
            <Trash2Icon />
          </Button>
        </div>
      </header>

      <div className="w-full text-start">{review.comment}</div>
    </Card>
  );
}
