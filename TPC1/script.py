import os
from html import escape
import shutil
import xml.etree.ElementTree as ET



html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Mapa</title>
    <meta charset="UTF-8">
</head>
<body>
"""

template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <title>{}</title>
    <meta charset="UTF-8">
</head>
<body>
"""

if os.path.exists('html'):
    shutil.rmtree('html')

os.mkdir('html')
listaRuas = {}

## function that populates the list of streets using metadata from each xml file in the textos folder
def populateList():
    for file in os.listdir('texto'):
        if file.endswith(".xml"):
            tree = ET.parse(f'texto/{file}')
            root = tree.getroot()
            listaRuas[root.find('./meta/número').text] = root.find('./meta/nome').text


## function that creates the html file for the index page using list of streets
def createIndex(html):
    html += "<ul>"
    for rua in sorted(listaRuas.keys(), key=int):
        html += f'<li><a href="ruas/{rua}.html">{rua} - {listaRuas[rua]}</a></li>'
    html += "</ul>"
    html += "</body>"
    return html

def parse_paragraph(paragraph):
    html_content = ""
    if paragraph.text:
        html_content += escape(paragraph.text)
    for elem in paragraph:
        if elem.tag == 'lugar':
            html_content += f"<span class='place'>{elem.text}</span>"
        elif elem.tag == 'data':
            html_content += f"<span class='date'>{elem.text}</span>"
        else:
            html_content += parse_paragraph(elem)
        html_content += escape(elem.tail) if elem.tail else ''
    return html_content


def parse_xml(xml_file):
    tree = ET.parse(f'texto/{xml_file}')
    root = tree.getroot()
    
    meta = root.find('meta')
    number = meta.find('número').text
    name = meta.find('nome').text
    
        
    general_description = ""
    for element in root.iter():
        if element.tag == 'para':
            general_description += f"<p>{parse_paragraph(element)}</p>"
        elif element.tag == 'lista-casas':
            break
    
    images = []
    for fig in root.findall('.//figura'):
        image_id = fig.get('id')
        image_path = fig.find('imagem').get('path')
        image_caption = fig.find('legenda').text
        images.append({'id': image_id, 'path': image_path, 'caption': image_caption})
    
    houses = []
    for casa in root.findall('.//casa'):
        house_number = casa.find('número').text
        enfiteuta = casa.find('enfiteuta').text if casa.find('enfiteuta') is not None else ""
        foro = casa.find('foro').text if casa.find('foro') is not None else ""
        
        house_description = ""
        for desc in casa.findall('.//desc'):
            house_description += f"<p>{parse_paragraph(desc)}</p>"
        
        houses.append({
            'number': house_number,
            'enfiteuta': enfiteuta,
            'foro': foro,
            'description': house_description
        })
    
    return number, name, general_description, houses, images

import glob

def create_html(xml_files):
    os.makedirs('html/ruas', exist_ok=True)
    for xml_file in xml_files:
        number, name, description, houses, images = parse_xml(xml_file)
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{name}</title>
        </head>
        <body>
        <h1>{name}</h1>
        """
        for image in images:
            html_content += f"""
            <figure>
                <img src="../{image['path']}" alt="{image['caption']}" width="400">
                <figcaption>{image['caption']}</figcaption>
            </figure>
            """
        html_content += f"""
        <div>
            <div>{description}</div>
        """
        # Add images from 'atual' folder
        atual_images = glob.glob(f'atual/{number}-*')
        html_content += "<h2>Imagens atuais</h2>"
        for image_path in atual_images:
            html_content += f"""
            <figure>
                <img src="../../{image_path}" alt="" width="350">
                <figcaption></figcaption>
            </figure>
            """
        html_content += "</div>"
        html_content += "<h2>Casas</h2>"
        html_content += "<ul>"
        for house in houses:
            html_content += f"""
            <li>
                <h4>{house['number']}</h4>
                <p>Enfiteuta: {house['enfiteuta']}</p>
                <p>Foro: {house['foro']}</p>
                <div>{house['description']}</div>
            </li>
            """
        html_content += """
        </body>
        </html>
        """
        
        with open(f'html/ruas/{number}.html', 'w') as f:
            f.write(html_content)
        
populateList()
html = createIndex(html)
with open('html/mapa.html', 'w') as f:
    f.write(html)

create_html(os.listdir('texto'))
print('Done')