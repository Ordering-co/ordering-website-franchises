# Configure and verify the franchise storefront

## 1. Prepare the checkout

For a new checkout:

```sh
git clone --recurse-submodules https://github.com/Ordering-co/ordering-website-franchises.git
cd ordering-website-franchises
```

For an existing checkout, first inspect `git remote -v` and `git status --short`. Preserve its changes and reuse the directory; do not delete it or reset it. Initialize the shared submodule with `git submodule update --init --recursive`, without `--remote`.

Activate Node 24 as specified by `.nvmrc`, then run:

```sh
corepack enable
corepack prepare pnpm@9.15.0 --activate
HUSKY=0 pnpm install --frozen-lockfile
pnpm setup:detect
```

`detect` reports the known local Quickstart launcher connection when that launcher is prepared. It does not inspect your assistant's native MCP connection itself or print the full configuration. The assistant should read your existing public configuration before choosing a project. `doctor` validates that configuration. Neither command reveals tokens or changes files.

## 2. Choose your project and franchise

The native Ordering MCP uses its current connection: ask your assistant to confirm the connected project. If it differs from an existing configured project, the assistant must ask which one to use before replacing it. Reuse a compatible connection without repeating login. Keep API keys out of frontend code. The frontend configuration and the MCP connection are independent; changing one does not change the other.

Browser-based project selection is not available in this franchise storefront. If a compatible MCP is unavailable, get your public project slug from your dashboard and explicitly choose an enabled franchise belonging to that project. A public GET validates availability and an exact match; it does not establish your identity or project membership.

```sh
pnpm setup:configure --project YOUR_PROJECT --franchise-slug YOUR_FRANCHISE
pnpm setup:doctor
pnpm start
```

`configure` validates `/current` and an exact enabled slug match in `/franchises`, then stores its numeric ID in `franchiseSlug`. It does not automatically choose a franchise or business. You can supply `--api-url`, `--api-version` and `--language` explicitly when needed; the helper supports the documented `v400` API. Without those options, existing values are preserved. If the project or franchise identity really changes, review the selection and add `--confirm-project-change` only after explicitly confirming that change.

If an older checkout stores a slug in `franchiseSlug`, migrate it with `setup:configure --project YOUR_PROJECT --franchise-slug YOUR_FRANCHISE`. Resolving the same slug to its numeric ID does not switch franchises. The `doctor` requires a numeric ID in that field. Local preview also accepts the older slug and resolves its human-readable label. A valid numeric selection already configured for the same project can be reused without supplying the franchise flag again.

After validation, `configure` writes `localProjectConfigured: true` alongside the selected project and franchise ID. This source-only marker explicitly enables the isolated preview; an existing project value, Worker injection or remote theme cannot enable it. For manual configuration, set the project and a valid numeric franchise ID first, then add the boolean marker only when you intend to use the isolated preview. Remove or set it to `false` to use the normal development flow. Do not use the string `"true"`.

Saving preserves every other field and creates a private snapshot in `.ordering-setup/` before atomically replacing the JSON. That directory is ignored by Git. Restart the server after changing configuration.

| Field in `src/config.json` | Source | Public | Required |
| --- | --- | --- | --- |
| `localProjectConfigured` | Written as boolean `true` by `configure`, or set explicitly for manual isolated preview | Yes | Only to opt in locally |
| `project` | Slug confirmed by MCP or your dashboard; `/current.result.code` must match | Yes | Yes |
| `franchiseSlug` | Numeric ID returned by `/franchises` for your chosen slug; the CLI accepts the human-readable `--franchise-slug` | Yes | Yes for this storefront |
| `api.url`, `api.version`, `api.language` | Your backend configuration; preserved unless explicitly overridden | Yes | Yes |
| `socket.url` | Your backend socket service; do not infer it from the API URL | Yes | For live updates |
| `app_name`, `app_id`, `app_internal_name` | Your frontend identity; preserved | Yes | Product identification |
| `businessSlug` | An explicitly selected business, if your variant requires one | Yes | Not needed to list a franchise |
| Flags, store IDs, dashboard and support settings | Your project and integrations | Yes | As required by enabled features |
| Google Maps and other browser keys | Your integration, restricted by domain and use | Yes | Only when enabled |
| Private API keys and administrative tokens | The MCP connection or backend | No | Never in frontend code |

