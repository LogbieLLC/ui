# UI Framework Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Namespace Documentation](#namespace-documentation)
   - [Database Namespace (`ui.db`)](#database-namespace-uidb)
   - [Authentication Namespace (`ui.auth`)](#authentication-namespace-uiauth)
   - [Testing Namespace (`ui.test`)](#testing-namespace-uitest)
   - [Next.js Namespace (`ui.next`)](#nextjs-namespace-uinext)
   - [Bun Runtime Namespace (`ui.bun`)](#bun-runtime-namespace-uibun)
   - [Commands Namespace (`ui.commands`)](#commands-namespace-uicommands)
4. [Advanced Usage](#advanced-usage)
5. [Examples](#examples)
6. [API Reference](#api-reference)

---

## Introduction

### What is the UI Framework?

The UI Framework is a unified interface that provides organized access to framework actions through namespaces. It serves as a single entry point for common operations across your Next.js application, including database operations, authentication, testing, Next.js utilities, runtime detection, and custom commands.

### Architecture Overview

The framework is organized into six main namespaces:

- **`ui.db`** - Database operations and schemas (Drizzle ORM)
- **`ui.auth`** - Authentication (client and server) (better-auth)
- **`ui.test`** - Testing utilities and helpers (Mocha)
- **`ui.next`** - Next.js framework integration
- **`ui.bun`** - Bun runtime detection and utilities
- **`ui.commands`** - Custom command system (plugin & registry)

### Key Benefits

- **Unified API**: Single import point for all framework actions
- **Type Safety**: Full TypeScript support with proper types
- **Organized Structure**: Logical namespace organization
- **Framework Integration**: Seamless integration with Next.js, Drizzle, and better-auth
- **Extensible**: Plugin system for custom commands
- **Developer Experience**: Consistent patterns across the codebase

### Installation

The UI framework is already part of this project. Simply import it where needed:

```typescript
import { ui } from "@/ui";
```

---

## Quick Start

### Basic Import Pattern

```typescript
// Import the unified ui object
import { ui } from "@/ui";

// Or import individual namespaces
import { db, auth, test, next, bun, commands } from "@/ui";
```

### Simple Usage Examples

```typescript
// Database operations
const users = await ui.db.db.select().from(ui.db.schema.users);

// Authentication (server-side)
const session = await ui.auth.getSession();
const user = await ui.auth.getCurrentUser();

// Next.js helpers
const metadata = ui.next.createMetadata({
  title: "My Page",
  description: "Page description"
});

// Runtime detection
if (ui.bun.isBun()) {
  console.log("Running in Bun!");
}

// Commands
ui.commands.register("greet", (name: string) => `Hello, ${name}!`);
const greeting = await ui.commands.execute("greet", "World");
```

### Common Patterns

**Server Component Pattern:**
```typescript
// app/page.tsx
import { ui } from "@/ui";

export default async function Page() {
  const user = await ui.auth.getCurrentUser();
  const runtime = ui.bun.getRuntime();
  
  return <div>Welcome, {user?.name}!</div>;
}
```

**Client Component Pattern:**
```typescript
// components/UserProfile.tsx
"use client";
import { ui } from "@/ui";

export default function UserProfile() {
  const { data: session } = ui.auth.useSession();
  
  return <div>{session?.user?.name}</div>;
}
```

**API Route Pattern:**
```typescript
// app/api/users/route.ts
import { ui } from "@/ui";

export async function GET() {
  const users = await ui.db.db.select().from(ui.db.schema.users);
  return ui.next.jsonResponse(users);
}
```

---

## Namespace Documentation

### Database Namespace (`ui.db`)

The database namespace provides access to Drizzle ORM operations and schemas.

#### Overview

- **Technology**: Drizzle ORM with PostgreSQL
- **Location**: [src/ui/db.ts](src/ui/db.ts)
- **Exports**: `db` (database instance), `schema` (database schemas)

#### Exports

```typescript
ui.db.db        // Drizzle database instance
ui.db.schema    // Database schemas
```

#### Usage Examples

**Querying Data:**
```typescript
import { ui } from "@/ui";

// Select all users
const users = await ui.db.db.select().from(ui.db.schema.users);

// Select with conditions
const user = await ui.db.db
  .select()
  .from(ui.db.schema.users)
  .where(eq(ui.db.schema.users.id, userId))
  .limit(1);

// Insert data
await ui.db.db.insert(ui.db.schema.users).values({
  name: "John Doe",
  email: "john@example.com"
});

// Update data
await ui.db.db
  .update(ui.db.schema.users)
  .set({ name: "Jane Doe" })
  .where(eq(ui.db.schema.users.id, userId));

// Delete data
await ui.db.db
  .delete(ui.db.schema.users)
  .where(eq(ui.db.schema.users.id, userId));
```

**Using Schemas:**
```typescript
import { ui } from "@/ui";
import { eq } from "drizzle-orm";

// Access schema definitions
const userSchema = ui.db.schema.users;
const postSchema = ui.db.schema.posts;

// Use in queries
const posts = await ui.db.db
  .select()
  .from(postSchema)
  .where(eq(postSchema.userId, userId));
```

**Transactions:**
```typescript
import { ui } from "@/ui";

await ui.db.db.transaction(async (tx) => {
  await tx.insert(ui.db.schema.users).values({ name: "User" });
  await tx.insert(ui.db.schema.posts).values({ title: "Post" });
});
```

---

### Authentication Namespace (`ui.auth`)

The authentication namespace provides access to better-auth functions for both server and client-side authentication.

#### Overview

- **Technology**: better-auth
- **Location**: [src/ui/auth.ts](src/ui/auth.ts)
- **Features**: Email/password authentication, session management

#### Server-Side Functions

**`getSession()`** - Get the current session on the server side

```typescript
import { ui } from "@/ui";

// In Server Components, Server Actions, or API routes
const session = await ui.auth.getSession();

if (session) {
  console.log("User is authenticated:", session.user);
} else {
  console.log("User is not authenticated");
}
```

**`getCurrentUser()`** - Get the current user (returns null if not authenticated)

```typescript
import { ui } from "@/ui";

const user = await ui.auth.getCurrentUser();

if (user) {
  console.log("Current user:", user.name, user.email);
} else {
  // User is not authenticated
  redirect("/login");
}
```

#### Client-Side Functions

**`signIn()`** - Sign in a user

```typescript
"use client";
import { ui } from "@/ui";

async function handleSignIn(email: string, password: string) {
  try {
    const result = await ui.auth.signIn.email({
      email,
      password,
    });
    
    if (result.error) {
      console.error("Sign in failed:", result.error);
    } else {
      console.log("Signed in successfully");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
```

**`signUp()`** - Sign up a new user

```typescript
"use client";
import { ui } from "@/ui";

async function handleSignUp(email: string, password: string, name: string) {
  try {
    const result = await ui.auth.signUp.email({
      email,
      password,
      name,
    });
    
    if (result.error) {
      console.error("Sign up failed:", result.error);
    } else {
      console.log("Signed up successfully");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
```

**`signOut()`** - Sign out the current user

```typescript
"use client";
import { ui } from "@/ui";

async function handleSignOut() {
  try {
    await ui.auth.signOut();
    console.log("Signed out successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}
```

**`useSession()`** - React hook for accessing session data

```typescript
"use client";
import { ui } from "@/ui";

export default function UserProfile() {
  const { data: session, isPending } = ui.auth.useSession();
  
  if (isPending) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
}
```

#### Advanced Usage

**Direct Auth Instance:**
```typescript
import { ui } from "@/ui";

// Access the main auth instance for advanced operations
const auth = ui.auth.auth;

// Use auth API directly
const session = await auth.api.getSession({ headers });
```

**Auth Client Instance:**
```typescript
"use client";
import { ui } from "@/ui";

// Access the client instance directly
const client = ui.auth.authClient;

// Use client methods
await client.signIn.email({ email, password });
```

**Session Type:**
```typescript
import { ui } from "@/ui";
import type { Session } from "@/ui";

function processSession(session: Session) {
  // Type-safe session handling
  console.log(session.user.id, session.user.email);
}
```

#### Complete Example: Protected Server Component

```typescript
// app/dashboard/page.tsx
import { ui } from "@/ui";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await ui.auth.getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}!</p>
    </div>
  );
}
```

#### Complete Example: Login Form

```typescript
// components/LoginForm.tsx
"use client";
import { ui } from "@/ui";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const result = await ui.auth.signIn.email({ email, password });
    
    if (result.error) {
      setError(result.error.message);
    } else {
      // Redirect or update UI
      window.location.href = "/dashboard";
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Sign In</button>
    </form>
  );
}
```

---

### Testing Namespace (`ui.test`)

The testing namespace provides access to Mocha testing utilities and assertion helpers.

#### Overview

- **Technology**: Mocha
- **Location**: [src/ui/test.ts](src/ui/test.ts)
- **Exports**: `describe`, `it`, `before`, `after`, `beforeEach`, `afterEach`, `assert`

#### Exports

```typescript
ui.test.describe      // Test suite definition
ui.test.it            // Test case definition
ui.test.before         // Setup before all tests
ui.test.after          // Cleanup after all tests
ui.test.beforeEach     // Setup before each test
ui.test.afterEach      // Cleanup after each test
ui.test.assert         // Assertion library
```

#### Usage Examples

**Basic Test Suite:**
```typescript
import { ui } from "@/ui";

ui.test.describe("User Service", () => {
  ui.test.it("should create a user", async () => {
    const user = await createUser({ name: "John", email: "john@example.com" });
    ui.test.assert.ok(user);
    ui.test.assert.strictEqual(user.name, "John");
  });
  
  ui.test.it("should validate email", () => {
    ui.test.assert.throws(() => {
      validateEmail("invalid-email");
    });
  });
});
```

**Test with Setup and Teardown:**
```typescript
import { ui } from "@/ui";

ui.test.describe("Database Tests", () => {
  ui.test.before(async () => {
    // Setup database connection
    await setupDatabase();
  });
  
  ui.test.after(async () => {
    // Cleanup database
    await cleanupDatabase();
  });
  
  ui.test.beforeEach(async () => {
    // Clear data before each test
    await clearTestData();
  });
  
  ui.test.it("should insert data", async () => {
    const result = await insertTestData();
    ui.test.assert.ok(result);
  });
});
```

**Assertion Examples:**
```typescript
import { ui } from "@/ui";

ui.test.describe("Assertions", () => {
  ui.test.it("should use various assertions", () => {
    // Equality
    ui.test.assert.strictEqual(1 + 1, 2);
    ui.test.assert.notStrictEqual(1, 2);
    
    // Truthiness
    ui.test.assert.ok(true);
    ui.test.assert.ok("non-empty string");
    
    // Deep equality
    ui.test.assert.deepStrictEqual(
      { a: 1, b: 2 },
      { a: 1, b: 2 }
    );
    
    // Throws
    ui.test.assert.throws(() => {
      throw new Error("Test error");
    });
    
    // Rejects
    ui.test.assert.rejects(async () => {
      throw new Error("Async error");
    });
  });
});
```

**Testing Async Functions:**
```typescript
import { ui } from "@/ui";

ui.test.describe("Async Operations", () => {
  ui.test.it("should handle async operations", async () => {
    const result = await fetchData();
    ui.test.assert.ok(result);
    ui.test.assert.strictEqual(result.status, "success");
  });
  
  ui.test.it("should handle promises", async () => {
    const promise = Promise.resolve("value");
    const value = await promise;
    ui.test.assert.strictEqual(value, "value");
  });
});
```

**Complete Test Example:**
```typescript
// test/user.test.ts
import { ui } from "@/ui";

ui.test.describe("User Model", () => {
  let testUser: User;
  
  ui.test.beforeEach(async () => {
    testUser = await createTestUser();
  });
  
  ui.test.afterEach(async () => {
    await deleteTestUser(testUser.id);
  });
  
  ui.test.it("should have required fields", () => {
    ui.test.assert.ok(testUser.id);
    ui.test.assert.ok(testUser.email);
    ui.test.assert.ok(testUser.name);
  });
  
  ui.test.it("should update user", async () => {
    const updated = await updateUser(testUser.id, { name: "New Name" });
    ui.test.assert.strictEqual(updated.name, "New Name");
  });
});
```

---

### Next.js Namespace (`ui.next`)

The Next.js namespace provides access to Next.js core functions and custom helper utilities.

#### Overview

- **Technology**: Next.js 16+ (App Router)
- **Location**: [src/ui/next.ts](src/ui/next.ts)
- **Features**: Components, navigation, server utilities, API helpers, metadata helpers

#### Core Components

**`Image`** - Optimized image component

```typescript
import { ui } from "@/ui";

export default function MyComponent() {
  return (
    <ui.next.Image
      src="/image.jpg"
      alt="Description"
      width={500}
      height={300}
    />
  );
}
```

**`Link`** - Client-side navigation

```typescript
import { ui } from "@/ui";

export default function Navigation() {
  return (
    <ui.next.Link href="/about">
      About Us
    </ui.next.Link>
  );
}
```

#### Navigation Hooks (Client Components)

**`useRouter()`** - Programmatic navigation

```typescript
"use client";
import { ui } from "@/ui";

export default function MyComponent() {
  const router = ui.next.useRouter();
  
  const handleClick = () => {
    router.push("/dashboard");
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

**`usePathname()`** - Get current pathname

```typescript
"use client";
import { ui } from "@/ui";

export default function Navigation() {
  const pathname = ui.next.usePathname();
  
  return (
    <nav>
      <ui.next.Link 
        href="/" 
        className={pathname === "/" ? "active" : ""}
      >
        Home
      </ui.next.Link>
    </nav>
  );
}
```

**`useSearchParams()`** - Get search parameters

```typescript
"use client";
import { ui } from "@/ui";

export default function SearchPage() {
  const searchParams = ui.next.useSearchParams();
  const query = searchParams.get("q");
  
  return <div>Searching for: {query}</div>;
}
```

#### Server Utilities

**`redirect()`** - Redirect to a different route

```typescript
import { ui } from "@/ui";

export default async function Page() {
  const user = await getCurrentUser();
  
  if (!user) {
    ui.next.redirect("/login");
  }
  
  return <div>Welcome!</div>;
}
```

**`notFound()`** - Trigger 404 page

```typescript
import { ui } from "@/ui";

export default async function Page({ params }: { params: { id: string } }) {
  const item = await getItem(params.id);
  
  if (!item) {
    ui.next.notFound();
  }
  
  return <div>{item.name}</div>;
}
```

**`permanentRedirect()`** - Permanent redirect (308)

```typescript
import { ui } from "@/ui";

export default async function Page() {
  ui.next.permanentRedirect("/new-url");
}
```

**`revalidatePath()`** - Revalidate a path

```typescript
import { ui } from "@/ui";

export async function POST() {
  await updateData();
  ui.next.revalidatePath("/dashboard");
  return ui.next.jsonResponse({ success: true });
}
```

**`revalidateTag()`** - Revalidate by tag

```typescript
import { ui } from "@/ui";

export async function POST() {
  await updateData();
  ui.next.revalidateTag("users");
  return ui.next.jsonResponse({ success: true });
}
```

**`cookies()`** - Access cookies

```typescript
import { ui } from "@/ui";

export default async function Page() {
  const cookieStore = await ui.next.cookies();
  const theme = cookieStore.get("theme");
  
  return <div>Theme: {theme?.value}</div>;
}
```

**`headers()`** - Access request headers

```typescript
import { ui } from "@/ui";

export default async function Page() {
  const headersList = await ui.next.headers();
  const userAgent = headersList.get("user-agent");
  
  return <div>User Agent: {userAgent}</div>;
}
```

#### Helper Functions

**`createMetadata()`** - Create page metadata object

```typescript
import { ui } from "@/ui";

export const metadata = ui.next.createMetadata({
  title: "My Page",
  description: "Page description",
  keywords: ["nextjs", "react", "typescript"],
  openGraph: {
    title: "My Page",
    description: "Page description",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Page",
    description: "Page description",
    images: ["/twitter-image.jpg"],
  },
});
```

**`jsonResponse()`** - Create JSON API response

```typescript
// app/api/users/route.ts
import { ui } from "@/ui";

export async function GET() {
  const users = await getUsers();
  return ui.next.jsonResponse(users, 200);
}
```

**`errorResponse()`** - Create error API response

```typescript
// app/api/users/[id]/route.ts
import { ui } from "@/ui";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser(params.id);
    if (!user) {
      return ui.next.errorResponse("User not found", 404);
    }
    return ui.next.jsonResponse(user);
  } catch (error) {
    return ui.next.errorResponse(
      "Internal server error",
      500,
      { details: error }
    );
  }
}
```

**`successResponse()`** - Create success API response

```typescript
// app/api/users/route.ts
import { ui } from "@/ui";

export async function POST(request: Request) {
  const data = await request.json();
  const user = await createUser(data);
  
  return ui.next.successResponse(
    user,
    "User created successfully",
    201
  );
}
```

**`getSearchParam()`** - Get search param as string

```typescript
// app/search/page.tsx
import { ui } from "@/ui";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = ui.next.getSearchParam(searchParams, "q");
  
  if (!query) {
    return <div>No search query provided</div>;
  }
  
  const results = await search(query);
  return <div>Results for: {query}</div>;
}
```

**`getSearchParamAsNumber()`** - Get search param as number

```typescript
// app/products/page.tsx
import { ui } from "@/ui";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = ui.next.getSearchParamAsNumber(searchParams, "page") ?? 1;
  const products = await getProducts(page);
  
  return <div>Page {page}</div>;
}
```

**`getSearchParamAsBoolean()`** - Get search param as boolean

```typescript
// app/settings/page.tsx
import { ui } from "@/ui";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: { debug?: string };
}) {
  const debug = ui.next.getSearchParamAsBoolean(searchParams, "debug") ?? false;
  
  return <div>Debug mode: {debug ? "on" : "off"}</div>;
}
```

**`isServerComponent()`** - Check if running in server component

```typescript
import { ui } from "@/ui";

export default function Component() {
  if (ui.next.isServerComponent()) {
    // Server-side logic
    return <div>Server Component</div>;
  }
  
  return <div>Client Component</div>;
}
```

**`isClientComponent()`** - Check if running in client component

```typescript
"use client";
import { ui } from "@/ui";

export default function Component() {
  if (ui.next.isClientComponent()) {
    // Client-side logic
    return <div>Client Component</div>;
  }
  
  return <div>Server Component</div>;
}
```

#### Complete Example: API Route

```typescript
// app/api/posts/route.ts
import { ui } from "@/ui";

export async function GET(request: Request) {
  try {
    const posts = await ui.db.db.select().from(ui.db.schema.posts);
    return ui.next.jsonResponse(posts);
  } catch (error) {
    return ui.next.errorResponse("Failed to fetch posts", 500);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const post = await ui.db.db
      .insert(ui.db.schema.posts)
      .values(data)
      .returning();
    
    ui.next.revalidatePath("/posts");
    return ui.next.successResponse(post[0], "Post created", 201);
  } catch (error) {
    return ui.next.errorResponse("Failed to create post", 500);
  }
}
```

---

### Bun Runtime Namespace (`ui.bun`)

The Bun runtime namespace provides runtime detection and utility functions for working with different JavaScript runtimes.

#### Overview

- **Location**: [src/ui/bun.ts](src/ui/bun.ts)
- **Purpose**: Runtime detection, environment variables, conditional execution

#### Runtime Detection

**`isBun()`** - Check if running in Bun runtime

```typescript
import { ui } from "@/ui";

if (ui.bun.isBun()) {
  console.log("Running in Bun!");
}
```

**`isNode()`** - Check if running in Node.js runtime

```typescript
import { ui } from "@/ui";

if (ui.bun.isNode()) {
  console.log("Running in Node.js!");
}
```

**`getRuntime()`** - Get current runtime name

```typescript
import { ui } from "@/ui";

const runtime = ui.bun.getRuntime();
// Returns: "bun" | "node" | "unknown"

console.log(`Current runtime: ${runtime}`);
```

**`getRuntimeInfo()`** - Get full runtime information

```typescript
import { ui } from "@/ui";

const info = ui.bun.getRuntimeInfo();
// Returns: {
//   runtime: "bun" | "node" | "unknown",
//   version: string | null,
//   platform: string,
//   arch: string
// }

console.log(`Runtime: ${info.runtime}`);
console.log(`Version: ${info.version}`);
console.log(`Platform: ${info.platform}`);
console.log(`Architecture: ${info.arch}`);
```

#### Version Info

**`getBunVersion()`** - Get Bun version (returns null if not Bun)

```typescript
import { ui } from "@/ui";

const version = ui.bun.getBunVersion();
if (version) {
  console.log(`Bun version: ${version}`);
}
```

**`getNodeVersion()`** - Get Node.js version (returns null if not Node.js)

```typescript
import { ui } from "@/ui";

const version = ui.bun.getNodeVersion();
if (version) {
  console.log(`Node.js version: ${version}`);
}
```

#### Environment Variables

**`getEnv()`** - Get environment variable with optional default

```typescript
import { ui } from "@/ui";

// Get with default
const port = ui.bun.getEnv("PORT", "3000");
console.log(`Port: ${port}`);

// Get without default (returns undefined if not set)
const apiKey = ui.bun.getEnv("API_KEY");
if (apiKey) {
  console.log("API key is set");
}
```

**`getRequiredEnv()`** - Get required environment variable (throws if not set)

```typescript
import { ui } from "@/ui";

try {
  const dbUrl = ui.bun.getRequiredEnv("DATABASE_URL");
  // Use dbUrl
} catch (error) {
  console.error("DATABASE_URL is required!");
}
```

**`isDevelopment()`** - Check if running in development mode

```typescript
import { ui } from "@/ui";

if (ui.bun.isDevelopment()) {
  console.log("Development mode - enabling debug features");
}
```

**`isProduction()`** - Check if running in production mode

```typescript
import { ui } from "@/ui";

if (ui.bun.isProduction()) {
  console.log("Production mode - enabling optimizations");
}
```

**`isTest()`** - Check if running in test mode

```typescript
import { ui } from "@/ui";

if (ui.bun.isTest()) {
  console.log("Test mode - using test database");
}
```

#### Conditional Execution

**`ifBun()`** - Execute function only if running in Bun

```typescript
import { ui } from "@/ui";

// Execute if Bun, otherwise return undefined
const result = ui.bun.ifBun(() => {
  return "Bun-specific operation";
});

// With fallback
const result = ui.bun.ifBun(
  () => "Bun operation",
  "Fallback for other runtimes"
);
```

**`ifNode()`** - Execute function only if running in Node.js

```typescript
import { ui } from "@/ui";

// Execute if Node.js, otherwise return undefined
const result = ui.bun.ifNode(() => {
  return "Node.js-specific operation";
});

// With fallback
const result = ui.bun.ifNode(
  () => "Node.js operation",
  "Fallback for other runtimes"
);
```

#### Complete Examples

**Runtime-Specific Configuration:**
```typescript
import { ui } from "@/ui";

function getDatabaseConfig() {
  if (ui.bun.isBun()) {
    // Bun-specific configuration
    return {
      host: "localhost",
      port: 5432,
      // Use Bun's native features
    };
  } else {
    // Node.js configuration
    return {
      host: ui.bun.getEnv("DB_HOST", "localhost"),
      port: parseInt(ui.bun.getEnv("DB_PORT", "5432")),
    };
  }
}
```

**Environment-Based Features:**
```typescript
import { ui } from "@/ui";

function initializeApp() {
  if (ui.bun.isDevelopment()) {
    // Enable debug logging
    console.log("Debug mode enabled");
  }
  
  if (ui.bun.isProduction()) {
    // Enable production optimizations
    console.log("Production optimizations enabled");
  }
  
  // Get configuration
  const apiUrl = ui.bun.getRequiredEnv("API_URL");
  const apiKey = ui.bun.getEnv("API_KEY");
  
  return { apiUrl, apiKey };
}
```

**Conditional Feature Loading:**
```typescript
import { ui } from "@/ui";

// Load runtime-specific features
const feature = ui.bun.ifBun(
  () => import("./bun-feature"),
  () => import("./node-feature")
);

if (feature) {
  // Use the feature
}
```

---

### Commands Namespace (`ui.commands`)

The commands namespace provides a plugin system and command registry for extending the framework with custom commands.

#### Overview

- **Location**: [src/ui/commands.ts](src/ui/commands.ts)
- **Features**: Command registration, plugin system, help system, metadata support

#### Simple Registry

**`register()`** - Register a single command

```typescript
import { ui } from "@/ui";

// Register a simple command
ui.commands.register("greet", (name: string) => {
  return `Hello, ${name}!`;
});

// Register with metadata
ui.commands.register(
  "calculate",
  (a: number, b: number) => a + b,
  {
    description: "Add two numbers",
    usage: "calculate <a> <b>",
    examples: ["calculate 5 3", "calculate 10 20"],
  }
);
```

**`execute()`** - Execute a registered command

```typescript
import { ui } from "@/ui";

// Execute a command
const greeting = await ui.commands.execute<string[], string>("greet", "World");
console.log(greeting); // "Hello, World!"

// Execute with typed parameters
const sum = await ui.commands.execute<[number, number], number>(
  "calculate",
  5,
  3
);
console.log(sum); // 8
```

#### Plugin System

**`plugin()`** - Register multiple commands as a plugin

```typescript
import { ui } from "@/ui";

// Register a plugin with multiple commands
ui.commands.plugin("math", {
  add: (a: number, b: number) => a + b,
  subtract: (a: number, b: number) => a - b,
  multiply: (a: number, b: number) => a * b,
  divide: (a: number, b: number) => a / b,
});

// Commands are namespaced: math:add, math:subtract, etc.
const sum = await ui.commands.execute("math:add", 10, 20);
const product = await ui.commands.execute("math:multiply", 5, 4);
```

**Plugin with Metadata:**
```typescript
import { ui } from "@/ui";

ui.commands.plugin("user", {
  create: {
    handler: (name: string, email: string) => {
      return { id: 1, name, email };
    },
    metadata: {
      description: "Create a new user",
      usage: "user:create <name> <email>",
      examples: ["user:create John john@example.com"],
    },
  },
  delete: (id: number) => {
    return `User ${id} deleted`;
  },
});
```

#### Utilities

**`has()`** - Check if a command exists

```typescript
import { ui } from "@/ui";

if (ui.commands.has("greet")) {
  await ui.commands.execute("greet", "World");
} else {
  console.log("Command not found");
}
```

**`list()`** - List all registered command names

```typescript
import { ui } from "@/ui";

const commands = ui.commands.list();
console.log("Available commands:", commands);
// Output: ["greet", "math:add", "math:subtract", "user:create"]
```

**`getAll()`** - Get all commands with metadata

```typescript
import { ui } from "@/ui";

const allCommands = ui.commands.getAll();
allCommands.forEach((cmd) => {
  console.log(`Command: ${cmd.name}`);
  if (cmd.metadata?.description) {
    console.log(`  Description: ${cmd.metadata.description}`);
  }
});
```

**`getMetadata()`** - Get command metadata

```typescript
import { ui } from "@/ui";

const metadata = ui.commands.getMetadata("calculate");
if (metadata) {
  console.log("Description:", metadata.description);
  console.log("Usage:", metadata.usage);
  console.log("Examples:", metadata.examples);
}
```

**`unregister()`** - Remove a command

```typescript
import { ui } from "@/ui";

const removed = ui.commands.unregister("greet");
if (removed) {
  console.log("Command removed");
}
```

**`clear()`** - Clear all commands

```typescript
import { ui } from "@/ui";

ui.commands.clear();
console.log("All commands cleared");
```

**`help()`** - Get help text for a command or all commands

```typescript
import { ui } from "@/ui";

// Get help for a specific command
const helpText = ui.commands.help("calculate");
console.log(helpText);
// Output:
// Command: calculate
// Description: Add two numbers
// Usage: calculate <a> <b>
// Examples:
//   calculate 5 3
//   calculate 10 20

// Get help for all commands
const allHelp = ui.commands.help();
console.log(allHelp);
// Output:
// Available commands:
//
//   greet - Simple greeting command
//   calculate - Add two numbers
//   math:add - Add two numbers
```

#### Command Metadata Structure

```typescript
interface CommandMetadata {
  description?: string;  // Command description
  usage?: string;        // Usage pattern
  examples?: string[];   // Example usages
}
```

#### Complete Examples

**Building a Command System:**
```typescript
import { ui } from "@/ui";

// Register utility commands
ui.commands.plugin("utils", {
  uppercase: (text: string) => text.toUpperCase(),
  lowercase: (text: string) => text.toLowerCase(),
  reverse: (text: string) => text.split("").reverse().join(""),
});

// Register async commands
ui.commands.register(
  "fetch-data",
  async (url: string) => {
    const response = await fetch(url);
    return response.json();
  },
  {
    description: "Fetch data from URL",
    usage: "fetch-data <url>",
    examples: ["fetch-data https://api.example.com/data"],
  }
);

// Use commands
const upper = await ui.commands.execute("utils:uppercase", "hello");
const data = await ui.commands.execute("fetch-data", "https://api.example.com/data");
```

**Command with Error Handling:**
```typescript
import { ui } from "@/ui";

ui.commands.register("divide", (a: number, b: number) => {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
});

try {
  const result = await ui.commands.execute("divide", 10, 2);
  console.log(result); // 5
} catch (error) {
  console.error("Error:", error.message);
}
```

**Dynamic Command Registration:**
```typescript
import { ui } from "@/ui";

// Register commands dynamically based on configuration
const commandConfig = [
  { name: "cmd1", handler: () => "Result 1" },
  { name: "cmd2", handler: () => "Result 2" },
];

commandConfig.forEach(({ name, handler }) => {
  ui.commands.register(name, handler);
});

// Execute dynamically
const result = await ui.commands.execute("cmd1");
```

---

## Advanced Usage

### Combining Namespaces

The UI framework is designed to work seamlessly across namespaces. Here are some common patterns:

**Database + Authentication:**
```typescript
import { ui } from "@/ui";

export default async function UserProfile() {
  const user = await ui.auth.getCurrentUser();
  
  if (!user) {
    ui.next.redirect("/login");
  }
  
  const posts = await ui.db.db
    .select()
    .from(ui.db.schema.posts)
    .where(eq(ui.db.schema.posts.userId, user.id));
  
  return <div>{/* Render posts */}</div>;
}
```

**Commands + Runtime Detection:**
```typescript
import { ui } from "@/ui";

ui.commands.register("runtime-info", () => {
  return ui.bun.getRuntimeInfo();
});

const info = await ui.commands.execute("runtime-info");
```

**Next.js + Database + Auth:**
```typescript
// app/api/posts/route.ts
import { ui } from "@/ui";

export async function POST(request: Request) {
  const user = await ui.auth.getCurrentUser();
  
  if (!user) {
    return ui.next.errorResponse("Unauthorized", 401);
  }
  
  const data = await request.json();
  const post = await ui.db.db
    .insert(ui.db.schema.posts)
    .values({ ...data, userId: user.id })
    .returning();
  
  ui.next.revalidatePath("/posts");
  return ui.next.jsonResponse(post[0]);
}
```

### TypeScript Types

The framework provides full TypeScript support:

```typescript
import { ui } from "@/ui";
import type { UI } from "@/ui";

// Type of the ui object
type UIFramework = typeof ui;

// Access specific namespace types
type AuthSession = Awaited<ReturnType<typeof ui.auth.getSession>>;
type RuntimeInfo = ReturnType<typeof ui.bun.getRuntimeInfo>;
```

### Best Practices

1. **Use Namespace Imports**: Import the entire `ui` object for better discoverability
2. **Type Safety**: Leverage TypeScript types for better IDE support
3. **Error Handling**: Always handle errors when using async operations
4. **Server vs Client**: Be aware of which functions work in server vs client components
5. **Command Naming**: Use namespaced commands (e.g., `plugin:command`) for better organization

### Common Patterns

**Protected API Route:**
```typescript
import { ui } from "@/ui";

export async function GET() {
  const user = await ui.auth.getCurrentUser();
  if (!user) {
    return ui.next.errorResponse("Unauthorized", 401);
  }
  
  const data = await fetchUserData(user.id);
  return ui.next.jsonResponse(data);
}
```

**Server Component with Data:**
```typescript
import { ui } from "@/ui";

export default async function Page() {
  const user = await ui.auth.getCurrentUser();
  const items = await ui.db.db.select().from(ui.db.schema.items);
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <ItemsList items={items} />
    </div>
  );
}
```

**Client Component with Session:**
```typescript
"use client";
import { ui } from "@/ui";

export default function ClientComponent() {
  const { data: session, isPending } = ui.auth.useSession();
  const router = ui.next.useRouter();
  
  if (isPending) return <div>Loading...</div>;
  if (!session) {
    router.push("/login");
    return null;
  }
  
  return <div>Welcome, {session.user.name}!</div>;
}
```

---

## Examples

### Complete Example: Blog Application

**Server Component - Blog List:**
```typescript
// app/blog/page.tsx
import { ui } from "@/ui";
import { eq } from "drizzle-orm";

export const metadata = ui.next.createMetadata({
  title: "Blog",
  description: "Read our latest blog posts",
});

export default async function BlogPage() {
  const posts = await ui.db.db
    .select()
    .from(ui.db.schema.posts)
    .orderBy(desc(ui.db.schema.posts.createdAt))
    .limit(10);
  
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <ui.next.Link href={`/blog/${post.id}`}>Read more</ui.next.Link>
        </article>
      ))}
    </div>
  );
}
```

**API Route - Create Post:**
```typescript
// app/api/posts/route.ts
import { ui } from "@/ui";

