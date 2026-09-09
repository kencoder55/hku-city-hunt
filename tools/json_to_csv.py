#!/usr/bin/env python3
"""
Convert i18n JSON files to CSV.
Output format: key, en, zh-hk
Nested keys are flattened with dot notation (e.g. layout.login, mission.tamjai.view_branches)
"""

import json
import csv
import os

BASE_DIR = os.path.join(os.path.dirname(__file__), '..', 'web', 'messages')
EN_FILE = os.path.join(BASE_DIR, 'en.json')
ZH_FILE = os.path.join(BASE_DIR, 'zh-HK.json')
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), 'output', 'messages.csv')


def flatten(obj, prefix=''):
    """Recursively flatten a nested dict into dot-notation keys."""
    items = {}
    for k, v in obj.items():
        full_key = f'{prefix}.{k}' if prefix else k
        if isinstance(v, dict):
            items.update(flatten(v, full_key))
        else:
            items[full_key] = v
    return items


def main():
    with open(EN_FILE, encoding='utf-8') as f:
        en_data = json.load(f)
    with open(ZH_FILE, encoding='utf-8') as f:
        zh_data = json.load(f)

    en_flat = flatten(en_data)
    zh_flat = flatten(zh_data)

    # Union of all keys, preserving order from en.json
    all_keys = list(en_flat.keys())
    for k in zh_flat:
        if k not in en_flat:
            all_keys.append(k)

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['key', 'en', 'zh-hk'])
        for key in all_keys:
            writer.writerow([
                key,
                en_flat.get(key, ''),
                zh_flat.get(key, ''),
            ])

    print(f'Done. {len(all_keys)} keys written to: {OUTPUT_FILE}')


if __name__ == '__main__':
    main()
