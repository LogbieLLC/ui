/**
 * Next.js namespace for the UI framework
 * Provides access to Next.js core functions and custom helpers
 */

// Core Next.js exports - Components
export { default as Image } from "next/image";
export { default as Link } from "next/link";

// Core Next.js exports - Navigation (App Router)
export { useRouter, usePathname, useSearchParams } from "next/navigation";

// Core Next.js exports - Server Actions & Utilities
export { redirect, notFound, permanentRedirect } from "next/navigation";
export { revalidatePath, revalidateTag } from "next/cache";
export { cookies, headers } from "next/headers";

// Core Next.js exports - Metadata
export type { Metadata, Viewport } from "next";
import type { Metadata } from "next";

// Core Next.js exports - API Route Types
export type { NextRequest, NextResponse } from "next/server";

/**
 * Helper: Create metadata object for pages
 */
export function createMetadata(metadata: {
  title?: string;
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    images?: string[];
  };
  twitter?: {
    card?: "summary" | "summary_large_image";
    title?: string;
    description?: string;
    images?: string[];
  };
}): Metadata {
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: metadata.openGraph,
    twitter: metadata.twitter,
  };
}

/**
 * Helper: Create API response with JSON
 */
export function jsonResponse<T>(data: T, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Helper: Create API error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  details?: unknown
): Response {
  const responseBody: { error: string; details?: unknown } = { error: message };
  if (details !== undefined) {
    responseBody.details = details;
  }
  return new Response(
    JSON.stringify(responseBody),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

/**
 * Helper: Create success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): Response {
  return new Response(
    JSON.stringify({
      success: true,
      ...(message && { message }),
      data,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

/**
 * Helper: Get search param as string
 */
export function getSearchParam(
  searchParams: URLSearchParams | { [key: string]: string | string[] | undefined },
  key: string
): string | null {
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get(key);
  }
  const value = searchParams[key];
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && value.length > 0) {
    return value[0];
  }
  return null;
}

/**
 * Helper: Get search param as number
 */
export function getSearchParamAsNumber(
  searchParams: URLSearchParams | { [key: string]: string | string[] | undefined },
  key: string
): number | null {
  const value = getSearchParam(searchParams, key);
  if (value === null) {
    return null;
  }
  const num = Number(value);
  return isNaN(num) ? null : num;
}

/**
 * Helper: Get search param as boolean
 */
export function getSearchParamAsBoolean(
  searchParams: URLSearchParams | { [key: string]: string | string[] | undefined },
  key: string
): boolean | null {
  const value = getSearchParam(searchParams, key);
  if (value === null) {
    return null;
  }
  return value === "true" || value === "1";
}

/**
 * Helper: Check if running in server component
 */
export function isServerComponent(): boolean {
  return typeof window === "undefined";
}

/**
 * Helper: Check if running in client component
 */
export function isClientComponent(): boolean {
  return typeof window !== "undefined";
}
