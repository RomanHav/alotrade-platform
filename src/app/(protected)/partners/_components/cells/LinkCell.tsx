'use client';
import { Input } from '@/components/ui/input';
import { ExternalLink } from 'lucide-react';

export function LinkCell({ value, editing, onChange }:{
  value?: string|null; editing: boolean; onChange?: (v:string)=>void;
}) {
  if (editing) {
    return (
      <Input placeholder="https://..." value={value ?? ''} onChange={(e)=>onChange?.(e.target.value)}
             className="h-9 w-full" inputMode="url" />
    );
  }
  const href = value || '';
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer"
         className="inline-flex max-w-full items-center justify-center truncate underline underline-offset-4" title={href}>
        {href}<ExternalLink className="ml-1 h-4 w-4 shrink-0" />
      </a>
    : <span className="text-muted-foreground">—</span>;
}
