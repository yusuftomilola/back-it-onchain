"use client";

import Link from "next/link";
import { AppLayout } from "@/components/AppLayout";
import { TrendingUp, Clock, ShieldCheck, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useGlobalState } from "@/components/GlobalState";

export default function FeedPage() {
    const { calls } = useGlobalState();

    const RightSidebar = (
        <div className="space-y-6">
            <div className="bg-secondary/20 rounded-xl p-6 border border-border">
                <h3 className="font-bold text-lg mb-2">Trending Markets</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-sm">ETH &gt; $4k</p>
                            <p className="text-xs text-muted-foreground">Vol: $1.2M</p>
                        </div>
                        <div className="text-green-500 font-bold text-sm">+12%</div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-sm">Base TVL &gt; Arb</p>
                            <p className="text-xs text-muted-foreground">Vol: $850k</p>
                        </div>
                        <div className="text-green-500 font-bold text-sm">+5%</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout rightSidebar={RightSidebar}>
            <div className="p-4">
                {/* Tabs */}
                <div className="flex gap-6 mb-6 border-b border-border px-2">
                    <button className="pb-3 border-b-2 border-primary font-bold text-primary">For You</button>
                    <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors">Following</button>
                    <button className="pb-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors">New</button>
                </div>

                {/* Feed */}
                <div className="space-y-4">
                    {calls.map((call) => (
                        <Link href={`/calls/${call.id}`} key={call.id} className="block group">
                            <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full ${call.creator.avatar} flex items-center justify-center font-bold text-white text-xs`}>
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
                                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                    {call.thesis}
                                </p>

                                <div className="flex flex-wrap gap-3 mb-4">
                                    <Badge icon={<TrendingUp className="h-3 w-3" />} label={`${call.asset} ➜ ${call.target}`} />
                                    <Badge icon={<Clock className="h-3 w-3" />} label={call.deadline} />
                                    <Badge icon={<ShieldCheck className="h-3 w-3" />} label={`Stake: ${call.stake}`} />
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <div className="flex gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-foreground">{call.backers}</span> Backers
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold text-foreground">{call.volume}</span> Vol
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                                        <MessageSquare className="h-3 w-3" />
                                        {call.comments} Comments
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
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
