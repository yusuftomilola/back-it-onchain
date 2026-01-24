"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWriteContract, usePublicClient, useAccount } from 'wagmi';
import { parseEther, stringToHex } from 'viem';
import { CallRegistryABI, ERC20ABI } from '../lib/abis';
import { useChain } from './ChainProvider';
import { useStellarWallet } from './StellarWalletProvider';

export interface Call {
  id: string; // callOnchainId
  title: string;
  thesis: string;
  asset: string;
  target: string;
  deadline: string;
  stake: string;
  creator: User;
  status: string;
  createdAt: string;
  backers: number;
  comments: number;
  volume: string;
  totalStakeYes: number;
  totalStakeNo: number;
  stakeToken: string;
  endTs: string;
  conditionJson?: any;
  chain?: "base" | "stellar";
}

export interface User {
  wallet: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  avatarCid?: string;
  avatar?: string; // Legacy UI
}

interface GlobalStateContextType {
    calls: Call[];
    createCall: (call: Omit<Call, 'id' | 'creator' | 'status' | 'createdAt' | 'backers' | 'comments' | 'volume' | 'totalStakeYes' | 'totalStakeNo' | 'stakeToken' | 'endTs' | 'conditionJson'>) => Promise<void>;
    stakeOnCall: (callId: string, amount: number, type: 'back' | 'challenge') => Promise<void>;
    currentUser: User | null;
    isLoading: boolean;
    login: () => Promise<void>;
    updateProfile: (data: { handle: string; bio: string }) => Promise<void>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined,
);

