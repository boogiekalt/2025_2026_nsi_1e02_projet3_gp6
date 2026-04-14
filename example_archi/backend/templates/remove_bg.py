from rembg import remove
from PIL import Image

input_path = "car_to_right.png"
output_path = "cat_to_right_without_bg.png"

with Image.open(input_path) as img:
    result = remove(img)
    result.save(output_path)
