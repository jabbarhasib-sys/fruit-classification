import os
import shutil
import random

# -------- CONFIG --------
BASE_DIR = r"c:\Users\jabba\OneDrive\Desktop\fruits-360_100x100\fruits-360"
SOURCE_DIR = os.path.join(BASE_DIR, "Test")   # Use Test set
DEST_DIR = r"c:\Users\jabba\OneDrive\Desktop\fruit_showcase"
IMAGES_PER_CLASS = 2
# ------------------------

os.makedirs(DEST_DIR, exist_ok=True)

classes = [
    d for d in os.listdir(SOURCE_DIR)
    if os.path.isdir(os.path.join(SOURCE_DIR, d))
]

print(f"Found {len(classes)} classes")

copied = 0

for cls in classes:
    cls_path = os.path.join(SOURCE_DIR, cls)
    images = [
        img for img in os.listdir(cls_path)
        if img.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    if len(images) < IMAGES_PER_CLASS:
        continue

    selected = random.sample(images, IMAGES_PER_CLASS)

    for img in selected:
        src = os.path.join(cls_path, img)
        new_name = f"{cls}_{img}"   # keep class name in filename
        dst = os.path.join(DEST_DIR, new_name)

        shutil.copy(src, dst)
        copied += 1

print(f"✅ Copied {copied} images into: {DEST_DIR}")
