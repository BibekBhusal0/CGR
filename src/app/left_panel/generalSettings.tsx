import { Select, Label, ListBox } from "@heroui/react";
import {
  allThemes,
  allNotationStyles,
  notationStyle,
  ThemeName,
  useSettingsState,
} from "@/Logic/state/settings";
import { base_path } from "@/app/full_board/customBoard";
import SwitchGroup from "@/components/switch";

function getImageSource(theme: string, board_theme: string) {
  return `${base_path}${board_theme.toLowerCase()}/${theme === "dark" ? "w" : "b"}P.svg`;
}

function GeneralSettings() {
  const theme = useSettingsState((state) => state.theme);
  const setTheme = useSettingsState((state) => state.setTheme);
  const darkMode = useSettingsState((state) => state.darkMode);
  const setNotationStyle = useSettingsState((state) => state.setNotationStyle);
  const notationStyle = useSettingsState((state) => state.notationStyle);
  const mode = darkMode === true ? "dark" : "light";

  return (
    <>
      <Select
        value={theme}
        variant="secondary"
        onChange={(e) => {
          if (e !== "") {
            const v = e as ThemeName;
            if (!allThemes.includes(v)) return;
            setTheme(v);
          }
        }}>
        <Label>Theme</Label>
        <Select.Trigger className="pt-1">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {allThemes.map((board_theme) => (
              <ListBox.Item
                aria-label={board_theme}
                className="py-1"
                key={board_theme}
                id={board_theme}>
                <div className="flex items-center gap-2 capitalize">
                  <img
                    className="h-auto w-9"
                    src={getImageSource(mode, board_theme)}
                    alt={`${board_theme} Pawn`}
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
