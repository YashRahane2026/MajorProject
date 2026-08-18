import argparse
import json
import csv
import os
import random
import uuid
from datetime import datetime, timedelta
from faker import Faker

"""
Methodology: Synthetic FIR Generation with Near-Duplicate Clusters

This script generates synthetic First Information Reports (FIRs) designed to test the natural language processing
and similarity search capabilities of the CrimeTrack AI platform.

1.  **Templates:** We use defined Modus Operandi (MO) templates covering various crime types.
2.  **Near-Duplicate Clusters:** To evaluate how well the system groups similar crimes, we generate 'clusters' of FIRs.
    For each cluster, a base MO is chosen, and multiple FIRs are generated around that specific MO but with different 
    complainants, dates, and slight textual variations in the narrative.
3.  **Faker Integration:** Indian names, realistic addresses, and randomized dates are injected into the templates.
"""

fake = Faker('en_IN')

CRIME_TYPES = [
    "theft", "robbery", "assault", "cyber_fraud", "narcotics", 
    "forgery", "kidnapping", "extortion", "arson", "murder"
]

# Base Modus Operandi templates. The system will create clusters around these.
MO_TEMPLATES = [
    # Theft/Robbery
    {"type": "theft", "mo_desc": "Chain snatching on motorcycle", "templates": [
        "The complainant was walking near {landmark} at approximately {time} when two unidentified individuals on a {vehicle} approached from behind and snatched a gold chain.",
        "A gold chain was stolen from the victim by two persons riding a {vehicle} near {landmark}. The incident occurred around {time}.",
        "Two suspects on a {vehicle} intercepted the complainant near {landmark} at {time} and forcibly removed their gold necklace before fleeing."
    ]},
    {"type": "robbery", "mo_desc": "ATM robbery with weapon", "templates": [
        "While withdrawing money at the {landmark} ATM, the victim was threatened with a {weapon} by an unknown person and forced to hand over cash.",
        "An armed robbery occurred at {landmark} ATM. A suspect brandishing a {weapon} coerced the victim into withdrawing and handing over funds.",
        "The complainant was held at {weapon}-point inside the ATM near {landmark} and robbed of freshly withdrawn cash."
    ]},
    # Cyber Fraud
    {"type": "cyber_fraud", "mo_desc": "Phishing call posing as bank official", "templates": [
        "The victim received a phone call from someone claiming to be a bank official. They were tricked into sharing their OTP, resulting in a loss of funds.",
        "A fraudster impersonating a bank manager contacted the complainant, asking for verification details. The victim shared an OTP and unauthorized transactions occurred.",
        "Under the pretext of KYC verification, an unknown caller convinced the victim to reveal their banking OTP, leading to financial fraud."
    ]},
    {"type": "cyber_fraud", "mo_desc": "Fake e-commerce listing", "templates": [
        "The complainant paid for an item listed on an online marketplace. The seller deleted their account and the item was never delivered.",
        "A fraudulent listing for a mobile phone tricked the victim into transferring money upfront. The seller subsequently became unreachable.",
        "The victim fell prey to an online shopping scam, paying in advance for goods that did not exist. The seller's contact details were deactivated."
    ]},
    # Assault
    {"type": "assault", "mo_desc": "Street altercation escalating to physical violence", "templates": [
        "A verbal dispute over parking near {landmark} escalated, and the suspect assaulted the complainant with a {weapon}.",
        "Following a minor disagreement at {landmark}, the accused physically attacked the victim, striking them with a {weapon}.",
        "The victim was battered with a {weapon} during a sudden altercation that occurred on the street near {landmark}."
    ]}
]

VEHICLES = ["black motorcycle", "blue scooter", "white hatchback", "stolen bike"]
WEAPONS = ["knife", "iron rod", "baseball bat", "firearm", "broken bottle"]
LANDMARKS = ["City Hospital", "Main Railway Station", "Central Market", "Public Park", "National Bank Branch"]

def random_date(start_days_ago=730, end_days_ago=0):
    start_date = datetime.now() - timedelta(days=start_days_ago)
    end_date = datetime.now() - timedelta(days=end_days_ago)
    random_days = random.randrange((end_date - start_date).days)
    return start_date + timedelta(days=random_days)

