'use client';

import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
    WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';
import {
    Address,
    Avatar,
    Name,
    Identity,
    EthBalance,
} from '@coinbase/onchainkit/identity';


export function Navbar() {
    return (
        <div className="flex justify-between items-center py-4 px-6 bg-white shadow-sm mb-8">
            <div className="text-xl font-bold text-indigo-600">Back It (Onchain)</div>
            <div className="flex items-center gap-4">
                <Wallet>
                    <ConnectWallet>
                        <Avatar className="h-6 w-6" />
                        <Name />
                    </ConnectWallet>
                    <WalletDropdown>
                        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                            <Avatar />
                            <Name />
                            <Address />
                            <EthBalance />
                        </Identity>
                        <WalletDropdownLink
                            icon="link"
                            href="https://wallet.coinbase.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Wallet Settings
                        </WalletDropdownLink>
                        <WalletDropdownDisconnect />
                    </WalletDropdown>
                </Wallet>
            </div>
        </div>
    );
}
