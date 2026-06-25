import { ReactNode } from "react";
import { ToastProvider } from "@heroui/react";
import { useTheme } from "@heroui/use-theme";
// import { useSettingsState } from "@/Logic/state/settings";

type ep = { children: ReactNode };

const EverythingProvider = ({ children }: ep) => {
  useTheme();
  // const animation = useSettingsState((state) => state.animation);
  return (
    <>
      {/* <ToastProvider disableAnimation={!animation} /> */}
      <ToastProvider />
      {children}
    </>
  );
};

export default EverythingProvider;
