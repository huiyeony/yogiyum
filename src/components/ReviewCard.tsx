import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { Review } from "@/entities/review";
import RatingStar from "./RatingStar";
import { useState } from "react";
import supabase from "@/lib/supabase";
import { Textarea } from "./ui/textarea";

interface Props {
  review: Review;
  title: string;
  onUpdate: (newComment: string) => void;
  onDelete: () => void;
}

export default function ReviewCard({
  review,
  title,
  onUpdate,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(review.content);

  return (
    <Card className="flex flex-col gap-4 bg-white rounded-md text-black p-4">
      <header className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <span className="text-lg font-bold">{review.userId}</span>
          <h3 className="text-base font-semibold mr-4">{title}</h3>
          <RatingStar rating={review.rating} digit={0} />
        </div>

        <div className="flex flex-row gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon />
          </Button>

          <Button
            size="icon"
            variant="destructive"
            onClick={async () => {
              const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
              if (!confirmDelete) return;

              const { error } = await supabase
                .from("reviews")
                .delete()
                .eq("id", review.id);

              if (!error) {
                onDelete(); // 부모 상태에서 제거
              } else {
                alert("삭제에 실패했습니다.");
              }
            }}
          >
            <Trash2Icon />
          </Button>
        </div>
      </header>

      <div className="w-full text-start">
        {isEditing ? (
          <div className="flex gap-2">
            <Textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <Button
              className="bg-orange-500 hover:bg-orange-300 text-white"
              onClick={async () => {
                const { error } = await supabase
                  .from("reviews")
                  .update({ content: editedComment })
                  .eq("id", review.id);

                if (!error) {
                  onUpdate(editedComment);
                  setIsEditing(false);
                }
              }}
            >
              저장
            </Button>
          </div>
        ) : (
          <p>{review.content}</p>
        )}
      </div>
    </Card>
  );
}
