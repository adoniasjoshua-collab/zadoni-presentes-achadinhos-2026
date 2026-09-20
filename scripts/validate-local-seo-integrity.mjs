import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

execFileSync(process.platform === 'win32' ? 'python' : 'python3',
  [fileURLToPath(new URL('./validate-local-seo-integrity.py', import.meta.url))],
  { stdio: 'inherit' });
