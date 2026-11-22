#!/usr/bin/env node
// Thin CLI wrapper. Forwards argv to scripts/generate.mjs.
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const gen  = resolve(here, '..', 'scripts', 'generate.mjs')

const child = spawn(process.execPath, [gen, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: process.cwd(),
})
child.on('exit', (code) => process.exit(code ?? 0))
