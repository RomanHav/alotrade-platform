"use client";

type Range = "day" | "week" | "month";

export default function ProductPerUserCard({ range }: { range: Range }) {
    const value = range === "day" ? 0.7 : range === "week" ? 3 : 5; // пример

    return (
        <div className="flex items-center justify-center h-40 md:h-44">
            <div className="text-center">
                <div className="text-sm text-neutral-500 mb-1">Середнє за період</div>
                <div className="text-5xl font-semibold tracking-tight">{value}</div>
            </div>
        </div>
    );
}
