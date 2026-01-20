import { Accordion, AccordionItem } from "@heroui/accordion";
import IconPreview from "@/components/icons_preview";
import GeneralSettings from "@/app/left_panel/generalSettings";
import StockfishSettings from "@/app/left_panel/stockfishSettings";
import Archive from "@/app/left_panel/archive";
import { icons } from "@/components/icons";
import { useSettingsState } from "@/Logic/state/settings";
import { Tab, Tabs } from "@heroui/tabs";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { cn } from "@heroui/theme";

const Items = {
  "General Settings": { content: <GeneralSettings />, icon: icons.left_panel.settings },
  "Stockfish Settings": { content: <StockfishSettings />, icon: icons.left_panel.engine },
  Archive: { content: <Archive />, icon: icons.left_panel.archive },
};

const devItems = {
  "Icons D": { content: <IconPreview />, icon: icons.left_panel.code },
};

function LeftPanel() {
  const openAccordions = useSettingsState((state) => state.openAccordions);
  const devMode = useSettingsState((state) => state.devMode);
  const setOpenAccordtions = useSettingsState((state) => state.setOpenAccordtions);

  const accordionItems = devMode ? { ...Items, ...devItems } : Items;

  return (
    <Accordion
      onSelectionChange={(e) => {
        if (typeof e === "string") return;
        const opened: string[] = [];
        e.forEach((i) => opened.push(i as string));
        setOpenAccordtions(opened);
      }}
      itemClasses={{ title: "text-xl overflow-x-hidden", content: "mb-2" }}
      aria-label="left"
      selectedKeys={new Set(openAccordions)}
      variant="light"
      selectionMode="multiple">
      {Object.entries(accordionItems).map(([key, value]) => (
        <AccordionItem
          startContent={value.icon}
          classNames={{ content: "space-y-4", startContent: "text-2xl" }}
          aria-label={key}
          title={key}
          key={key}>
          {value.content}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function SettingsTabs() {
  const devMode = useSettingsState((state) => state.devMode);
  const modalItems = devMode ? { ...Items, ...devItems } : Items;
  return (
    <Tabs aria-label="Settings tabs" variant="light" size="sm" classNames={{ tabList: "gap-0" }}>
      {Object.entries(modalItems).map(([key, value]) => (
        <Tab
          aria-label={key}
          title={
            <div className="flex-center gap-1">
              {value.icon} <span>{key}</span>
            </div>
          }
          className="md:text-md p-1 text-sm md:px-2"
          key={key}>
          <div className="h-80 w-full space-y-4 overflow-auto">{value.content}</div>
        </Tab>
      ))}
    </Tabs>
  );
}

function Left() {
  const [modalOpen, setModalOpen] = useState(false);
  const sidebarCollapsed = useSettingsState((state) => state.sidebarCollapsed);
  const toggle = useSettingsState((state) => state.toggleValues);
  const toggleSidebar = () => toggle("sidebarCollapsed");

  return (
    <>
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
          <div className="bg-content1 rounded-large shadow-medium hidden max-h-[calc(100vh-120px)] w-full overflow-y-auto lg:block">
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
      <Modal isOpen={modalOpen} onOpenChange={setModalOpen} size="lg">
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalBody className="p-2">
            <SettingsTabs />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Left;