export function GlobalStateProvider({ children }: { children: React.ReactNode }) {
    const [calls, setCalls] = useState<Call[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const { writeContractAsync } = useWriteContract();
    const publicClient = usePublicClient();
    const { address: evmAddress, isConnected: isEvmConnected } = useAccount();

    // Multi-chain support
    const { selectedChain } = useChain();
    const { publicKey: stellarAddress, isConnected: isStellarConnected } = useStellarWallet();

    // Determine active wallet based on selected chain
    const address = selectedChain === 'stellar' ? stellarAddress : evmAddress;
    const isConnected = selectedChain === 'stellar' ? isStellarConnected : isEvmConnected;

  useEffect(() => {
    const storedChain = localStorage.getItem("selectedChain");
    if (storedChain === "base" || storedChain === "stellar") {
      setSelectedChainState(storedChain);
    }
  }, []);

  const setSelectedChain = (chain: "base" | "stellar") => {
    setSelectedChainState(chain);
    localStorage.setItem("selectedChain", chain);
    if (isConnected) {
      disconnect();
    }
  };

  const fetchCalls = async () => {
    try {
      const res = await fetch("http://localhost:3001/calls");
      if (!res.ok) throw new Error("Failed to fetch calls");
      const data = await res.json();

    const login = async () => {
        if (!address) return;
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wallet: address,
                    chain: selectedChain,
                }),
            });
            const user = await res.json();
            setCurrentUser(user);
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

      setCalls(mappedCalls);
    } catch (error) {
      console.error("Failed to fetch calls:", error);
    }
  };

  const login = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address }),
      });
      const user = await res.json();
      setCurrentUser(user);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

    useEffect(() => {
        if (isConnected && address) {
            login();
        }
    }, [isConnected, address, selectedChain]);

    const createCall = async (newCallData: Omit<Call, 'id' | 'creator' | 'status' | 'createdAt' | 'backers' | 'comments' | 'volume' | 'totalStakeYes' | 'totalStakeNo' | 'stakeToken' | 'endTs' | 'conditionJson'>) => {
        if (!currentUser) {
            alert("Please connect wallet first");
            return;
        }
        setIsLoading(true);
        try {
            const stakeAmount = parseEther(newCallData.stake.split(' ')[0]); // Assuming "100 USDC" format
            const tokenAddress = process.env.NEXT_PUBLIC_MOCK_TOKEN_ADDRESS as `0x${string}`;
            const registryAddress = process.env.NEXT_PUBLIC_CALL_REGISTRY_ADDRESS as `0x${string}`;

  useEffect(() => {
    if (isConnected && address) {
      login();
    }
  }, [isConnected, address]);

  const createCall = async (
    newCallData: Omit<
      Call,
      | "id"
      | "creator"
      | "status"
      | "createdAt"
      | "backers"
      | "comments"
      | "volume"
      | "stakeToken"
      | "totalStakeYes"
      | "totalStakeNo"
      | "endTs"
    >,
  ) => {
    if (!currentUser) {
      alert("Please connect wallet first");
      return;
    }
    setIsLoading(true);
    try {
      const stakeAmount = parseEther(newCallData.stake.split(" ")[0]); // Assuming "100 USDC" format
      const tokenAddress = process.env
        .NEXT_PUBLIC_MOCK_TOKEN_ADDRESS as `0x${string}`;
      const registryAddress = process.env
        .NEXT_PUBLIC_CALL_REGISTRY_ADDRESS as `0x${string}`;

      // 1. Upload Metadata to Mock IPFS
      const metadata = {
        title: newCallData.title,
        thesis: newCallData.thesis,
        asset: newCallData.asset,
        target: newCallData.target,
        deadline: newCallData.deadline,
      };

      const ipfsRes = await fetch("http://localhost:3001/calls/ipfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });
      const { cid } = await ipfsRes.json();
      console.log("Uploaded metadata, CID:", cid);

      // 2. Approve Token
      console.log("Approving token...");
      const approveTx = await writeContractAsync({
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: "approve",
        args: [registryAddress, stakeAmount],
      });
      console.log("Approve Tx:", approveTx);
      // Wait for approval receipt
      await publicClient?.waitForTransactionReceipt({ hash: approveTx });

      // 3. Create Call
      console.log("Creating call...");
      const deadlineTimestamp = Math.floor(
        new Date(newCallData.deadline).getTime() / 1000,
      );
      const createTx = await writeContractAsync({
        address: registryAddress,
        abi: CallRegistryABI,
        functionName: "createCall",
        args: [
          tokenAddress, // _stakeToken
          stakeAmount, // _stakeAmount
          BigInt(deadlineTimestamp), // _endTs
          tokenAddress, // _tokenAddress (Asset being predicted - using same token for now)
          stringToHex(newCallData.asset, { size: 32 }), // _pairId (Mocking with asset name)
          cid, // _ipfsCID (Mocking IPFS)
        ],
      });
      console.log("Create Call Tx:", createTx);
      await publicClient?.waitForTransactionReceipt({ hash: createTx });

      // Optimistic Update
      const newCall: Call = {
        id: "optimistic-" + Math.random().toString(36).substr(2, 9),
        title: newCallData.title,
        thesis: newCallData.thesis,
        asset: newCallData.asset,
        target: newCallData.target,
        deadline: newCallData.deadline,
        stake: newCallData.stake,
        creator: currentUser,
        status: "active",
        createdAt: new Date().toISOString(),
        backers: 1,
        comments: 0,
        volume: `$${newCallData.stake}`,
        totalStakeYes: parseFloat(newCallData.stake.split(" ")[0]) || 0,
        totalStakeNo: 0,
        stakeToken: process.env.NEXT_PUBLIC_MOCK_TOKEN_ADDRESS || "USDC",
        endTs: new Date(newCallData.deadline).toISOString(),
      };
      setCalls((prev) => [newCall, ...prev]);

      // Refresh calls from backend after some delay for indexer
      setTimeout(fetchCalls, 8000); // Increased to 8s for local anvil indexing + backend processing
    } catch (error) {
      console.error("Failed to create call:", error);
      alert("Failed to create call. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const stakeOnCall = async (
    callId: string,
    amount: number,
    type: "back" | "challenge",
  ) => {
    setIsLoading(true);
    try {
      const stakeAmount = parseEther(amount.toString());
      const tokenAddress = process.env
        .NEXT_PUBLIC_MOCK_TOKEN_ADDRESS as `0x${string}`;
      const registryAddress = process.env
        .NEXT_PUBLIC_CALL_REGISTRY_ADDRESS as `0x${string}`;

      // 1. Approve Token
      const approveTx = await writeContractAsync({
        address: tokenAddress,
        abi: ERC20ABI,
        functionName: "approve",
        args: [registryAddress, stakeAmount],
      });
      await publicClient?.waitForTransactionReceipt({ hash: approveTx });

      // 2. Stake
      const position = type === "back"; // true for YES (Back), false for NO (Challenge)
      const stakeTx = await writeContractAsync({
        address: registryAddress,
        abi: CallRegistryABI,
        functionName: "stakeOnCall",
        args: [BigInt(callId), stakeAmount, position],
      });
      await publicClient?.waitForTransactionReceipt({ hash: stakeTx });

      setCalls((prev) =>
        prev.map((call) => {
          if (call.id === callId) {
            const currentVolume =
              parseFloat(call.volume.replace(/[^0-9.-]+/g, "")) || 0;
            const newVolume = currentVolume + amount;
            return {
              ...call,
              backers: call.backers + 1,
              volume: `$${newVolume.toLocaleString()}`,
            };
          }
          return call;
        }),
      );
    } catch (error) {
      console.error("Failed to stake:", error);
      alert("Failed to stake. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlobalStateContext.Provider
      value={{
        calls,
        createCall,
        stakeOnCall,
        currentUser,
        isLoading,
        login,
        updateProfile,
        selectedChain,
        setSelectedChain,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}
