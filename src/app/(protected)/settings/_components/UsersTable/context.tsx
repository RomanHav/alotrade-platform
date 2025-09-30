'use client';

import * as React from 'react';

export type SelectedUser = {
  id: string;
  username: string;
  email: string;
  role: string;
  image: string;
};

type AddUserModalCtx = {
  add: boolean;
  open: () => void;  
  openWith: (u: SelectedUser) => void; 
  close: () => void;
  selectedUser: SelectedUser | null;
};

const Ctx = React.createContext<AddUserModalCtx | undefined>(undefined);

export function AddUserModalProvider({ children }: { children: React.ReactNode }) {
  const [add, setAdd] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<SelectedUser | null>(null);

  React.useEffect(() => {
    document.body.style.overflow = add ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [add]);

  const open = React.useCallback(() => {
    setSelectedUser(null);
    setAdd(true);
  }, []);

  const openWith = React.useCallback((u: SelectedUser) => {
    setSelectedUser(u);
    setAdd(true);
  }, []);

  const close = React.useCallback(() => setAdd(false), []);

  const value = React.useMemo(
    () => ({ add, open, openWith, close, selectedUser }),
    [add, open, openWith, close, selectedUser]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAddUserModal() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('useAddUserModal must be used within AddUserModalProvider');
  return ctx;
}
