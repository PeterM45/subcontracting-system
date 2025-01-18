# Subcontracting System

A web application to manage subcontractors, service requests, and rates for waste businesses.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Neon (Postgres) + Drizzle ORM
- **API**: tRPC
- **Authentication**: Clerk
- **Language**: TypeScript
- **Linting**: ESLint (Strict Configuration)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git

### Installation

1. Clone the repository:

```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
```

4. Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to see your application.

## Available Scripts

```bash
# Development
pnpm dev          # Start development server with turbo
pnpm start        # Start production server
pnpm preview      # Build and start for preview

# Building
pnpm build        # Build for production

# Database
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Drizzle Studio

# Code Quality
pnpm check        # Run linting and type checking
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm typecheck    # Run TypeScript checks
pnpm format:check # Check formatting
pnpm format:write # Fix formatting
```

## Project Structure

```
├── src/
│   ├── app/               # Next.js App Router pages and layouts
│   │   ├── @modal/       # Modal interceptors
│   │   ├── _components/  # Page-specific components
│   │   └── api/         # API routes
│   ├── components/       # Shared UI components
│   │   └── ui/          # shadcn/ui components
│   ├── server/          # Backend logic
│   │   ├── api/         # tRPC routers and procedures
│   │   └── db/          # Database schema and config
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── styles/          # Global styles
│   └── trpc/            # tRPC client setup
├── public/              # Static assets
├── drizzle.config.ts    # Drizzle configuration
├── next.config.js       # Next.js configuration
└── tsconfig.json        # TypeScript configuration
```

## Development Workflow

### Database Management

The project uses Drizzle ORM with a Neon Postgres database. Use the provided scripts to manage your database:

- `pnpm db:generate` to create new migrations
- `pnpm db:push` to apply schema changes
- `pnpm db:studio` to open Drizzle Studio for database management

### Code Quality

The project maintains high code quality standards through:

- Strict TypeScript configuration
- ESLint with strict rules
- Prettier for consistent formatting
- Pre-configured shadcn/ui components

Run `pnpm check` before committing to ensure your code meets the project's standards.

### API Development

tRPC routes are defined in `src/server/api/routers/`. The project includes routers for:

- Customers
- Service Requests
- Subcontractors
- Rates
