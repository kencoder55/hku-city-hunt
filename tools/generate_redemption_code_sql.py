#!/usr/bin/env python3
"""
Generate INSERT SQL for tbl_redemption_code from a text file of codes.

Usage:
    python3 generate_redemption_code_sql.py <input_file> <type> [output_file] [--user-id <id>]

Arguments:
    input_file   Path to text file with one code per line
    type         Product type (e.g. mtr500, mtr1000, eslite)
    output_file  (Optional) Output SQL file path. Defaults to output/<type>_codes.sql
    --user-id    (Optional) User ID for created_by / updated_by. Defaults to 1

Examples:
    python3 generate_redemption_code_sql.py \
        "mtr-code/PROD_Testing Codes for 330_New Life 330 Campaign 500 Points.txt" \
        mtr500

    python3 generate_redemption_code_sql.py \
        "mtr-code/PROD_Testing Codes for 330_New Life 330 Campaign 1000 Points.txt" \
        mtr1000 \
        output/mtr1000_codes.sql \
        --user-id 2
"""

import sys
import os
import argparse
from datetime import datetime


def generate_sql(input_file: str, code_type: str, output_file: str | None = None, user_id: int = 1):
    if not os.path.exists(input_file):
        print(f"Error: File not found: {input_file}")
        sys.exit(1)

    with open(input_file, "r", encoding="utf-8") as f:
        codes = [line.strip() for line in f if line.strip()]

    if not codes:
        print("Error: No codes found in file.")
        sys.exit(1)

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [
        f"-- Generated at {now}",
        f"-- Type: {code_type}",
        f"-- Source: {input_file}",
        f"-- Total codes: {len(codes)}",
        f"-- created_by / updated_by: {user_id}",
        "",
        "INSERT INTO `tbl_redemption_code` (`type`, `code`, `is_used`, `created_by`, `updated_by`)",
        "VALUES",
    ]

    value_rows = []
    for code in codes:
        safe_code = code.replace("'", "''")
        value_rows.append(f"('{code_type}','{safe_code}',0,{user_id},{user_id})")

    lines.append(",\n".join(value_rows) + ";")
    lines.append("")

    sql_content = "\n".join(lines)

    if not output_file:
        output_file = os.path.join("output", f"{code_type}_codes.sql")

    os.makedirs(os.path.dirname(output_file) if os.path.dirname(output_file) else ".", exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(sql_content)

    print(f"SQL written to: {output_file}")
    print(f"Total {len(codes)} codes with type '{code_type}' (created_by={user_id}).")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate redemption code INSERT SQL")
    parser.add_argument("input_file", help="Path to text file with one code per line")
    parser.add_argument("type", help="Product type (e.g. mtr500, mtr1000)")
    parser.add_argument("output_file", nargs="?", default=None, help="Output SQL file path")
    parser.add_argument("--user-id", type=int, default=1, dest="user_id",
                        help="User ID for created_by / updated_by (default: 1)")

    args = parser.parse_args()
    generate_sql(args.input_file, args.type, args.output_file, args.user_id)
