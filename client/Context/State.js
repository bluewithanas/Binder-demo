import { createContext, useContext, useState } from 'react';


export const AppContext= createContext();

export function AppWrapper({children}){
    const [GlobalState, setGlobalState]=useState({
        name: null,
        email: null,
        id: null
    });

    return(
        <AppContext.Provider value={{GlobalState, setGlobalState}}>


            {children}
        </AppContext.Provider>
    )
}

// export function useAppContext(){
//     return useContext(AppContext());
// }