import { Accordion, Tabs, Button, Modal } from "@heroui/react";
// import IconPreview from "@/components/icons_preview";
import GeneralSettings from "@/app/left_panel/generalSettings";
import StockfishSettings from "@/app/left_panel/stockfishSettings";
import Archive from "@/app/left_panel/archive";
import { icons } from "@/components/icons";
import { useSettingsState } from "@/Logic/state/settings";
import { useState } from "react";
import { cn } from "@heroui/theme";
import SwitchGroup from "@/components/switchGroup";

const Items = {
  "General Settings": { content: <GeneralSettings />, icon: icons.left_panel.settings },
  "Stockfish Settings": { content: <StockfishSettings />, icon: icons.left_panel.engine },
  Archive: { content: <Archive />, icon: icons.left_panel.archive },
};

const devItems = {
  Extras: { content: <DevSettings />, icon: icons.left_panel.code },
  // "Icons D": { content: <IconPreview />, icon: icons.left_panel.code },
};

function DevSettings() {
  return (
    <>
      <SwitchGroup switches={[{ item: "analyzePerMove", children: "Per Move Analysis" }]} />
    </>
  );
}

function LeftPanel() {
  const openAccordions = useSettingsState((state) => state.openAccordions);
  const devMode = useSettingsState((state) => state.devMode);
  const setOpenAccordtions = useSettingsState((state) => state.setOpenAccordtions);

  const accordionItems = devMode ? { ...Items, ...devItems } : Items;

  return (
    <Accordion
      // itemClasses={{ title: "text-xl overflow-x-hidden", content: "mb-2" }}
      allowsMultipleExpanded
      aria-label="left"
      expandedKeys={new Set(openAccordions)}
      onExpandedChange={(val) => {
        const opened: string[] = [];
        val.forEach((i) => opened.push(i as string));
        setOpenAccordtions(opened);
      }}
      // variant="light"
    >
      {Object.entries(accordionItems).map(([key, value]) => (
        <Accordion.Item
          // classNames={{ content: "space-y-4", startContent: "text-2xl" }}
          aria-label={key}
          key={key}>
          <Accordion.Heading>
            <Accordion.Trigger>
              {value.icon}
              {key}
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>{value.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

function SettingsTabs() {
  const devMode = useSettingsState((state) => state.devMode);
  const modalItems = devMode ? { ...Items, ...devItems } : Items;
  return (
    <Tabs
      aria-label="Settings tabs"
      // variant="light"
      // size="sm"
      // classNames={{ tabList: "gap-0" }}
    >
      <Tabs.ListContainer>
        <Tabs.List>
          {Object.entries(modalItems).map(([key, value]) => (
            <Tabs.Tab
              aria-label={key}
              id={key}
              className="md:text-md p-1 text-sm md:px-2"
              key={key}>
              <div className="flex-center gap-1">
                {value.icon} <span>{key}</span>
              </div>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
      {Object.entries(modalItems).map(([key, value]) => (
        <Tabs.Panel id={key} key={key} className="h-80 w-full space-y-4 overflow-auto">
          {value.content}
        </Tabs.Panel>
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
          // variant={sidebarCollapsed ? "light" : "ghost"}
          size="sm"
          className={cn(
            "hidden text-xl lg:flex",
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
          // variant={"light"}
          onPress={() => setModalOpen(true)}
          size="sm"
          className={cn(
            "absolute top-3.5 right-5 z-10 text-2xl lg:relative lg:top-[unset] lg:right-[unset] lg:text-xl",
            !sidebarCollapsed && "lg:hidden"
          )}
          isIconOnly>
          {icons.left_panel.settings}
        </Button>
      </div>
      <Modal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        // size="lg"
      >
        <Modal.Backdrop>
          <Modal.Header>Settings</Modal.Header>
          <Modal.Body className="p-2">
            <SettingsTabs />
          </Modal.Body>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}

export default Left;
