export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { handlers } from "@/auth";
export const { GET, POST } = handlers;
