function extraction(file_1, file_2) {
    /*
    Cette fonction extrait les données de deux fichiers CSV et les fusionne en une seule table de personnages.
  
    Paramètres :
    file_1 (str) : Le chemin du premier fichier CSV
    file_2 (str) : Le chemin du deuxième fichier CSV
  
    Renvoie :
    list : Une liste de dictionnaires, où chaque dictionnaire représente un personnage avec leurs noms et maisons.
    */
    Papa.parse(file_1, {
      download: true,
      header: true,
      delimiter: ";",
      complete: function (results1) {
        Papa.parse(file_2, {
          download: true,
          header: true,
          delimiter: ";",
          complete: function (results2) {
            let character_table = results1.data.map(function (element) {
              return { ...element };
            });
            character_table = character_table.map(function (element) {
              return { ...element };
            });
            let characters = results2.data.map(function (element) {
              return { ...element };
            });
            characters = characters.map(function (element) {
              return { ...element };
            });
  
            for (let key in characters) {
              for (let character of character_table) {
                if (character.Name === characters[key].Name) {
                  character.House = characters[key].House;
                }
              }
            }
            console.log(character_table);
          },
        });
      },
    });
    return character_table
  }

  
  function distance(profil, personnage, methode='euclidienne') {
    /*
    Cette fonction calcule la distance entre deux profils de personnages en utilisant la méthode euclidienne par défaut.

    Paramètres :
    profil (dict) : Un dictionnaire représentant le profil d'un personnage avec les caractéristiques 'Courage', 'Ambition', 'Intelligence', 'Good'
    personnage (dict) : Un dictionnaire représentant un personnage avec les caractéristiques 'Courage', 'Ambition', 'Intelligence', 'Good'
    methode (str) : La méthode à utiliser pour calculer la distance (par défaut 'euclidienne')

    Renvoie :
    float : La distance entre les deux profils de personnages
    */
    return Math.sqrt(Math.pow(parseInt(profil['Courage']) - parseInt(personnage['Courage']), 2)
                + Math.pow(parseInt(profil['Ambition']) - parseInt(personnage['Ambition']), 2)
                + Math.pow(parseInt(profil['Intelligence']) - parseInt(personnage['Intelligence']), 2)
                + Math.pow(parseInt(profil['Good']) - parseInt(personnage['Good']), 2));
}



function ajout_distance(tab, profile_type) {
    for (let i = 0; i < tab.length; i++) {
        let character = tab[i];
        character['Distance'] = distance(unknown_character, character);
    }
    return tab;
}



function best_house(tab) {
    const included_house = {};
    for (const neighboor of tab) {
        if (neighboor['House'] in included_house) {
            included_house[neighboor['House']] += 1;
        } else {
            included_house[neighboor['House']] = 1;
        }
    }
    let maximum = 0;
    let top_house = '';
    for (const houses in included_house) {
        if (included_house[houses] > maximum) {
            maximum = included_house[houses];
            top_house = houses;
        }
    }
    return top_house;
}

function execution(profile_type) {
    /*
    This function finds the top k nearest neighbors of a given profile and returns the house with the most number of characters among those neighbors and the list of the nearest neighbors.
  
    Parameters :
    profile_type (dict) : A dictionary representing a profile with caracteristics and values.
  
    Returns :
    tuple : The name of the house with the most number of characters among the nearest neighbors and the list of the nearest neighbors.
  
    */
    let characters = ajout_distance(characters, profile_type);
    let k = 5;
    let voisins = characters.sort(function(a, b) {
      return b.Distance - a.Distance;
    });
    return (best_house(voisins.slice(0, k)), voisins.slice(0, k));
  }
  

  function results_creation(tab) {
    /*
    This function creates a dictionary of results, where each key is the name of a character and each value is the house the character belongs to.

    Parameters :
    tab (list) : A list of dictionaries representing characters, with each dictionary containing a 'Name' and 'House' key.

    Returns :
    dict : A dictionary where each key is the name of a character and each value is the house the character belongs to.
    */

    let results = {};
    for (let i=0; i<tab.length; i++) {
        results[tab[i]['Name']] = tab[i]['Maison'];
    }
    return results;
}



let personnage = extraction("Caracteristiques_des_persos.csv", "characters.csv")




