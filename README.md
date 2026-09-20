# 🎓 edu-sl

> Trilingual (**English**, **සිංහල**, **தமிழ்**) Sri Lanka universities, higher education institutes, and faculties dataset for TypeScript & JavaScript with zero runtime dependencies.

[![CI](https://github.com/mahesh-abeykoon/edu-sl/actions/workflows/ci.yml/badge.svg)](https://github.com/mahesh-abeykoon/edu-sl/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)]()
[![Trilingual](https://img.shields.io/badge/languages-EN%20%7C%20SI%20%7C%20TA-orange)]()


---

## 🏛️ Comprehensive Higher Education Coverage

`edu-sl` provides complete, authoritative, and verified data on Sri Lankan universities and higher education institutions:

* **All 17 UGC State Universities**: Complete official universities under the University Grants Commission (Colombo, Peradeniya, Moratuwa, Kelaniya, Sri Jayewardenepura, Ruhuna, Jaffna, Rajarata, Wayamba, Sabaragamuwa, Eastern, South Eastern, Uva Wellassa, Open University, UVPA, GWUIM, Vavuniya).
* **Accredited Non-State / Private Degree Awarding Institutes**: SLIIT, NSBM, KDU, Horizon, CINEC, SLTC, APIIT, etc.
* **Faculty Breakdowns**: Individual faculties for each institution with trilingual translations.
* **Trilingual First-Class Support**: Lookups in **English**, **Sinhala (සිංහල)**, and **Tamil (தமிழ்)**.
* **Geographic Alignment**: District, city, and postal codes aligned with [`geo-sl`](https://github.com/Mahesh-Abeykoon/geo-sl).
* **Zero Runtime Dependencies**: Pure, pre-indexed TypeScript with instant O(1) lookups.

---

## 📦 Installation

```bash
npm install edu-sl
# or
pnpm add edu-sl
# or
yarn add edu-sl
```

---

## ⚡ Quick Start

```typescript
import {
  getUniversities,
  getUniversity,
  getUniversitiesByDistrict,
  getFaculties,
  searchUniversities,
  toSelectOptions
} from 'edu-sl';

// 1. Get all universities
const all = getUniversities();

// 2. Find by Code, Abbreviation, or Slug ID
const uom = getUniversity('UOM');
console.log(uom?.name_en); // "University of Moratuwa"
console.log(uom?.name_si); // "මොරටුව විශ්වවිද්‍යාලය"
console.log(uom?.name_ta); // "மொறட்டுவ பல்கலைக்கழகம்"

// 3. Trilingual Localization
const uocSi = getUniversity('UOC', { lang: 'si' });
console.log(uocSi?.name); // "කොළඹ විශ්වවිද්‍යාලය"

// 4. Get Faculties for a University
const faculties = getFaculties('UOM');
console.log(faculties.map((f) => f.name_en));
// => ["Faculty of Architecture", "Faculty of Business", "Faculty of Engineering", "Faculty of Information Technology", ...]

// 5. Filter by District
const kandyUnis = getUniversitiesByDistrict('Kandy'); // University of Peradeniya

// 6. Trilingual Relevance Search
searchUniversities('Moratuwa'); // => [University of Moratuwa]
searchUniversities('පේරාදෙණිය');  // => [University of Peradeniya]
searchUniversities('KDU');        // => [Kotelawala Defence University]
```

---

## 🎨 React / Next.js Dropdown Form Example

Easily build cascading University ➔ Faculty selectors using `toSelectOptions()`:

```tsx
import React, { useState } from 'react';
import { getUniversities, getFaculties, toSelectOptions } from 'edu-sl';

export function UniversitySelectForm() {
  const [selectedUniCode, setSelectedUniCode] = useState('UOM');
  const [selectedFacultyId, setSelectedFacultyId] = useState('');

  const universities = toSelectOptions(getUniversities(), 'name', 'code');
  const faculties = toSelectOptions(getFaculties(selectedUniCode), 'name', 'id');

  return (
    <div className="space-y-4">
      {/* University Dropdown */}
      <select
        value={selectedUniCode}
        onChange={(e) => {
          setSelectedUniCode(e.target.value);
          setSelectedFacultyId('');
        }}
      >
        {universities.map((u) => (
          <option key={u.value} value={u.value}>{u.label}</option>
        ))}
      </select>

      {/* Faculty Dropdown */}
      <select
        value={selectedFacultyId}
        onChange={(e) => setSelectedFacultyId(e.target.value)}
      >
        <option value="">Select Faculty...</option>
        {faculties.map((f) => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>
    </div>
  );
}
```

---

## 🤝 Contributing & Adding Universities

`edu-sl` is an open-source project that welcomes community contributions!

If you want to add a university, campus, new faculty, or update official contacts:
1. Fork the repository on GitHub.
2. Review our [Contribution Guide (CONTRIBUTING.md)](./CONTRIBUTING.md) for full field specifications and schema template.
3. Edit [`src/data/universities.json`](./src/data/universities.json).
4. Run `npm test` to verify your changes.
5. Submit a Pull Request!


---

## 📄 License

MIT © [Mahesh Abeykoon](https://github.com/Mahesh-Abeykoon)