export async function POST(request: Request) {
  try {
    const user = await ui.auth.getCurrentUser();
    if (!user) {
      return ui.next.errorResponse("Unauthorized", 401);
    }
    
    const data = await request.json();
    const post = await ui.db.db
      .insert(ui.db.schema.posts)
      .values({
        ...data,
        userId: user.id,
        createdAt: new Date(),
      })
      .returning();
    
    ui.next.revalidatePath("/blog");
    return ui.next.successResponse(post[0], "Post created", 201);
  } catch (error) {
    return ui.next.errorResponse("Failed to create post", 500);
  }
}
```

**Client Component - Post Editor:**
```typescript
// components/PostEditor.tsx
"use client";
import { ui } from "@/ui";
import { useState } from "react";

export default function PostEditor() {
  const { data: session } = ui.auth.useSession();
  const router = ui.next.useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        setError(data.error);
        return;
      }
      
      router.push("/blog");
    } catch (error) {
      setError("Failed to create post");
    }
  };
  
  if (!session) {
    return <div>Please sign in to create a post</div>;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Create Post</button>
    </form>
  );
}
```

### Example: Runtime-Specific Features

```typescript
import { ui } from "@/ui";

function getOptimalConfig() {
  return ui.bun.ifBun(
    () => ({
      // Bun-specific optimizations
      useNativeFeatures: true,
      workerThreads: 4,
    }),
    () => ({
      // Node.js configuration
      useNativeFeatures: false,
      workerThreads: 2,
    })
  );
}

