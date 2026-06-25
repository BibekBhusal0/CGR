import { SwitchProps } from "@heroui/react";
import { booleanSettings } from "@/Logic/state/settings";

export type ToggleSwitchProps = Partial<SwitchProps> & {
  item: booleanSettings;
};
