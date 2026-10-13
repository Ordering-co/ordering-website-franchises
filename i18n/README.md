# Translations

`config.json` defines the source language, required locales and catalog path. `translations.json` contains the catalog; existing translations should be preserved. Use `t('KEY', 'Readable fallback')` in UI code.

```sh
pnpm i18n:generate
pnpm i18n:verify
pnpm i18n:check-generated
pnpm i18n:missing
```

Initialize the shared-components submodule before generating: the scanner reads both local UI and shared code. Generated CSV files accompany the catalog. Keys with runtime variable fallbacks are handled by the scanner's documented rules.

`pnpm i18n:sync` is a dry run. Live sync needs your own authorized backend, project and credentials supplied through the variables in `.env.example` in this directory. Keep credentials out of source control and browser code. Review the dry run before `pnpm i18n:sync:live`.
