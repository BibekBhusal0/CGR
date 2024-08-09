import FullBoard from "./components/full_board";
import LeftPanel from "./components/left_panel";
import RightPanel from "./components/right_panel";
import {
  Action,
  initialState,
  reducer,
  stateProps,
  ContextProps,
} from "./Logic/reducers";
import {
  ColorAction,
  ColorReducer,
  ColorState,
  ColorStateType,
  ColorContextProps,
} from "./components/colors";
import { useReducer, createContext, Dispatch } from "react";

export const AppContext = createContext<ContextProps | undefined>(undefined);
export const ColorContext = createContext<ColorContextProps | undefined>(
  undefined
);
function App() {
  const [state, dispatch]: [stateProps, Dispatch<Action>] = useReducer(
    reducer,
    initialState
  );
  const [CState, CDispatch]: [ColorStateType, Dispatch<ColorAction>] =
    useReducer(ColorReducer, ColorState);
  return (
    <div className="flex items-start flex-col md:flex-row gap-3 pt-6 h-full">
      <AppContext.Provider value={{ state, dispatch }}>
        <ColorContext.Provider value={{ state: CState, dispatch: CDispatch }}>
          <LeftPanel />
          <FullBoard />
        </ColorContext.Provider>
        <RightPanel />
      </AppContext.Provider>
    </div>
  );
}

export default App;
