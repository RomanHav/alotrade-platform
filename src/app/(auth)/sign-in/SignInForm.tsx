"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

const LS_KEY = "cms_signin_pref"

export default function SignInForm({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY)
            if (raw) {
                const saved = JSON.parse(raw) as { email?: string; remember?: boolean }
                if (saved.remember && saved.email) {
                    setEmail(saved.email)
                    setRemember(true)
                }
            }
        } catch {}
    }, [])

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (remember) {
                localStorage.setItem(LS_KEY, JSON.stringify({ email, remember: true }))
            } else {
                localStorage.removeItem(LS_KEY)
            }
        } catch {}

        const res = await signIn("credentials", {
            email,
            password,
            callbackUrl,
            redirect: false,
        })

        setLoading(false)
        if (res?.ok && res.url) router.push(res.url)
        else setError("Невірна пошта або пароль")
    }

    return (
        <div className="w-full flex flex-col items-center gap-5">
            <h1 className="text-4xl font-normal">Особистий кабінет</h1>
            <Card className="w-xs p-6">
                <form onSubmit={onSubmit} className="grid gap-6">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Електронна пошта</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Електронна пошта"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="remember"
                            checked={remember}
                            onCheckedChange={(v) => setRemember(Boolean(v))}
                        />
                        <Label htmlFor="remember">Запам&apos;ятати мене</Label>
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? "Вхід..." : "Увійти"}
                    </Button>

                    <button type="button" onClick={() => alert("Зверніться до адміністратора для зміни паролю.")} className="underline flex justify-start">
                        Забули пароль?
                    </button>
                </form>
            </Card>
        </div>
    )
}
