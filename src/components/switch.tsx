import { Switch } from "@heroui/react";
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
      onChange={toggle}
      // children={props.children || item}
      // classNames={switchClassNames}
    >
      <Switch.Content>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Content>
      {props.children || item }
    </Switch>
  );
}
