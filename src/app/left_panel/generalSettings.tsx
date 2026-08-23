import { Select, Label, ListBox } from "@heroui/react";
import {
  allBoardThemes,
  allNotationStyles,
  boardThemes,
  notationStyle,
  useSettingsState,
} from "@/Logic/state/settings";
import { base_path } from "@/app/full_board/customBoard";
import SwitchGroup from "@/components/switch";

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
          if (e !== "") {
            const v = e as boardThemes;
            if (!allBoardThemes.includes(v)) return;
            setBoardTheme(v);
          }
        }}>
        <Label> Board Theme</Label>
        <Select.Trigger className="pt-1">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allBoardThemes.map((board_theme) => (
              <ListBox.Item
                aria-label={board_theme}
                className="py-1"
                key={board_theme}
                id={board_theme}>
                <div className="flex items-center gap-2 capitalize">
                  <img
                    className="h-auto w-9"
                    src={getImageSource(theme, board_theme)}
                    alt={`${board_theme} board_theme Pawn`}
                  />
                  <div className="text-md pt-1">{board_theme}</div>
                </div>
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
        <Label>Notation Style</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allNotationStyles.map((notation) => (
              <ListBox.Item
                className="capitalize"
                aria-label={notation}
                id={notation}
                key={notation}>
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
          { item: "animation", children: "Animation" },
          { item: "evalBar", children: "Eval Bar" },
          { item: "devMode", children: "Dev Mode" },
        ]}
      />
    </>
  );
}

export default GeneralSettings;
