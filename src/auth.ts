import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "database" },
    pages: { signIn: "/login" },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(raw) {
                const parsed = credentialsSchema.safeParse(raw)
                if (!parsed.success) return null
                const { email, password } = parsed.data

                const user = await prisma.user.findUnique({ where: { email } })
                if (!user || !user.passwordHash) return null

                const valid = await bcrypt.compare(password, user.passwordHash)
                if (!valid) return null

                return {
                    id: user.id,
                    email: user.email ?? undefined,
                    name: user.name ?? undefined,
                    role: user.role,
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, user }) {
            if (session.user) {
                ;(session.user).id = user.id
                ;(session.user).role = user.role
            }
            return session
        },
    },
})
