import { PencilIcon, Trash2Icon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import type { Comment } from '@/entities/comment';
import RatingStar from './RatingStar';
import { useState } from 'react';

interface Props {
  comment: {
    id: number;
    rating: number;
    content: string;
    user_id: number;
    restaurant_id: number;
  };
}

export default function CommentCard({ comment }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
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
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setIsEditing(true)}>
            <PencilIcon />
          </Button>

          <Button size="icon" variant="destructive">
            <Trash2Icon />
          </Button>
        </div>
      </header>

      <div className="w-full text-start">
        {isEditing ? (
          <input
            className="w-full border rounded p-2"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onBlur={() => setIsEditing(false)} // 포커스 벗어나면 종료
            autoFocus
          />
        ) : (
          <p>{editedContent}</p> // 수정된 내용 표시
        )}
      </div>
    </Card>
  );
}
