import { createContext, useContext } from 'react';

const GenericContext = createContext();

//change Generic Provider to new Provider
function GenericProvider({ children }) {
  //change GenericContect to new Context
  return (
    <GenericContext.Provider
      //need to update value with whatever you want the context to hold
      value={'example'}
    >
      {children}
    </GenericContext.Provider>
  );
}
//change useGeneric to new use_Context
function useGenericContext() {
  const context = useContext(GenericContext);
  if (context === undefined)
    throw new Error('GenericContext was used outside of GenericProvider');

  return context;
}

export { GenericProvider, useGenericContext };
