export type Partner = {
  id: string;
  name: string;
  link?: string | null;
  image?: string | null;
};

export type EditOptions = {
  editingId?: string | null;
  drafts: Record<string, Partial<Partner>>;
  onDraftChange: (id: string, key: keyof Partner, value: string) => void;
  onStartEdit: (p: Partner) => void;
  onCancelEdit: (id: string) => void;
  onSaveEdit: (id: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
};
