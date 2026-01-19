import {
  addGameToArchive,
  clearArchive,
  getAllGamesFromArchive,
  importGamesToArchive,
} from "@/utils/archive";
import { getCurrentGameToSave, importGame, saveToJson } from "@/utils/import_export";
import { Button, ButtonGroup, ButtonProps } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { useState, useRef } from "react";
import { icons } from "@/components/icons";
import { cn } from "@heroui/theme";
import { Fragment } from "react/jsx-runtime";
import { addToast } from "@heroui/toast";
import { saveType, useGameState } from "@/Logic/state/game";

export default function Archive() {
  const [warningOpen, setWarningOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [games, setGames] = useState<saveType[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const Game = useGameState((state) => state.Game);
  const analysis = useGameState((state) => state.analysis);

  const loadGames = async () => {
    const all = await getAllGamesFromArchive();
    setGames(all);
    setArchiveOpen(true);
  };

  const handleAddGame = async () => {
    const g = getCurrentGameToSave();
    if (!g) {
      addToast({ title: "No game to save", color: "danger" });
      return;
    }
    const all = await getAllGamesFromArchive();
    const alreadySaved = all.some((game) => game.pgn === g.pgn);
    if (alreadySaved) {
      addToast({ title: "Game already archived", color: "warning" });
      return;
    }
    await addGameToArchive(g as saveType);
    addToast({ title: "Game archived", color: "success" });
  };

  const handleImportArchive = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/json") return;
    const text = await file.text();
    const games = JSON.parse(text);
    if (Array.isArray(games)) {
      await importGamesToArchive(games);
      addToast({ title: "Archive imported", color: "success" });
    } else {
      addToast({ title: "Invalid Archive Format", color: "danger" });
    }
  };

  const handleExportArchive = async () => {
    const all = await getAllGamesFromArchive();
    saveToJson(all, "chess_archive");
    addToast({ title: "Archive downloaded", color: "success" });
  };

  const handleDeleteGame = async (id: string) => {
    const db = await (await import("@/utils/archive")).getDb();
    await db.delete("games", id);
    loadGames();
    addToast({ title: "Game deleted", color: "danger" });
  };

  const handleClear = async () => {
    await clearArchive();
    setWarningOpen(false);
    addToast({ title: "Archive cleared", color: "warning" });
  };

  const allButtons: Partial<ButtonProps>[] = [
    {
      children: "Add This Game",
      startContent: icons.others.add,
      onPress: handleAddGame,
      disabled: !Game || !analysis,
    },
    { children: "Load From archive", startContent: icons.left_panel.archive, onPress: loadGames },
    {
      children: "Upload to archive",
      startContent: icons.others.upload,
      onPress: () => fileRef.current?.click(),
    },
    {
      children: "Download Archive",
      startContent: icons.others.download,
      onPress: handleExportArchive,
    },
    {
      children: "Clear archive",
      color: "danger",
      variant: "flat",
      startContent: icons.others.trash,
      onPress: () => setWarningOpen(true),
    },
  ];

  const defaultProps: ButtonProps = {
    className: "w-full text-xl",
    size: "lg",
    color: "primary",
    variant: "solid",
  };

  return (
    <div className="flex-center flex-col gap-3">
      {allButtons.map((button, i) => (
        <Fragment key={i}>
          {!button.disabled && (
            <Button
              {...defaultProps}
              {...button}
              className={cn(button?.className, defaultProps.className)}
            />
          )}
        </Fragment>
      ))}
      <input type="file" accept=".json" onChange={handleImportArchive} hidden ref={fileRef} />

      {/* Warning Modal */}
      <Modal isOpen={warningOpen} onOpenChange={setWarningOpen} size="xs" hideCloseButton>
        <ModalContent>
          <ModalHeader>Are you sure you want to empty the archive?</ModalHeader>
          <ModalFooter>
            <Button size="sm" color="danger" onPress={handleClear}>
              Yes
            </Button>
            <Button size="sm" onPress={() => setWarningOpen(false)}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Load Archive Modal */}
      <Modal isOpen={archiveOpen} onOpenChange={setArchiveOpen} size="md">
        <ModalContent>
          <ModalHeader>{games.length === 0 ? "Archive Empty" : "Select a Game"}</ModalHeader>
          <ModalBody className="flex max-h-96 flex-col overflow-auto">
            {games.length === 0 ? (
              <div className="pb-5 text-center text-gray-500">
                You can add a game to archive using the <strong>"Add This Game"</strong> button when
                you are analyzing a game. Once archived, games will appear here for easy loading.
              </div>
            ) : (
              games.map((game, i) => (
                <>
                  <ButtonGroup key={game.id} className="mb-2 w-full">
                    <Button
                      className="w-full justify-start"
                      variant="solid"
                      onPress={() => {
                        importGame(game);
                        setArchiveOpen(false);
                      }}>
                      {game.name || `Game ${i + 1}`}
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      className="text-xl"
                      onPress={() => handleDeleteGame(game.id)}
                      isIconOnly>
                      {icons.others.trash}
                    </Button>
                  </ButtonGroup>
                </>
              ))
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
