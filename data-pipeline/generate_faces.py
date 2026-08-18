import argparse
import csv
import os
import random
import uuid
import numpy as np
from PIL import Image, ImageEnhance
from faker import Faker
from sklearn.datasets import fetch_lfw_people

"""
Methodology: LFW Synthetic Suspect Generation

This script generates synthetic suspect data using the Labeled Faces in the Wild (LFW) dataset.
To evaluate the facial recognition system safely without using real criminal data, we:
1. Fetch the LFW dataset as a base source of facial images.
2. Anonymize the dataset by replacing real LFW identity names with synthetic names generated via `Faker`.
3. Create 'Alias Variants' by grouping multiple images of the same real individual under a single synthetic identity but with different alias names.
4. Apply data augmentations (rotation, flip, brightness) to individuals with only one image to ensure every suspect has multiple images for robust testing.
5. Export a comprehensive CSV mapping and save the processed images.
"""

# Initialize Faker with Indian locale for realistic names in the context of the project
fake = Faker('en_IN')

def apply_augmentations(img: Image.Image) -> list[Image.Image]:
    """Applies slight augmentations to an image to create variants."""
    variants = []
    
    # 1. Horizontal Flip
    variants.append(img.transpose(Image.FLIP_LEFT_RIGHT))
    
    # 2. Slight Rotation (between -10 and 10 degrees)
    angle = random.uniform(-10, 10)
    variants.append(img.rotate(angle))
    
    # 3. Brightness Adjustment
    enhancer = ImageEnhance.Brightness(img)
    factor = random.uniform(0.7, 1.3)
    variants.append(enhancer.enhance(factor))
    
    return variants

def main(args):
    os.makedirs(args.output_dir, exist_ok=True)
    images_dir = os.path.join(args.output_dir, 'faces')
    os.makedirs(images_dir, exist_ok=True)
    
    print(f"Fetching LFW dataset (min_faces_per_person={args.min_faces_per_person})...")
    lfw_people = fetch_lfw_people(min_faces_per_person=args.min_faces_per_person, resize=1.0, color=True)
    
    target_names = lfw_people.target_names
    images = lfw_people.images
    targets = lfw_people.target
    
    print(f"Loaded {len(images)} images across {len(target_names)} identities.")
    
    # Map LFW target ID to a list of image indices
    identity_map = {}
    for idx, target_id in enumerate(targets):
        if target_id not in identity_map:
            identity_map[target_id] = []
        identity_map[target_id].append(idx)
    
    available_targets = list(identity_map.keys())
    # Limit suspects if requested
    if args.max_suspects > 0 and args.max_suspects < len(available_targets):
        available_targets = random.sample(available_targets, args.max_suspects)
    
    metadata = []
    
    print(f"Processing {len(available_targets)} identities into synthetic suspects...")
    for target_id in available_targets:
        image_indices = identity_map[target_id]
        
        # Primary identity setup
        suspect_uuid = str(uuid.uuid4())
        primary_name = fake.name()
        original_name = target_names[target_id]
        
        for i, img_idx in enumerate(image_indices):
            # The first image is the primary, subsequent are aliases/variants
            is_alias = (i > 0)
            current_name = fake.name() if is_alias else primary_name
            
            # Convert numpy array back to PIL Image (LFW images are float32 in [0, 1] or [0, 255])
            # fetch_lfw_people with color=True returns float32 [0, 255] or [0, 1]. Let's normalize
            img_arr = images[img_idx]
            if img_arr.max() <= 1.0:
                img_arr = img_arr * 255.0
            
            img_pil = Image.fromarray(img_arr.astype(np.uint8))
            
            filename = f"{suspect_uuid}_{i}.jpg"
            filepath = os.path.join(images_dir, filename)
            img_pil.save(filepath)
            
            metadata.append({
                'synthetic_suspect_id': suspect_uuid,
                'synthetic_name': current_name,
                'original_lfw_name': original_name,
                'image_path': os.path.relpath(filepath, args.output_dir),
                'is_alias_variant': str(is_alias).lower()
            })
            
        # If the person only had 1 image, create artificial variants via augmentation
        if len(image_indices) == 1:
            base_img_idx = image_indices[0]
            base_img_arr = images[base_img_idx]
            if base_img_arr.max() <= 1.0:
                base_img_arr = base_img_arr * 255.0
            base_img_pil = Image.fromarray(base_img_arr.astype(np.uint8))
            
            augmented_images = apply_augmentations(base_img_pil)
            for j, aug_img in enumerate(augmented_images, start=1):
                filename = f"{suspect_uuid}_aug_{j}.jpg"
                filepath = os.path.join(images_dir, filename)
                aug_img.save(filepath)
                
                metadata.append({
                    'synthetic_suspect_id': suspect_uuid,
                    'synthetic_name': fake.name(), # Treat augmentations as aliases with different names
                    'original_lfw_name': original_name,
                    'image_path': os.path.relpath(filepath, args.output_dir),
                    'is_alias_variant': 'true'
                })

    csv_path = os.path.join(args.output_dir, 'suspect_metadata.csv')
    print(f"Saving metadata to {csv_path}...")
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'synthetic_suspect_id', 'synthetic_name', 'original_lfw_name', 'image_path', 'is_alias_variant'
        ])
        writer.writeheader()
        writer.writerows(metadata)
        
    print("Done!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate synthetic faces from LFW dataset.")
    parser.add_argument("--output_dir", type=str, default="output", help="Directory to save images and CSV")
    parser.add_argument("--min_faces_per_person", type=int, default=1, help="Minimum faces per person to fetch from LFW")
    parser.add_argument("--max_suspects", type=int, default=50, help="Maximum number of synthetic identities to generate")
    
    args = parser.parse_args()
    main(args)
