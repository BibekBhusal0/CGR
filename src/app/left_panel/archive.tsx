// import { importGameFromJson, saveGameJson } from "@/utils/import_export";
// import { useRef } from "react";
import { icons } from "@/components/icons";
import { Button, ButtonProps } from "@heroui/button";
import { cn } from "@heroui/theme";
import { Fragment } from "react/jsx-runtime";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { useState } from "react";

export default function Archive() {
  const [warningOpen, setWarningOpen] = useState(false)
  // const [selectOpen, setSelectOpen] = useState(false)

  const allButtons: Partial<ButtonProps>[] = [
    { children: "Add This Game", startContent: icons.others.add },
    { children: "Load From archive", startContent: icons.left_panel.archive },
    { children: "Upload to  archive", startContent: icons.others.upload },
    { children: "Download Archive", startContent: icons.others.download },
    {
      children: "Clear archive",
      color: 'danger',
      variant: 'flat', startContent: icons.others.trash,
      onPress: () => setWarningOpen(true)
    },
  ]

  const defaultProps: ButtonProps = {
    className: 'w-full text-xl',
    size: 'lg',
    color: 'primary',
    variant: 'solid',
  }

  return (
    <div className='flex-center gap-3 flex-col'>
      {allButtons.map((button, i) => <Fragment>
        {button.disabled ? <></> : <Button
          key={i}
          {...defaultProps}
          {...button}
          className={cn(button?.className, defaultProps?.className)}
        />}
      </Fragment>
      )}
      <Modal isOpen={warningOpen} onOpenChange={setWarningOpen} size='xs' hideCloseButton>
        <ModalContent>
          <ModalHeader>
            Are you sure you want to empty the archive
          </ModalHeader>
          <ModalFooter>
            <Button>Yes</Button>
            <Button>No</Button>
          </ModalFooter>
        </ModalContent>

      </Modal>
    </div >
  )
}

/* export default function Archive() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    if (file.type !== "application/json") return;
    importGameFromJson(file);
  };
  const handleRestore = () => fileRef.current?.click();
  const handleBackup = () => saveGameJson();
  return (
    <div>
      <Button onPress={handleRestore} >Load Game </Button>
      <Button onPress={handleBackup} >Save Game </Button>
      <input type="file" accept=".json" onChange={handleFileChange} hidden ref={fileRef} />
    </div>
  )
}
*/
