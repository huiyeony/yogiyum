import type { Menu } from "@/entities/menu";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface Props {
  menu: Menu;
}

export default function MenuCard(props: Props) {
  return (
    <Card className="items-start p-3 gap-3 bg-neutral-50">
      <div className="flex items-start gap-3">
        {/* 메뉴 카드 이미지 */}
        {props.menu.imageUrl && (
          <img
            src={props.menu.imageUrl.toString()}
            className="aspect-square object-cover h-20 rounded-sm"
          />
        )}
        <div className="flex flex-col gap-1">
          <div className="h-14 font-bold text-lg line-clamp-2 font-['Gowun_Dodum']">
            {props.menu.name}
          </div>
          <div className="text-sm text-neutral-500 line-clamp-1">
            {props.menu.description}
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex items-center gap-2">
        <Badge
          variant={"secondary"}
          className="border border-neutral-200 font-['Gowun_Dodum']"
        >
          가격
        </Badge>
        <div className="font-bold text-end font-['Gowun_Dodum']">
          {props.menu.price}
        </div>
      </div>
    </Card>
  );
}
