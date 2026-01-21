import { useSettingsState } from "@/Logic/state/settings";
import FullBoard from "@/app/full_board";
import Left from "@/app/left_panel";
import RightPanel from "@/app/right_panel";
import { cn } from "@heroui/theme";

function App() {
  const sidebarCollapsed = useSettingsState((state) => state.sidebarCollapsed);

  return (
    <div className="flex h-full flex-col items-start gap-1 pt-1 lg:flex-row lg:gap-3 lg:pt-4">
      <Left />
      <FullBoard />
      <div
        className={cn(
          "w-full px-2",
          sidebarCollapsed ? "basis-5/12" : "basis-3/12 lg:basis-4/12"
        )}>
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
