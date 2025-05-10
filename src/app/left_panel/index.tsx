import { Accordion, AccordionItem } from "@heroui/accordion";
import IconPreview from "@/components/icons_preview";
import GeneralSettings from "./generalSettings";
import StockfishSettings from "./stockfishSettings";
import Archive from "./archive";
import { icons } from "@/components/icons";

const Items = {
  "General Settings": { content: <GeneralSettings />, icon: icons.left_panel.settings },
  "Stockfish Settings": { content: <StockfishSettings />, icon: icons.left_panel.engine },
  "Archive": { content: <Archive />, icon: icons.left_panel.archive },
  "Icons D": { content: <IconPreview />, icon: icons.left_panel.code },
}

function LeftPanel() {
  return (
    <div className="basis-3/12">
      <Accordion
        itemClasses={{ title: "text-xl overflow-x-hidden", content: "mb-2" }}
        aria-label="left"
        variant="splitted"
        defaultExpandedKeys={["General Settings", "Stockfish Settings",]}
        selectionMode="multiple">
        {
          Object.entries(Items).map(([key, value]) => (
            <AccordionItem
              startContent={value.icon}
              classNames={{ content: 'space-y-4', startContent: "text-2xl" }}
              aria-label={key}
              title={key}
              key={key}
            >
              {value.content}
            </AccordionItem>
          ))
        }
      </Accordion>
    </div>
  );
}

export default LeftPanel;
