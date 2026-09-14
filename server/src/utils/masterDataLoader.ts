import path from 'path';
import fs from 'fs';

let cachedPlaces: any[] | null = null;

export function loadMasterUnifiedPlaces(): any[] {
  if (cachedPlaces && cachedPlaces.length > 0) {
    return cachedPlaces;
  }

  const candidatePaths = [
    path.resolve(__dirname, '../../seed/master_unified_places.json'),
    path.resolve(__dirname, '../../../src/seed/master_unified_places.json'),
    path.resolve(__dirname, '../../src/seed/master_unified_places.json'),
    path.resolve(process.cwd(), 'server/src/seed/master_unified_places.json'),
    path.resolve(process.cwd(), 'src/seed/master_unified_places.json'),
    path.resolve(process.cwd(), 'server/dist/seed/master_unified_places.json'),
    path.resolve(process.cwd(), 'dist/seed/master_unified_places.json'),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8');
        cachedPlaces = JSON.parse(raw);
        console.log(`[MasterDataLoader] Successfully loaded ${cachedPlaces?.length} monuments from ${p}`);
        return cachedPlaces || [];
      } catch (err) {
        console.warn(`[MasterDataLoader] Failed to parse ${p}:`, err);
      }
    }
  }

  console.warn('[MasterDataLoader] Warning: Could not locate master_unified_places.json in any expected path');
  return [];
}
