import random
import string
import argparse
from datetime import datetime

def generate_code(length=6):
    """Generate a random code with letters and numbers"""
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

def generate_codes(count=100000):
    """Generate unique codes"""
    codes = set()
    while len(codes) < count:
        code = generate_code()
        codes.add(code)
    return sorted(codes)

def main():
    parser = argparse.ArgumentParser(description="Generate unique random codes")
    parser.add_argument("count", type=int, nargs="?", default=100000,
                        help="Number of codes to generate (default: 100000)")
    parser.add_argument("--output", type=str, default=None,
                        help="Output file path (default: ../output/codes-<date>.txt)")
    args = parser.parse_args()

    count = args.count
    print(f"Generating {count} unique codes...")
    codes = generate_codes(count)

    timestamp = datetime.now().strftime("%Y-%m-%d")
    output_file = args.output or f"../output/codes-{timestamp}.txt"

    with open(output_file, 'w') as f:
        for code in codes:
            f.write(code + '\n')

    print(f"Successfully generated {len(codes)} codes")
    print(f"Output file: {output_file}")

if __name__ == "__main__":
    main()
