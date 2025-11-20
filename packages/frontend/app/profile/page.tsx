"use client";

import { AppLayout } from "@/components/AppLayout";
import { User, MapPin, Calendar, Link as LinkIcon, Settings, TrendingUp, Clock, ShieldCheck, MessageSquare } from 'lucide-react';
import { useState } from "react";
import Link from "next/link";
import { useGlobalState } from "@/components/GlobalState";

export default function ProfilePage() {
    const { currentUser, calls } = useGlobalState();
    const [activeTab, setActiveTab] = useState<'created' | 'staked'>('created');

    const myCalls = calls.filter(call => call.creator.handle === currentUser.handle);

    const RightSidebar = (
        <div className="space-y-6">
            <div className="bg-secondary/20 rounded-xl p-6 border border-border">
                <h3 className="font-bold text-lg mb-2">Reputation Score</h3>
                <div className="text-3xl font-bold text-primary mb-1">92%</div>
                <p className="text-sm text-muted-foreground">
                    Top 5% of predictors. Keep making accurate calls to increase your score.
                </p>
            </div>
        </div>
    );

    return (
        <AppLayout rightSidebar={RightSidebar}>
            <div>
                {/* Cover Image */}
                <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20" />

                <div className="px-4 pb-4">
                    {/* Profile Header */}
                    <div className="relative -mt-12 mb-4 flex justify-between items-end">
                        <div className="h-24 w-24 rounded-full bg-background p-1">
                            <div className={`h-full w-full rounded-full ${currentUser.avatar} flex items-center justify-center border border-border`}>
                                <User className="h-10 w-10 text-white" />
                            </div>
                        </div>
                        <button className="px-4 py-2 rounded-full border border-border hover:bg-secondary transition-colors font-medium text-sm flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Edit Profile
                        </button>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">{currentUser.name}</h1>
                        <p className="text-muted-foreground">{currentUser.handle}</p>

                        <p className="mt-3 text-sm leading-relaxed">
                            Building the future of prediction markets. Onchain or nothing.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Base Sepolia
                            </div>
                            <div className="flex items-center gap-1">
                                <LinkIcon className="h-3 w-3" />
                                <a href="#" className="hover:text-primary hover:underline">backit.xyz</a>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Joined Nov 2025
                            </div>
                        </div>

                        <div className="flex gap-4 mt-4 text-sm">
                            <div className="flex gap-1">
                                <span className="font-bold">245</span>
                                <span className="text-muted-foreground">Following</span>
                            </div>
                            <div className="flex gap-1">
                                <span className="font-bold">1.2k</span>
                                <span className="text-muted-foreground">Followers</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border mb-4">
                        <button
                            onClick={() => setActiveTab('created')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'created'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Created Calls
                        </button>
                        <button
                            onClick={() => setActiveTab('staked')}
                            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'staked'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Staked Calls
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        {activeTab === 'created' ? (
                            myCalls.length > 0 ? (
                                myCalls.map((call) => (
                                    <Link href={`/calls/${call.id}`} key={call.id} className="block group">
                                        <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-8 w-8 rounded-full ${call.creator.avatar} flex items-center justify-center font-bold text-white text-xs`}>
                                                        {call.creator.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm group-hover:text-primary transition-colors">{call.creator.name}</div>
                                                        <div className="text-xs text-muted-foreground">{call.createdAt}</div>
                                                    </div>
                                                </div>
                                                <div className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">
                                                    {call.status === 'active' ? 'Active' : call.status}
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-bold mb-2 leading-snug">{call.title}</h3>

                                            <div className="flex flex-wrap gap-3 mb-4">
                                                <Badge icon={<TrendingUp className="h-3 w-3" />} label={`${call.asset} ➜ ${call.target}`} />
                                                <Badge icon={<Clock className="h-3 w-3" />} label={call.deadline} />
                                                <Badge icon={<ShieldCheck className="h-3 w-3" />} label={`Stake: ${call.stake}`} />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-10 text-muted-foreground">
                                    <p>No calls created yet.</p>
                                    <Link href="/create" className="text-primary hover:underline mt-2 inline-block">
                                        Create your first prediction
                                    </Link>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>No stakes yet.</p>
                                <Link href="/feed" className="text-primary hover:underline mt-2 inline-block">
                                    Explore markets
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function Badge({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/50 text-xs font-medium text-muted-foreground border border-border">
            {icon}
            {label}
        </div>
    );
}
