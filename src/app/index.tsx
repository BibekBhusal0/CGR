import { useSettingsState } from "@/Logic/state/settings";
import FullBoard from "./full_board";
import LeftPanel, { SettingsModal } from "./left_panel";
import RightPanel from "./right_panel";
import { icons } from "@/components/icons";
import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { useState } from "react";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const sidebarCollapsed = useSettingsState((state) => state.sidebarCollapsed);
  const toggle = useSettingsState((state) => state.toggleValues);
  const toggleSidebar = () => toggle("sidebarCollapsed");

  return (
    <div className="flex h-full flex-col items-start gap-3 pt-4 lg:flex-row">
      <div
        className={cn(
          "pl-2 lg:mr-0",
          sidebarCollapsed ? "flex flex-col gap-2" : "relative w-full basis-3/12 overflow-visible"
        )}>
        <Button
          onPress={toggleSidebar}
          variant={sidebarCollapsed ? "light" : "ghost"}
          size="sm"
          className={cn(
            "text-xl",
            sidebarCollapsed ? "rotate-180" : "absolute top-2 -right-15 z-50"
          )}
          isIconOnly>
          {icons.others.sidebar}
        </Button>
        {!sidebarCollapsed && (
          <div className="bg-content1 rounded-large shadow-medium max-h-[calc(100vh-120px)] w-full overflow-y-auto hidden lg:block">
            <LeftPanel />
          </div>
        )}
        <Button
          variant={"light"}
          onPress={() => setModalOpen(true)}
          size="sm"
          className={cn("text-xl", !sidebarCollapsed && "lg:hidden")}
          isIconOnly>
          {icons.left_panel.settings}
        </Button>
      </div>
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
      <Modal isOpen={modalOpen} onOpenChange={setModalOpen} size="lg">
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalBody className="p-2">
            <SettingsModal />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;
