// src/app/(auth)/sign-in/SignInForm.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SignInForm({
                                       action,
                                       callbackUrl = "/dashboard",
                                   }: {
    action: (formData: FormData) => Promise<void> // server action из страницы
    callbackUrl?: string
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    return (
        <div className="w-full flex flex-col items-center gap-5">
            <h1 className="text-4xl font-normal">Особистий кабінет</h1>
            <Card className="w-xs p-6">
                <CardContent>
                    <form
                        action={async (fd) => {
                            setError(null)
                            setLoading(true)
                            try {
                                await action(fd)  // тут произойдёт редирект на сервере
                            } catch {
                                setError("Помилка входу")
                                setLoading(false)
                            }
                        }}
                        className="grid gap-6"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="Електронна пошта" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Пароль</Label>
                            <Input id="password" name="password" type="password" placeholder="Пароль" required />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <Checkbox id="remember" className="mt-2" />
                        <input type="hidden" name="callbackUrl" value={callbackUrl} />
                        <Button type="submit" disabled={loading}>{loading ? "Входим..." : "Войти"}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
