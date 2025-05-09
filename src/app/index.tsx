import FullBoard from "./full_board";
import LeftPanel from "./left_panel";
import RightPanel from "./right_panel";

function App() {
  return (
    <div className="flex h-full flex-col items-start gap-3 pt-6 md:flex-row">
      <LeftPanel />
      <FullBoard />
      <RightPanel />
    </div>
  );
}

export default App;
