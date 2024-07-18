import FullBoard from "./components/full_board";
import LeftPanel from "./components/left_panel";
import RightPanel from "./components/right_panel";
import {
  Action,
  initialState,
  reducer,
  stateProps,
  ContextProps,
} from "./reducers";
import { useReducer, createContext, Dispatch } from "react";

export const AppContext = createContext<ContextProps | undefined>(undefined);
function App() {
  const [state, dispatch]: [stateProps, Dispatch<Action>] = useReducer(
    reducer,
    initialState
  );
  return (
    <div className=" flex flex-row gap-3 pt-6">
      <AppContext.Provider value={{ state, dispatch }}>
        <LeftPanel />
        <FullBoard />
        <RightPanel />
      </AppContext.Provider>
    </div>
  );
}

export default App;
