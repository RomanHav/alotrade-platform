"use client"

import { useState, FormEvent } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react" // ✅ клиентский хелпер

export default function SignInPage() {
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
            const res = await signIn("credentials", {
                email,
                password,
                callbackUrl,
                redirect: false, // управляем редиректом сами
            })

            if (res?.ok && res.url) {
                router.push(res.url) // обычно это callbackUrl
            } else {
                setError("Неверный email или пароль")
            }
        } catch {
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
