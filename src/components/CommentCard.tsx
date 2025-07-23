import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { Comment } from "@/entities/comment";
import RatingStar from "./RatingStar";

interface Props {
  comment: Comment;
}

export default function CommentCard({ comment }: Props) {
  return (
    <Card className="flex flex-col gap-4 bg-white rounded-md text-black p-4">
      <header className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-8 items-center">
          {/* 닉네임부분 */}
          <span className="text-lg font-bold">{comment.userId}</span>

          {/* 별점부분 */}
          <RatingStar rating={comment.rating} digit={0} />
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

      <div className="w-full text-start">{comment.comment}</div>
    </Card>
  );
}
