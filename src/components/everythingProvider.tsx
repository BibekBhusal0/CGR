import { ReactNode } from "react";
import { ToastProvider } from "@heroui/react";
import { useTheme } from "@heroui/use-theme";

type ep = { children: ReactNode };

const EverythingProvider = ({ children }: ep) => {
  useTheme();
  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
};

export default EverythingProvider;
