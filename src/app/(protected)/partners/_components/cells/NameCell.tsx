'use client';
import { Input } from '@/components/ui/input';

export function NameCell({ value, editing, onChange }:{
  value: string; editing: boolean; onChange?: (v:string)=>void;
}) {
  return editing
    ? <Input value={value} onChange={(e)=>onChange?.(e.target.value)} className="h-9 w-full" />
    : <div className="truncate">{value}</div>;
}
