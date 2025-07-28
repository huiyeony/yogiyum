import type { Menu } from "@/entities/menu";
import { Card } from "./ui/card";

interface Props {
  menu: Menu;
}

export default function MenuCard(props: Props) {
  return (
    <Card className="flex flex-row gap-4 p-4 bg-neutral-50">
      {/* 메뉴 카드 이미지 */}
      {props.menu.imageUrl && (
        <img
          src={props.menu.imageUrl.toString()}
          className="aspect-square object-cover h-20 rounded-sm"
        />
      )}

      {/* 메뉴 카드 우측 부분 */}
      <div className="flex flex-col flex-1 gap-1">
        <div className="font-bold text-lg">{props.menu.name}</div>
        <div className="text-sm text-neutral-500">{props.menu.description}</div>
        <div className="font-bold text-end">{props.menu.price}</div>
      </div>
    </Card>
  );
}
