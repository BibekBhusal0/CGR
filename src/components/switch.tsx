import { Switch } from "@heroui/react";
import { ToggleSwitchProps } from "@/components/switch_types";
import { useSettingsState } from "@/Logic/state/settings";

export function ToggleSwitch({ item, ...props }: ToggleSwitchProps) {
  const value = useSettingsState((state) => state[item]);
  const toggleValues = useSettingsState((state) => state.toggleValues);
  if (typeof props.children === "function") return;

  const toggle = () => toggleValues(item);

  return (
    <Switch {...props} isSelected={value} onChange={toggle}>
      <Switch.Content>
        {props.children || item}
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
}
