if (Number(process.versions.node.split('.')[0]) !== 24) {
  console.error('Use Node 24 (see .nvmrc) and pnpm 9.15.0 before running this storefront.')
  process.exit(1)
}
