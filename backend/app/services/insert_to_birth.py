from PIL import Image, ImageDraw, ImageFont # type: ignore

img = Image.open("birth_certificate_form.jpg")
draw = ImageDraw.Draw(img)

khmer_font_path = "../fonts/Khmer_OS_Siemreap_Regular.ttf"
font_size = 36
try:
    font = ImageFont.truetype(khmer_font_path, size=font_size)
except IOError:
    print(f"Error: Could not load font {khmer_font_path}. Please make sure the font file exists.")
    exit()

FIELDS = {
    "city": [430, 390, 450, 89],
    "district": [474, 477, 410, 75],
    "commune": [418, 558, 497, 68],
    "certificate_number": [1562, 390, 385, 66],
    "doc_number": [1820, 465, 274, 73],
    "certificate_year": [1540, 547, 432, 82],
    "last_name": [783, 745, 1038, 70],
    "first_name": [793, 848, 1038, 67],
    "last_name_latin": [791, 915, 1256, 70],
    "first_name_latin": [793, 1006, 1256, 64],
    "gender": [1894, 828, 199, 89],
    "nationality": [799, 1103, 1257, 67],
    "dob": [793, 1178, 1251, 72],
    "pob": [798, 1289, 1259, 216],
    "father_name": [789, 1605, 621, 70],
    "mother_name": [1429, 1604, 621, 73],
    "father_name_latin": [786, 1685, 626, 69],
    "mother_name_latin": [1427, 1686, 619, 69],
    "father_nationality": [788, 1782, 624, 72],
    "mother_nationality": [1427, 1781, 622, 72],
    "father_dob": [786, 1870, 626, 73],
    "mother_dob": [1427, 1882, 622, 59],
    "father_pob": [785, 1959, 627, 222],
    "mother_pob": [1429, 1956, 624, 225],
    "first_pob_baby": [782, 2190, 1270, 249],
    "created_place": [1049, 2465, 305, 52],
    "created_date": [1438, 2450, 127, 56],
    "create_month": [1621, 2450, 161, 63],
    "create_year": [1837, 2450, 208, 64],
    "created_by": [1366, 2630, 374, 72],
    "signature": [1376, 2785, 388, 120]
}

data = {
        "city": "រាជធានីភ្នំពេញ",
        "district": "ដូនពេញ",
        "commune": "ផ្សារថ្មីទី៣",
        "certificate_number": "០១/២០១១",
        "doc_number": "",
        "certificate_year": "២០១១",
        "last_name": "ប៊ុនលី",
        "first_name": "ស្រីលក្ខណ៍",
        "last_name_latin": "",
        "first_name_latin": "",
        "gender": "ស្រី",
        "nationality": "ខ្មែរ",
        "dob": "ថ្ងៃទី ០៣ ខែ ឧសភា ឆ្នាំ ២០១០",
        "pob": "ភូមិ ៣ សង្កាត់ ផ្សារថ្មីទី៣ ខណ្ឌ ដូនពេញ រាជធានីភ្នំពេញ",
        "father_name": "ប៊ុន . វិចិត្រ",
        "mother_name": "ស៊ុន . ស្រីណែត",
        "father_name_latin": "",
        "mother_name_latin": "",
        "father_nationality": "ខ្មែរ",
        "mother_nationality": "ខ្មែរ",
        "father_dob": "ថ្ងៃទី ០៣ ខែ កញ្ញា ឆ្នាំ ១៩៨៤",
        "mother_dob": "ថ្ងៃទី ០៩ ខែ ឧសភា ឆ្នាំ ១៩៨៦",
        "father_pob": "ភូមិ ៣ សង្កាត់ ផ្សារថ្មីទី៣ ខណ្ឌ ដូនពេញ រាជធានីភ្នំពេញ",
        "mother_pob": "ភូមិ ៣ សង្កាត់ ផ្សារថ្មីទី៣ ខណ្ឌ ដូនពេញ រាជធានីភ្នំពេញ",
        "first_pob_baby": "ភូមិ ៣ សង្កាត់ ផ្សារថ្មីទី៣ ខណ្ឌ ដូនពេញ រាជធានីភ្នំពេញ",
        "created_place": "រាជធានីភ្នំពេញ",
        "created_date": "០១",
        "create_month": "វិច្ឆិកា",
        "create_year": "២០១១",
        "created_by": "ស៊ុន . វណ្ណឌី",
        "signature": "Present"
}

for field, params in FIELDS.items():
    x, y, width, height = params
    text = data[field]

    bbox = draw.textbbox((x, y), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    if text_width > width:
        words = text.split()
        lines = []
        current_line = ""
        for word in words:
            test_line = current_line + word + " "
            bbox = draw.textbbox((x, y), test_line, font=font)
            test_width = bbox[2] - bbox[0]
            if test_width <= width:
                current_line = test_line
            else:
                lines.append(current_line)
                current_line = word + " "
        lines.append(current_line)

        total_text_height = len(lines) * text_height

        y_offset = (height - total_text_height) // 2

        for i, line in enumerate(lines):
            bbox = draw.textbbox((x, y), line, font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
            x_position = x
            y_position = y + y_offset + i * text_height
            draw.text((x_position, y_position), line, font=font, fill="black")
    else:
        y_position = y + (height - text_height) // 2
        draw.text((x, y_position), text, font=font, fill="black")

img.save("filled_birth_certificate_form.jpg", encoding='utf-8')
