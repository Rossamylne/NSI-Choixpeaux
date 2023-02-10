import csv
from math import sqrt

def extraction(file_1, file_2):
    """
    Cette fonction extrait les données de deux fichiers CSV et les fusionne en une seule table de personnages.
    
    Paramètres :
    file_1 (str) : Le chemin du premier fichier CSV
    file_2 (str) : Le chemin du deuxième fichier CSV
    
    Renvoie :
    list : Une liste de dictionnaires, où chaque dictionnaire représente un personnage avec leurs noms et maisons.
    
    """
    with open(file_1, mode='r', encoding='utf-8') as f:
        test_reader = csv.DictReader(f, delimiter=';')
        character_table = [{key : value for key, value in element.items()} for element in test_reader]
        character_table = [{key : value for key, value in element.items()} for element in character_table]
    with open(file_2, mode='r', encoding='utf-8') as f:
        test_reader = csv.DictReader(f, delimiter=';')
        characters = [{key : value for key, value in element.items()} for element in test_reader]
        characters = [{key : value for key, value in element.items()} for element in characters ]
    
    for key in characters:
        for character in character_table:
            if character['Name'] == key['Name']:
                character['House'] = key['House']
    return character_table



def distance(profil, personnage, methode='euclidienne'):
    """
    This function calculates the distance between two character profiles using the Euclidean method by default.
    
    Parameters :
    profil (dict) : A dictionary representing a character profile with characteristics 'Courage', 'Ambition', 'Intelligence', 'Good'
    personnage (dict) : A dictionary representing a character with characteristics 'Courage', 'Ambition', 'Intelligence', 'Good'
    methode (str) : The method to use for calculating distance (defaults to 'euclidean')
    
    Returns :
    float : The distance between the two character profiles
    
    """
    return sqrt((int(profil['Courage']) - int(personnage['Courage'])) ** 2
                + (int(profil['Ambition']) - int(personnage['Ambition'])) ** 2
                + (int(profil['Intelligence']) - int(personnage['Intelligence'])) ** 2
                + (int(profil['Good']) - int(personnage['Good'])) ** 2)

def ajout_distance(tab, unknown_character):
    """
    This function calculates the distance between an unknown character and all the characters in a table, then adds the result in a new 'Distance' column for each character.
    
    Parameters :
    tab (list) : A list of dictionaries, where each dictionary represents a character with their names and houses.
    unknown_character (dict) : A dictionary representing an unknown character with characteristics 'Courage', 'Ambition', 'Intelligence', 'Good'
    
    Returns :
    list : A list of dictionaries, where each dictionary represents a character with their names, houses, and the distance from the unknown character.
    
    """
    for character in tab:
        character['Distance'] = distance(unknown_character, character)
    return tab



#print(voisins)



def best_house(tab):
    """
    This function finds the house with the most number of characters in a table.
    
    Parameters :
    tab (list) : A list of dictionaries, where each dictionary represents a character with their names and houses.
    
    Returns :
    str : The name of the house with the most number of characters.
    
    """
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

def profile_creation(base):
    """
    This function prompts the user for input of caracteristics values and creates a profile from these inputs.
    
    Parameters :
    base (dict) : A dictionary with keys representing caracteristics and no values.
    
    Returns :
    dict : A dictionary with keys representing caracteristics and values representing the inputs from the user.
    
    """
    for caracteristics in base.keys():
        base[caracteristics] = int(input(f'{caracteristics} : '))
    return base

def execution(profile_type):
    """
    This function finds the top k nearest neighbors of a given profile and returns the house with the most number of characters among those neighbors and the list of the nearest neighbors.
    
    Parameters :
    profile_type (dict) : A dictionary representing a profile with caracteristics and values.
    
    Returns :
    tuple : The name of the house with the most number of characters among the nearest neighbors and the list of the nearest neighbors.
    
    """
    characters = ajout_distance(personnage, profile_type)
    k = 5
    voisins = sorted(personnage, key=lambda x: x['Distance'])
    return best_house(voisins[:k]), voisins[:k]


def results_creation(tab):
    """
    This function creates a dictionary of results, where each key is the name of a character and each value is the house the character belongs to.
    
    Parameters :
    tab (list) : A list of dictionaries representing characters, with each dictionary containing a 'Name' and 'House' key.
    
    Returns :
    dict : A dictionary where each key is the name of a character and each value is the house the character belongs to.
    
    """
    results = {}
    for character_name in tab:
        results[character_name['Name']] = character_name['House']
    return results

def procedure():
    choice = int(input("1 : Profiles test \n2 : Test your own profile\n"))
    if choice == 1:
        unknown_profile = [{'Courage':9, 'Ambition':2, 'Intelligence':8, 'Good':9}, {'Courage':6, 'Ambition':7, 'Intelligence':9, 'Good':7},
          {'Courage':3, 'Ambition':8, 'Intelligence':6, 'Good':3}, {'Courage':2, 'Ambition':3, 'Intelligence':7, 'Good':8},
          {'Courage':3, 'Ambition':4, 'Intelligence':8, 'Good':8}]
        
        for mysterious_profiles in unknown_profile:
            print(f"\nThe profile {mysterious_profiles} must go in :\n{execution(mysterious_profiles)[0]}, \nnearest neighbors are : {results_creation(execution(mysterious_profiles)[1])}")
            
            
    elif choice == 2:
        personnal_profile_foundation = {'Courage':0, 'Ambition':0, 'Intelligence':0, 'Good':0}
        personnal_profile = profile_creation(personnal_profile_foundation)
        print(f'Your perfect house is  : {execution(personnal_profile)[0]}, \nnearest profile are : {results_creation(execution(personnal_profile)[1])}')
    
    return choice




personnage = extraction("Caracteristiques_des_persos.csv", "Characters.csv")


procedure()