const config = getOptimalConfig();
```

### Example: Command Plugin System

```typescript
import { ui } from "@/ui";

// Create a plugin for user management
ui.commands.plugin("user", {
  create: {
    handler: async (name: string, email: string) => {
      const user = await ui.db.db
        .insert(ui.db.schema.users)
        .values({ name, email })
        .returning();
      return user[0];
    },
    metadata: {
      description: "Create a new user",
      usage: "user:create <name> <email>",
      examples: ["user:create John john@example.com"],
    },
  },
  list: {
    handler: async () => {
      return await ui.db.db.select().from(ui.db.schema.users);
    },
    metadata: {
      description: "List all users",
      usage: "user:list",
    },
  },
});

// Use the plugin
const newUser = await ui.commands.execute("user:create", "John", "john@example.com");
const users = await ui.commands.execute("user:list");
```

---

## API Reference

### Quick Reference Table

| Namespace | Key Functions | Purpose |
|-----------|--------------|---------|
| `ui.db` | `db`, `schema` | Database operations (Drizzle ORM) |
| `ui.auth` | `getSession()`, `getCurrentUser()`, `signIn()`, `signUp()`, `signOut()`, `useSession()` | Authentication (better-auth) |
| `ui.test` | `describe()`, `it()`, `before()`, `after()`, `assert` | Testing utilities (Mocha) |
| `ui.next` | `Image`, `Link`, `useRouter()`, `redirect()`, `jsonResponse()`, etc. | Next.js integration |
| `ui.bun` | `isBun()`, `isNode()`, `getRuntime()`, `getEnv()`, etc. | Runtime detection |
| `ui.commands` | `register()`, `execute()`, `plugin()`, `help()` | Custom commands |

### Type Definitions

```typescript
// Main UI object type
export type UI = typeof ui;