`.env.example` lists local Vite settings. Create `.env` only if you need it and it does not already exist; do not overwrite your own file. Every value exposed by Vite is public. Authentication, payments, analytics and notifications depend on backend services and permissions; test them against a project you control.

Only when `src/config.json` contains `localProjectConfigured: true` and the environment is development or a permitted private preview host, the runtime pins project, API and franchise to `src/config.json`. Domain rules, injected `window.__CONFIG__`, stored browser projects and remote themes cannot replace that selection. Before mounting providers, it validates the project and resolves the selected franchise to its numeric SDK ID. Local `localStorage` and `sessionStorage` use a namespace for API, version, language, project and franchise. Global data and previous A/B namespaces remain intact. If the browser prevents isolation, the storefront stops rather than using an unscoped session. Without the source marker, development retains the existing Worker, domain and browser-session behavior, makes no additional onboarding lookups and does not require a franchise. Hosted production never activates the isolated setup solely from the marker. Production retains its domain and worker configuration; review those settings before a separately authorized release.

The local catalogue prepares public pickup and location defaults when pickup without an address is supported. These are read parameters separate from stored order options; they are not synchronized to the backend. Existing options and sessions remain intact. The catalogue omits Maps and address selection, and it does not automatically activate a single store. Configure your own Google Maps integration to test the full address flow. Push initialization, permission requests and subscriptions are also omitted in local preview.

Check the local indicator for your selected project and franchise. **Order Now** should open `/search`, where a real store card must be visible inside the viewport. An accessibility entry or a successful request alone does not prove that the card is visible.

## 3. First edit and maintenance

Change `home.title` in `src/helmetdata.json`, restart and check the browser tab title on the home page. The backend theme can provide the site name; preserve its translations. For an immediate HMR check, make a small temporary change to the local indicator text and verify it appears without a reload, then restore it. Use this prompt:

> In this configured franchise checkout, make a small visible change to the name, title or local indicator. Preserve the project, franchise, API, socket, translations and IDs. Show me the diff and verify it in the browser. Do not publish.

Diagnosis:

> Diagnose this storefront with pnpm setup:detect and pnpm setup:doctor. Confirm the effective project and franchise without printing tokens. Inspect the console and requests; distinguish installation, backend, CORS, disabled franchise, permission and integration issues. Do not switch projects or automatically choose a business.

Updating:

> Update this checkout safely. Read its instructions, verify its state and remote, and preserve customizations and the pinned submodule gitlink. Do not change dependencies or lockfiles for convenience. Use Node 24, pnpm 9.15.0 and a frozen install. Run the documented checks without publishing.

Switching project or franchise:

> I want to change this storefront's project or franchise. Confirm the selection I provide, validate /current and the exact enabled franchise, show which fields will change, and use setup:configure with explicit confirmation and a backup. Preserve everything else, restart and verify that an older browser session cannot override the selection.

Disconnecting and reverting:

> Disconnect the integration I identify. Distinguish the MCP connection from frontend configuration; do not revoke credentials or delete data without my instruction. To revert the local configuration, identify the snapshot in .ordering-setup and run pnpm setup:restore --backup RETURNED_FILENAME. Preserve unrelated customizations and verify the resulting file.

`restore` recovers backed-up local configuration. It does not revoke MCP access, delete projects or undo backend changes. Inspect the backup before restoring it; it contains previous configuration and may include personal values.

## Checks and limits

```sh
pnpm lint:check
pnpm build
pnpm i18n:verify
pnpm i18n:check-generated
pnpm test:coverage
node scripts/coverage-summary.js --no-run --strict
pnpm setup:test
```

Manage translations in `i18n/translations.json`; add literal fallbacks and locale entries, then run `pnpm i18n:generate`. See `i18n/README.md`. Coverage is scoped by the test configuration and does not measure all source files.

### Cloudflare and Docker

For Cloudflare, choose your own account and worker names in `wrangler.toml`, set the project and asset URL for each environment and supply account credentials through your local environment or deployment platform. `pnpm cf:dev` starts the worker locally; deployment scripts publish to the configured account and environment. Review configuration before using them. Docker requires the submodule to be initialized before building; use `docker compose up --build` for development.

No onboarding step publishes or migrates backend data.
