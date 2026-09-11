import { createHash, createHmac, randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { ConfigurationError, environment } from "@/lib/config";
import { safeEqual } from "@/lib/security";

const CART_COOKIE = "uc_cart";
const CART_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function requireCookieSecret(): string {
  if (!environment.cartCookieSecret) throw new ConfigurationError("Falta CART_COOKIE_SECRET.");
  return environment.cartCookieSecret;
}

function sign(token: string): string {
  return createHmac("sha256", requireCookieSecret()).update(token).digest("base64url");
}

function parseSignedCookie(value: string | undefined): string | null {
  if (!value) return null;
  const separator = value.lastIndexOf(".");
  if (separator < 1) return null;
  const token = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  return safeEqual(sign(token), signature) ? token : null;
}

function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashCartToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function getCartToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return parseSignedCookie(cookieStore.get(CART_COOKIE)?.value);
}

export async function getOrCreateCartToken(): Promise<string> {
  const existing = await getCartToken();
  if (existing) return existing;

  const token = newToken();
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, `${token}.${sign(token)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_MAX_AGE_SECONDS,
  });
  return token;
}

export async function rotateCartToken(): Promise<string> {
  const token = newToken();
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, `${token}.${sign(token)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_MAX_AGE_SECONDS,
  });
  return token;
}

export function cartExpiry(): Date {
  return new Date(Date.now() + CART_MAX_AGE_SECONDS * 1000);
}
