import csv
from math import sqrt

with open("Caracteristiques_des_persos.csv", mode='r', encoding='utf-8') as f:
    test_reader = csv.DictReader(f, delimiter=';')
    personnage = [{key : value for key, value in element.items()} for element in test_reader]
    personnage = [{key : value for key, value in element.items()} for element in personnage]


'''
print(personnage)
'''


with open("Characters.csv", mode='r', encoding='utf-8') as f:
    test_reader = csv.DictReader(f, delimiter=';')
    maisons = [{key : value for key, value in element.items()} for element in test_reader]
    maisons = [{key : value for key, value in element.items()} for element in maisons ]
    
    
for key in maisons:
    for characters in personnage:
        if characters['Name'] == key['Name']:
            characters['House'] = key['House']
#print(personnage)



def distance(profil, personnage, methode='euclidienne'):
    return sqrt((int(profil['Courage']) - int(personnage['Courage'])) ** 2
                + (int(profil['Ambition']) - int(personnage['Ambition'])) ** 2
                + (int(profil['Intelligence']) - int(personnage['Intelligence'])) ** 2
                + (int(profil['Good']) - int(personnage['Good'])) ** 2)

def ajout_distance(tab, unknown_character):
    for character in tab:
        character['Distance'] = distance(unknown_character, character)
    return tab



profil = [{'Courage':9, 'Ambition':2, 'Intelligence':8, 'Good':9}, {'Courage':6, 'Ambition':7, 'Intelligence':9, 'Good':7},
          {'Courage':3, 'Ambition':8, 'Intelligence':6, 'Good':3}, {'Courage':2, 'Ambition':3, 'Intelligence':7, 'Good':8},
          {'Courage':3, 'Ambition':4, 'Intelligence':8, 'Good':8}]

characters = ajout_distance(personnage, profil[1])

k = 5
voisins = sorted(personnage, key=lambda x: x['Distance'])
#print(voisins)



def best_house(tab):
    included_house = {}
    for neighboor in tab:
        if neighboor['House'] in included_house:
            included_house[neighboor['House']] += 1
        else:
            included_house[neighboor['House']] = 1
    #print(included_house)
    maximum = 0
    for houses, nb in included_house.items():
        if nb > maximum:
            maximum = nb
            top_house = houses
    return top_house

def procedure():
    return none
print('Your house is :', best_house(voisins[:k]))
        