// Session type
export type Session = typeof auth.$Infer.Session;

// Command handler type
export type CommandHandler<TArgs extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TArgs
) => TReturn | Promise<TReturn>;

// Command metadata type
export interface CommandMetadata {
  description?: string;
  usage?: string;
  examples?: string[];
}
```

### Function Signatures

#### Database Namespace

```typescript
ui.db.db: DrizzleDatabase
ui.db.schema: DatabaseSchemas
```

#### Authentication Namespace

```typescript
// Server-side
ui.auth.getSession(): Promise<Session | null>
ui.auth.getCurrentUser(): Promise<User | null>

// Client-side
ui.auth.signIn.email({ email, password }): Promise<SignInResult>
ui.auth.signUp.email({ email, password, name }): Promise<SignUpResult>
ui.auth.signOut(): Promise<void>
ui.auth.useSession(): { data: Session | null, isPending: boolean }

// Advanced
ui.auth.auth: AuthInstance
ui.auth.authClient: AuthClientInstance
```

#### Testing Namespace

```typescript
ui.test.describe(name: string, fn: () => void): void
ui.test.it(name: string, fn: () => void | Promise<void>): void
ui.test.before(fn: () => void | Promise<void>): void
ui.test.after(fn: () => void | Promise<void>): void
ui.test.beforeEach(fn: () => void | Promise<void>): void
ui.test.afterEach(fn: () => void | Promise<void>): void
ui.test.assert: Assert
```

#### Next.js Namespace

```typescript
// Components
ui.next.Image: React.ComponentType<ImageProps>
ui.next.Link: React.ComponentType<LinkProps>

