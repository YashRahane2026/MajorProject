import json
import csv
import os

MALE_PORTRAITS = [
    '/images/portrait_001.jpg',
    '/images/portrait_003.jpg',
    '/images/portrait_005.jpg',
    '/images/portrait_006.jpg',
    '/images/portrait_008.jpg',
    '/images/portrait_010.jpg',
    '/images/portrait_011.jpg',
    '/images/portrait_013.jpg',
    '/images/portrait_015.jpg',
    '/images/portrait_017.jpg',
    '/images/portrait_019.jpg',
    '/images/portrait_020.jpg',
    '/images/portrait_022.jpg',
    '/images/portrait_024.jpg',
    '/images/portrait_025.jpg',
    '/images/portrait_026.jpg',
    '/images/portrait_028.jpg',
    '/images/portrait_030.jpg',
    '/images/portrait_031.jpg',
]

FEMALE_PORTRAITS = [
    '/images/portrait_002.jpg',
    '/images/portrait_004.jpg',
    '/images/portrait_007.jpg',
    '/images/portrait_009.jpg',
    '/images/portrait_012.jpg',
    '/images/portrait_014.jpg',
    '/images/portrait_016.jpg',
    '/images/portrait_018.jpg',
    '/images/portrait_021.jpg',
    '/images/portrait_023.jpg',
    '/images/portrait_027.jpg',
    '/images/portrait_029.jpg',
    '/images/portrait_032.jpg',
]

# 25 Unique base portraits for the first 25 suspects
# 13 Females, 12 Males = 25 distinct images
BASE_25_MAPPINGS = [
    ("SYN-NGP-00001", "Kranti Reddy", "Female", "/images/portrait_002.jpg"),
    ("SYN-NGP-00002", "Anagha Mahalle", "Female", "/images/portrait_021.jpg"),
    ("SYN-NGP-00003", "Kavya Kale", "Female", "/images/portrait_016.jpg"),
    ("SYN-NGP-00004", "Tanvi Gite", "Female", "/images/portrait_027.jpg"),
    ("SYN-NGP-00005", "Nidhi Deshmukh", "Female", "/images/portrait_004.jpg"),
    ("SYN-NGP-00006", "Devendra Kamble", "Male", "/images/portrait_006.jpg"),
    ("SYN-NGP-00007", "Tanvi Reddy", "Female", "/images/portrait_014.jpg"),
    ("SYN-NGP-00008", "Anagha Siddiqui", "Female", "/images/portrait_007.jpg"),
    ("SYN-NGP-00009", "Megha Uke", "Female", "/images/portrait_029.jpg"),
    ("SYN-NGP-00010", "Deepak Iyer", "Male", "/images/portrait_010.jpg"),
    ("SYN-NGP-00011", "Radhika Selokar", "Female", "/images/portrait_009.jpg"),
    ("SYN-NGP-00012", "Meenal Patel", "Female", "/images/portrait_012.jpg"),
    ("SYN-NGP-00013", "Kedar Raut", "Male", "/images/portrait_013.jpg"),
    ("SYN-NGP-00014", "Tanvi Jain", "Female", "/images/portrait_018.jpg"),
    ("SYN-NGP-00015", "Anjali Borkar", "Female", "/images/portrait_023.jpg"),
    ("SYN-NGP-00016", "Dhruv Kirtane", "Male", "/images/portrait_011.jpg"),
    ("SYN-NGP-00017", "Chinmay Dhawale", "Male", "/images/portrait_001.jpg"),
    ("SYN-NGP-00018", "Yuvraj Thakre", "Male", "/images/portrait_008.jpg"),
    ("SYN-NGP-00019", "Rajat Gole", "Male", "/images/portrait_003.jpg"),
    ("SYN-NGP-00020", "Faizan Mishra", "Male", "/images/portrait_015.jpg"),
    ("SYN-NGP-00021", "Pallavi Bose", "Female", "/images/portrait_032.jpg"),
    ("SYN-NGP-00022", "Nitin Thakare", "Male", "/images/portrait_025.jpg"),
    ("SYN-NGP-00023", "Navin Dhabale", "Male", "/images/portrait_024.jpg"),
    ("SYN-NGP-00024", "Saurabh Kamble", "Male", "/images/portrait_020.jpg"),
    ("SYN-NGP-00025", "Rajesh Menon", "Male", "/images/portrait_022.jpg"),
]

# Verify all 25 are unique
photos_25 = [p[3] for p in BASE_25_MAPPINGS]
assert len(set(photos_25)) == 25, f"Expected 25 unique photos in base, got {len(set(photos_25))}"
print("Base 25 mapping verified: 25 completely unique, gender-matched portraits!")

# 1. Update synthetic_nagpur_suspects_5000.json
json_path = 'data/demo/synthetic_nagpur_suspects_5000.json'
with open(json_path, 'r', encoding='utf-8') as f:
    profiles = json.load(f)

male_idx = 0
female_idx = 0

for i, p in enumerate(profiles):
    if i < 25:
        base_id, base_name, base_gender, base_photo = BASE_25_MAPPINGS[i]
        p['id'] = base_id
        p['name'] = base_name
        p['gender'] = base_gender
        p['photoUrl'] = base_photo
    else:
        gender = p.get('gender', 'Male')
        if gender == 'Female':
            p['photoUrl'] = FEMALE_PORTRAITS[female_idx % len(FEMALE_PORTRAITS)]
            female_idx += 1
        else:
            p['photoUrl'] = MALE_PORTRAITS[male_idx % len(MALE_PORTRAITS)]
            male_idx += 1

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(profiles, f, indent=2)

print(f"Updated {len(profiles)} profiles in {json_path} with strict gender alignment!")

# 2. Update CSV files
csv_path = 'data/demo/synthetic_nagpur_suspects_5000.csv'
fieldnames = list(profiles[0].keys())

with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(profiles)

print(f"Updated {csv_path}")

# Preview 25 CSV
preview_csv_path = 'data/demo/synthetic_nagpur_suspects_preview_25.csv'
with open(preview_csv_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(profiles[:25])

print(f"Updated {preview_csv_path}")
