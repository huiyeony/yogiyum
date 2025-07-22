import { PencilIcon, Star, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export default function CommentCard() {
  return (
    <Card className="flex flex-col gap-4 bg-white rounded-md text-black p-4">
      <header className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-8 items-center">
          {/* 닉네임부분 */}
          <span className="text-lg font-bold">닉네임</span>

          {/* 별점부분 */}
          <div className="flex flex-row gap-1">
            <Star size={20} />
            <Star size={20} />
            <Star size={20} />
            <Star size={20} />
            <Star size={20} />
          </div>
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

      <div className="w-full text-start">
        Ipsam dolorem ut tempora sunt perferendis consectetur molestiae neque.
        Sint non ea accusantium quos tenetur sint. Omnis aspernatur omnis
        architecto nulla.
      </div>
    </Card>
  );
}
