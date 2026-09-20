import { describe, it, expect } from 'vitest';
import {
  UNIVERSITIES,
  getUniversities,
  getUniversity,
  getUniversitiesByDistrict,
  getUniversitiesByType,
  getFaculties,
  searchUniversities,
  toSelectOptions,
  getDistricts,
  getInstitutionTypes
} from '../src/index';

describe('edu-sl: Universities & Higher Education Dataset', () => {
  it('should load all initial universities and institutes', () => {
    const all = getUniversities();
    expect(all.length).toBeGreaterThanOrEqual(20);
  });

  it('should contain all 17 UGC state universities', () => {
    const stateUnis = getUniversitiesByType('state');
    expect(stateUnis.length).toBeGreaterThanOrEqual(17);
    expect(stateUnis.every((u) => u.ugc_recognized)).toBe(true);

    const codes = stateUnis.map((u) => u.code);
    expect(codes).toContain('UOC');
    expect(codes).toContain('UOP');
    expect(codes).toContain('UOM');
    expect(codes).toContain('UOK');
    expect(codes).toContain('USJ');
    expect(codes).toContain('UOR');
    expect(codes).toContain('UOJ');
    expect(codes).toContain('RUSL');
    expect(codes).toContain('SUSL');
    expect(codes).toContain('WUSL');
    expect(codes).toContain('UWU');
    expect(codes).toContain('OUSL');
    expect(codes).toContain('EUSL');
    expect(codes).toContain('SEUSL');
    expect(codes).toContain('UVPA');
    expect(codes).toContain('GWUIM');
    expect(codes).toContain('UOV');
  });

  it('should find university by code, abbreviation, or slug ID', () => {
    const uom = getUniversity('UOM');
    expect(uom).toBeDefined();
    expect(uom?.name_en).toBe('University of Moratuwa');

    const uop = getUniversity('UoP');
    expect(uop).toBeDefined();
    expect(uop?.name_en).toBe('University of Peradeniya');

    const uoc = getUniversity('uoc');
    expect(uoc).toBeDefined();
    expect(uoc?.name_en).toBe('University of Colombo');
  });

  it('should support trilingual localization for universities and faculties', () => {
    const uomSi = getUniversity('UOM', { lang: 'si' });
    expect(uomSi?.name).toBe('මොරටුව විශ්වවිද්‍යාලය');
    expect(uomSi?.faculties[0].name).toBe('ගෘහ නිර්මාණ ශිල්ප පීඨය');

    const uocTa = getUniversity('UOC', { lang: 'ta' });
    expect(uocTa?.name).toBe('கொழும்பு பல்கலைக்கழகம்');
    expect(uocTa?.faculties[0].name).toBe('கலை பீடம்');
  });

  it('should filter universities by district', () => {
    const kandyUnis = getUniversitiesByDistrict('Kandy');
    expect(kandyUnis.length).toBeGreaterThanOrEqual(1);
    expect(kandyUnis.some((u) => u.code === 'UOP')).toBe(true);

    const colomboUnis = getUniversitiesByDistrict('Colombo');
    expect(colomboUnis.length).toBeGreaterThanOrEqual(4);
    expect(colomboUnis.some((u) => u.code === 'UOC')).toBe(true);
    expect(colomboUnis.some((u) => u.code === 'UOM')).toBe(true);
  });

  it('should retrieve faculties for a given university', () => {
    const faculties = getFaculties('UOM');
    expect(faculties.length).toBeGreaterThanOrEqual(5);
    const facultyNames = faculties.map((f) => f.name_en);
    expect(facultyNames).toContain('Faculty of Engineering');
    expect(facultyNames).toContain('Faculty of Information Technology');
  });

  it('should perform relevance search across English, Sinhala, Tamil, and acronyms', () => {
    const enSearch = searchUniversities('Moratuwa');
    expect(enSearch.length).toBeGreaterThan(0);
    expect(enSearch[0].code).toBe('UOM');

    const siSearch = searchUniversities('පේරාදෙණිය');
    expect(siSearch.length).toBeGreaterThan(0);
    expect(siSearch[0].code).toBe('UOP');

    const taSearch = searchUniversities('கொழும்பு');
    expect(taSearch.length).toBeGreaterThan(0);
    expect(taSearch[0].code).toBe('UOC');

    const codeSearch = searchUniversities('KDU');
    expect(codeSearch.length).toBeGreaterThan(0);
    expect(codeSearch[0].code).toBe('KDU');
  });

  it('should format dropdown options with toSelectOptions helper', () => {
    const unis = getUniversities();
    const options = toSelectOptions(unis, 'name', 'code');
    expect(options.length).toBeGreaterThanOrEqual(20);
    expect(options[0]).toHaveProperty('label');
    expect(options[0]).toHaveProperty('value');

    const faculties = getFaculties('UOM');
    const facultyOptions = toSelectOptions(faculties, 'name', 'id');
    expect(facultyOptions.length).toBeGreaterThanOrEqual(5);
  });

  it('should list all institution types and available districts', () => {
    const types = getInstitutionTypes();
    expect(types).toContain('state');
    expect(types).toContain('private');
    expect(types).toContain('defense');

    const districts = getDistricts();
    expect(districts.length).toBeGreaterThan(5);
    expect(districts).toContain('Colombo');
    expect(districts).toContain('Kandy');
    expect(districts).toContain('Matara');
  });
});
