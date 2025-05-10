import { Accordion, AccordionItem } from "@heroui/accordion";
import IconPreview from "@/components/icons_preview";
import GeneralSettings from "./generalSettings";
import StockfishSettings from "./stockfishSettings";

const Items = {
  "General Settings": <GeneralSettings />,
  "Stockfish Settings": <StockfishSettings />,
  "Icons D": <IconPreview />
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
              classNames={{ content: 'space-y-4' }}
              aria-label={key}
              title={key}
              key={key}
            >
              {value}
            </AccordionItem>
          ))
        }
      </Accordion>
    </div>
  );
}

export default LeftPanel;
