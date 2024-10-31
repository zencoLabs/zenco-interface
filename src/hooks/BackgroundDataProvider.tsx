import React, { useContext } from 'react';
import {
    useBodhiDataSubscription,
    useSpaceUserDataSubscription,
} from 'src/store/root';

interface BackgroundDataProviderContextType {
    refetchBodhiData: () => Promise<void>;
    refetchSpaceUserData?: () => Promise<void>; 
}

const BackgroundDataProviderContext = React.createContext<BackgroundDataProviderContextType>(
    {} as BackgroundDataProviderContextType
);

/**
 * Naive provider that subscribes to different data sources.
 * This context provider will run useEffects that relate to instantiating subscriptions as a poll every 60s to consistently fetch data from on-chain and update the Zustand global store.
 * @returns
 */
export const BackgroundDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const refetchSpaceUserData = useSpaceUserDataSubscription();

    const refetchBodhiData = useBodhiDataSubscription(); 

    return (
        <BackgroundDataProviderContext.Provider
            value={{ refetchBodhiData, refetchSpaceUserData }}
        >
            {children}
        </BackgroundDataProviderContext.Provider>
    );
};

export const useBackgroundDataProvider = () => useContext(BackgroundDataProviderContext);
