import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardFooter } from "./ui/card";
import type { Review } from "@/entities/review";
import RatingStar from "./RatingStar";
import { useState } from "react";
import supabase from "@/lib/supabase";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface Props {
  review: Review;
  title: string;
  onUpdate: (newComment: string) => void;
  onDelete: () => void;
  editable?: boolean;
}

export default function ReviewCard({
  review,
  title,
  onUpdate,
  onDelete,
  editable = false,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(review.content);

  return (
    <Card className="w-full flex flex-col gap-3 bg-white border rounded-lg p-4 shadow-sm">
      {/* 상단 - 제목 + 별점 + 버튼 */}
      <header className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div className="w-full flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-center w-full ">{title}</h3>
          <Separator />
          <div className="flex items-center gap-1">
            <Badge variant="secondary">평점</Badge>
            <RatingStar rating={review.rating} digit={1} size={16} />
          </div>
        </div>
      </header>

      {/* 본문 */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary">리뷰</Badge>
        {isEditing ? (
          <div className="flex flex-col gap-2 w-full">
            <Textarea
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              className="text-sm w-full min-h-[80px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs px-2 py-1"
                onClick={() => {
                  setEditedComment(review.content);
                  setIsEditing(false);
                }}
              >
                취소
              </Button>
              <Button
                size="sm"
                className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-1 text-xs"
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
          <p className="text-xs w-full break-words">{review.content}</p>
        )}
      </div>

      {/* 수정/삭제 버튼 */}
      {editable && (
        <CardFooter className="w-full flex items-center justify-end gap-2 px-0 opacity-80">
          <Button
            size="icon"
            className="w-8 h-8 p-1"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={16} />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="w-8 h-8 p-1 opacity-90"
            onClick={async () => {
              const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
              if (!confirmDelete) return;

              const { error } = await supabase
                .from("reviews")
                .delete()
                .eq("id", review.id);

              if (!error) {
                onDelete();
              } else {
                alert("삭제에 실패했습니다.");
              }
            }}
          >
            <Trash2 size={16} />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
