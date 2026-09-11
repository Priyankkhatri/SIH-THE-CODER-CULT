import { PLACES_DATA, HERITAGE_RECORDS, SOURCES_DATA, ARTIFACTS_DATA } from '../seed/data';
import { v4 as uuidv4 } from 'uuid';

const users = new Map<string, any>();
const preferences = new Map<string, any>();
const itineraries = new Map<string, any>();

// Helper to assemble full heritage record with relation
function getHeritageRecord(record: any, include?: any) {
  if (!record) return null;
  const clone = { ...record, id: record.id || record.placeId };
  if (include?.sources) {
    clone.sources = SOURCES_DATA.filter((s: any) => s.heritageId === record.placeId || s.heritageId === clone.id);
  }
  if (include?.place) {
    const p = PLACES_DATA.find((p: any) => p.id === record.placeId);
    if (p && typeof include.place === 'object' && include.place.select) {
      const selected: any = {};
      for (const k of Object.keys(include.place.select)) {
        selected[k] = (p as any)[k];
      }
      clone.place = selected;
    } else {
      clone.place = p || null;
    }
  }
  return clone;
}

// Helper to assemble place with relation
function getPlace(place: any, include?: any) {
  if (!place) return null;
  const clone = { ...place };
  if (include?.heritageRecord) {
    const hr = HERITAGE_RECORDS.find((r: any) => r.placeId === place.id);
    if (hr) {
      if (typeof include.heritageRecord === 'object' && include.heritageRecord.select) {
        const selected: any = {};
        for (const k of Object.keys(include.heritageRecord.select)) {
          selected[k] = (hr as any)[k];
        }
        clone.heritageRecord = selected;
      } else {
        clone.heritageRecord = getHeritageRecord(hr, include.heritageRecord?.include);
      }
    } else {
      clone.heritageRecord = null;
    }
  }
  if (include?.artifacts) {
    clone.artifacts = ARTIFACTS_DATA.filter((a: any) => a.placeId === place.id);
  }
  return clone;
}

export const inMemoryDb: any = {
  $connect: async () => true,
  $disconnect: async () => true,

  user: {
    create: async ({ data }: any) => {
      const u = { ...data, id: data.id || uuidv4(), createdAt: new Date(), updatedAt: new Date() };
      users.set(u.id, u);
      return u;
    },
    update: async ({ where, data }: any) => {
      const u = users.get(where.id);
      if (u) {
        Object.assign(u, data, { updatedAt: new Date() });
      }
      return u;
    },
    findUnique: async ({ where }: any) => users.get(where.id) || null,
  },

  preference: {
    upsert: async ({ where, update, create }: any) => {
      const existing = preferences.get(where.userId);
      if (existing) {
        Object.assign(existing, update);
        return existing;
      }
      const pref = { ...create, id: uuidv4() };
      preferences.set(where.userId, pref);
      return pref;
    },
  },

  place: {
    findMany: async (args?: any) => {
      let result = PLACES_DATA.map((p: any) => getPlace(p, args?.include));
      if (args?.where?.category) {
        result = result.filter((p: any) => p.category === args.where.category);
      }
      if (args?.distinct?.includes('category')) {
        const seen = new Set();
        const uniqueCat: any[] = [];
        for (const p of PLACES_DATA) {
          if (!seen.has(p.category)) {
            seen.add(p.category);
            uniqueCat.push({ category: p.category });
          }
        }
        return uniqueCat;
      }
      return result;
    },
    findUnique: async (args: any) => {
      const p = PLACES_DATA.find((x: any) => x.id === args.where.id);
      return p ? getPlace(p, args.include) : null;
    },
  },

  heritageRecord: {
    findMany: async (args?: any) => {
      let records = HERITAGE_RECORDS.map((r: any) => getHeritageRecord(r, args?.include));
      if (args?.take) {
        records = records.slice(0, args.take);
      }
      return records;
    },
    findUnique: async (args: any) => {
      const r = HERITAGE_RECORDS.find((x: any) => x.placeId === args.where.placeId);
      return r ? getHeritageRecord(r, args.include) : null;
    },
  },

  source: {
    findMany: async (args?: any) => {
      if (args?.where?.heritageId) {
        return SOURCES_DATA.filter((s: any) => s.heritageId === args.where.heritageId);
      }
      return SOURCES_DATA;
    },
  },

  artifact: {
    findMany: async (args?: any) => {
      if (args?.where?.placeId) {
        return ARTIFACTS_DATA.filter((a: any) => a.placeId === args.where.placeId);
      }
      return ARTIFACTS_DATA;
    },
    findFirst: async (args?: any) => {
      let match = ARTIFACTS_DATA[0];
      if (args?.where?.visionLabel?.contains) {
        const q = args.where.visionLabel.contains.toLowerCase();
        const found = ARTIFACTS_DATA.find((a: any) => a.visionLabel?.toLowerCase().includes(q));
        if (found) match = found;
      }
      if (!match) return null;
      const clone: any = { ...match };
      if (args?.include?.place) {
        const p = PLACES_DATA.find((p: any) => p.id === match.placeId);
        if (p) {
          const pClone: any = { ...p };
          if (args.include.place.include?.heritageRecord) {
            const hr = HERITAGE_RECORDS.find((r: any) => r.placeId === p.id);
            pClone.heritageRecord = hr ? { shortStory: hr.shortStory, significance: hr.significance } : null;
          }
          clone.place = pClone;
        }
      }
      return clone;
    },
  },

  itinerary: {
    create: async ({ data, include }: any) => {
      const items = (data.items?.create || []).map((item: any, idx: number) => ({
        ...item,
        id: uuidv4(),
        order: item.order ?? idx,
      }));
      const itin = {
        ...data,
        id: uuidv4(),
        createdAt: new Date(),
        items,
      };
      itineraries.set(itin.id, itin);
      return itin;
    },
    findMany: async (args?: any) => {
      const list = Array.from(itineraries.values());
      if (args?.where?.userId) {
        return list.filter((i: any) => i.userId === args.where.userId);
      }
      return list;
    },
  },
};
