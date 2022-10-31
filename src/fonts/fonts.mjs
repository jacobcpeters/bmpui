import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export { bitocra, bitocra7, HaxorMedium };

const bitocra = await readFile(resolve(__dirname, './bitocra.bdf'), {encoding: 'ascii'});
const bitocra7 = await readFile(resolve(__dirname, './bitocra7.bdf'), {encoding: 'ascii'});
const HaxorMedium = await readFile(resolve(__dirname, './HaxorMedium-10.bdf'), {encoding: 'ascii'});
