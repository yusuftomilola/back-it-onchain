'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains';
import { http, createConfig, WagmiProvider, cookieStorage, createStorage, type State } from 'wagmi';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { ReactNode, useState } from 'react';

import { GlobalStateProvider } from './GlobalState';

const config = createConfig({
    chains: [baseSepolia],
    connectors: [
        injected(),
        coinbaseWallet({
            appName: 'Back It (Onchain)',
        }),
    ],
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    transports: {
        [baseSepolia.id]: http(),
    },
});

export function Providers(props: {
    children: ReactNode;
    initialState?: State;
}) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config} initialState={props.initialState}>
            <QueryClientProvider client={queryClient}>
                <OnchainKitProvider
                    apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
                    chain={baseSepolia}
                >
                    <GlobalStateProvider>
                        {props.children}
                    </GlobalStateProvider>
                </OnchainKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
