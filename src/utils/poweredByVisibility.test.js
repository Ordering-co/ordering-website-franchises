/** @vitest-environment jsdom */
import { describe, expect, it } from 'vitest'

import {
  isWhiteLabelFranchiseEnabled,
  isWhiteLabelFranchiseEnabledForClient,
  shouldDisablePoweredBy,
  shouldShowPoweredBy,
  shouldShowPoweredByForClient
} from './poweredByVisibility'

const enabled = { value: true }
const disabled = { value: false }

describe('isWhiteLabelFranchiseEnabled', () => {
  it.each([true, 'true', 'TRUE', 1, '1'])('treats %j as enabled', value => {
    expect(isWhiteLabelFranchiseEnabled({
      white_label_franchise_module: { value }
    })).toBe(true)
  })

  it.each([false, 'false', 0, '0', null, undefined, ''])('treats %j as disabled', value => {
    expect(isWhiteLabelFranchiseEnabled({
      white_label_franchise_module: { value }
    })).toBe(false)
  })

  it('is disabled when the feature is missing', () => {
    expect(isWhiteLabelFranchiseEnabled({})).toBe(false)
    expect(isWhiteLabelFranchiseEnabled()).toBe(false)
  })
})

describe('isWhiteLabelFranchiseEnabledForClient', () => {
  it('is true when only first-load features enable white label', () => {
    window.__FIRST_LOAD__ = {
      features: { white_label_franchise_module: enabled }
    }
    expect(isWhiteLabelFranchiseEnabledForClient({
      powered_by_ordering_module: enabled
    })).toBe(true)
    delete window.__FIRST_LOAD__
  })

  it('is false when first-load and configs both have white label off', () => {
    window.__FIRST_LOAD__ = {
      features: { white_label_franchise_module: disabled }
    }
    expect(isWhiteLabelFranchiseEnabledForClient({
      white_label_franchise_module: disabled,
      powered_by_ordering_module: enabled
    })).toBe(false)
    delete window.__FIRST_LOAD__
  })
})

describe('shouldShowPoweredBy', () => {
  it('hides branding when white label is on even if powered_by_ordering_module is on', () => {
    expect(shouldShowPoweredBy({
      configs: {
        white_label_franchise_module: enabled,
        powered_by_ordering_module: enabled,
        plan_enterprise: enabled
      },
      disablePoweredByFromWorker: false
    })).toBe(false)
  })

  it('hides branding when first-load features enable white label', () => {
    expect(shouldShowPoweredBy({
      features: { white_label_franchise_module: enabled },
      configs: { powered_by_ordering_module: enabled },
      disablePoweredByFromWorker: false
    })).toBe(false)
  })

  it('hides branding when the worker disable flag is true', () => {
    expect(shouldShowPoweredBy({
      configs: { powered_by_ordering_module: enabled },
      disablePoweredByFromWorker: true
    })).toBe(false)
  })

  it('shows branding when powered_by_ordering_module is on and white label is off', () => {
    expect(shouldShowPoweredBy({
      configs: { powered_by_ordering_module: enabled }
    })).toBe(true)
  })

  it('shows branding when plan_enterprise is on and white label is off', () => {
    expect(shouldShowPoweredBy({
      configs: { plan_enterprise: enabled }
    })).toBe(true)
  })

  it('falls through to existing flags when the worker disable flag is false', () => {
    expect(shouldShowPoweredBy({
      configs: { powered_by_ordering_module: disabled },
      disablePoweredByFromWorker: false
    })).toBe(false)
  })

  it('hides branding when white label is off and no powered-by source is on', () => {
    expect(shouldShowPoweredBy({
      configs: {
        white_label_franchise_module: disabled,
        powered_by_ordering_module: disabled
      }
    })).toBe(false)
  })
})

describe('shouldDisablePoweredBy', () => {
  it('is true when the deploy env disables powered-by', () => {
    expect(shouldDisablePoweredBy({
      envDisablePoweredBy: true,
      features: {}
    })).toBe(true)
  })

  it('is true when first-load features enable white label', () => {
    expect(shouldDisablePoweredBy({
      envDisablePoweredBy: false,
      features: { white_label_franchise_module: enabled }
    })).toBe(true)
  })

  it('is false when neither env nor white label is on', () => {
    expect(shouldDisablePoweredBy({
      envDisablePoweredBy: false,
      features: { white_label_franchise_module: disabled },
      configs: { powered_by_ordering_module: enabled }
    })).toBe(false)
  })
})

describe('shouldShowPoweredByForClient', () => {
  it('hides branding when white label is on even if the worker flag says show', () => {
    window.__CONFIG__ = { disable_powered_by: false }
    expect(shouldShowPoweredByForClient({
      white_label_franchise_module: enabled,
      powered_by_ordering_module: enabled
    })).toBe(false)
    delete window.__CONFIG__
  })

  it('keeps branding on when white label is off for an enterprise tenant', () => {
    window.__CONFIG__ = { disable_powered_by: false }
    expect(shouldShowPoweredByForClient({
      white_label_franchise_module: disabled,
      powered_by_ordering_module: enabled,
      plan_enterprise: enabled
    })).toBe(true)
    delete window.__CONFIG__
  })

  it('hides branding when first-load features enable white label after configs drop the flag', () => {
    window.__CONFIG__ = { disable_powered_by: false }
    window.__FIRST_LOAD__ = {
      features: { white_label_franchise_module: enabled }
    }
    expect(shouldShowPoweredByForClient({
      powered_by_ordering_module: enabled
    })).toBe(false)
    delete window.__CONFIG__
    delete window.__FIRST_LOAD__
  })
})
