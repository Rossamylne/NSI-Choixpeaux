let personnage = extraction("Caracteristiques_des_persos.csv", "characters.csv")

function extraction(file_1, file_2) {
    var character_table = []
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var rows = this.responseText.split("\n");
            var headers = rows[0].split(";")
            for (var i = 1; i < rows.length; i++) {
                var element = rows[i].split(";")
                var obj = {}
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = element[j]
                }
                character_table.push(obj)
            }
        }
    };
    xhr.open("GET", file_1, false);
    xhr.send();

    var xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var rows = this.responseText.split("\n");
            var headers = rows[0].split(";")
            var characters = []
            for (var i = 1; i < rows.length; i++) {
                var element = rows[i].split(";")
                var obj = {}
                for (var j = 0; j < headers.length; j++) {
                    obj[headers[j]] = element[j]
                }
                characters.push(obj)
            }
            for (var key in characters) {
                for (var character in character_table) {
                    if (character_table[character]['Name'] == characters[key]['Name']) {
                        character_table[character]['House'] = characters[key]['House']
                    }
                }
            }
        }
    };
    xhr2.open("GET", file_2, false);
    xhr2.send();
    return character_table
}

function distance(profil, personnage, methode = 'euclidienne') {
    return Math.sqrt(Math.pow(parseInt(profil['Courage']) - parseInt(personnage['Courage']), 2) + Math.pow(parseInt(profil['Ambition']) - parseInt(personnage['Ambition']), 2) + Math.pow(parseInt(profil['Intelligence']) - parseInt(personnage['Intelligence']), 2) + Math.pow(parseInt(profil['Good']) - parseInt(personnage['Good']), 2))
}

function ajout_distance(tab, unknown_character) {
    for (let i = 0; i < tab.length; i++) {
        tab[i]['Distance'] = distance(unknown_character, tab[i]);
    }
    return tab;
}

function best_house(tab) {
    let included_house = {};
    for (let i = 0; i < tab.length; i++) {
        let neighboor = tab[i];
        if (neighboor['House'] in included_house) {
            included_house[neighboor['House']] += 1;
        } else {
            included_house[neighboor['House']] = 1;
        }
    }
    let maximum = 0;
    let top_house;
    for (let houses in included_house) {
        let nb = included_house[houses];
        if (nb > maximum) {
            maximum = nb;
            top_house = houses;
        }
    }
    return top_house;
}


function execution(profile_type) {
    let characters = ajout_distance(personnage, profile_type);
    let k = 5;
    let voisins = characters.sort(function(a, b) {
        return a['Distance'] - b['Distance'];
    });
    return [best_house(voisins.slice(0, k)), voisins.slice(0, k)];
}

function results_creation(tab) {
    let results = {};
    for (let i = 0; i < tab.length; i++) {
        results[tab[i]['Name']] = tab[i]['House'];
    }
    return results;
}

let currentQuestion = 0;
let tosend = [1, 1, 1, 1];
let questions = {
    "Êtes-vous plutôt du genre à prendre des risques ou à éviter les situations risquées ?": [{
            "Je suis plutôt prudent(e)": [0, 0, 1, 0]
        },
        {
            "Je suis prêt(e) à prendre des risques si nécessaire": [0, 0, 0, 0]
        },
        {
            "Je suis intrépide, j'aime les défis !": [1, 0, 0, 0]
        },
    ],

    "Aimez-vous être en charge d'une équipe ou préférez-vous travailler seul(e) ?": [{
            "Je préfère travailler seul(e)": [0, 1, 0, 0]
        },
        {
            "J'aime être en charge, mais je peux travailler en équipe": [0, 0, 0, 0]
        },
        {
            "J'adore être en charge d'une équipe !": [0, 0, 0, 1]
        },
    ],

    "Préférez-vous résoudre des problèmes complexes ou accomplir des tâches simples et répétitives ?": [{
            "J'aime les tâches simples et répétitives": [1, 0, 0, 0]
        },
        {
            "J'aime résoudre des problèmes, mais je préfère quand ils ne sont pas trop complexes": [0, 0, 0, 0]
        },
        {
            "Je suis à l'aise avec les problèmes complexes, j'adore les défis !": [0, 0, 1, 0]
        },
    ],

    "Êtes-vous plutôt introverti(e) ou extraverti(e) ?": [{
            "Je suis plutôt introverti(e)": [0, 0, 0, 0]
        },
        {
            "Je suis plutôt extraverti(e)": [0, 0, 0, 2]
        },
        {
            "Je suis un(e) ambiverti(e), j'ai un bon équilibre entre les deux": [0, 0, 0, 1]
        },
    ],

    "Aimez-vous aider les autres ou préférez-vous vous concentrer sur vos propres objectifs ?": [{
            "Je préfère me concentrer sur mes propres objectifs": [0, 1, 0, 0]
        },
        {
            "J'aime aider les autres, mais je ne veux pas être en charge de leur réussite": [0, 0, 1, 1]
        },
        {
            "J'aime aider les autres et je veux être en charge de leur réussite !": [0, 1, 0, 1]
        },
    ],
    "Êtes-vous prêt à prendre des risques pour atteindre vos objectifs ?": [{
        "Oui": [1, 1, 0, 0]
    },
    {
        "Non": [0, 0, 0, 0]
    },
    {
        "Ça dépend": [1, 0, 1, 0]
    }
    ],
    "Avez-vous tendance à prendre des décisions rapides ou à réfléchir longuement avant de prendre une décision ?": [{
            "Je prends des décisions rapides": [1, 0, 0, 0]
        },
        {
            "Je réfléchis longuement avant de prendre une décision": [0, 0, 2, 0]
        },
        {
            "Ça dépend de la situation": [0, 0, 1, 0]
        }
    ],
    "Avez-vous tendance à être honnête, même si cela signifie être impopulaire ?": [{
            "Oui": [1, 0, 1, 2]
        },
        {
            "Non": [0, 0, 0, 0]
        },
        {
            "Ça dépend": [0, 0, 0, 1]
        }
    ],
    "Avez-vous des facilités à rester serein(e), même lorsque certaines situation sont stressantes ?": [{
            "Je panique facilement": [0, 0, 0, 0]
        },
        {
            "Je gère plutôt bien la pression": [1, 0, 0, 0]
        },
        {
            "Je suis souvent celui/celle qui prends les décisions dans des moments pressants": [2, 0, 0, 0]
        }
    ],
    "Vous sentez-vous supérieur(e) aux autres ?": [{
            "Oui, dans les domaines que je maîtrise bien": [0, 1, 1, 0]
        },
        {
            "Non, au contraire je me sens souvent surpassé(e)": [0, 0, 0, 0]
        },
        {
            "Oui, globalement": [0, 2, 0, 0]
        }
    ]
}

const questionEl = document.getElementById("question");
const buttons = document.querySelectorAll(".boutons-container button");

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
        console.log(answer, "1");

        tosend = tosend.map((value, idx) => value + answer[Object.keys(answer)[0]][idx]);

        currentQuestion++;
        if (currentQuestion < Object.keys(questions).length) {
            displayQuestion();
        } else {
            console.log(tosend, "2");
            let final_result = execution({
                'Courage': tosend[0],
                'Ambition': tosend[1],
                'Intelligence': tosend[2],
                'Good': tosend[3]
            });
            console.log(final_result);
            alert(`Vous êtes de le maison ${final_result[0]} !`);
        }
    });
});
