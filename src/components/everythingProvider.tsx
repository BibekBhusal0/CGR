import { HeroUIProvider } from "@heroui/system";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/Logic/reducers/store";
import { ReactNode } from "react";

type ep = { children: ReactNode; }

const EverythingProvider = ({ children }: ep) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HeroUIProvider disableAnimation={false}>
          {children}
        </HeroUIProvider>
      </PersistGate>
    </Provider>
  );
};

export default EverythingProvider;
