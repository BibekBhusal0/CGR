// import { Select, SelectItem } from "@heroui/select";
// import { Switch } from "@heroui/switch";
import { useTheme, Switch, Select, Label, ListBox } from "@heroui/react";
import {
  allBoardThemes,
  allNotationStyles,
  boardThemes,
  notationStyle,
  useSettingsState,
} from "@/Logic/state/settings";
import { base_path } from "@/app/full_board/customBoard";
import SwitchGroup from "@/components/switchGroup";
import { switchClassNames } from "@/components/switch_types";

function getImageSource(theme: string, board_theme: string) {
  return `${base_path}${board_theme.toLowerCase()}/${theme === "dark" ? "w" : "b"}P.svg`;
}

function GeneralSettings() {
  const { theme, setTheme } = useTheme();
  const btheme = useSettingsState((state) => state.btheme);
  const setBoardTheme = useSettingsState((state) => state.setBoardTheme);
  const setNotationStyle = useSettingsState((state) => state.setNotationStyle);
  const notationStyle = useSettingsState((state) => state.notationStyle);

  function changeTheme() {
    const not_theme = theme === "dark" ? "light" : "dark";
    setTheme(not_theme);
  }

  return (
    <>
      <Select
      // selectedKeys={[btheme]}
      // startContent={
      //   <img alt="select theme" className="h-auto w-8 pb-1" src={getImageSource(theme, btheme)} />
      // }
      // size="md"
      // classNames={{
      //   label: "text-lg pl-2",
      //   trigger: "capitalize",
      //   listbox: "px-0",
      // }}
      // onChange={(e) => {
      //   if (e.target.value.trim() !== "") {
      //     const v = e.target.value.trim() as boardThemes;
      //     if (!allBoardThemes.includes(v)) return;
      //     setBoardTheme(v);
      //   }
      // }}
      // labelPlacement="outside-left"
      // label="Board Theme"
      >
        <Label> Board Theme</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allBoardThemes.map((board_theme) => (
              <ListBox.Item
                // startContent={
                //   <img
                //     className="h-auto w-9"
                //     src={getImageSource(theme, board_theme)}
                //     alt={`${board_theme} board_theme Pawn`}
                //   />
                // }
                className="capitalize"
                // classNames={{ base: "items-center", title: "text-sm" }}
                aria-label={board_theme}
                key={board_theme}>
                {board_theme}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      <Select
      // selectedKeys={[notationStyle]}
      // size="md"
      // classNames={{
      //   label: "text-lg pl-2",
      //   trigger: "capitalize",
      //   listbox: "px-0",
      // }}
      // onChange={(e) => {
      // if (e.target.value.trim() !== "") {
      //   const v = e.target.value.trim() as notationStyle;
      //   if (!allNotationStyles.includes(v)) return;
      //   setNotationStyle(v);
      // }
      // }}
      // labelPlacement="outside-left"
      // label="Notation"
      >
        <Label> Board Theme</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allNotationStyles.map((notation) => (
              <ListBox.Item
                // className="capitalize"
                // classNames={{ base: "items-center", title: "text-sm" }}
                aria-label={notation}
                key={notation}>
                {notation}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Switch
        isSelected={theme === "dark"}
        onChange={changeTheme}
        // classNames={switchClassNames}
      >
        {" "}
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
        Dark Mode{" "}
      </Switch>
      <SwitchGroup
        switches={[
          { item: "highlight", children: "Highlight Moves" },
          // { item: "animation", children: "Animation" },
          { item: "devMode", children: "Dev Mode" },
        ]}
      />
    </>
  );
}

export default GeneralSettings;
