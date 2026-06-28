import { ReactNode } from "react";
import { ToastProvider } from "@heroui/react";
import { autoSetTheme } from "@/utils/setTheme";

type ep = { children: ReactNode };

const EverythingProvider = ({ children }: ep) => {
  autoSetTheme();
  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
};

export default EverythingProvider;
