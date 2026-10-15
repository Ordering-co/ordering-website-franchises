# Configure and verify the franchise storefront

This React storefront uses functional components and a shared components submodule. Vite 7 and pnpm provide development and builds; Cloudflare Workers deliver static assets from `dist/`. See [wrangler.toml](wrangler.toml) and [worker/](worker/) for edge behavior.

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

Change `home.title` in `src/helmetdata.json`, restart and check the browser tab title on the home page. The backend theme can provide the site name; preserve its translations. For an immediate development-update check, make a small temporary change to the local indicator text and verify it appears automatically, then restore it. Depending on the edited module, Vite may use HMR or reload the page automatically; do not claim state preservation without checking it. Use this prompt:

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
pnpm test
pnpm test:coverage
node scripts/coverage-summary.js --no-run --strict
pnpm setup:test
```

Manage translations in `i18n/translations.json`; add literal fallbacks and locale entries, then run `pnpm i18n:generate`. See `i18n/README.md`. Coverage is scoped by the test configuration and does not measure all source files.

## Repository structure

- `src/pages/`: storefront routes.
- `src/ui/`: presentation and local components.
- `src/@/components/`: shared controllers, contexts and SDK submodule.
- `worker/`: SPA delivery, SEO and runtime configuration.
- `i18n/`: translation catalogue and generators.

Change local presentation in this repository; shared SDK changes belong in its own repository. Keep translation fallbacks and existing locale values when updating copy.

A successful bundle or HTTP preview verifies asset delivery, not backend tenant behavior, checkout, payments or notifications. Runtime functionality requires the corresponding backend services and project permissions. Configure your own integrations before using the storefront.

## Build, preview and formatting

Development uses port 3000. `pnpm dev` and `pnpm start` both start Vite. To build and preview the production bundle:

```sh
pnpm build
pnpm preview
```

The bundle is written to `dist/`. To format code, run `pnpm lint`; use `pnpm lint:check` for a check without fixes.

## Cloudflare builds and runtime assets

Choose your own Cloudflare account, worker names, project and asset URLs in `wrangler.toml` for each environment. Supply account credentials through your local environment or deployment platform. `pnpm cf:dev` runs the worker locally. Review configuration before using deployment scripts; they publish to the configured account and require separate authorization.

- **Install:** `corepack enable && corepack prepare pnpm@9.15.0 --activate && pnpm install --frozen-lockfile`
- **Build:** `pnpm run build`
- Optional: `NODE_VERSION=24`, `HUSKY=0` on CI
- The generic `.env.example` template and `wrangler.toml` use `ASSET_BASE_URL=/`; preserve your own local `.env`. If production hashed assets are served from another origin, that Vite prefix is set in **Cloudflare Workers Builds**, not by the tracked file. Recreating the build variable in the Cloudflare dashboard is what production uses.
- `wrangler.toml` `ASSET_BASE_URL=/` is the Worker runtime value for URLs injected by the Worker (for example favicons). It is independent of the Vite prefix.
- Fingerprinted files under `/assets/*` get CORS and immutable cache from `public/_headers`. `run_worker_first` excludes `js`, `css`, fonts, maps, and other static extensions so those requests do not invoke the Worker.
- Process-level `ASSET_BASE_URL` or `VITE_ASSET_BASE_URL` still overrides your local `.env` value during local builds.

## Docker alternative

Install [Docker Engine](https://docs.docker.com/engine/install/) and ensure Docker is running. Clone and initialize the shared submodule as described in the manual setup above. From the project root:

```sh
docker compose up --build
```

Open `http://localhost:3000` in your browser. Docker requires the initialized submodule before building.

## Troubleshooting

- If you can't reach `0.0.0.0:3000`, use `localhost:3000` instead.
- Docker issues: restart Docker Desktop and run `docker compose up` again.
- **JavaScript heap out of memory:** increase Docker Desktop memory/CPU limits under Settings → Resources.

For project, connection, API, CORS, disabled-franchise or permission issues, use the diagnosis prompt in [First edit and maintenance](#3-first-edit-and-maintenance) together with `pnpm setup:detect` and `pnpm setup:doctor`. Keep private credentials out of logs and browser configuration.

## Google Analytics 4 ecommerce

GA4 is optional and configured per Ordering project. Shared code does not contain a
default Measurement ID, client brand, or currency.

- When the app runs in single-store / marketplace / kiosk mode
  (`singleBusinessConfig.isActive`), the Measurement ID comes from
  `store_google_analytics_id` in `window.__CONFIG__` / `src/config.json`.
- Otherwise it comes from the project dashboard/API setting
  `track_id_google_analytics`.
- Only valid GA4 Measurement IDs (`G-...`) enable tracking. Empty, invalid,
  `"0"`, or legacy Universal Analytics values keep tracking disabled.
- Currency comes from the project `stripe_currency` configuration. Monetary
  values are omitted when no valid ISO 4217 currency is available.
- Measurement ID changes take effect from configuration on the next page load;
  they do not require a source-code change or deployment.

The integration sends the GA4 ecommerce journey `view_item_list`,
`select_item`, `view_item`, `add_to_cart`, `remove_from_cart`, `view_cart`,
`begin_checkout`, `add_shipping_info`, `add_payment_info`, and `purchase`.
`purchase` is emitted only after Ordering confirms the order and is deduplicated
by Measurement ID plus transaction ID. Login and signup successes send only the
method; email, phone, name, address, payment details, and Ordering user IDs are
never included.

### GA4 QA

1. Configure a test project's `track_id_google_analytics` in the dashboard.
2. Open the site in a private window and verify page and ecommerce events in GA4
   DebugView or Tag Assistant.
3. Complete the menu → product → cart → checkout → payment → successful-order
   journey on desktop and mobile.
4. Confirm every event has the expected `send_to`, item data, configured
   currency, store/order/payment metadata, and no PII.
5. Reload the successful order page and confirm the same `transaction_id` does
   not create another purchase.
6. Remove or invalidate the project ID, reload, and confirm no GA script or
   events are sent.
7. Configure a second test project with another ID and confirm events never
   appear in the first project's property.
8. Exercise payment failure/cancellation and confirm no `purchase` is emitted.

No onboarding step publishes or migrates backend data.
