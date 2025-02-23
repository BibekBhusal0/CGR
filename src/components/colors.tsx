import { Input } from "@heroui/input";
import { Listbox, ListboxItem, Snippet } from "@heroui/react";
import { Dispatch, useContext } from "react";
import { AppContext, ColorContext } from "../App";

export function ColorPicker() {
  const colorContext = useContext(ColorContext);
  const appContext = useContext(AppContext);
  if (!colorContext || !appContext) {
    throw new Error("context not found");
  }
  const {
    dispatch,
    state: { colors },
  } = colorContext;
  const {
    state: { btheme },
  } = appContext;
  const { light, dark } = colors[btheme];

  const customStyle = {
    color: light,
    backgroundColor: dark,
  };
  const entries = [
    {
      label: "Light Square Color",
      value: light,

      onValueChange: (e: string) => {
        dispatch({
          type: "SetColor",
          theme: btheme,
          color: { light: e, dark },
        });
      },
    },
    {
      label: "Dark Square Color",
      value: dark,
      onValueChange: (e: string) => {
        dispatch({
          type: "SetColor",
          theme: btheme,
          color: { light, dark: e },
        });
      },
    },
  ];
  return (
    <div className="flex flex-col gap-5 justify-center">
      <div
        style={customStyle}
        className="p-2 rounded-md text-2xl font-bold text-center">
        TEST
      </div>
      <div className="flex gap-3 flex-col">
        {entries.map((item) => (
          <Input
            {...item}
            key={item.label}
            type="color"
            labelPlacement="outside-left"
            classNames={{
              input: "w-full h-min-2 h-6",
              mainWrapper: "w-12 h-full cursor-pointer",
              base: "justify-around",
              label: "text-xl",
            }}></Input>
        ))}

        <AllColors />
      </div>
    </div>
  );
}

const AllColors: React.FC = () => {
  const colorContext = useContext(ColorContext);
  const appContext = useContext(AppContext);
  if (!colorContext || !appContext) {
    throw new Error("context not found");
  }
  const {
    state: { colors },
  } = colorContext;
  const {
    state: { btheme },
    dispatch,
  } = appContext;

  return (
    <Snippet
      hideSymbol
      variant="bordered"
      classNames={{ base: "items-start" }}
      copyButtonProps={{
        onClick: () => navigator.clipboard.writeText(JSON.stringify(colors)),
      }}>
      <Listbox
        classNames={{ base: "overflow-auto h-60" }}
        selectionMode="single"
        selectedKeys={[btheme]}
        aria-label="select"
        onSelectionChange={(item) => {
          dispatch({ type: "SetTheme", theme: String(Array.from(item)[0]) });
        }}
        color="success"
        variant="solid">
        {Object.entries(colors).map(([th, sqTypes]) => (
          <ListboxItem textValue={th} key={th}>
            <div className="font-bold capitalize">{th}</div>
            <ul className="pl-5 ">
              {Object.entries(sqTypes).map(([key, val]) => (
                <li key={key}>
                  <span className="font-semibold capitalize">{key}</span>:
                  <span className="uppercase">{val}</span>
                </li>
              ))}
            </ul>
          </ListboxItem>
        ))}
      </Listbox>
    </Snippet>
  );
};

export interface boardColorType {
  light: string;
  dark: string;
}

export interface themeToColor {
  [key: string]: boardColorType;
}

export type ColorAction = {
  type: "SetColor";
  color: boardColorType;
  theme: string;
};

export interface ColorStateType {
  colors: themeToColor;
}

export interface ColorContextProps {
  state: ColorStateType;
  dispatch: Dispatch<ColorAction>;
}

export const ColorState: ColorStateType = {
  colors: {
    default: { light: "#f0d2ad", dark: "#654e2f" },
    ocen: { light: "#D5E0E6", dark: "#6aa4c8" },
    wood: { light: "#c8ac89", dark: "#6e543f" },
    geometric: { light: "#C7C3AB", dark: "#77534c" },
    cosmos: { light: "#94a1ad", dark: "#464c53" },
    dash: { light: "#EDF3F4", dark: "#7e8a99" },
    glass: { light: "#dbdbdb", dark: "#687578" },
    nature: { light: "#c4d49b", dark: "#68926f" },
  },
};

export function ColorReducer(
  state: ColorStateType,
  action: ColorAction
): ColorStateType {
  switch (action.type) {
    default:
      return state;
    case "SetColor":
      return {
        ...state,
        colors: { ...state.colors, [action.theme]: action.color },
      };
  }
}
