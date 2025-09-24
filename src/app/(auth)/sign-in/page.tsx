"use client"

import { useState, FormEvent } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const sp = useSearchParams()
    const callbackUrl = sp.get("callbackUrl") ?? "/dashboard"

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            // вызываем API next-auth
            const res = await fetch("/api/auth/callback/credentials", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    csrf: "",
                    email,
                    password,
                    callbackUrl,
                    json: "true",
                }),
            })
            const data = await res.json()
            if (data?.url) router.push(data.url)
            else setError("Неверный email или пароль")
        } catch (err) {
            setError("Ошибка входа")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-dvh flex items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Вход в CMS</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Пароль</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <Button type="submit" disabled={loading}>{loading ? "Входим..." : "Войти"}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
