#!/usr/bin/env python3
"""
Generate mission SQL and JSON data from CSV files
"""
import csv
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
from collections import defaultdict


class MissionDataGenerator:
    # Cover image mapping by brand
    COVER_IMAGE_MAP = {
        'mtr': '/assets/images/mission-cover/mtr.svg',
        'hku1': '/assets/images/mission-cover/hku-1.svg',
        'hku2': '/assets/images/mission-cover/hku-2.svg',
        'mtrmall': '/assets/icons/mtr-mall.png',
        'thealchemistcafe': '/assets/images/mission-cover/thealchemistcafe.svg',
        'eslite': '/assets/images/mission-cover/eslite.svg',
        'cafe330': '/assets/images/mission-cover/cafe330.svg',
        'so330': '/assets/images/mission-cover/so330.svg',
        'tamjai': '/assets/images/mission-cover/tamjai.svg',
        'samgor': '/assets/images/mission-cover/samgor.svg',
    }
    
    def __init__(self, skip_gps=False, skip_start=False):
        self.locations = {}  # location_code -> location data
        self.quiz_data = {}  # slug -> quiz data
        self.cards_data = []  # cards data for matching missions
        self.errors = []
        self.slug_counts = defaultdict(int)  # Track slug usage for deduplication
        self.skip_gps = skip_gps  # Debug mode to add skip_gps to all missions
        self.skip_start = skip_start  # Override start_time with "2026-01-01 00:00:00"
        
    def get_brand_key(self, brand: str): 
        if(brand == 'MTR Mall'):
            return 'mtrmall'
        elif(brand == 'MTR'):
            return 'mtr'
        elif(brand == 'HKU1'):
            return 'hku1'
        elif(brand == 'HKU2'):
            return 'hku2'
        elif(brand == '誠品'):
            return 'eslite'
        elif(brand == '牧羊少年'):
            return 'thealchemistcafe'   
        elif(brand == 'Cafe330'):   
            return 'cafe330'
        elif(brand == '譚仔'):
            return 'tamjai'
        elif(brand == '三哥'):
            return 'samgor'
        
        return brand
        
    def load_location_data(self, filepath: str):
        """Load location data from CSV"""
        print(f"Loading location data from {filepath}...")
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    location_code = row['Location Code'].strip()
                    self.locations[location_code] = {
                        'brand': row['Brand'],
                        'code': location_code.split('-')[1] if '-' in location_code else location_code,
                        'name_zh': row['Name (Zh)'],
                        'name_en': row['Name (En)'],
                        'address_zh': row['Address Details (Zh)'],
                        'address_en': row['Address Details (En)'],
                        'max_distance': float(row['max_distance']) if row.get('max_distance') else 100,
                        'lat': float(row['lat']) if row.get('lat') else 0,
                        'lng': float(row['lng']) if row.get('lng') else 0,
                        'x': float(row['x']) if row.get('x') else 0,
                        'y': float(row['y']) if row.get('y') else 0
                    }
            print(f"Loaded {len(self.locations)} locations")
        except Exception as e:
            self.errors.append(f"Error loading location data: {str(e)}")
            print(f"ERROR: {str(e)}")
    
    def load_quiz_data(self, filepath: str):
        """Load quiz question data from CSV"""
        print(f"Loading quiz data from {filepath}...")
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    slug = row['Slug']
                    if not slug:
                        continue
                    
                    # Build options list
                    options = []
                    for i in range(1, 5):  # Up to 4 choices
                        choice_zh_key = f'Choice {i} (ZH)' if i == 1 else f'Choice{i}(EN)'.replace('EN', 'ZH')
                        choice_en_key = f'Choice {i} (EN)' if i == 1 else f'Choice{i}(EN)'
                        
                        # Handle variations in column names
                        choice_zh = row.get(choice_zh_key) or row.get(f'Choice {i} (ZH)')
                        choice_en = row.get(choice_en_key) or row.get(f'Choice{i}(EN)')
                        
                        if choice_zh:
                            # Get result messages (use empty string if not available or is placeholder)
                            result_key = f'Result {i} (ZH)'
                            result_en_key = f'Result {i} (EN)'
                            message_zh = row.get(result_key, '')
                            message_en = row.get(result_en_key, '')
                            
                            # # Filter out placeholder values like "TBC"
                            # if message_zh and message_zh.strip().upper().startswith('TBC'):
                            #     message_zh = ''
                            # if message_en and message_en.strip().upper().startswith('TBC'):
                            #     message_en = ''
                            
                            option = {
                                'label_zh': choice_zh,
                                'label_en': choice_en or '',
                                'value': chr(96 + i),  # a, b, c, d
                                'message_zh': message_zh,
                                'message_en': message_en
                            }
                            
                            options.append(option)
                    
                    self.quiz_data[slug] = {
                        'question_zh': row.get('Question (ZH)') or row.get('Question(EN)') or '',
                        'question_en': row.get('Question (EN)') or row.get('Question(EN)') or '',
                        'options': options
                    }
            print(f"Loaded {len(self.quiz_data)} quiz questions")
        except Exception as e:
            self.errors.append(f"Error loading quiz data: {str(e)}")
            print(f"ERROR: {str(e)}")
    
    def load_cards_data(self, filepath: str):
        """Load cards data from JSON"""
        print(f"Loading cards data from {filepath}...")
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                self.cards_data = json.load(f)
            print(f"Loaded {len(self.cards_data)} cards")
        except Exception as e:
            self.errors.append(f"Error loading cards data: {str(e)}")
            print(f"ERROR: {str(e)}")
    
    def generate_slug(self, base_slug: str) -> str:
        """Generate unique slug with deduplication"""
        if base_slug not in self.slug_counts:
            self.slug_counts[base_slug] = 1
            return base_slug
        else:
            count = self.slug_counts[base_slug]
            self.slug_counts[base_slug] += 1
            return f"{base_slug}-{count}"
    
    def map_locations(self, location_codes: str) -> List[Dict]:
        """Map location codes to location data"""
        if not location_codes:
            return []
        
        codes = [code.strip() for code in location_codes.split(',')]
        mapped_locations = []
        
        for code in codes:
            if code in self.locations:
                mapped_locations.append(self.locations[code])
            else:
                self.errors.append(f"Location code not found: {code}")
        
        return mapped_locations
    
    def build_parameter(self, mission_type: str, slug: str, complete_msg_zh: str, complete_msg_en: str, photo_frame: str = '', video: str = '') -> Dict:
        """Build parameter JSON based on mission type"""
        param = {
            'message_zh': complete_msg_zh,
            'message_en': complete_msg_en
        }
        
        # Add walking-specific parameters
        if mission_type == 'walking':
            param['required_distance'] = 30
        
        # Add quiz-specific parameters
        elif mission_type == 'quiz':
            if slug in self.quiz_data:
                quiz = self.quiz_data[slug]
                
                quiz = self.update_quiz_messages(quiz, complete_msg_zh, complete_msg_en)
                param['question_zh'] = quiz['question_zh']
                param['question_en'] = quiz['question_en']
                param['options'] = quiz['options']
            else:
                self.errors.append(f"Quiz data not found for slug: {slug}")
        
        # Add matching-specific parameters
        elif mission_type == 'matching':
            if self.cards_data:
                param['cards'] = self.cards_data
            else:
                self.errors.append(f"Cards data not loaded for matching mission: {slug}")
        
        # Add photo-specific parameters
        elif mission_type == 'photo':
            if photo_frame:
                param['image_url'] = photo_frame
        
        # Add video-specific parameters
        elif mission_type == 'video':
            if video:
                param['video_url'] = video
        
        # Add skip_gps flag if enabled
        if self.skip_gps:
            param['skip_gps'] = 1
        
        return param
    
    def format_end_date(self, date_str: str) -> str:
        """Format date to SQL format"""
        if not date_str:
            return ''
        try:
            # Try parsing common date formats
            for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y']:
                try:
                    dt = datetime.strptime(date_str, fmt)
                    return dt.strftime('%Y-%m-%d 23:59:59')
                except ValueError:
                    continue
            return date_str
        except Exception as e:
            self.errors.append(f"Error formatting date '{date_str}': {str(e)}")
            return date_str
    
    
    def format_date(self, date_str: str) -> str:
        """Format date to SQL format"""
        if not date_str:
            return ''
        try:
            # Try parsing common date formats
            for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y']:
                try:
                    dt = datetime.strptime(date_str, fmt)
                    return dt.strftime('%Y-%m-%d 00:00:00')
                except ValueError:
                    continue
            return date_str
        except Exception as e:
            self.errors.append(f"Error formatting date '{date_str}': {str(e)}")
            return date_str
    
    def escape_sql_string(self, text: str) -> str:
        """Escape string for SQL"""
        if not text:
            return ''
        # Escape single quotes and backslashes
        return text.replace('\\', '\\\\').replace("'", "\\'")
    
    def update_quiz_messages(self, quiz_data: Dict, complete_msg_zh: str, complete_msg_en: str) -> Dict:
        """Update quiz messages with completion messages"""
        if not quiz_data:
            return quiz_data
        
        updated_quiz = quiz_data.copy()
        for option in updated_quiz.get('options', []):
            if complete_msg_zh:
                option['message_zh'] = complete_msg_zh
            if complete_msg_en:
                option['message_en'] = complete_msg_en
        
        return updated_quiz 
    
    
    def location_codes_address_list(self, location_codes: str, lang: str) -> str:
        """Convert location codes to address list string"""
        if not location_codes:
            return ''
        
        if lang not in ['zh', 'en']:
            lang = 'zh'
            
        sep = '、' if lang == 'zh' else ', '
        
        codes = [code.strip() for code in location_codes.split(',')]
        addresses = []
        
        for code in codes:
            if code in self.locations:
                loc = self.locations[code]
                address = f"{loc['name_zh']}" if lang == 'zh' else f"{loc['name_en']}"
                addresses.append(address)
            else:
                self.errors.append(f"Location code not found for address conversion: {code}")
        
        return sep.join(addresses)
    
    def get_cover_image_by_brand(self, brand_key: str, slug: str) -> Optional[str]:
        image_key = brand_key
        
        if(slug == 'a-moment-with-day-day'):
            image_key = 'so330'
                
        return self.COVER_IMAGE_MAP.get(image_key, None)
        
    
    def process_mission_data(self, filepath: str) -> List[Dict]:
        """Process mission data CSV and return list of mission objects"""
        print(f"Processing mission data from {filepath}...")
        missions = []
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                mission_id = 1
                
                for row in reader:
                    # Skip empty rows
                    if not row.get('Slug'):
                        continue
                    
                    # Generate unique slug
                    base_slug = row['Slug']
                    slug = self.generate_slug(base_slug)
                    
                    # Get mission type
                    mission_type = row.get('Mission Type ', '').strip().lower()
                    if not mission_type:
                        mission_type = row.get('Mission Type', '').strip().lower()
                    
                    # Map locations
                    location_codes = row.get('Mission Location Code', '')
                    locations = self.map_locations(location_codes)
                    
                    # Build parameter
                    complete_msg_zh = row.get('Complete Mission Message', '')
                    complete_msg_en = row.get('Complete Mission Message(En)', '')
                    photo_frame = row.get('Photo Frame', '')
                    video = row.get('Video', '')
                    # print(f"Video URL for mission '{slug}': {video} ")
                    parameter = self.build_parameter(mission_type, base_slug, complete_msg_zh, complete_msg_en, photo_frame, video)
                   
                    
                    # Get brand and determine cover image
                    brandName = row.get('Brand', '')
                    brand_key = self.get_brand_key(brandName)
                    cover_image = self.get_cover_image_by_brand(brand_key, slug)
                    # brand = row.get('Brand', '')
                    # cover_image = self.COVER_IMAGE_MAP.get(brand_key, None)
                    category = brand_key if brand_key != 'mtrmall' else 'mtr'
                    
                    # Create mission object
                    mission = {
                        'id': mission_id,
                        'slug': slug,
                        'type': mission_type,
                        'code': row.get('Mission Number', ''),
                        'location_codes': location_codes,
                        'name_en': row.get('Mission Name (En)', ''),
                        'name_zh': row.get('Mission Name (Zh)', ''),
                        'description_en': row.get('Description (En)', ''),
                        'description_zh': row.get('Description (Zh)', ''),
                        'wellness_message_zh': row.get('Wellness Message (Zh)', ''),
                        'wellness_message_en': row.get('Wellness Message (En)', ''),
                        'address_zh': self.location_codes_address_list(location_codes, 'zh'),
                        'address_en': self.location_codes_address_list(location_codes, 'en'),
                        # 'address_zh': row.get('Mission Location (ZH)', ''),
                        # 'address_en': row.get('Mission Location (EN)', ''),  # Column appears twice in CSV
                        'cover_image': cover_image,  # Based on brand mapping
                        'start_time': '2026-01-01 00:00:00' if self.skip_start else self.format_date(row.get('Start Date', '')),
                        'end_time': self.format_end_date(row.get('End Date', '')),
                        'category': category,
                        'video_url': video,
                        'location': locations,
                        'parameter': parameter
                    }
                    
                    missions.append(mission)
                    mission_id += 1
            
            print(f"Processed {len(missions)} missions")
            return missions
            
        except Exception as e:
            self.errors.append(f"Error processing mission data: {str(e)}")
            print(f"ERROR: {str(e)}")
            return []
    
    def generate_json_output(self, missions: List[Dict], output_path: str):
        """Generate JSON output file"""
        print(f"Generating JSON output to {output_path}...")
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(missions, f, ensure_ascii=False, indent=2)
            print(f"JSON output saved to {output_path}")
        except Exception as e:
            self.errors.append(f"Error generating JSON output: {str(e)}")
            print(f"ERROR: {str(e)}")
    
    def generate_sql_output(self, missions: List[Dict], output_path: str):
        """Generate SQL INSERT statements"""
        print(f"Generating SQL output to {output_path}...")
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write("-- Mission Data SQL Insert Statements\n")
                f.write("-- Generated on: " + datetime.now().strftime('%Y-%m-%d %H:%M:%S') + "\n")
                if self.skip_gps:
                    f.write("-- DEBUG MODE: skip_gps enabled for all missions\n")
                f.write("\n")
                f.write("-- Truncate existing mission data\n")
                f.write("TRUNCATE TABLE tbl_mission;\n\n")
                
                for mission in missions:
                    # Convert location array to JSON string
                    location_json = json.dumps(mission['location'], ensure_ascii=False, separators=(',', ':'))
                    parameter_json = json.dumps(mission['parameter'], ensure_ascii=False, separators=(',', ':'))
                    
                    # Format cover_image
                    cover_image = f"'{mission['cover_image']}'" if mission['cover_image'] else 'NULL'
                    
                    sql = f"""INSERT INTO tbl_mission (id, slug, type, code, name_en, name_zh, description_en, description_zh, wellness_message_zh, wellness_message_en, address_zh, address_en, cover_image, start_time, end_time, category, location, parameter) VALUES
({mission['id']}, '{self.escape_sql_string(mission['slug'])}', '{self.escape_sql_string(mission['type'])}', '{self.escape_sql_string(mission['code'])}', '{self.escape_sql_string(mission['name_en'])}', '{self.escape_sql_string(mission['name_zh'])}', '{self.escape_sql_string(mission['description_en'])}', '{self.escape_sql_string(mission['description_zh'])}', '{self.escape_sql_string(mission['wellness_message_zh'])}', '{self.escape_sql_string(mission['wellness_message_en'])}', '{self.escape_sql_string(mission['address_zh'])}', '{self.escape_sql_string(mission['address_en'])}', {cover_image}, '{mission['start_time']}', '{mission['end_time']}', '{self.escape_sql_string(mission['category'])}', '{self.escape_sql_string(location_json)}', '{self.escape_sql_string(parameter_json)}');

"""
                    f.write(sql)
            
            print(f"SQL output saved to {output_path}")
        except Exception as e:
            self.errors.append(f"Error generating SQL output: {str(e)}")
            print(f"ERROR: {str(e)}")
    
    def generate_error_report(self, output_path: str):
        """Generate error report"""
        print(f"Generating error report to {output_path}...")
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write("Error Report\n")
                f.write("=" * 80 + "\n")
                f.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"Total errors: {len(self.errors)}\n\n")
                
                if self.errors:
                    for i, error in enumerate(self.errors, 1):
                        f.write(f"{i}. {error}\n")
                else:
                    f.write("No errors found!\n")
            
            print(f"Error report saved to {output_path}")
        except Exception as e:
            print(f"ERROR generating error report: {str(e)}")


