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
    <Card className="flex flex-col gap-3 bg-white border rounded-lg p-4 text-sm shadow-sm">
      {/* 상단 - 제목 + 별점 + 버튼 */}
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-neutral-400">내가 준 평점</span>
            <RatingStar rating={review.rating} digit={1} size={16} />
          </div>
        </div>

        <div className="flex flex-row gap-2 self-end sm:self-auto">
          <Button
            size="icon"
            className="w-6 h-6"
            variant="secondary"
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon size={12} />
          </Button>

          <Button
            size="icon"
            className="w-6 h-6"
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
            <Trash2Icon size={12} />
          </Button>
        </div>
      </header>

      {/* 본문 */}
      <div className="text-neutral-700 text-sm text-left">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="text-sm"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-1"
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
          </div>
        ) : (
          <p className="text-xs">{review.content}</p>
        )}
      </div>
    </Card>
  );
}
