# Ordering Franchise Website

React 18 storefront using Vite, styled-components and the Ordering API. A franchise storefront with business selection, checkout and order tracking.

## Start with your assistant

Copy this single prompt into Codex, Claude Code or another assistant:

> Set up my storefront from https://github.com/Ordering-co/ordering-website-franchises.git. Reuse an existing checkout without deleting customizations and follow setup.md. Detect the available Ordering connection; confirm my project and an enabled franchise I explicitly choose. Preserve other settings, validate and save with a backup. Start locally, verify the selection and help me make a first visible edit. Do not publish or deploy.

1. Confirm the project and choose an enabled franchise explicitly; never automatically select the first franchise or business.
2. Open the local storefront and check the project/franchise indicator. **Order Now** opens the local read-only catalogue; a real store card must be visible inside the viewport.
3. Make a small visible edit and check that the development server updates the page automatically. Follow [setup.md](setup.md) for manual setup, diagnosis, project switching and reverting a backup.

```sh
pnpm setup:detect
pnpm setup:configure --project YOUR_PROJECT --franchise-slug YOUR_FRANCHISE
pnpm setup:doctor
pnpm start
```

`setup:configure` validates your explicit selection and writes `localProjectConfigured: true` to opt in to isolated local preview. Without that source marker, normal development keeps its existing project, Worker and session flow. These helpers do not create projects or franchises. Public validation checks availability, not developer identity or project membership. Keep private API credentials out of browser code.

## Setup

Use Node 24 and pnpm 9.15.0. The shared components are a Git submodule.

```sh
git clone --recurse-submodules https://github.com/Ordering-co/ordering-website-franchises.git
cd ordering-website-franchises
corepack enable
corepack prepare pnpm@9.15.0 --activate
HUSKY=0 pnpm install --frozen-lockfile
[ -e .env ] || cp .env.example .env
pnpm setup:configure --project YOUR_PROJECT --franchise-slug YOUR_FRANCHISE
pnpm setup:doctor
pnpm start
```

For an existing checkout, run `git submodule update --init --recursive` before installing. See [setup.md](setup.md) for configuration and validation.

## Commands

```sh
pnpm build
pnpm preview
pnpm lint:check
pnpm i18n:verify
pnpm i18n:check-generated
pnpm test
pnpm test:coverage
node scripts/coverage-summary.js --no-run --strict
pnpm setup:test
```

Development and preview use port 3000. Build output is `dist/`. Configure your own Ordering project and integrations before using the storefront. Runtime functionality requires the corresponding backend services and project permissions.

## Structure

- `src/pages/`: storefront routes.
- `src/ui/`: presentation and local components.
- `src/@/components/`: shared controllers, contexts and SDK submodule.
- `worker/`: SPA delivery, SEO and runtime configuration.
- `i18n/`: translation catalog and generators.

Change local presentation in this repository; shared SDK changes belong in its own repository. Keep translation fallbacks and existing locale values when updating copy.

## License

See `license-ordering.txt` for the distribution terms. Third-party dependencies retain their own licenses and notices.
