import { useSettingsState } from "@/Logic/state/settings";
import FullBoard from "./full_board";
import Left from "./left_panel";
import RightPanel from "./right_panel";
import { cn } from "@heroui/theme";

function App() {
  const sidebarCollapsed = useSettingsState((state) => state.sidebarCollapsed);

  return (
    <div className="flex h-full flex-col items-start gap-3 pt-4 lg:flex-row">
      <Left />
      <div
        className={cn(
          "px-2 lg:px-0",
          sidebarCollapsed ? "basis-7/12" : "basis-6/12 lg:basis-5/12"
        )}>
        <FullBoard />
      </div>
      <div
        className={cn(
          "relative w-full px-2",
          sidebarCollapsed ? "basis-5/12" : "basis-3/12 lg:basis-4/12"
        )}>
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
