import csv
import json
import os
    
def convert_csv_to_json(csv_file_path, json_file_path):
    """
    Convert CSV file to JSON format with specified structure
    """
    locations = []
    
    # Check if CSV file exists
    if not os.path.isfile(csv_file_path):
        print(f"CSV file not found: {csv_file_path}")
        return
    
    # Create output directory if it doesn't exist
    if not os.path.exists(os.path.dirname(json_file_path)):
        os.makedirs(os.path.dirname(json_file_path), exist_ok=True) 
        
    
    
    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        
        for row in csv_reader:
            
            location = {
                "brand": row['Brand'],
                "code": row['Location Code'],
                "name_zh": row['Name (Zh)'],
                "name_en": row['Name (En)'],
                "address_zh": row['Address Details (Zh)'],
                "address_en": row['Address Details (En)'],
                "max_distance": int(row['max_distance']) if row['max_distance'] else 100,
                "lat": float(row['lat']) if row['lat'] else 0.0,
                "lng": float(row['lng']) if row['lng'] else 0.0,
                "x": float(row['x']) if row['x'] else 0.0,
                "y": float(row['y']) if row['y'] else 0.0
            }
            
            if(location["brand"] == ""):
                continue
            
            locations.append(location)
    
    # Write to JSON file
    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(locations, json_file, ensure_ascii=False, indent=2)
    
    print(f"Converted {len(locations)} locations from CSV to JSON")
    print(f"Output saved to: {json_file_path}")

if __name__ == "__main__":
    csv_file = "source/330event-location-pin.csv"
    json_file = "output/330event-location-pin.json"
    
    convert_csv_to_json(csv_file, json_file)
