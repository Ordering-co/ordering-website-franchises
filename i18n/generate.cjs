#!/usr/bin/env node
/* i18n generator.
 * Scans src/ (app + submodule) for t('KEY', 'fallback') and emits:
 *   - translations.json  : multi-locale catalog (SoT; merges existing locales)
 *   - lang_keys.csv      : key,value,source,note (legacy DB-import artifact)
 *   - lang_keys_conflicts.csv
 *   - typo_findings.txt
 */
'use strict'

const fs = require('fs')
const path = require('path')
const { scanKeys } = require('./scanKeys.cjs')
const { loadConfig } = require('./loadConfig.cjs')

const OUT = process.argv[2] || __dirname
fs.mkdirSync(OUT, { recursive: true })

const config = loadConfig()
const { rows, keys, filesScanned, totalCalls, dynamicSkipped } = scanKeys()

// --- translations.json (multi-locale SoT) ---
const catalogPath = config.catalogPath
let existing = {}
if (fs.existsSync(catalogPath)) {
  existing = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
}

const sourceLang = config.sourceLanguage
const locales = config.supportedLocales
const catalog = {}

for (const r of rows) {
  const prev = existing[r.key] && typeof existing[r.key] === 'object' ? existing[r.key] : {}
  const entry = { ...prev }
  // English (source) always refreshed from code scan when a static value exists
  if (r.value) {
    entry[sourceLang] = r.value
  } else if (prev[sourceLang]) {
    entry[sourceLang] = prev[sourceLang]
  } else {
    entry[sourceLang] = ''
  }
  for (const loc of locales) {
    if (entry[loc] == null) entry[loc] = prev[loc] != null ? prev[loc] : ''
  }
  catalog[r.key] = entry
}

const sortedCatalog = {}
for (const key of Object.keys(catalog).sort((a, b) => a.localeCompare(b))) {
  sortedCatalog[key] = catalog[key]
}
fs.writeFileSync(catalogPath, JSON.stringify(sortedCatalog, null, 2) + '\n')

// --- CSV (legacy) ---
const esc = s => '"' + String(s).replace(/"/g, '""') + '"'
const csv = ['key,value,source,note']
for (const r of rows) {
  csv.push([esc(r.key), esc(r.value), esc(r.source), esc(r.note)].join(','))
}
fs.writeFileSync(path.join(OUT, 'lang_keys.csv'), csv.join('\n') + '\n')

const conf = ['key,value,app_uses,submodule_uses']
for (const [key, e] of keys) {
  if (e.values.size > 1) {
    for (const [v, c] of e.values) {
      conf.push([esc(key), esc(v), c.app, c.sub].join(','))
    }
  }
}
fs.writeFileSync(path.join(OUT, 'lang_keys_conflicts.csv'), conf.join('\n') + '\n')

const MISSPELL = [
  'recieve', 'occured', 'occurence', 'seperate', 'definately', 'adress', 'addres\\b',
  'succesful', 'successfull', 'sucessful', 'accross', 'aquire', 'avaliable', 'availabe',
  'begining', 'beleive', 'calender', 'cancelation', 'cant\\b', 'comming', 'commited',
  'completly', 'choosen', 'concious', 'definate', 'dissapear', 'dont\\b', 'embarass',
  'enviroment', 'existance', 'foward', 'goverment', 'happend', 'harrass', 'independant',
  'indispensible', 'knowlege', 'lenght', 'maintainance', 'mispell', 'neccessary',
  'necesary', 'noticable', 'occassion', 'paymet', 'persistant', 'posession', 'prefered',
  'priviledge', 'quanity', 'questionaire', 'recomend', 'refered', 'refering', 'relevent',
  'reciept', 'rythm', 'succesfully', 'tommorow', 'truely', 'untill', 'usefull', 'wich\\b',
  'withing', 'writting', 'youre\\b', 'doesnt', 'wont\\b', 'we\'ll sent', 'has been sent',
  'pelase', 'plase', 'agin', 'amout', 'avilable', 'lenght', 'minumum', 'maxinum',
  'sucess', 'erro\\b', 'porfile', 'profle', 'shiping', 'delievery', 'deliever', 'adddress',
  'cofirm', 'confrim', 'cusomter', 'custmer', 'orderr', 'totaly', 'aplied', 'aplly',
  'addrress', 'serach', 'seach\\b', 'selct', 'invlaid', 'requried', 'reqired', 'paswword',
  'emial', 'phon\\b', 'numer\\b', 'verfiy', 'verfication', 'succesfuly'
]
const reMis = new RegExp('\\b(' + MISSPELL.join('|') + ')', 'i')
const typoLines = []
const seen = new Set()
for (const [key, e] of keys) {
  for (const v of e.values.keys()) {
    const k = key + '||' + v
    if (seen.has(k)) continue
    seen.add(k)
    if (reMis.test(v)) typoLines.push(`${key}\t${v}`)
  }
}
fs.writeFileSync(
  path.join(OUT, 'typo_findings.txt'),
  (typoLines.length ? typoLines.join('\n') : '(no curated-misspelling hits)') + '\n'
)

const missingLocaleSlots = rows.reduce((n, r) => {
  const entry = sortedCatalog[r.key] || {}
  return n + locales.filter(loc => !entry[loc] || !String(entry[loc]).trim()).length
}, 0)

console.log('files scanned:', filesScanned)
console.log('total t() calls (string key, non-dynamic):', totalCalls)
console.log('dynamic-prefix calls skipped:', dynamicSkipped)
console.log('unique keys (scanned):', keys.size)
console.log('rows in export (incl. added dynamic):', rows.length)
console.log('catalog written:', path.relative(process.cwd(), catalogPath))
console.log('supportedLocales from config:', locales.join(', '))
console.log('empty locale slots remaining (fill via translate-keys skill):', missingLocaleSlots)
console.log('keys w/ no code fallback (value supplied):', rows.filter(r => r.note.startsWith('no_fallback_in_code')).length)
console.log('keys w/ empty export value:', rows.filter(r => !r.value).length)
console.log(
  'source breakdown -> app:', rows.filter(r => r.source === 'app').length,
  '| submodule:', rows.filter(r => r.source === 'submodule').length,
  '| both:', rows.filter(r => r.source === 'both').length
)
console.log('conflicting keys:', [...keys.values()].filter(e => e.values.size > 1).length)
console.log('curated typo hits:', typoLines.length)
