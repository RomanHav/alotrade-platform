"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

type Range = "day" | "week" | "month";

export default function LanguageShareCard({ range }: { range: Range }) {
    const data = useMemo(() => {
        if (range === "day") {
            return [
                { name: "00", ua: 62, en: 38 },
                { name: "04", ua: 58, en: 42 },
                { name: "08", ua: 60, en: 40 },
                { name: "12", ua: 64, en: 36 },
                { name: "16", ua: 63, en: 37 },
                { name: "20", ua: 61, en: 39 },
                { name: "24", ua: 62, en: 38 },
            ];
        }
        if (range === "week") {
            return [
                { name: "Пн", ua: 61, en: 39 },
                { name: "Вт", ua: 63, en: 37 },
                { name: "Ср", ua: 62, en: 38 },
                { name: "Чт", ua: 64, en: 36 },
                { name: "Пт", ua: 65, en: 35 },
                { name: "Сб", ua: 60, en: 40 },
                { name: "Нд", ua: 59, en: 41 },
            ];
        }
        return [
            { name: "1", ua: 60, en: 40 },
            { name: "5", ua: 58, en: 42 },
            { name: "10", ua: 61, en: 39 },
            { name: "15", ua: 63, en: 37 },
            { name: "20", ua: 62, en: 38 },
            { name: "25", ua: 64, en: 36 },
            { name: "30", ua: 63, en: 37 },
        ];
    }, [range]);

    return (
        <div className="h-40 md:h-44">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                        <linearGradient id="ua" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7C6FF9" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#7C6FF9" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="en" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4DD5FF" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#4DD5FF" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                    <Tooltip
                        cursor={{ stroke: "#e5e7eb" }}
                        contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb" }}
                    />
                    <Area type="monotone" dataKey="ua" stroke="#7C6FF9" fill="url(#ua)" name="Українська" />
                    <Area type="monotone" dataKey="en" stroke="#4DD5FF" fill="url(#en)" name="Англійська" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
