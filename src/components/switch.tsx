import { Switch } from "@heroui/react";
import { useSettingsState } from "@/Logic/state/settings";
import { SwitchProps } from "@heroui/react";
import { booleanSettings } from "@/Logic/state/settings";

export type ToggleSwitchProps = Partial<SwitchProps> & {
  item: booleanSettings;
};

export function ToggleSwitch({ item, ...props }: ToggleSwitchProps) {
  const value = useSettingsState((state) => state[item]);
  const toggleValues = useSettingsState((state) => state.toggleValues);
  if (typeof props.children === "function") return;

  const toggle = () => toggleValues(item);

  return (
    <Switch {...props} isSelected={value} onChange={toggle}>
      <Switch.Content>
        <div className="label">{props.children || item}</div>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Content>
    </Switch>
  );
}

export default function SwitchGroup({ switches }: { switches: ToggleSwitchProps[] }) {
  return (
    <>
      {switches.map((s, i) => (
        <ToggleSwitch key={i} {...s} />
      ))}
    </>
  );
}
