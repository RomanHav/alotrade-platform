'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Copy, CopyCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';
import { useAddUserModal } from './UsersTable/context';

type RoleClient = 'manager' | 'admin';
type RoleServer = 'MANAGER' | 'ADMIN';

function generatePassword(len = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+=';
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try { return JSON.stringify(err); } catch { return 'Сталася помилка'; }
}

const uaToClientRole = (ua: string): RoleClient => (ua === 'Адмін' ? 'admin' : 'manager');
const clientToServerRole = (c: RoleClient): RoleServer => (c === 'admin' ? 'ADMIN' : 'MANAGER');

export default function AddUserForm() {
  const { close, selectedUser } = useAddUserModal();
  const isEdit = !!selectedUser;


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleClient>('manager');
  const [password, setPassword] = useState(generatePassword());
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.username ?? '');
      setEmail(selectedUser.email ?? '');
      setRole(uaToClientRole(selectedUser.role));
      setPassword(generatePassword());
    } else {
      setName('');
      setEmail('');
      setRole('manager');
      setPassword(generatePassword());
    }
  }, [selectedUser]);

  const title = isEdit ? 'Змінити пароль' : 'Додати користувача';
  const submitLabel = isEdit ? 'Оновити пароль' : 'Додати';

  async function copyPassword() {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isEdit && selectedUser) {
     
        const res = await fetch(`/api/users/${selectedUser.id}/password`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Не вдалося оновити пароль');

       
        close();
        return;
      }

     
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: clientToServerRole(role),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Не вдалося створити користувача');

      await mutate('/api/users');
      close();
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed left-1/2 top-1/2 z-50 flex h-screen w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="flex w-full max-w-lg flex-col justify-center gap-6 border shadow-sm border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-6">
        <h2 className="text-2xl">{title}</h2>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Ім&apos;я користувача</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ім'я користувача"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isEdit} 
            />
          </div>

         
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Електронна пошта</Label>
            <Input
              id="email"
              type="email"
              placeholder="Електронна пошта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isEdit}
            />
          </div>

         
          <div className="flex flex-col gap-2">
            <Label htmlFor="role">Роль</Label>
            <Select
              value={role}
              onValueChange={(v: RoleClient) => setRole(v)}
              disabled={isEdit}   
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Оберіть роль" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="admin">Адміністратор</SelectItem>
                <SelectItem value="manager">Менеджер</SelectItem>
              </SelectContent>
            </Select>
          </div>

         
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-32"
                required
              />

              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-10 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>

              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Скопіювати пароль"
                onClick={copyPassword}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {copied ? <CopyCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={loading} className='cursor-pointer'>
              {loading ? (isEdit ? 'Оновлення…' : 'Додавання…') : submitLabel}
            </Button>
            <Button type="button" onClick={close} variant="destructive" className='cursor-pointer'>
              Відмінити
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
