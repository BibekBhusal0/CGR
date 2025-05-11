import { SwitchProps } from "@heroui/switch";
import { booleanSettings } from "@/Logic/reducers/settings";

export const switchClassNames = {
  base: "flex-row-reverse justify-between w-full max-w-full",
  label: "text-lg capitalize",
};

export type ToggleSwitchProps = Partial<SwitchProps> & {
  item: booleanSettings;
};