def main():
    """Main execution"""
    import sys
    
    print("=" * 80)
    print("Mission Data Generator")
    print("=" * 80)
    
    # Check for skip_gps flag
    skip_gps = '--skip-gps' in sys.argv or '--skip-gps' in sys.argv
    if skip_gps:
        print("DEBUG MODE: skip_gps will be added to all missions")
        print("=" * 80)
    
    # Check for skip_start flag
    skip_start = '--skip-start' in sys.argv
    if skip_start:
        print("OVERRIDE MODE: start_time will be set to '2026-01-01 00:00:00'")
        print("=" * 80)
    
    # Initialize generator
    generator = MissionDataGenerator(skip_gps=skip_gps, skip_start=skip_start)
    
    # Define paths
    base_path = Path(__file__).parent
    source_path = base_path / 'source'
    output_path = base_path / 'output'
    
    # Ensure output directory exists
    output_path.mkdir(exist_ok=True)
    
    # Load supporting data
    generator.load_location_data(source_path / 'hku-location-data.csv')
    generator.load_quiz_data(source_path / '330event-quiz-data.csv')
    generator.load_cards_data(source_path / 'cards.json')
    
    # Process mission data
    missions = generator.process_mission_data(source_path / 'hku-mission-data.csv')
    
    # Generate outputs
    if missions:
        generator.generate_json_output(missions, output_path / 'mission-data.json')
        generator.generate_sql_output(missions, output_path / 'mission-data.sql')
    
    # Generate error report
    generator.generate_error_report(output_path / 'error-report.txt')
    
    print("\n" + "=" * 80)
    print(f"Processing complete!")
    if generator.skip_gps:
        print(f"Mode: DEBUG (skip_gps enabled for all missions)")
    if generator.skip_start:
        print(f"Mode: OVERRIDE (start_time set to '2026-01-01 00:00:00')")
    print(f"Total missions processed: {len(missions)}")
    print(f"Total errors: {len(generator.errors)}")
    print(f"Output files:")
    print(f"  - {output_path / 'mission-data.json'}")
    print(f"  - {output_path / 'mission-data.sql'}")
    print(f"  - {output_path / 'error-report.txt'}")
    print("=" * 80)


if __name__ == '__main__':
    main()
