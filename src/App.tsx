import FullBoard from "./components/full_board";
import LeftPanel from "./components/left_panel";
import RightPanel from "./components/right_panel";

function App() {
  return (
    <div className="flex items-start flex-col md:flex-row gap-3 pt-6 h-full">
      <LeftPanel />
      <FullBoard />
      <RightPanel />
    </div>
  );
}

export default App;
