import type { Menu } from "@/entities/menu";
import MenuCard from "./MenuCard";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronsUpDownIcon } from "lucide-react";

interface Props {
  menus: Menu[];
}

export default function MenuCardSection(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex flex-col gap-4"
      >
        <header className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">메뉴</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon">
              <ChevronsUpDownIcon />
            </Button>
          </CollapsibleTrigger>
        </header>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {props.menus.slice(0, 2).map((menu, idx) => (
              <MenuCard key={idx} menu={menu} />
            ))}
          </div>

          <CollapsibleContent>
            <div className="grid grid-cols-2 gap-2">
              {props.menus.slice(2).map((menu, idx) => (
                <MenuCard key={idx} menu={menu} />
              ))}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </section>
  );
}
