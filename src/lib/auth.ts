import type { AstroCookies } from 'astro';

const AUTH_URL = import.meta.env.PRESTASHOP_AUTH_URL?.replace(/\/$/, '');
const DAY = 60 * 60 * 24;

/** Static login: quando true ogni visitatore e autenticato come demo. */

const STATIC_LOGIN = true;
const STATIC_USER: AuthUser = {
	id: 'static-1',
	firstName: 'Demo',
	lastName: 'Customer',
	name: 'Demo Customer',
	email: 'demo@atelier.example',
};

export interface AuthUser {
	id: string | number;
	firstName?: string;
	lastName?: string;
	name?: string;
	email: string;
}

interface AuthCtx {
	cookies: AstroCookies;
	url: URL;
	redirect: (path: string, status?: 301 | 302 | 303 | 307 | 308) => Response;
}

interface Session {
	user: AuthUser;
	token: string;
}

const DEMO_PASSWORD = 'demo1234';
const demoUser = (email: string): AuthUser => ({
	id: 'demo-1',
	firstName: 'Demo',
	lastName: 'Customer',
	name: 'Demo Customer',
	email,
});

function setSession(ctx: AuthCtx, session: Session, remember: boolean) {
	const maxAge = remember ? DAY * 30 : DAY;
	const secure = ctx.url.protocol === 'https:';
	const base = { sameSite: 'lax' as const, secure, path: '/', maxAge };

	ctx.cookies.set('auth_token', session.token, { ...base, httpOnly: true });
	ctx.cookies.set('auth_user', JSON.stringify(session.user), { ...base, httpOnly: false });
	ctx.cookies.set('is_authenticated', 'true', { ...base, httpOnly: false });
}

async function callAuth(path: string, body: unknown): Promise<Session | null> {
	if (!AUTH_URL) return null;
	const res = await fetch(`${AUTH_URL}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify(body),
	});
	if (!res.ok) throw new Error(`auth ${path} failed: ${res.status}`);
	const data = (await res.json()) as { user?: AuthUser; token?: string };
	return data.user && data.token ? { user: data.user, token: data.token } : null;
}

export async function login(
	ctx: AuthCtx,
	email: string,
	password: string,
	remember = false,
): Promise<{ ok: boolean; error?: string }> {
	try {
		let session = await callAuth('/login', { email, password });
		if (!session) {
			if (password !== DEMO_PASSWORD) return { ok: false, error: 'invalid_credentials' };
			session = { user: demoUser(email), token: 'demo-token' };
		}
		setSession(ctx, session, remember);
		return { ok: true };
	} catch (e) {
		return { ok: false, error: e instanceof Error ? e.message : 'login_failed' };
	}
}

export async function register(
	ctx: AuthCtx,
	payload: { firstName: string; lastName: string; email: string; password: string },
): Promise<{ ok: boolean; error?: string }> {
	try {
		let session = await callAuth('/register', payload);
		if (!session) {
			session = {
				user: {
					id: 'demo-1',
					firstName: payload.firstName,
					lastName: payload.lastName,
					name: `${payload.firstName} ${payload.lastName}`.trim(),
					email: payload.email,
				},
				token: 'demo-token',
			};
		}
		setSession(ctx, session, false);
		return { ok: true };
	} catch (e) {
		return { ok: false, error: e instanceof Error ? e.message : 'register_failed' };
	}
}

export function logout(ctx: AuthCtx): void {
	ctx.cookies.delete('auth_token', { path: '/' });
	ctx.cookies.delete('auth_user', { path: '/' });
	ctx.cookies.delete('is_authenticated', { path: '/' });
}

export function isAuthenticated(ctx: { cookies: AstroCookies }): boolean {
	if (STATIC_LOGIN) return true;
	return Boolean(
		ctx.cookies.get('is_authenticated')?.value && ctx.cookies.get('auth_token')?.value,
	);
}

export function getCurrentUser(ctx: { cookies: AstroCookies }): AuthUser | null {
	const raw = ctx.cookies.get('auth_user')?.value;
	if (raw) {
		try {
			return JSON.parse(raw) as AuthUser;
		} catch {}
	}
	return STATIC_LOGIN ? STATIC_USER : null;
}

export function requireAuth(ctx: AuthCtx): Response | null {
	if (isAuthenticated(ctx)) return null;
	const back = encodeURIComponent(ctx.url.pathname + ctx.url.search);
	return ctx.redirect(`/login?redirect=${back}`);
}

export function requireGuest(ctx: AuthCtx): Response | null {
	return isAuthenticated(ctx) ? ctx.redirect('/account') : null;
}
