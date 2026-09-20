import universitiesData from './data/universities.json';
import type {
  Faculty,
  InstitutionType,
  Language,
  QueryOptions,
  SearchOptions,
  SelectOption,
  University
} from './types';

export const UNIVERSITIES: readonly University[] = Object.freeze(
  (universitiesData as any[]).map((u) =>
    Object.freeze({
      id: u.id,
      code: u.code,
      name: u.name_en,
      name_en: u.name_en,
      name_si: u.name_si,
      name_ta: u.name_ta,
      abbreviation: u.abbreviation,
      type: u.type as InstitutionType,
      ugc_recognized: Boolean(u.ugc_recognized),
      established_year: u.established_year,
      website: u.website,
      contact: Object.freeze({ ...u.contact }),
      location: Object.freeze({ ...u.location }),
      faculties: Object.freeze(
        (u.faculties || []).map((f: any) =>
          Object.freeze({
            id: f.id,
            name: f.name_en,
            name_en: f.name_en,
            name_si: f.name_si,
            name_ta: f.name_ta,
            website: f.website
          })
        )
      )
    })
  )
);

const CODE_OR_ID_MAP = new Map<string, University>();
const DISTRICT_MAP = new Map<string, University[]>();
const TYPE_MAP = new Map<string, University[]>();

for (const u of UNIVERSITIES) {
  CODE_OR_ID_MAP.set(u.code.toUpperCase(), u);
  CODE_OR_ID_MAP.set(u.id.toLowerCase(), u);
  CODE_OR_ID_MAP.set(u.abbreviation.toUpperCase(), u);
  CODE_OR_ID_MAP.set(u.name_en.toLowerCase(), u);

  const distKey = u.location.district.toLowerCase();
  if (!DISTRICT_MAP.has(distKey)) DISTRICT_MAP.set(distKey, []);
  DISTRICT_MAP.get(distKey)!.push(u);

  const typeKey = u.type.toLowerCase();
  if (!TYPE_MAP.has(typeKey)) TYPE_MAP.set(typeKey, []);
  TYPE_MAP.get(typeKey)!.push(u);
}

for (const [k, arr] of DISTRICT_MAP.entries()) {
  DISTRICT_MAP.set(k, Object.freeze(arr) as any);
}
for (const [k, arr] of TYPE_MAP.entries()) {
  TYPE_MAP.set(k, Object.freeze(arr) as any);
}

function localizeUniversity(u: University, lang?: Language): University {
  if (!lang || lang === 'en') return u;

  const locName = lang === 'si' ? u.name_si : u.name_ta;
  return {
    ...u,
    name: locName,
    faculties: u.faculties.map((f: Faculty) => ({
      ...f,
      name: lang === 'si' ? f.name_si : f.name_ta
    }))
  };
}


/**
 * Returns all universities and degree-awarding higher education institutes in Sri Lanka.
 *
 * @param options - Query options including language, institution type, and UGC filter.
 */
export function getUniversities(
  options?: QueryOptions & { type?: InstitutionType; ugc_only?: boolean }
): readonly University[] | University[] {
  let list = UNIVERSITIES;

  if (options?.type) {
    const typeKey = options.type.toLowerCase();
    list = TYPE_MAP.get(typeKey) || [];
  }

  if (options?.ugc_only) {
    list = list.filter((u) => u.ugc_recognized);
  }

  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((u) => localizeUniversity(u, lang));
}

/**
 * Finds a university by code (e.g. 'UOM'), ID ('uom'), abbreviation ('UoM'), or English name.
 *
 * @param codeOrId - Unique code, slug ID, or name.
 * @param options - Query options including language selection.
 */
export function getUniversity(codeOrId: string, options?: QueryOptions): University | undefined {
  if (!codeOrId || typeof codeOrId !== 'string') return undefined;
  const key = codeOrId.trim();
  const match =
    CODE_OR_ID_MAP.get(key.toUpperCase()) ||
    CODE_OR_ID_MAP.get(key.toLowerCase()) ||
    CODE_OR_ID_MAP.get(key);

  if (!match) return undefined;
  return localizeUniversity(match, options?.lang);
}

