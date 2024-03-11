import json




periodDict = {
    "Barroco": "O estilo musical barroco, predominantemente popular entre os séculos XVII e XVIII na Europa, é caracterizado por uma riqueza de ornamentação, complexidade harmônica e contrapontística, e uma expressiva utilização de contrastes dinâmicos. As composições barrocas frequentemente apresentam uma estrutura clara e bem definida, com ênfase na elaboração de motivos musicais e na exploração de emoções através da música. As formas musicais comuns incluem a fuga, a toccata, a sonata e a suite, e o uso frequente de baixo contínuo proporciona uma base harmônica flexível sobre a qual outras partes instrumentais ou vocais podem se desenvolver. Compositores notáveis deste período incluem Johann Sebastian Bach, George Frideric Handel e Antonio Vivaldi.",
    "Renascimento": "O Renascimento foi um período de grande inovação e experimentação na música, com o desenvolvimento de novas formas e estilos musicais, incluindo a polifonia, a música secular e a música instrumental. Compositores notáveis deste período incluem Josquin des Prez, Giovanni Pierluigi da Palestrina e William Byrd."
}

def readJson(file):
    try:
        with open(file, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print('Erro desconhecido:', e)
    return data

def errorCheck(json):
    newjson = []
    for i in json:
        print(i)
        if ('id' in i) and ('nome' in i) and ('periodo' in i):
            newjson.append(i)
    return newjson

def createPeriodosJson(json, periodDict):
    periodos = {}
    for i in json:
        if not i['periodo'] in periodos:
            periodos[i['periodo']] = {
                'id': 'P' + str(len(periodos) + 1),
                'name': i['periodo'],
                'description': periodDict.get(i['periodo'], '')
            }
    return periodos

def createNewJson(compositores, periodos):
    ## create a new json with the periodos and the compositores

    newJson = {
        "periodos": periodos,
        "compositores": compositores
    }
    return newJson

def write_json(data, file):
    try:
        with open(file, 'w') as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        print('Erro desconhecido:', e)

def dicToList(dic):
    ## convert a dictionary to a list, removing the keys
    list = []
    for i in dic:
        list.append(dic[i])
    return list

file = 'compositores.json'
data = json.load(open(file))
compositores = data['compositores']
compnovo = errorCheck(compositores)
# load the JSON data from the file
  # extract the list of composers
periodos = createPeriodosJson(compnovo, periodDict)  # create the list of periods
perinovo= dicToList(periodos)

newJson = createNewJson(compnovo, perinovo)  # create the new JSON
write_json(newJson, 'compositores2.json')