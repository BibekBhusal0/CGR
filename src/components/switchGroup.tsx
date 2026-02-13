import { ToggleSwitch } from "@/components/switch";
import { ToggleSwitchProps } from "@/components/switch_types";

export default function SwitchGroup({ switches }: { switches: ToggleSwitchProps[] }) {
  return (
    <>
      {switches.map((s, i) => (
        <ToggleSwitch key={i} {...s} />
      ))}
    </>
  );
}
