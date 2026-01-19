import { HeroUIProvider } from "@heroui/system";
import { ReactNode } from "react";
import { ToastProvider } from "@heroui/toast";
import { useTheme } from "@heroui/use-theme";

type ep = { children: ReactNode };

const EverythingProvider = ({ children }: ep) => {
  useTheme();
  return (
    <HeroUIProvider disableAnimation={false}>
      <ToastProvider />
      {children}
    </HeroUIProvider>
  );
};

export default EverythingProvider;
