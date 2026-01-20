import { Switch } from "@heroui/switch";
import { switchClassNames, ToggleSwitchProps } from "@/components/switch_types";
import { useSettingsState } from "@/Logic/state/settings";

export function ToggleSwitch({ item, ...props }: ToggleSwitchProps) {
  const value = useSettingsState((state) => state[item]);
  const toggleValues = useSettingsState((state) => state.toggleValues);

  const toggle = () => toggleValues(item);

  return (
    <Switch
      {...props}
      isSelected={value}
      onValueChange={toggle}
      children={props.children || item}
      classNames={switchClassNames}
    />
  );
}
