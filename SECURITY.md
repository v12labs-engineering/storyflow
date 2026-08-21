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

## Supported versions

This prototype does not publish versioned security-support windows. Security fixes target the current default branch.
