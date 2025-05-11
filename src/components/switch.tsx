import { Switch, } from "@heroui/switch";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "@/Logic/reducers/store";
import { toggleValues } from "@/Logic/reducers/settings";
import { switchClassNames, ToggleSwitchProps } from "./switch_types";

export function ToggleSwitch({ item, ...props }: ToggleSwitchProps) {
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
