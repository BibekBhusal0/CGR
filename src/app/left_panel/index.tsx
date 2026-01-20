import { Accordion, AccordionItem } from "@heroui/accordion";
import IconPreview from "@/components/icons_preview";
import GeneralSettings from "./generalSettings";
import StockfishSettings from "./stockfishSettings";
import Archive from "./archive";
import { icons } from "@/components/icons";
import { useSettingsState } from "@/Logic/state/settings";

export const Items = {
  "General Settings": { content: <GeneralSettings />, icon: icons.left_panel.settings },
  "Stockfish Settings": { content: <StockfishSettings />, icon: icons.left_panel.engine },
  Archive: { content: <Archive />, icon: icons.left_panel.archive },
};

export const devItems = {
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

export default LeftPanel;
