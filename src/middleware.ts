import { NextResponse } from 'next/server';

// Middleware responsibilities:
// 1. Locale detection (next-intl) — to be configured when i18n is implemented
// 2. Auth check is NOT done here — it's handled client-side by AuthGuard component
//
// See: docs/webapp-cliente.md §6 — "No hace auth check — eso es responsabilidad del AuthGuard client-side"

export function middleware() {
  return NextResponse.next();
}
