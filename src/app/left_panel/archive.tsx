import { importGameFromJson, saveGameJson } from "@/utils/import_export";
import { Button } from "@heroui/button";
import { useRef } from "react";

export default function Archive() {
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



