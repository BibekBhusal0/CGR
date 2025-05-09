import { HeroUIProvider } from "@heroui/system";
import { Provider } from "react-redux";
import { store, loadSettings as load } from "@/Logic/reducers/store";
import { ReactNode, useEffect } from "react";
import { ToastProvider } from "@heroui/toast";

type ep = { children: ReactNode };

const LoadSettings = ({ children }: ep) => {
  useEffect(() => {
    load();
  }, []);
  return children;
};

const EverythingProvider = ({ children }: ep) => {
  return (
    <Provider store={store}>
      <HeroUIProvider disableAnimation={false}>
        <ToastProvider />
        <LoadSettings>{children}</LoadSettings>
      </HeroUIProvider>
    </Provider>
  );
};

export default EverythingProvider;