let questions = {
    "Êtes-vous plutôt du genre à prendre des risques ou à éviter les situations risquées ?": [{
            "Je suis plutôt prudent(e)": [1, 0, 2, 3]
        },
        {
            "Je suis prêt(e) à prendre des risques si nécessaire": [2, 2, 1, 1]
        },
        {
            "Je suis intrépide, j'aime les défis !": [3, 3, 1, 0]
        },
    ],

    "Aimez-vous être en charge d'une équipe ou préférez-vous travailler seul(e) ?": [{
            "Je préfère travailler seul(e)": [0, 0, 2, 1]
        },
        {
            "J'aime être en charge, mais je peux travailler en équipe": [1, 2, 1, 2]
        },
        {
            "J'adore être en charge d'une équipe !": [2, 3, 0, 2]
        },
    ],

    "Préférez-vous résoudre des problèmes complexes ou accomplir des tâches simples et répétitives ?": [{
            "J'aime les tâches simples et répétitives": [0, 0, 1, 2]
        },
        {
            "J'aime résoudre des problèmes, mais je préfère quand ils ne sont pas trop complexes": [1, 1, 2, 1]
        },
        {
            "Je suis à l'aise avec les problèmes complexes, j'adore les défis !": [3, 3, 3, 0]
        },
    ],

    "Êtes-vous plutôt introverti(e) ou extraverti(e) ?": [{
            "Je suis plutôt introverti(e)": [1, 1, 2, 2]
        },
        {
            "Je suis plutôt extraverti(e)": [2, 2, 1, 1]
        },
        {
            "Je suis un(e) ambiverti(e), j'ai un bon équilibre entre les deux": [1, 2, 2, 1]
        },
    ],

    "Aimez-vous aider les autres ou préférez-vous vous concentrer sur vos propres objectifs ?": [{
            "Je préfère me concentrer sur mes propres objectifs": [0, 2, 1, 0]
        },
        {
            "J'aime aider les autres, mais je ne veux pas être en charge de leur réussite": [1, 1, 3, 2]
        },
        {
            "J'aime aider les autres et je veux être en charge de leur réussite !": [2, 3, 2, 3]
        },
    ],
    "Êtes-vous prêt à prendre des risques pour atteindre vos objectifs ?": [{
        "Oui": [3, 2, 0, 1]
    },
    {
        "Non": [1, 0, 2, 3]
    },
    {
        "Ça dépend": [2, 3, 1, 0]
    }
    ],
    "Avez-vous tendance à prendre des décisions rapides ou à réfléchir longuement avant de prendre une décision ?": [{
            "Je prends des décisions rapides": [3, 1, 2, 0]
        },
        {
            "Je réfléchis longuement avant de prendre une décision": [0, 2, 1, 3]
        },
        {
            "Ça dépend de la situation": [2, 3, 0, 1]
        }
    ],
    "Avez-vous tendance à être honnête, même si cela signifie être impopulaire ?": [{
            "Oui": [3, 2, 1, 0]
        },
        {
            "Non": [0, 1, 2, 3]
        },
        {
            "Ça dépend": [2, 1, 3, 0]
        }
    ],
    "Êtes-vous une personne plutôt introvertie ou extravertie ?": [{
            "Introverti": [1, 2, 0, 3]
        },
        {
            "Extraverti": [3, 0, 2, 1]
        },
        {
            "Un mélange des deux": [2, 1, 3, 0]
        }
    ],
    "Préférez-vous travailler seul ou en équipe ?": [{
            "Seul": [1, 0, 3, 2]
        },
        {
            "En équipe": [2, 3, 1, 0]
        },
        {
            "Ça dépend de la tâche à accomplir": [3, 1, 2, 0]
        }
    ]
}

const questionEl = document.getElementById("question");
const buttons = document.querySelectorAll(".bouton");

let currentQuestion = 0;
let tosend = [0, 0, 0, 0];

function displayQuestion() {
  const question = Object.keys(questions)[currentQuestion];
  const answers = Object.values(questions)[currentQuestion];

  questionEl.innerText = question;

  buttons.forEach((button, index) => {
    button.innerText = Object.keys(answers[index])[0];
  });
}

window.onload = displayQuestion;

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const answer = Object.values(questions)[currentQuestion][index];

    tosend = tosend.map((value, idx) => value + answer[Object.keys(answer)[0]][idx]);

    currentQuestion++;

    if (currentQuestion < Object.keys(questions).length) {
      displayQuestion();
    } else {
      const result = execution({
        'Courage': tosend[0],
        'Ambition': tosend[1],
        'Intelligence': tosend[2],
        'Bonté': tosend[3]
      });
      alert(`Vous êtes dans la maison ${result[0]} !`);
    }
  });
});