/**
 * Returns all universities in a given district (e.g. 'Colombo', 'Kandy', 'Gampaha').
 *
 * @param district - District name.
 * @param options - Query options including language selection.
 */
export function getUniversitiesByDistrict(
  district: string,
  options?: QueryOptions
): readonly University[] | University[] {
  if (!district || typeof district !== 'string') return [];
  const list = DISTRICT_MAP.get(district.trim().toLowerCase()) || [];

  const lang = options?.lang;
  if (!lang || lang === 'en') return list;

  return list.map((u) => localizeUniversity(u, lang));
}

/**
 * Returns all universities filtered by type ('state' | 'private' | 'defense' | etc.).
 *
 * @param type - Institution type.
 * @param options - Query options including language selection.
 */
export function getUniversitiesByType(
  type: InstitutionType,
  options?: QueryOptions
): readonly University[] | University[] {
  return getUniversities({ ...options, type });
}

/**
 * Returns all faculties for a given university.
 *
 * @param codeOrId - University code or ID.
 * @param options - Query options including language selection.
 */
export function getFaculties(codeOrId: string, options?: QueryOptions): readonly Faculty[] | Faculty[] {
  const uni = getUniversity(codeOrId, options);
  return uni?.faculties || [];
}

/**
 * Searches universities across English, Sinhala, Tamil, acronyms, and locations.
 * Uses relevance ranking to prioritize exact matches and acronyms.
 *
 * @param query - Search term.
 * @param options - Search options including limit, language, district, and type filters.
 */
export function searchUniversities(query: string, options?: SearchOptions): University[] {
  if (!query || !query.trim()) return [];
  const raw = query.trim();
  const q = raw.toLowerCase();
  const limit = options?.limit ?? 15;
  const lang = options?.lang || 'en';

  const scored: Array<{ uni: University; score: number }> = [];

  for (const u of UNIVERSITIES) {
    if (options?.type && u.type !== options.type) continue;
    if (options?.ugc_only && !u.ugc_recognized) continue;
    if (options?.district && u.location.district.toLowerCase() !== options.district.toLowerCase()) {
      continue;
    }

    let score = 0;
    const nameEn = u.name_en.toLowerCase();
    const code = u.code.toLowerCase();
    const abbr = u.abbreviation.toLowerCase();

    if (code === q || abbr === q) {
      score = 100;
    } else if (nameEn === q || u.name_si === raw || u.name_ta === raw) {
      score = 95;
    } else if (nameEn.startsWith(q) || code.startsWith(q)) {
      score = 80;
    } else if (u.name_si.startsWith(raw) || u.name_ta.startsWith(raw)) {
      score = 75;
    } else if (nameEn.includes(q)) {
      score = 50;
    } else if (u.name_si.includes(raw) || u.name_ta.includes(raw)) {
      score = 45;
    } else if (u.location.city.toLowerCase().includes(q) || u.location.district.toLowerCase().includes(q)) {
      score = 30;
    }

    if (score > 0) {
      scored.push({ uni: u, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.uni.name_en.localeCompare(b.uni.name_en));

  const results: University[] = [];
  const max = Math.min(scored.length, limit);
  for (let i = 0; i < max; i++) {
    results.push(localizeUniversity(scored[i].uni, lang));
  }

  return results;
}

/**
 * Converts array items into standard `{ label: string, value: string }` options
 * formatted for React-Select, Shadcn Combobox, MUI Select, or HTML `<select>`.
 *
 * @param items - Array of universities, faculties, or objects.
 * @param labelKey - Property key or mapper function for display text.
 * @param valueKey - Property key or mapper function for option value.
 */
export function toSelectOptions<T>(
  items: readonly T[] | T[],
  labelKey: keyof T | ((item: T) => string),
  valueKey: keyof T | ((item: T) => string)
): SelectOption[] {
  return items.map((item) => {
    const label = typeof labelKey === 'function' ? labelKey(item) : String(item[labelKey] ?? '');
    const value = typeof valueKey === 'function' ? valueKey(item) : String(item[valueKey] ?? '');
    return { label, value };
  });
}
