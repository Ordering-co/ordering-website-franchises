# Ordering Franchise Website

A React 18 franchise storefront with Vite, business selection, checkout and order tracking.

## Start with your assistant

Copy this single prompt into Codex, Claude Code or another assistant:

> Set up my storefront from https://github.com/Ordering-co/ordering-website-franchises.git. Reuse an existing checkout without deleting customizations and follow setup.md. Detect the available Ordering connection; confirm my project and an enabled franchise I explicitly choose. Preserve other settings, validate and save with a backup. Start locally, verify the selection and help me make a first visible edit. Do not publish or deploy.

1. Confirm the project and choose your franchise when the assistant asks. It must not select the first franchise or business automatically.
2. Open the local storefront. Check that the indicator shows your project and franchise, then click **Order Now** to open the local catalogue.
3. Confirm that a real store card is visible. Make a small edit and check that it appears without reloading through HMR.

You can also follow [setup.md](setup.md) manually. The local helper does not create projects, franchises or MCP connections. The [verification report](docs/onboarding-verification.md) records the checks and their limits.

## Common commands

```sh
pnpm setup:detect
pnpm setup:configure --project YOUR_PROJECT --franchise-slug YOUR_FRANCHISE
pnpm setup:doctor
pnpm start
```

Configuration lives in `src/config.json`. Use Node 24 and pnpm 9.15.0, and keep the shared submodule at its pinned commit. Development and preview use port 3000; the build produces `dist/`.

## Structure and quality

`src/pages/` contains routes, `src/ui/` local components, `src/@/components/` the shared submodule, `worker/` SPA delivery and SEO, and `i18n/` the translation catalogue. Change local presentation here; SDK changes belong in its own repository. Preserve translations and literal fallbacks.

```sh
pnpm build
pnpm lint:check
pnpm i18n:verify
pnpm i18n:check-generated
pnpm test:coverage
node scripts/coverage-summary.js --no-run --strict
pnpm setup:test
```

A successful build or HTTP response does not verify checkout, payments, notifications or project permissions. The local catalogue uses public pickup defaults when supported, without creating a guest user. Maps and the full address flow require your own Google Maps integration; see the runbook.

## License

See `license-ordering.txt`. Dependencies retain their own licenses and notices.
