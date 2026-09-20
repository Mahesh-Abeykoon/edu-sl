# Contributing to edu-sl

Thank you for your interest in contributing to **`edu-sl`**! This project aims to provide the most complete, accurate, and authoritative trilingual dataset of Sri Lankan universities, higher education institutes, and faculties.

Whether you are adding a missing institution, adding new faculties, updating contact details, or fixing translations, your contributions are warmly welcome.

---

## Table of Contents
- [Development Setup](#development-setup)
- [How to Add or Update an Institution](#how-to-add-or-update-an-institution)
- [JSON Schema Template](#json-schema-template)
- [Field Specifications](#field-specifications)
- [Testing & Quality Verification](#testing--quality-verification)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code of Conduct](#code-of-conduct)

---

## Development Setup

1. **Fork the Repository**
   Click the **Fork** button at the top right of the [edu-sl repository](https://github.com/mahesh-abeykoon/edu-sl).

2. **Clone your fork locally**
   ```bash
   git clone https://github.com/<your-username>/edu-sl.git
   cd edu-sl
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create a new feature branch**
   ```bash
   git checkout -b add-institution-name
   ```

---

## How to Add or Update an Institution

All university and institute records are stored in:
```
src/data/universities.json
```

1. Open `src/data/universities.json`.
2. To add a new university or institute, append a new object to the JSON array (or insert it alphabetically or logically).
3. Ensure all trilingual strings (**English**, **Sinhala**, and **Tamil**) are accurately spelled.
4. Verify the details against official sources:
   - [University Grants Commission (UGC) Sri Lanka](https://www.ugc.ac.lk/)
   - Ministry of Education / Higher Education Division
   - Official institutional websites

---

## JSON Schema Template

Copy and paste this template when adding an institution:

```json
{
  "id": "usj",
  "code": "USJ",
  "name_en": "University of Sri Jayewardenepura",
  "name_si": "ශ්‍රී ජයවර්ධනපුර විශ්වවිද්‍යාලය",
  "name_ta": "ஸ்ரீ ஜயவர்த்தனபுர பல்கலைக்கழகம்",
  "abbreviation": "USJ",
  "type": "state",
  "ugc_recognized": true,
  "established_year": 1958,
  "website": "https://www.sjp.ac.lk",
  "contact": {
    "phone": "+94 11 280 2022",
    "email": "info@sjp.ac.lk"
  },
  "location": {
    "district": "Colombo",
    "city": "Nugegoda",
    "postal_code": "10250",
    "address": "Gangodawila, Nugegoda 10250",
    "latitude": 6.8529,
    "longitude": 79.9038
  },
  "faculties": [
    {
      "id": "applied-sciences",
      "name_en": "Faculty of Applied Sciences",
      "name_si": "ව්‍යවහාරික විද්‍යා පීඨය",
      "name_ta": "பிரயோக விஞ்ஞான பீடம்"
    },
    {
      "id": "engineering",
      "name_en": "Faculty of Engineering",
      "name_si": "ඉංජිනේරු පීඨය",
      "name_ta": "பொறியியல் பீடம்"
    },
    {
      "id": "management",
      "name_en": "Faculty of Management Studies & Commerce",
      "name_si": "කළමනාකරණ අධ්‍යයන හා වාණිජ විද්‍යා පීඨය",
      "name_ta": "முகாமைத்துவக் கற்கைகள் மற்றும் வர்த்தக பீடம்"
    },
    {
      "id": "humanities",
      "name_en": "Faculty of Humanities & Social Sciences",
      "name_si": "මානව ශාස්ත්‍ර හා සමාජයීය විද්‍යා පීඨය",
      "name_ta": "மானிடவியல் மற்றும் சமூக விஞ்ஞான பீடம்"
    }
  ]
}
```

---

## Field Specifications

| Field | Type | Description | Allowed / Example Values |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Unique lowercase slug | `"usj"`, `"uoc"`, `"sliit"` |
| `code` | `string` | Official uppercase acronym | `"USJ"`, `"UOC"`, `"SLIIT"` |
| `name_en` | `string` | Official name in English | `"University of Sri Jayewardenepura"` |
| `name_si` | `string` | Official name in Sinhala (සිංහල) | `"ශ්‍රී ජයවර්ධනපුර විශ්වවිද්‍යාලය"` |
| `name_ta` | `string` | Official name in Tamil (தமிழ்) | `"ஸ்ரீ ஜயவர்த்தனபுர பல்கலைக்கழகம்"` |
| `abbreviation` | `string` | Familiar short form / abbreviation | `"USJ"`, `"UoC"`, `"UoP"` |
| `type` | `string` | Classification category | `'state'`, `'private'`, `'defense'`, `'semi-government'`, `'postgraduate'`, `'vocational'` |
| `ugc_recognized` | `boolean` | Recognized or approved by UGC Sri Lanka | `true` or `false` |
| `established_year` | `number` | Year of founding | `1921` |
| `website` | `string` | Official website URL | `"https://cmb.ac.lk"` |
| `contact.phone` | `string` | Primary contact telephone (E.164 format preferred) | `"+94 11 258 1835"` |
| `contact.email` | `string` | Official inquiries email address | `"info@cmb.ac.lk"` |
| `location.district` | `string` | Sri Lankan district name matching standard geographic spelling | `"Colombo"`, `"Kandy"`, `"Gampaha"` |
| `location.city` | `string` | Town / City name | `"Colombo 3"`, `"Peradeniya"`, `"Malabe"` |
| `location.postal_code` | `string` | 5-digit Sri Lanka postal code | `"00300"`, `"20400"`, `"10115"` |
| `location.address` | `string` | Official street / postal address | `"94 Cumaratunga Munidasa Mawatha, Colombo 00300"` |
| `location.latitude` | `number \| null` | Geographic coordinate latitude | `6.9000` |
| `location.longitude` | `number \| null` | Geographic coordinate longitude | `79.8588` |
| `faculties` | `Faculty[]` | Array of faculty / school objects with `id`, `name_en`, `name_si`, `name_ta` | See schema template above |

---

## Testing & Quality Verification

Before committing your changes, always test locally:

1. **Run unit tests**:
   ```bash
   npm test
   ```
   This validates that all JSON entries conform to types, no duplicate keys exist, and query helper functions work properly.

2. **Verify the TypeScript build**:
   ```bash
   npm run build
   ```
   Ensures type definitions (`.d.ts`), CommonJS, and ES module builds succeed without warnings or errors.

---

## Submitting a Pull Request

1. Commit your changes with a clear, conventional commit message:
   ```bash
   git add src/data/universities.json
   git commit -m "feat(data): add SLIIT campus and faculties"
   ```
2. Push your branch to GitHub:
   ```bash
   git push origin add-institution-name
   ```
3. Open a Pull Request on GitHub against the `main` branch.
4. Complete the Pull Request checklist provided in the template.
5. GitHub Actions CI will automatically run tests against Node 18, 20, and 22. Ensure all checks pass!

---

## Code of Conduct

We are committed to providing a welcoming, diverse, and harassment-free environment for everyone. Please treat all contributors and maintainers with respect.
