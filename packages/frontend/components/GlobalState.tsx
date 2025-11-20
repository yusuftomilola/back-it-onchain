"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Call {
    id: string;
    title: string;
    thesis: string;
    asset: string;
    target: string;
    deadline: string;
    stake: string;
    creator: User;
    status: 'active' | 'closed' | 'disputed';
    createdAt: string;
    backers: number;
    comments: number;
    volume: string;
}

export interface User {
    name: string;
    handle: string;
    avatar: string; // Color or image URL
}

interface GlobalStateContextType {
    calls: Call[];
    createCall: (call: Omit<Call, 'id' | 'creator' | 'status' | 'createdAt' | 'backers' | 'comments' | 'volume'>) => Promise<void>;
    stakeOnCall: (callId: string, amount: number, type: 'back' | 'challenge') => Promise<void>;
    currentUser: User;
    isLoading: boolean;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

const MOCK_USER: User = {
    name: "Mustang",
    handle: "@mustang_onchain",
    avatar: "bg-gradient-to-br from-primary to-purple-600",
};

const INITIAL_CALLS: Call[] = [
    {
        id: "1",
        title: "ETH to hit $4,000 by end of Q2",
        thesis: "The ETF inflows are just starting to ramp up. Technicals showing a clear breakout from the accumulation zone. Supply shock incoming.",
        asset: "ETH",
        target: "$4,000",
        deadline: "Jun 30, 2025",
        stake: "5.0 ETH",
        creator: { name: "CryptoWhale", handle: "@whale_eth", avatar: "bg-blue-500" },
        status: "active",
        createdAt: "2h ago",
        backers: 24,
        comments: 48,
        volume: "$12,450"
    },
    {
        id: "2",
        title: "Base to flip Arbitrum in TVL",
        thesis: "Coinbase Smart Wallet is a game changer. Onboarding millions of users directly to Base. The flippening is inevitable.",
        asset: "TVL",
        target: "Flippening",
        deadline: "Dec 31, 2025",
        stake: "1000 USDC",
        creator: { name: "BaseGod", handle: "@based", avatar: "bg-blue-600" },
        status: "active",
        createdAt: "5h ago",
        backers: 156,
        comments: 89,
        volume: "$45,200"
    },
    {
        id: "3",
        title: "Farcaster to reach 1M DAU",
        thesis: "Network effects are kicking in. Frames are the new mini-apps. It's the only crypto social app that feels like a real product.",
        asset: "DAU",
        target: "1,000,000",
        deadline: "Aug 15, 2025",
        stake: "500 USDC",
        creator: { name: "VitalikFan", handle: "@vitalik_fan", avatar: "bg-green-500" },
        status: "active",
        createdAt: "1d ago",
        backers: 42,
        comments: 12,
        volume: "$8,500"
    }
];

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
    const [calls, setCalls] = useState<Call[]>(INITIAL_CALLS);
    const [isLoading, setIsLoading] = useState(false);
    const currentUser = MOCK_USER;

    const createCall = async (newCallData: Omit<Call, 'id' | 'creator' | 'status' | 'createdAt' | 'backers' | 'comments' | 'volume'>) => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newCall: Call = {
            ...newCallData,
            id: Math.random().toString(36).substr(2, 9),
            creator: currentUser,
            status: 'active',
            createdAt: 'Just now',
            backers: 0,
            comments: 0,
            volume: `$${newCallData.stake}` // Initial volume is just the stake
        };

        setCalls(prev => [newCall, ...prev]);
        setIsLoading(false);
    };

    const stakeOnCall = async (callId: string, amount: number, type: 'back' | 'challenge') => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        setCalls(prev => prev.map(call => {
            if (call.id === callId) {
                // Simple parsing of volume string (e.g., "$12,450" -> 12450)
                const currentVolume = parseFloat(call.volume.replace(/[^0-9.-]+/g, "")) || 0;
                const newVolume = currentVolume + amount;

                return {
                    ...call,
                    backers: call.backers + 1,
                    volume: `$${newVolume.toLocaleString()}`
                };
            }
            return call;
        }));
        setIsLoading(false);
    };

    return (
        <GlobalStateContext.Provider value={{ calls, createCall, stakeOnCall, currentUser, isLoading }}>
            {children}
        </GlobalStateContext.Provider>
    );
}

export function useGlobalState() {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
        throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
}
