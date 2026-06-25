import { Switch } from "@heroui/react";
import { switchClassNames, ToggleSwitchProps } from "@/components/switch_types";
import { useSettingsState } from "@/Logic/state/settings";

export function ToggleSwitch({ item, ...props }: ToggleSwitchProps) {
  const value = useSettingsState((state) => state[item]);
  const toggleValues = useSettingsState((state) => state.toggleValues);
  if (typeof props.children === "function") return;

  const toggle = () => toggleValues(item);

  return (
    <Switch
      {...props}
      isSelected={value}
      onChange={toggle}
      // classNames={switchClassNames}
    >
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        {props.children || item}
      </Switch.Content>
    </Switch>
  );
}
