import { ReactNode } from "react";
import { ToastProvider } from "@heroui/react";
import { autoSetTheme } from "@/utils/setTheme";
import { autoSetAnimation } from "@/utils/setAnimation";

type ep = { children: ReactNode };

const EverythingProvider = ({ children }: ep) => {
  autoSetTheme();
  autoSetAnimation();
  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
};

export default EverythingProvider;
