import { useSettingsState } from "@/Logic/state/settings";
import FullBoard from "./full_board";
import LeftPanel from "./left_panel";
import RightPanel from "./right_panel";
import { icons } from "@/components/icons";
import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";

function App() {
  const sidebarCollapsed = useSettingsState((state) => state.sidebarCollapsed);
  const toggle = useSettingsState((state) => state.toggleValues);
  const toggleSidebar = () => toggle("sidebarCollapsed");

  return (
    <div className="flex h-full flex-col items-start gap-3 pt-6 md:flex-row">
      <div className="bg-content1 rounded-large shadow-medium mx-2 w-full basis-3/12 overflow-y-auto pl-2 lg:mr-0">
        <Button isIconOnly onPress={toggleSidebar}>
          {icons.others.sidebar}
        </Button>
        {!sidebarCollapsed && <LeftPanel />}
      </div>
      <div className={cn("px-2 lg:px-0", sidebarCollapsed ? "" : "basis-6/12 lg:basis-5/12")}>
        <FullBoard />
      </div>
      <div className="relative w-full basis-3/12 px-2 lg:basis-4/12">
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
