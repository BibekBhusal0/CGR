import FullBoard from "./full_board";
import LeftPanel from "./left_panel";
import RightPanel from "./right_panel";

function App() {
  return (
    <div className="flex h-full flex-col items-start gap-3 pt-6 md:flex-row">
      <div className="basis-3/12 w-full">
        <LeftPanel />
      </div>
      <div className="basis-6/12 lg:basis-5/12 px-2 lg:px-0 ">
        <FullBoard />
      </div>
      <div className="relative basis-3/12 px-2 lg:basis-4/12 w-full">
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
