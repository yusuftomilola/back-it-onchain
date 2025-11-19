'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Call {
    id: string;
    tokenAddress: string;
    stakeAmount: string;
    targetPrice: string;
    endTs: string;
    creatorWallet: string;
    status: string;
}

export default function CallDetail() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    const [call, setCall] = useState<Call | null>(null);

    useEffect(() => {
        const fetchCall = async () => {
            await new Promise(resolve => setTimeout(resolve, 100));
            setCall({
                id: id as string,
                tokenAddress: '0x420...69',
                stakeAmount: '100',
                targetPrice: '2000',
                endTs: new Date(Date.now() + 86400000).toISOString(),
                creatorWallet: '0x123...abc',
                status: 'OPEN',
            });
        };
        if (id) {
            fetchCall();
        }
    }, [id]);

    if (!id) return <div>Invalid Call ID</div>;
    if (!call) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6">Call #{call.id}</h1>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <p className="text-sm text-gray-500">Token</p>
                        <p className="text-lg font-mono">{call.tokenAddress}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Target Price</p>
                        <p className="text-lg font-bold">${call.targetPrice}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Stake</p>
                        <p className="text-lg">{call.stakeAmount} USDC</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Ends</p>
                        <p className="text-lg">{new Date(call.endTs).toLocaleString()}</p>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">Actions</h2>
                    <div className="flex space-x-4">
                        <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                            Co-Back (Agree)
                        </button>
                        <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
                            Counter-Back (Disagree)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
