import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
// Current release includes the commercial edits from September 19–20.
// Historical snapshots remain immutable and available through --historical.
const historical = process.argv.includes('--historical');
const script = fileURLToPath(new URL(historical ? './seo_baseline.py' : './validate-ux-cro.py', import.meta.url));
const result = spawnSync(process.platform === 'win32' ? 'python' : 'python3', historical ? [script, 'check'] : [script], { stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
