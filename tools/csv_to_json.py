#!/usr/bin/env python3
"""
Reverse of json_to_csv.py
Read messages.csv and write updates back to en.json and zh-HK.json.
Dot-notation keys (e.g. layout.login, mission.tamjai.view_branches) are
expanded back into nested dicts, preserving any existing structure.
"""

import json
import csv
import os

BASE_DIR = os.path.join(os.path.dirname(__file__), '..', 'web', 'messages')
EN_FILE = os.path.join(BASE_DIR, 'en.json')
ZH_FILE = os.path.join(BASE_DIR, 'zh-HK.json')
CSV_FILE = os.path.join(os.path.dirname(__file__), 'output', 'messages.csv')


def set_nested(obj, key_parts, value):
    """Set a value in a nested dict using a list of key parts."""
    for part in key_parts[:-1]:
        if part not in obj or not isinstance(obj[part], dict):
            obj[part] = {}
        obj = obj[part]
    obj[key_parts[-1]] = value


def load_json(path):
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    return {}


def save_json(path, data):
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'Written: {path}')


def main():
    if not os.path.exists(CSV_FILE):
        print(f'CSV file not found: {CSV_FILE}')
        return

    en_data = load_json(EN_FILE)
    zh_data = load_json(ZH_FILE)

    updated = 0
    with open(CSV_FILE, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            key = row.get('key', '').strip()
            en_val = row.get('en', '')
            zh_val = row.get('zh-hk', '')

            if not key:
                continue

            parts = key.split('.')
            set_nested(en_data, parts, en_val)
            set_nested(zh_data, parts, zh_val)
            updated += 1

    save_json(EN_FILE, en_data)
    save_json(ZH_FILE, zh_data)
    print(f'Done. {updated} keys updated.')


if __name__ == '__main__':
    main()
