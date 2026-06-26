import { Select, Label, ListBox } from "@heroui/react";
import {
  allBoardThemes,
  allNotationStyles,
  boardThemes,
  notationStyle,
  useSettingsState,
} from "@/Logic/state/settings";
import { base_path } from "@/app/full_board/customBoard";
import SwitchGroup from "@/components/switchGroup";

function getImageSource(theme: string, board_theme: string) {
  return `${base_path}${board_theme.toLowerCase()}/${theme === "dark" ? "w" : "b"}P.svg`;
}

function GeneralSettings() {
  const btheme = useSettingsState((state) => state.btheme);
  const setBoardTheme = useSettingsState((state) => state.setBoardTheme);
  const darkMode = useSettingsState((state) => state.darkMode);
  const setNotationStyle = useSettingsState((state) => state.setNotationStyle);
  const notationStyle = useSettingsState((state) => state.notationStyle);
  const theme = darkMode === true ? "dark" : "light";

  return (
    <>
      <Select
        value={btheme}
        variant="secondary"
        onChange={(e) => {
          if (e == "") {
            const v = e as boardThemes;
            if (!allBoardThemes.includes(v)) return;
            setBoardTheme(v);
          }
        }}>
        <Label className="pl-2 text-lg"> Board Theme</Label>
        <Select.Trigger className="items-center gap-2 capitalize">
          <img alt="select theme" className="h-auto w-8 pb-1" src={getImageSource(theme, btheme)} />
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allBoardThemes.map((board_theme) => (
              <ListBox.Item className="py-1 capitalize" aria-label={board_theme} key={board_theme}>
                <img
                  className="h-auto w-9"
                  src={getImageSource(theme, board_theme)}
                  alt={`${board_theme} board_theme Pawn`}
                />
                {board_theme}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      <Select
        value={notationStyle}
        variant="secondary"
        onChange={(e) => {
          if (e !== "") {
            const v = e as notationStyle;
            if (!allNotationStyles.includes(v)) return;
            setNotationStyle(v);
          }
        }}>
        <Label className="pl-2 text-lg">Notation Style</Label>
        <Select.Trigger className="capitalize">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allNotationStyles.map((notation) => (
              <ListBox.Item className="capitalize" aria-label={notation} key={notation}>
                {notation}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <SwitchGroup
        switches={[
          { item: "darkMode", children: "Dark Mode" },
          { item: "highlight", children: "Highlight Moves" },
          // { item: "animation", children: "Animation" },
          { item: "devMode", children: "Dev Mode" },
        ]}
      />
    </>
  );
}

export default GeneralSettings;
