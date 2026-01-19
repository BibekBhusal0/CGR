import { HeroUIProvider } from "@heroui/system";
import { loadSettings as load } from "@/utils/storage";
import { ReactNode, useEffect } from "react";
import { ToastProvider } from "@heroui/toast";
import { useTheme } from "@heroui/use-theme";

type ep = { children: ReactNode };

const LoadSettings = ({ children }: ep) => {
  useTheme();
  useEffect(() => {
    load();
  }, []);
  return children;
};

const EverythingProvider = ({ children }: ep) => {
  return (
    <HeroUIProvider disableAnimation={false}>
      <ToastProvider />
      <LoadSettings>{children}</LoadSettings>
    </HeroUIProvider>
  );
};

export default EverythingProvider;
