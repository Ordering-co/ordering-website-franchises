/**
 * Re-export so Vite pre-bundle does not use the literal "smart-app-banner.js"
 * filename, which aggressive block lists (Brave Shields, etc.) often block.
 */
export { default } from 'ordering-sab-vendor'
