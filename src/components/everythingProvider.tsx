import { HeroUIProvider } from "@heroui/system";
import { ReactNode } from "react";
import { ToastProvider } from "@heroui/toast";
import { useTheme } from "@heroui/use-theme";
import { useSettingsState } from "@/Logic/state/settings";

type ep = { children: ReactNode };

const EverythingProvider = ({ children }: ep) => {
  useTheme();
  const animation = useSettingsState((state) => state.animation);
  return (
    <HeroUIProvider disableAnimation={!animation}>
      <ToastProvider disableAnimation={!animation} />
      {children}
    </HeroUIProvider>
  );
};

export default EverythingProvider;
