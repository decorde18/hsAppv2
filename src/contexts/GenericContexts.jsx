import { createContext, useContext } from "react";

const GenericContext = createContext();
function GenericProvider({ children }) {
  return <GenericContext.Provider>{children}</GenericContext.Provider>;
}
function useGeneric() {
  const context = useContext(GenericContext);
  if (context === undefined)
    throw new Error("GenericContext was used outside of GenericProvider");
}

export { GenericProvider, useGeneric };
