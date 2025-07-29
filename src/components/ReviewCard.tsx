import { Pencil, PencilIcon, Trash2, Trash2Icon } from "lucide-react";
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
}

export default function ReviewCard({ review, title, onUpdate, onDelete }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(review.content);

    return (
        <Card className="w-full flex flex-col gap-3 bg-white border rounded-lg p-4 shadow-sm">
            {/* 상단 - 제목 + 별점 + 버튼 */}
            <header className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="w-full flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <Separator />
                    <div className="flex items-center gap-1">
                        <Badge variant={"secondary"}>내가 준 평점</Badge>
                        <RatingStar rating={review.rating} digit={1} size={16} />
                    </div>
                </div>
            </header>

            {/* 본문 */}
            <div className="flex items-center gap-2">
                <Badge variant={"secondary"}>나의 리뷰</Badge>
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <Textarea value={editedComment} onChange={(e) => setEditedComment(e.target.value)} className="text-sm" />
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-400 text-white px-3 py-1"
                                onClick={async () => {
                                    const { error } = await supabase.from("reviews").update({ content: editedComment }).eq("id", review.id);

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
            <CardFooter className="w-full flex items-center justify-end gap-2 px-0 opacity-80">
                <Button>
                    <Pencil />
                    수정
                </Button>
                <Button variant={"destructive"} className="opacity-90">
                    <Trash2 />
                    삭제
                </Button>
            </CardFooter>

            {/* <div className="flex flex-row gap-2 self-end sm:self-auto">
                <Button size="icon" className="w-6 h-6" variant="secondary" onClick={() => setIsEditing(true)}>
                    <PencilIcon size={12} />
                </Button>

                <Button
                    size="icon"
                    className="w-6 h-6"
                    variant="destructive"
                    onClick={async () => {
                        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
                        if (!confirmDelete) return;

                        const { error } = await supabase.from("reviews").delete().eq("id", review.id);

                        if (!error) {
                            onDelete(); // 부모 상태에서 제거
                        } else {
                            alert("삭제에 실패했습니다.");
                        }
                    }}
                >
                    <Trash2Icon size={12} />
                </Button>
            </div> */}
        </Card>
    );
}
