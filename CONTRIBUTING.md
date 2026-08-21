# Contributing

Storyflow is a legacy prototype. Keep changes focused, document compatibility assumptions, and avoid combining product work with framework migrations.

## Development

1. Use Node.js 18 or 20 and pnpm 7.13.4 through Corepack.
2. Copy `apps/app/.env.example` to `apps/app/.env.local` and use disposable development resources.
3. Install with `pnpm install`.
4. Run the relevant workspace rather than all services when possible.

Before requesting review, run the checks the affected workspace supports:

```bash
pnpm tsc
pnpm lint
pnpm build
```

Include manual verification steps for authentication, storage, editor, AMP generation, or widget changes. Screenshots and fixtures must not contain real user data, credentials, private bucket URLs, or personal contact details.

Report vulnerabilities privately according to [SECURITY.md](SECURITY.md). Note that the repository has no root license yet; ask the maintainers about contribution terms if licensing affects your work.
