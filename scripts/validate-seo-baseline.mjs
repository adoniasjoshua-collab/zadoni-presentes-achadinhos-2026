import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const script = fileURLToPath(new URL('./seo_baseline.py', import.meta.url));
const result = spawnSync(process.platform === 'win32' ? 'python' : 'python3', [script, 'check'], { stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
