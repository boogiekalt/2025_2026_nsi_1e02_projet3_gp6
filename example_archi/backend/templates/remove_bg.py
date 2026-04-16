from rembg import remove
from PIL import Image

input_path = "car_to_right.png"
output_path = "car_to_right_without_bg.png"

with open(input_path, "rb") as i:
    with open(output_path, "wb") as o:
        o.write(remove(i.read()))

