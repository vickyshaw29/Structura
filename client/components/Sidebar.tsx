import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Sidebar = () => {
  const menuOptions = ( 
    <>
      <NewDocumentButton/>
      {/* Other options */}
    </>
  )
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <Sheet>
        <SheetTrigger className="md:hidden">
          <MenuIcon className="p-2 hover:opacity-30 rounded-lg cursor-pointer" size={40}/>
        </SheetTrigger>
        <SheetContent className="" side="left">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <div>
                {menuOptions}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <div className="hidden md:inline">
        <NewDocumentButton />
      </div>
    </div>
  );
};

export default Sidebar;
