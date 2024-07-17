import FullBoard from "./components/full_board";
import LeftPanel from "./components/left_panel";
import RightPanel from "./components/right_panel";

function App() {
  return (
    <div className=" flex flex-row gap-2">
      <LeftPanel />
      <FullBoard />
      <RightPanel />
    </div>
  );
}

export default App;
