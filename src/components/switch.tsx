import { Switch, SwitchProps } from "@heroui/switch";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";
import { booleanSettings, toggleValues } from "@/Logic/reducers/settings";

export const switchClassNames = {
  // base: "flex-row-reverse justify-between w-full max-w-full pt-3 mt-3",
  base: "flex-row-reverse justify-between w-full max-w-full border-default-400",
  label: "text-lg capitalize",
};

export type ToggleSwitchProps = Partial<SwitchProps> & {
  item: booleanSettings;
};

function ToggleSwitch({ item, ...props }: ToggleSwitchProps) {
  const value = useSelector((state: StateType) => state.settings[item]);

  const dispatch = useDispatch();
  const toggle = () => dispatch(toggleValues(item));

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

export default ToggleSwitch;
