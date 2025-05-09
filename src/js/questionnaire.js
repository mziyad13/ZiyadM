const questions = [
    {
        text: "1. Qui a remporté la Coupe du Monde 2022 ?",
        qid: 1,
        options: [
            { rLabel: "Brésil", rid: 1 },
            { rLabel: "Argentine", rid: 2 },
            { rLabel: "France", rid: 3 },
            { rLabel: "Allemagne", rid: 4 }
        ],
        answer: 2 // Argentine
    },
    {
        text: "2. Où s'est déroulée la Coupe du Monde 2022 ?",
        qid: 2,
        options: [
            { rLabel: "Qatar", rid: 1 },
            { rLabel: "Russie", rid: 2 },
            { rLabel: "Brésil", rid: 3 },
            { rLabel: "Allemagne", rid: 4 }
        ],
        answer: 1 // Qatar
    },
    {
        text: "3. Quel joueur a marqué le plus de buts lors de cette édition ?",
        qid: 3,
        options: [
            { rLabel: "Lionel Messi", rid: 1 },
            { rLabel: "Kylian Mbappé", rid: 2 },
            { rLabel: "Cristiano Ronaldo", rid: 3 },
            { rLabel: "Neymar", rid: 4 }
        ],
        answer: 2 // Kylian Mbappé
    },
    {
        text: "4. Combien d'équipes ont participé à la Coupe du Monde 2022 ?",
        qid: 4,
        options: [
            { rLabel: "32", rid: 1 },
            { rLabel: "48", rid: 2 },
            { rLabel: "24", rid: 3 },
            { rLabel: "16", rid: 4 }
        ],
        answer: 1 // 32
    },
    {
        text: "5. Quel pays a accueilli la finale ?",
        qid: 5,
        options: [
            { rLabel: "Qatar", rid: 1 },
            { rLabel: "Brésil", rid: 2 },
            { rLabel: "Allemagne", rid: 3 },
            { rLabel: "France", rid: 4 }
        ],
        answer: 1 // Qatar
    }
];

let currentQuestion = 0;
let reponsesConcatenées = ""; 
const container = document.getElementById("questionContainer");
const feedback = document.getElementById("feedback");
const progressBar = document.getElementById("progressBar");

function showQuestion(index) {
    const q = questions[index];
    const optionsHtml = q.options.map(option => `
        <button class="bg-white border border-gray-300 text-gray-800 font-medium py-2 px-4 rounded shadow hover:bg-gray-100 transition duration-200"
                onclick="handleAnswer(${q.qid}, ${option.rid})">
            ${option.rLabel}
        </button>
    `).join('');

    container.innerHTML = `
        <h2 class="text-lg font-semibold mb-4">${q.text}</h2>
        <div class="grid grid-cols-1 gap-3">
            ${optionsHtml}
        </div>
    `;

    updateProgressBar();
}

function handleAnswer(qid, rid) {
    reponsesConcatenées += `A${qid}_${rid}`;
    const currentQ = questions[currentQuestion];

    const isAnswerCorrect = (rid === currentQ.answer);
    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion(currentQuestion);
    } else {
        // Vérification après toutes les réponses
        const hasErrors = !isAnswerCorrect;
        if (hasErrors) {
            feedback.textContent = "❌ Une ou plusieurs réponses sont incorrectes. Le questionnaire va redémarrer...";
            setTimeout(() => {
                currentQuestion = 0;
                reponsesConcatenées = ""; // Réinitialisation des réponses
                feedback.textContent = ""; // Effacer le feedback
                showQuestion(currentQuestion); // Redémarrer le questionnaire
            }, 3000);
        } else {
            const pageUrl = `${reponsesConcatenées}.html`;
            checkPageExists(pageUrl, function(exists) {
                if (exists) {
                    window.location.href = pageUrl; // Redirection si la page existe
                } else {
                    container.innerHTML = `
                        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                            <h2 class="text-xl font-bold mb-4">Merci pour vos réponses</h2>
                            <p class="text-gray-700 mb-4">Suite à vos réponses, vous ne souhaitez pas être contacté.</p>
                            <button onclick="location.reload()" class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
                                Recommencer le questionnaire
                            </button>
                        </div>
                    `;
                }
            });
        }
    }
}

function updateProgressBar() {
    const progress = (currentQuestion / questions.length) * 100;
    progressBar.value = progress;
}

// Fonction bruteforce
function bruteforce() {
    const allAnswers = questions.map(q => q.options);
    const currentCombination = Array(questions.length).fill(0);

    function testCombination() {
        for (let i = 0; i < questions.length; i++) {
            if (allAnswers[i][currentCombination[i]].rid !== questions[i].answer) {
                return false;
            }
        }
        return true;
    }

    function getNextCombination() {
        for (let i = 0; i < currentCombination.length; i++) {
            currentCombination[i]++;
            if (currentCombination[i] < allAnswers[i].length) {
                return false; // Continue testing
            }
            currentCombination[i] = 0; // Reset and carry over
        }
        return true; // All combinations tested
    }

    function startBruteforce() {
        const interval = setInterval(() => {
            if (testCombination()) {
                clearInterval(interval);
                window.location.href = "formulaire.html"; // Redirect when successful
                return;
            }
            if (getNextCombination()) {
                clearInterval(interval);
                feedback.textContent = "❌ Impossible de trouver une solution.";
            }
        }, 100); // Ajuste la vitesse si nécessaire
    }

    document.getElementById("bruteforceBtn").addEventListener("click", startBruteforce);
}

showQuestion(currentQuestion);
bruteforce();