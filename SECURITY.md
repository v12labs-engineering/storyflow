# Security Policy

## Reporting

Do not open a public issue for a suspected vulnerability. Use GitHub's private **Report a vulnerability** option when available. Otherwise contact the V12 Labs maintainers through a private channel listed on the organization's official website.

Include the affected revision, component, reproduction steps, impact, and any known mitigation. Never include active credentials, private user content, or customer data.

## Deployment guidance

- Keep `BACKBLAZE_APP_ID` and `BACKBLAZE_APP_KEY` server-only and scope the application key to the required buckets and operations.
- Configure Supabase Row Level Security before allowing users to create, update, or delete stories and feedback.
- Treat anonymous Supabase keys as public identifiers, not authorization controls.
- Keep public widget/story payloads separate from private creator and contact data.
- Validate media type and size at the edge and storage layer as well as in application code.
- Sanitize all fields before generating or serving HTML.
- Rotate any credential that enters a commit, log, screenshot, or build artifact.
- Upgrade unsupported framework and authentication libraries before production deployment.

## Known credential follow-up

An editor-service bearer was previously committed in client-facing source. The current code no longer contains that bearer or its service host, but repository changes cannot invalidate a credential or erase earlier Git objects. The repository owner must revoke and rotate the old credential outside this codebase, then coordinate a separate Git-history purge if the repository is intended for public release. Do not rewrite shared history until rotation is complete and collaborators have agreed on the migration procedure.

## Supported versions

This prototype does not publish versioned security-support windows. Security fixes target the current default branch.
