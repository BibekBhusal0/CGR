import FullBoard from "./components/full_board";
import LeftPanel from "./components/left_panel";
import RightPanel from "./components/right_panel";

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
