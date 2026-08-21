# Storyflow

Storyflow is an early-stage web-stories prototype. It lets a signed-in creator collect image, video, YouTube, or existing AMP Story links, publish a generated AMP story to Backblaze B2, and embed a floating story player on another website with a JavaScript widget.

> **Status:** This is a legacy prototype built on Next.js 12 and Supabase JavaScript v1. It is useful as a product and engineering reference, but it needs further modernization and security review before production use. See the known limitations below.

## Repository structure

```text
apps/app/                    Creator-facing product and API routes (port 4010)
apps/home/                   Minimal public holding page (port 5010)
packages/storyflow-widget/   Embeddable story-player bundle (port 6010 in dev)
packages/eslint-config-custom/
packages/tsconfig/           Shared lint and TypeScript configuration
```

The previous README mentioned a separate `studio` app; no such workspace exists. The canvas editor code is embedded under `apps/app/layerhub-editor` and is reached from the product's editor route.

## Features present in the code

- Supabase email magic-link sign-in
- Creator dashboard for listing, adding, editing, and deleting story records
- Image/video uploads to a Backblaze B2 media bucket
- AMP story markup generation from image, video, YouTube, and CTA records
- Publishing generated AMP HTML to Backblaze B2
- An embeddable JavaScript widget that fetches a user's public stories and opens an AMP Story Player
- A canvas-based visual editor prototype based on Layerhub
- Feedback capture through Supabase

## Architecture and data flow

The dashboard uses the Supabase v1 browser client for authentication and database access. This means the Supabase project's Row Level Security policies are part of the application's security boundary and must restrict mutations to the authenticated owner.

Authenticated Backblaze write routes verify the Supabase cookie and require the requested user ID to match the signed-in user. Generated story HTML is stored in the `storyflow` bucket; uploaded media is stored in `storyflow-media`. The widget calls the public story-list endpoint and renders the resulting media in an iframe-based AMP player.

## Prerequisites

- Node.js 18 or 20
- Corepack with pnpm 7.13.4
- A Supabase project compatible with `@supabase/supabase-js` v1
- Backblaze B2 credentials and buckets only when testing uploads/publishing

The Layerhub dependency includes native `canvas`. On Apple Silicon, installation may require `pkg-config` plus Cairo/Pango/Pixman development libraries because the pinned canvas line may not provide a prebuilt binary for your Node ABI.

## Environment variables

Create the product app's local environment file:

```bash
cp apps/app/.env.example apps/app/.env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Product app | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Product app | Browser-safe Supabase anonymous key. Authorization still depends on RLS. |
| `NEXT_PUBLIC_STORYFLOW_WIDGET` | Widget integration | URL of the built widget bundle, locally `http://localhost:6010/main.bundle.js`. |
| `NEXT_PUBLIC_PEXELS_KEY` | Optional | Browser-visible Pexels API key used by editor search. |
| `NEXT_PUBLIC_PIXABAY_KEY` | Optional | Browser-visible Pixabay API key used by editor search. |
| `BACKBLAZE_APP_ID` | Upload/publish routes | Server-only Backblaze application key ID. |
| `BACKBLAZE_APP_KEY` | Upload/publish routes | Server-only Backblaze application key. |
| `STORYFLOW_EDITOR_API_URL` | Visual editor | Server-only editor service base URL. HTTPS is required outside local development. |
| `STORYFLOW_EDITOR_API_TOKEN` | Visual editor | Server-only bearer token used by the authenticated editor proxy. |

Do not place Backblaze credentials in a `NEXT_PUBLIC_` variable. The former tracked `.env` files were removed; only `.env.example` should be committed.
Do not expose the editor service token through a `NEXT_PUBLIC_` variable or client-side service module.

## Supabase setup

The code expects `stories` and `feedback` tables. Story records use fields including `id`, `name`, `description`, `type`, `url`, `media_id`, `cta_link`, `cta_text`, and `user_id`.

Before using the app, configure:

1. Email magic-link authentication and an allowed redirect for `http://localhost:4010`.
2. Row Level Security so users can read and mutate only their own private dashboard records.
3. A deliberate public-read policy for story fields required by the embed endpoint. Avoid returning private profile or contact fields from public APIs.

No SQL migrations are included, so schema creation remains a manual setup step.

## Install and run

Enable the repository-pinned package manager and install all workspaces:

```bash
corepack enable
pnpm install
```

Run one workspace at a time:

```bash
pnpm --filter app dev                    # http://localhost:4010
pnpm --filter home dev                   # http://localhost:5010
pnpm --filter storyflow-widget dev       # http://localhost:6010/main.bundle.js
```

Or start all development tasks with `pnpm dev`.

The unauthenticated Storyflow landing page is at `http://localhost:4010/`; authenticated creator routes redirect to `/login` when no Supabase session is present.

## Quality checks

```bash
pnpm tsc
pnpm lint
pnpm build
pnpm audit
```

There is no automated test suite in the repository. Validate authentication, story ownership, uploads, generated AMP markup, and widget embedding manually against disposable Supabase and Backblaze resources.

## Known limitations

- Next.js 12 and Supabase JavaScript v1 are no longer current platform lines and should be upgraded in a dedicated migration.
- The dependency tree contains legacy editor libraries and native canvas installation requirements.
- The repository has no database migrations or checked-in RLS policy definitions.
- The widget's production API and preview origins are currently compiled as `storyflow.video` endpoints.
- Public story APIs and buckets require careful separation from private creator data.
- The project has no automated tests or continuous-integration workflow.

## Security, contributing, and license

Read [SECURITY.md](SECURITY.md) before reporting a vulnerability and [CONTRIBUTING.md](CONTRIBUTING.md) before opening a change.

This repository does not include a root license. The widget package metadata says `MIT`, but package metadata alone does not provide the repository's license text. The owner must choose and add the intended license before describing the repository as open source or inviting reuse.
