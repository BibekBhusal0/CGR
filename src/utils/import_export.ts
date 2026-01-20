export const saveToJson = (data: unknown, fileName: string = "games") => {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName + ".json";
  a.click();
  URL.revokeObjectURL(url);
};
