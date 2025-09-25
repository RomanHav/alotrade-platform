"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Smartphone, Monitor } from "lucide-react";
import { useMemo } from "react";

type Range = "day" | "week" | "month";

export default function TrafficSourceCard({ range }: { range: Range }) {
    const data = useMemo(() => {
        if (range === "week") return [{ name: "Смартфон", value: 68 }, { name: "ПК", value: 32 }];
        if (range === "month") return [{ name: "Смартфон", value: 62 }, { name: "ПК", value: 38 }];
        return [{ name: "Смартфон", value: 72 }, { name: "ПК", value: 28 }];
    }, [range]);

    const COLORS = ["#7C6FF9", "#4DD5FF"];

    return (
        <div className="flex gap-4 items-center">
            <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie dataKey="value" data={data} innerRadius={48} outerRadius={72} strokeWidth={0}>
                            {data.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            cursor={false}
                            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ background: COLORS[0] }} />
                    <Smartphone className="h-4 w-4 text-neutral-500" />
                    <span className="text-neutral-600">Смартфон</span>
                    <span className="ml-2 font-medium">{data[0].value}%</span>
                </li>
                <li className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ background: COLORS[1] }} />
                    <Monitor className="h-4 w-4 text-neutral-500" />
                    <span className="text-neutral-600">ПК</span>
                    <span className="ml-2 font-medium">{data[1].value}%</span>
                </li>
            </ul>
        </div>
    );
}
