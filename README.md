# Ordering Franchise Website

React 18 storefront using Vite, styled-components and the Ordering API. A franchise storefront with business selection, checkout and order tracking.

## Setup

Use Node 24 and pnpm 9.15.0. The shared components are a Git submodule.

```sh
git clone --recurse-submodules https://github.com/Ordering-co/ordering-website-franchises.git
cd ordering-website-franchises
corepack enable
corepack prepare pnpm@9.15.0 --activate
HUSKY=0 pnpm install --frozen-lockfile
cp .env.example .env
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
