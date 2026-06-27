import { clearArchive, getAllGamesFromArchive, importGamesToArchive, getDb } from "@/utils/archive";
import { saveToJson } from "@/utils/import_export";
import { Button, ButtonGroup, ButtonProps, Modal, toast } from "@heroui/react";
import { useState, useRef } from "react";
import { icons } from "@/components/icons";
import { saveType, useGameState } from "@/Logic/state/game";
import { Buttons, newButtonProps } from "@/components/buttons";

export default function Archive() {
  const [warningOpen, setWarningOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [games, setGames] = useState<saveType[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const Game = useGameState((state) => state.Game);
  const analysis = useGameState((state) => state.analysis);
  const saveGameToArchive = useGameState((state) => state.saveGameToArchive);
  const loadGame = useGameState((state) => state.loadGame);
  const onLoad = (game: saveType) => {
    loadGame(game);
    try {
      setArchiveOpen(false);
      toast.success("Game Imported");
    } catch {
      toast.danger("Game can not be imported");
    }
  };

  const loadGames = async () => {
    const all = await getAllGamesFromArchive();
    setGames(all);
    setArchiveOpen(true);
  };

  const handleImportArchive = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/json") return;
    const text = await file.text();
    const games = JSON.parse(text);
    if (Array.isArray(games)) {
      await importGamesToArchive(games);
      toast.success("Archive imported");
    } else {
      toast.danger("Invalid Archive Format");
    }
  };

  const handleExportArchive = async () => {
    const all = await getAllGamesFromArchive();
    saveToJson(all, "chess_archive");
    toast.success("Archive downloaded");
  };

  const handleDeleteGame = async (id: string) => {
    const db = await getDb();
    await db.delete("games", id);
    loadGames();
    toast.danger("Game deleted");
  };

  const handleClear = async () => {
    await clearArchive();
    setWarningOpen(false);
    toast.warning("Archive cleared");
  };

  const allButtons: newButtonProps[] = [
    {
      children: "Add This Game",
      icon: icons.others.add,
      onClick: saveGameToArchive,
      hide: !Game || !analysis,
    },
    {
      children: "Load From archive",
      icon: icons.left_panel.archive,
      onClick: loadGames,
    },
    {
      children: "Upload to archive",
      icon: icons.others.upload,
      onClick: () => fileRef.current?.click(),
    },
    {
      children: "Download Archive",
      icon: icons.others.download,
      onClick: handleExportArchive,
    },
    {
      children: "Clear archive",
      variant: "danger",
      icon: icons.others.trash,
      onClick: () => setWarningOpen(true),
    },
  ];

  const defaultProps: ButtonProps = {
    className: "w-full text-xl",
    size: "lg",
  };

  return (
    <>
      <Buttons buttons={allButtons} defaultProps={defaultProps} />
      <input type="file" accept=".json" onChange={handleImportArchive} hidden ref={fileRef} />

      {/* Warning Modal */}
      <Modal isOpen={warningOpen} onOpenChange={setWarningOpen}>
        <Modal.Backdrop>
          <Modal.Container size="xs">
            <Modal.Dialog>
              <Modal.Header>Are you sure you want to empty the archive?</Modal.Header>
              <Modal.Footer>
                <Buttons
                  buttons={[
                    { onClick: handleClear, variant: "danger", children: "Yes" },
                    { onClick: () => setWarningOpen(false), children: "No" },
                  ]}
                  defaultProps={{ size: "sm" }}
                />
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Load Archive Modal */}
      <Modal isOpen={archiveOpen} onOpenChange={setArchiveOpen}>
        <Modal.Backdrop>
          <Modal.Container size="sm">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>{games.length === 0 ? "Archive Empty" : "Select a Game"}</Modal.Header>
              <Modal.Body className="flex max-h-96 flex-col overflow-auto">
                {games.length === 0 ? (
                  <div className="pb-5 text-center text-gray-500">
                    You can add a game to archive using the <strong>"Add This Game"</strong> button
                    when you are analyzing a game. Once archived, games will appear here for easy
                    loading.
                  </div>
                ) : (
                  games.map((game, i) => (
                    <ButtonGroup key={game.id} className="mb-2 w-full">
                      <Button
                        className="w-full max-w-[90%] justify-start truncate"
                        variant="tertiary"
                        onClick={() => onLoad(game)}>
                        {game.name || `Game ${i + 1}`}
                      </Button>
                      <Button
                        variant="danger-soft"
                        className="text-xl"
                        onClick={() => handleDeleteGame(game.id)}
                        isIconOnly>
                        {icons.others.trash}
                      </Button>
                    </ButtonGroup>
                  ))
                )}
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
