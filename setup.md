# Configuration and validation

Set `project` in `src/config.json` to your own Ordering project. The API URL, version and language and socket configuration must match your backend. Keep feature flags appropriate to your project. Store identifiers in the template are public integration identifiers; configure your own stores before release. Configure your own dashboard URL, support email and observability services. Never put privileged API credentials in browser code.

`.env.example` lists local Vite settings; values exposed by Vite are public browser configuration. Google Maps requires your own restricted browser key when enabled. Backend project settings control authentication, payments, analytics, notifications and franchise/business availability. Test these integrations only against a project you control.

For Cloudflare, choose your own account and worker names in `wrangler.toml`, set the project and asset URL for each environment and supply account credentials through your local environment or deployment platform. `pnpm cf:dev` starts the worker locally; deployment scripts publish to the configured account and environment. Review configuration before using them. Docker requires the submodule to be initialized before building; use `docker compose up --build` for development.

Run `pnpm build`, `pnpm lint:check`, `pnpm i18n:verify`, `pnpm i18n:check-generated`, `pnpm test:coverage` and `node scripts/coverage-summary.js --no-run --strict`. Coverage is scoped by the test configuration; it does not represent every source file. A successful bundle or HTTP preview verifies asset delivery, not backend tenant behavior, checkout, payments or notifications.

Translations are managed in `i18n/translations.json`. New keys need real literal fallbacks, entries in each locale and refreshed generated files with `pnpm i18n:generate`. Retain existing translations. See `i18n/README.md` for catalog operations.