def generate_cluster(cluster_id, template_def, num_firs):
    firs = []
    
    # Establish base details for the cluster to ensure similarity
    base_vehicle = random.choice(VEHICLES)
    base_weapon = random.choice(WEAPONS)
    base_landmark = random.choice(LANDMARKS)
    
    for _ in range(num_firs):
        template_str = random.choice(template_def["templates"])
        
        # Sometimes vary the details slightly within the cluster, but keep mostly consistent
        vehicle = base_vehicle if random.random() > 0.2 else random.choice(VEHICLES)
        weapon = base_weapon if random.random() > 0.2 else random.choice(WEAPONS)
        landmark = base_landmark if random.random() > 0.2 else random.choice(LANDMARKS)
        
        time_str = fake.time(pattern='%H:%M:%S')
        
        narrative = template_str.format(
            landmark=landmark,
            time=time_str,
            vehicle=vehicle,
            weapon=weapon
        )
        
        incident_date = random_date()
        
        fir = {
            "fir_id": str(uuid.uuid4()),
            "fir_number": f"FIR-{fake.random_int(min=1000, max=9999)}/{incident_date.year}",
            "crime_type": template_def["type"],
            "mo_cluster_id": cluster_id,
            "narrative_text": narrative,
            "mo_description": template_def["mo_desc"],
            "complainant_name": fake.name(),
            "incident_date": incident_date.strftime("%Y-%m-%dT%H:%M:%S"),
            "incident_location": fake.address().replace('\n', ', '),
            "police_station": f"{fake.city()} Police Station"
        }
        firs.append(fir)
        
    return firs

def main(args):
    os.makedirs(args.output_dir, exist_ok=True)
    
    all_firs = []
    cluster_labels = []
    
    print(f"Generating {args.num_clusters} MO clusters...")
    
    # Generate clusters
    firs_per_cluster = max(1, args.num_firs // args.num_clusters)
    
    for i in range(args.num_clusters):
        cluster_id = f"CLUSTER_{i+1:03d}"
        template_def = random.choice(MO_TEMPLATES)
        
        # Add a bit of randomness to cluster sizes
        current_cluster_size = firs_per_cluster + random.randint(-1, 2)
        current_cluster_size = max(1, current_cluster_size)
        
        cluster_firs = generate_cluster(cluster_id, template_def, current_cluster_size)
        all_firs.extend(cluster_firs)
        
        for fir in cluster_firs:
            cluster_labels.append({
                "fir_id": fir["fir_id"],
                "mo_cluster_id": fir["mo_cluster_id"],
                "crime_type": fir["crime_type"]
            })
            
    # We might have slightly over or under generated due to randomness, cap it if needed
    if len(all_firs) > args.num_firs:
        all_firs = all_firs[:args.num_firs]
        cluster_labels = cluster_labels[:args.num_firs]

    # Save FIRs to JSONL
    jsonl_path = os.path.join(args.output_dir, 'synthetic_firs.jsonl')
    print(f"Saving {len(all_firs)} FIRs to {jsonl_path}...")
    with open(jsonl_path, 'w', encoding='utf-8') as f:
        for fir in all_firs:
            f.write(json.dumps(fir) + '\n')
            
    # Save ground truth clusters to CSV
    csv_path = os.path.join(args.output_dir, 'cluster_labels.csv')
    print(f"Saving ground truth labels to {csv_path}...")
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=["fir_id", "mo_cluster_id", "crime_type"])
        writer.writeheader()
        writer.writerows(cluster_labels)
        
    print("Done!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate synthetic FIRs with near-duplicate clusters.")
    parser.add_argument("--num_firs", type=int, default=100, help="Approximate total number of FIRs to generate")
    parser.add_argument("--num_clusters", type=int, default=20, help="Number of distinct MO clusters to generate")
    parser.add_argument("--output_dir", type=str, default="output", help="Directory to save JSONL and CSV files")
    
    args = parser.parse_args()
    main(args)
