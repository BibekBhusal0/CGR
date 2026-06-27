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
      allowsMultipleExpanded
      className="settings"
      aria-label="left"
      expandedKeys={new Set(openAccordions)}
      onExpandedChange={(val) => {
        const opened: string[] = [];
        val.forEach((i) => opened.push(i as string));
        setOpenAccordtions(opened);
      }}
      variant="surface">
      {Object.entries(accordionItems).map(([key, value]) => (
        <Accordion.Item aria-label={key} key={key}>
          <Accordion.Heading>
            <Accordion.Trigger className="flex items-center gap-3 text-xl">
              {value.icon}
              {key}
              <Accordion.Indicator />
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel className="px-4 py-1">{value.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

function SettingsTabs() {
  const devMode = useSettingsState((state) => state.devMode);
  const modalItems = devMode ? { ...Items, ...devItems } : Items;
  return (
    <Tabs aria-label="Settings tabs" variant="primary" className="settings">
      <Tabs.ListContainer>
        <Tabs.List aria-label="Settings">
          {Object.entries(modalItems).map(([key, value]) => (
            <Tabs.Tab id={key} key={key} className="w-auto grow">
              <div className="flex-center gap-1">
                {value.icon} <span>{key}</span>
              </div>
              <Tabs.Indicator />
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
          variant={sidebarCollapsed ? "tertiary" : "outline"}
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
          variant="tertiary"
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
      <Modal isOpen={modalOpen} onOpenChange={setModalOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="w-150 max-w-150">
              <Modal.CloseTrigger />
              <Modal.Header>Settings</Modal.Header>
              <Modal.Body className="p-2">
                <SettingsTabs />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}

export default Left;
