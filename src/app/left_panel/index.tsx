import { Accordion, AccordionItem } from "@heroui/accordion";
import IconPreview from "@/components/icons_preview";
import GeneralSettings from "./generalSettings";
import StockfishSettings from "./stockfishSettings";
import { icons } from "@/components/icons";

const Items = {
  "General Settings": { content: <GeneralSettings />, icon: icons.others.settings },
  "Stockfish Settings": { content: <StockfishSettings />, icon: icons.others.engine },
  "Icons D": { content: <IconPreview />, icon: icons.others.code }
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
