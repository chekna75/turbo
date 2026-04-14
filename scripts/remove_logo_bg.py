#!/usr/bin/env python3
"""
Supprime l'arrière-plan noir d'une image de logo et sauvegarde en PNG transparent.
Usage: python3 scripts/remove_logo_bg.py <image_source> [output_path]
"""
import sys, os
from PIL import Image
import urllib.request, io


def smooth_edges(img, threshold=40, feather=80):
    img = img.convert("RGBA")
    new_data = []
    for r, g, b, a in img.getdata():
        brightness = (r + g + b) / 3
        if brightness < threshold:
            new_data.append((r, g, b, 0))
        elif brightness < feather:
            alpha = int(255 * (brightness - threshold) / (feather - threshold))
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, a))
    img.putdata(new_data)
    return img


def remove_bg(source, output_path=None):
    if source.startswith("http://") or source.startswith("https://"):
        with urllib.request.urlopen(source) as response:
            img = Image.open(io.BytesIO(response.read()))
    else:
        img = Image.open(source)

    result = smooth_edges(img)

    if output_path is None:
        base = os.path.splitext(source)[0] if not source.startswith("http") else "logo_no_bg"
        output_path = base + "_transparent.png"

    result.save(output_path, "PNG")
    print(f"Sauvegardé : {output_path}")
    return output_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/remove_logo_bg.py <image_source> [output_path]")
        sys.exit(1)

    source = sys.argv[1]
    output = sys.argv[2] if len(sys.argv) > 2 else None
    remove_bg(source, output)