// Navigation hooks (client only)
ui.next.useRouter(): AppRouterInstance
ui.next.usePathname(): string
ui.next.useSearchParams(): ReadonlyURLSearchParams

// Server utilities
ui.next.redirect(url: string): never
ui.next.notFound(): never
ui.next.permanentRedirect(url: string): never
ui.next.revalidatePath(path: string): void
ui.next.revalidateTag(tag: string): void
ui.next.cookies(): Promise<ReadonlyRequestCookies>
ui.next.headers(): Promise<Headers>

// Helpers
ui.next.createMetadata(metadata: MetadataInput): Metadata
ui.next.jsonResponse<T>(data: T, status?: number): Response
ui.next.errorResponse(message: string, status?: number, details?: unknown): Response
ui.next.successResponse<T>(data: T, message?: string, status?: number): Response
ui.next.getSearchParam(searchParams: SearchParams, key: string): string | null
ui.next.getSearchParamAsNumber(searchParams: SearchParams, key: string): number | null
ui.next.getSearchParamAsBoolean(searchParams: SearchParams, key: string): boolean | null
ui.next.isServerComponent(): boolean
ui.next.isClientComponent(): boolean
```

#### Bun Runtime Namespace

```typescript
ui.bun.isBun(): boolean
ui.bun.isNode(): boolean
ui.bun.getRuntime(): "bun" | "node" | "unknown"
ui.bun.getRuntimeInfo(): RuntimeInfo
ui.bun.getBunVersion(): string | null
ui.bun.getNodeVersion(): string | null
ui.bun.getEnv(key: string, defaultValue?: string): string | undefined
ui.bun.getRequiredEnv(key: string): string
ui.bun.isDevelopment(): boolean
ui.bun.isProduction(): boolean
ui.bun.isTest(): boolean
ui.bun.ifBun<T>(fn: () => T, fallback?: T): T | undefined
ui.bun.ifNode<T>(fn: () => T, fallback?: T): T | undefined
```

#### Commands Namespace

```typescript
ui.commands.register<TArgs, TReturn>(
  name: string,
  handler: CommandHandler<TArgs, TReturn>,
  metadata?: CommandMetadata
): void

