import { enableMapSet } from 'immer';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { createSingletonSubscriber } from './utils/createSingletonSubscriber';
import { BodhiSlice, createBodhiSlice } from './bodhiSlice';
import { Web3Slice, createWeb3Slice } from './web3Slice';

enableMapSet();

export type RootStore =
    BodhiSlice &
    Web3Slice


export const useRootStore = create<RootStore>()(
    subscribeWithSelector(
        devtools((...args) => {
            return {
                ...createBodhiSlice(...args),
                ...createWeb3Slice(...args)
            };
        })
    )
);

// hydrate state from localeStorage to not break on ssr issues
if (typeof document !== 'undefined') {
    document.onreadystatechange = function () {
        if (document.readyState == 'complete') {
            //---------------------
        }
    };
}

export const useSpaceUserDataSubscription = createSingletonSubscriber(() => { 
    return useRootStore.getState().refreshSpaceUserData();

}, 1000 * 60 * 60); //1hour

export const useBodhiDataSubscription = createSingletonSubscriber(() => {
    return useRootStore.getState().refreshBodhiData();
}, 60000 * 5); //5minutes
 