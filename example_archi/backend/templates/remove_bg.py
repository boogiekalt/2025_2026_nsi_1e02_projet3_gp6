from rembg import remove

input_path = "car_down.png"   # Mets ici le nom EXACT du fichier
output_path = "car_down_without_bg.png"

with open(input_path, "rb") as i:
    with open(output_path, "wb") as o:
        o.write(remove(i.read()))

