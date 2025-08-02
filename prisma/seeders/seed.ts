import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();
const THIS_FILE = path.basename(__filename);

// Get all .ts or .js files except this file, sorted
const files = fs
    .readdirSync(__dirname)
    .filter(
        (file) =>
            (file.endsWith('.ts') || file.endsWith('.js')) &&
            file !== THIS_FILE,
    )
    .sort();

async function hasRun(file: string): Promise<boolean> {
    const record = await prisma.seedHistory.findUnique({
        where: { name: file },
    });
    return Boolean(record);
}

async function markAsRun(file: string): Promise<void> {
    await prisma.seedHistory.create({ data: { name: file } });
}

async function unmarkAsRun(file: string): Promise<void> {
    await prisma.seedHistory.deleteMany({ where: { name: file } });
}

async function executeSeedFiles(
    files: string[],
    action: 'up' | 'down',
): Promise<void> {
    for (const file of files) {
        const alreadyRan = await hasRun(file);

        if (action === 'up' && alreadyRan) {
            console.log(`Skipping ${file} (already run)`);
            continue;
        }
        if (action === 'down' && !alreadyRan) {
            console.log(`Skipping ${file} (not previously run)`);
            continue;
        }

        const fullPath = path.join(__dirname, file);
        const mod = await import(fullPath);

        if (typeof mod[action] === 'function') {
            console.log(`Running ${action} on ${file}`);
            await mod[action]();

            if (action === 'up') {
                await markAsRun(file);
            } else if (action === 'down') {
                await unmarkAsRun(file);
            }
        } else {
            console.warn(`No "${action}" export found in ${file}`);
        }
    }
}

const direction = process.argv[2] as 'up' | 'down' | undefined;

if (!direction || !['up', 'down'].includes(direction)) {
    console.error('Usage: seed.ts [up|down]');
    process.exit(1);
}

executeSeedFiles(files, direction)
    .then(() => {
        console.log(`✅ Seed ${direction} complete`);
        process.exit(0);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
