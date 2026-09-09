# Mission Data Generator

This program generates mission SQL and JSON data from CSV source files for the 330-event-2026 project.

## Overview

The generator processes mission data from multiple CSV files and produces:
1. **mission-data.json** - JSON list of all processed mission data
2. **mission-data.sql** - Full SQL INSERT statements for database import
3. **error-report.txt** - Log of any errors encountered during processing

## Source Files

The program requires three CSV files in the `source/` directory:

1. **330event-mission-data.csv** - Main mission data
2. **330event-location-data.csv** - Location information mapped by Location Code
3. **330event-quiz-data.csv** - Quiz questions and answers for quiz-type missions

## Features

### Location Mapping
- Automatically maps location codes from mission data to full location details
- Each location includes: brand, code, name (ZH/EN), coordinates (lat/lng), position (x/y), and max_distance

### Mission Type Support
The generator handles all mission types with specific parameter configurations:

- **photo** - Photo capture missions
- **quiz** - Quiz missions with questions and multiple choice options
- **painting** - Drawing/painting missions
- **audio** - Audio recording missions
- **walking** - Walking missions with required_distance parameter (30m)
- **reflection** - Reflection missions
- **letter** - Letter writing missions
- **matching** - Matching game missions
- **AR** - Augmented reality missions
- **tamjai** - Tamjai-specific missions
- **samgor** - Samgor-specific missions

### Smart Parameter Generation

#### For Walking Missions
```json
{
  "message_zh": "...",
  "message_en": "...",
  "required_distance": 30
}
```

#### For Quiz Missions
```json
{
  "message_zh": "...",
  "message_en": "...",
  "question_zh": "...",
  "question_en": "...",
  "options": [
    {
      "label_zh": "...",
      "label_en": "...",
      "value": "a",
      "message_zh": "...",
      "message_en": "..."
    }
  ]
}
```

#### For Other Missions
Missions of type reflection, quiz, painting, letter, matching, and audio automatically include `skip_gps: 1` in parameters.

### Slug Deduplication
If a slug appears multiple times, the generator automatically appends `-1`, `-2`, etc. to ensure uniqueness.

## Usage

### Running the Generator

**Normal Mode:**
```bash
python3 generate_mission_sql.py
```

**Debug Mode (with GPS skip):**
```bash
python3 generate_mission_sql.py --debug-gps
```

When `--debug-gps` flag is enabled, all missions will have `"skip_gps": 1` added to their parameters. This is useful for testing without requiring physical GPS location.

### Output Structure

```
tools/
├── source/
│   ├── 330event-mission-data.csv
│   ├── 330event-location-data.csv
│   └── 330event-quiz-data.csv
├── output/
│   ├── mission-data.json
│   ├── mission-data.sql
│   └── error-report.txt
└── generate_mission_sql.py
```

## Database Schema

The SQL output follows this schema:

```sql
INSERT INTO tbl_mission (
  id,
  slug,
  type,
  code,
  name_en,
  name_zh,
  description_en,
  description_zh,
  wellness_message_zh,
  wellness_message_en,
  address_zh,
  address_en,
  cover_image,
  start_time,
  end_time,
  category,
  location,
  parameter
) VALUES (...);
```

## Field Mapping

From CSV to Database:

- `Slug` → `slug` (unique, auto-incremented if duplicate)
- `Mission Type` → `type`
- `Mission Number` → `code`
- `Mission Name (En)` → `name_en`
- `Mission Name (Zh)` → `name_zh`
- `Description (En)` → `description_en`
- `Description (Zh)` → `description_zh`
- `Wellness Message (Zh)` → `wellness_message_zh`
- `Wellness Message (En)` → `wellness_message_en`
- `Mission Location` → `address_zh` / `address_en`
- `Start Date` → `start_time`
- `End Date` → `end_time`
- `Brand` → `category` (lowercase) + `cover_image` (via mapping)
- `Mission Location Code` → mapped to `location` (JSON array)
- Complete messages + type-specific data → `parameter` (JSON object)

### Cover Image Mapping

Cover images are automatically assigned based on the mission brand:

| Brand | Cover Image Path |
|-------|-----------------|
| MTR | `/assets/images/mission-cover/mtr.svg` |
| MTR Mall | `/assets/images/mission-cover/mtr.svg` |
| 牧羊少年 | `/assets/images/mission-cover/thealchemistcafe.svg` |
| 誠品 | `/assets/images/mission-cover/eslite.svg` |
| Cafe330 | `/assets/images/mission-cover/cafe330.svg` |
| 譚仔 | `/assets/images/mission-cover/tamjai.svg` |
| 三哥 | `/assets/images/mission-cover/samgor.svg` |

If a brand is not found in the mapping, `cover_image` will be set to `NULL`.

## Error Handling

The generator tracks and reports:
- Missing location codes
- Missing quiz data for quiz-type missions
- Date formatting issues
- CSV parsing errors

All errors are logged to `output/error-report.txt` with detailed descriptions.

## Example Output

### JSON Format
```json
{
  "id": 1,
  "slug": "flowing-colours",
  "type": "photo",
  "code": "V1",
  "name_en": "Flowing Colours",
  "name_zh": "流動​中​的​色塊​",
  ...
  "location": [
    {
      "brand": "MTR",
      "code": "knt",
      "name_zh": "堅尼地城",
      "name_en": "Kennedy Town",
      "max_distance": 200.0,
      "lat": 22.28124591004056,
      "lng": 114.12888386370224,
      "x": 52.57,
      "y": 63.96
    }
  ],
  "parameter": {
    "message_zh": "...",
    "message_en": "..."
  }
}
```

### SQL Format
```sql
INSERT INTO tbl_mission (...) VALUES
(1, 'flowing-colours', 'photo', 'V1', ...);
```

## Requirements

- Python 3.6 or higher
- Standard library only (no external dependencies)

## Command Line Options

- `--debug-gps` or `--debug_gps`: Enable debug mode to add `skip_gps: 1` to all mission parameters

## Notes

- All strings are properly escaped for SQL insertion
- Date formats are converted to `YYYY-MM-DD HH:MM:SS`
- `cover_image` is determined by brand mapping (see Field Mapping section)
- Location JSON arrays are properly formatted
- Parameter JSON objects are properly formatted with appropriate type-specific fields
- In debug mode (`--debug-gps`), all missions will have `skip_gps: 1` added regardless of mission type