ui.commands.execute<TArgs, TReturn>(
  name: string,
  ...args: TArgs
): Promise<TReturn>

ui.commands.plugin(pluginName: string, commands: CommandPlugin): void
ui.commands.has(name: string): boolean
ui.commands.list(): string[]
ui.commands.getAll(): Array<{ name: string; metadata?: CommandMetadata }>
ui.commands.getMetadata(name: string): CommandMetadata | undefined
ui.commands.unregister(name: string): boolean
ui.commands.clear(): void
ui.commands.help(name?: string): string
```

---

## Troubleshooting

### Common Issues

**Issue: "Cannot find module '@/ui'"**
- **Solution**: Ensure your `tsconfig.json` has the correct path alias configured:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./src/*"]
      }
    }
  }
  ```

**Issue: "useSession is not a function" in server component**
- **Solution**: `useSession()` is a React hook and can only be used in client components. Use `getSession()` or `getCurrentUser()` in server components.

**Issue: "Command not found" error**
- **Solution**: Ensure the command is registered before execution. Check if the command exists with `ui.commands.has(name)`.

**Issue: Database connection errors**
- **Solution**: Ensure `DATABASE_URL` environment variable is set correctly.

**Issue: Authentication not working**
- **Solution**: 
  - Check that `NEXT_PUBLIC_BETTER_AUTH_URL` or `NEXT_PUBLIC_APP_URL` is set
  - Ensure the auth API route is properly configured at `/api/auth/[...all]`

### Getting Help

- Check the source files in `src/ui/` for implementation details
- Review test files in `test/` for usage examples
- Check the framework documentation for Next.js, Drizzle, and better-auth

---

## Additional Resources

- **Source Files**: [src/ui/](src/ui/)
- **Tests**: [test/ui-framework.test.ts](test/ui-framework.test.ts)
- **Next.js Documentation**: https://nextjs.org/docs
- **Drizzle ORM Documentation**: https://orm.drizzle.team/docs/overview
- **better-auth Documentation**: https://www.better-auth.com/docs

---

*Last updated: January 2026*
