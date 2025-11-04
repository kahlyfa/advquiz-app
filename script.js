// ==========================================
// EMAILJS CONFIGURATION
// ==========================================
// TO SET UP EMAILJS:
// 1. Go to https://www.emailjs.com/
// 2. Sign up for a free account
// 3. Add an email service (Gmail, Outlook, etc.)
// 4. Create an email template
// 5. Get your Public Key from the EmailJS dashboard
// 6. Replace the values below with your credentials

const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE',        // Replace with your EmailJS Public Key
    SERVICE_ID: 'YOUR_SERVICE_ID_HERE',        // Replace with your EmailJS Service ID
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID_HERE',      // Replace with your EmailJS Template ID
    RECIPIENT_EMAIL: 'nkanganthony@gmail.com'  // Email where results will be sent
};

// Initialize EmailJS
(function() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
})();

// ==========================================
// QUIZ DATA
// ==========================================

const quizQuestions = [
    {
        id: 1,
        question: "What is the capital city of France?",
        correctAnswer: "Paris",
        keywords: ["paris"] // For flexible matching
    },
    {
        id: 2,
        question: "Who wrote the play 'Romeo and Juliet'?",
        correctAnswer: "William Shakespeare",
        keywords: ["shakespeare", "william shakespeare"]
    },
    {
        id: 3,
        question: "What is the largest planet in our solar system?",
        correctAnswer: "Jupiter",
        keywords: ["jupiter"]
    },
    {
        id: 4,
        question: "In which year did World War II end?",
        correctAnswer: "1945",
        keywords: ["1945"]
    },
    {
        id: 5,
        question: "What is the chemical symbol for gold?",
        correctAnswer: "Au",
        keywords: ["au"]
    }
];

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval;
let timeRemaining = 300; // 5 minutes in seconds
let quizStartTime;
let userName = '';
let userEmail = '';

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Load any saved progress from localStorage
    loadSavedProgress();
});

// ==========================================
// QUIZ CONTROL FUNCTIONS
// ==========================================

function startQuiz() {
    // Get and validate user information
    userName = document.getElementById('userName').value.trim();
    userEmail = document.getElementById('userEmail').value.trim();
    
    if (!userName) {
        alert('Please enter your name to start the quiz!');
        return;
    }
    
    // Initialize user answers array
    userAnswers = new Array(quizQuestions.length).fill('');
    
    // Record start time
    quizStartTime = new Date();
    
    // Hide welcome screen and show quiz screen
    document.getElementById('welcomeScreen').classList.add('hidden');
    document.getElementById('quizScreen').classList.remove('hidden');
    document.getElementById('quizScreen').classList.add('fade-in');
    
    // Update total questions display
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    
    // Start the timer
    startTimer();
    
    // Display first question
    displayQuestion();
    
    // Save to localStorage
    saveProgress();
}

function displayQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    const questionContainer = document.getElementById('questionContainer');
    
    // Create question HTML
    questionContainer.innerHTML = `
        <div class="question-slide-in">
            <div class="mb-2">
                <span class="bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                    Question ${currentQuestionIndex + 1}
                </span>
            </div>
            <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">${question.question}</h3>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="answer">
                    Your Answer:
                </label>
                <textarea 
                    id="answer" 
                    rows="4" 
                    class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none resize-none"
                    placeholder="Type your answer here..."
                    autocomplete="off"
                >${userAnswers[currentQuestionIndex]}</textarea>
            </div>
            <p class="text-sm text-gray-500">
                <span class="font-semibold">Tip:</span> Be specific and concise in your answer.
            </p>
        </div>
    `;
    
    // Update progress
    updateProgress();
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Focus on textarea
    document.getElementById('answer').focus();
    
    // Auto-save answer on input
    document.getElementById('answer').addEventListener('input', function(e) {
        userAnswers[currentQuestionIndex] = e.target.value;
        saveProgress();
    });
}

function nextQuestion() {
    // Save current answer
    const answerInput = document.getElementById('answer');
    userAnswers[currentQuestionIndex] = answerInput.value.trim();
    
    // Move to next question
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
    
    saveProgress();
}

function previousQuestion() {
    // Save current answer
    const answerInput = document.getElementById('answer');
    userAnswers[currentQuestionIndex] = answerInput.value.trim();
    
    // Move to previous question
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
    
    saveProgress();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Enable/disable previous button
    prevBtn.disabled = currentQuestionIndex === 0;
    
    // Show/hide next and submit buttons
    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
}

// ==========================================
// TIMER FUNCTIONS
// ==========================================

function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(function() {
        timeRemaining--;
        updateTimerDisplay();
        
        // Warning when less than 1 minute
        if (timeRemaining <= 60) {
            document.getElementById('timer').classList.add('timer-warning');
        }
        
        // Auto-submit when time runs out
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            autoSubmitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('timer').textContent = timerDisplay;
}

function autoSubmitQuiz() {
    alert('Time is up! Your quiz will be submitted automatically.');
    submitQuiz();
}

// ==========================================
// SUBMISSION AND SCORING
// ==========================================

function submitQuiz() {
    // Save current answer
    const answerInput = document.getElementById('answer');
    if (answerInput) {
        userAnswers[currentQuestionIndex] = answerInput.value.trim();
    }
    
    // Stop timer
    clearInterval(timerInterval);
    
    // Calculate score
    const score = calculateScore();
    
    // Save results to localStorage
    saveResults(score);
    
    // Show loading overlay
    document.getElementById('loadingOverlay').classList.remove('hidden');
    
    // Send email with results
    sendResultsEmail(score);
    
    // Display results after a short delay
    setTimeout(() => {
        displayResults(score);
        document.getElementById('loadingOverlay').classList.add('hidden');
    }, 2000);
}

function calculateScore() {
    let correctCount = 0;
    const results = [];
    
    quizQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index].trim().toLowerCase();
        const isCorrect = question.keywords.some(keyword => 
            userAnswer === keyword.toLowerCase()
        );
        
        if (isCorrect) {
            correctCount++;
        }
        
        results.push({
            question: question.question,
            userAnswer: userAnswers[index] || '(No answer)',
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect
        });
    });
    
    return {
        correct: correctCount,
        total: quizQuestions.length,
        percentage: Math.round((correctCount / quizQuestions.length) * 100),
        details: results
    };
}

function displayResults(score) {
    // Hide quiz screen and show results screen
    document.getElementById('quizScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');
    document.getElementById('resultsScreen').classList.add('fade-in');
    
    // Display score
    document.getElementById('finalScore').textContent = `${score.correct}/${score.total}`;
    document.getElementById('scorePercentage').textContent = `${score.percentage}%`;
    
    // Display score icon and message
    const scoreIcon = document.getElementById('scoreIcon');
    const scoreMessage = document.getElementById('scoreMessage');
    
    if (score.percentage >= 80) {
        scoreIcon.innerHTML = `
            <svg class="w-24 h-24 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        `;
        scoreMessage.innerHTML = '<p class="text-green-600 font-semibold">🎉 Excellent! You did a great job!</p>';
    } else if (score.percentage >= 60) {
        scoreIcon.innerHTML = `
            <svg class="w-24 h-24 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        `;
        scoreMessage.innerHTML = '<p class="text-yellow-600 font-semibold">👍 Good job! Keep practicing to improve.</p>';
    } else {
        scoreIcon.innerHTML = `
            <svg class="w-24 h-24 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
        `;
        scoreMessage.innerHTML = '<p class="text-red-600 font-semibold">💪 Don\'t give up! Practice makes perfect.</p>';
    }
    
    // Display answer review
    const answerReview = document.getElementById('answerReview');
    answerReview.innerHTML = score.details.map((detail, index) => `
        <div class="p-4 rounded-lg ${detail.isCorrect ? 'answer-correct' : 'answer-incorrect'}">
            <p class="font-semibold text-gray-800 mb-2">Q${index + 1}: ${detail.question}</p>
            <p class="text-sm text-gray-700 mb-1">
                <span class="font-semibold">Your answer:</span> ${detail.userAnswer}
            </p>
            <p class="text-sm text-gray-700">
                <span class="font-semibold">Correct answer:</span> ${detail.correctAnswer}
            </p>
            <p class="text-sm font-semibold mt-2 ${detail.isCorrect ? 'text-green-700' : 'text-red-700'}">
                ${detail.isCorrect ? '✓ Correct' : '✗ Incorrect'}
            </p>
        </div>
    `).join('');
}

// ==========================================
// EMAIL FUNCTIONALITY
// ==========================================

function sendResultsEmail(score) {
    // Prepare email content
    const emailParams = {
        to_email: EMAILJS_CONFIG.RECIPIENT_EMAIL,
        user_name: userName,
        user_email: userEmail || 'Not provided',
        score: `${score.correct}/${score.total}`,
        percentage: `${score.percentage}%`,
        quiz_date: new Date().toLocaleString(),
        time_taken: formatTimeTaken(),
        answers: formatAnswersForEmail(score.details)
    };
    
    // Send email using EmailJS
    emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        emailParams
    )
    .then(function(response) {
        console.log('Email sent successfully!', response.status, response.text);
    })
    .catch(function(error) {
        console.error('Failed to send email:', error);
        alert('Warning: Failed to send email. Your results have been saved locally.');
    });
}

function formatAnswersForEmail(details) {
    return details.map((detail, index) => `
Question ${index + 1}: ${detail.question}
Your Answer: ${detail.userAnswer}
Correct Answer: ${detail.correctAnswer}
Status: ${detail.isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
-------------------
    `).join('\n');
}

function formatTimeTaken() {
    const timeTaken = 300 - timeRemaining; // Total seconds taken
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    return `${minutes} minutes ${seconds} seconds`;
}

// ==========================================
// LOCAL STORAGE FUNCTIONS
// ==========================================

function saveProgress() {
    const progressData = {
        currentQuestionIndex: currentQuestionIndex,
        userAnswers: userAnswers,
        timeRemaining: timeRemaining,
        userName: userName,
        userEmail: userEmail,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('quizProgress', JSON.stringify(progressData));
}

function loadSavedProgress() {
    const savedData = localStorage.getItem('quizProgress');
    if (savedData) {
        // Optionally restore progress - disabled by default for fresh start
        // Uncomment below to enable progress restoration
        /*
        const data = JSON.parse(savedData);
        currentQuestionIndex = data.currentQuestionIndex;
        userAnswers = data.userAnswers;
        timeRemaining = data.timeRemaining;
        userName = data.userName;
        userEmail = data.userEmail;
        */
    }
}

function saveResults(score) {
    const resultsData = {
        userName: userName,
        userEmail: userEmail,
        score: score,
        completedAt: new Date().toISOString(),
        timeTaken: formatTimeTaken()
    };
    
    // Save to localStorage
    localStorage.setItem('lastQuizResults', JSON.stringify(resultsData));
    
    // Also save to history
    let history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    history.push(resultsData);
    localStorage.setItem('quizHistory', JSON.stringify(history));
}

function clearSavedData() {
    localStorage.removeItem('quizProgress');
}

// ==========================================
// RESTART QUIZ
// ==========================================

function restartQuiz() {
    // Reset all variables
    currentQuestionIndex = 0;
    userAnswers = [];
    timeRemaining = 300;
    userName = '';
    userEmail = '';
    
    // Clear saved progress
    clearSavedData();
    
    // Hide results screen and show welcome screen
    document.getElementById('resultsScreen').classList.add('hidden');
    document.getElementById('welcomeScreen').classList.remove('hidden');
    
    // Reset input fields
    document.getElementById('userName').value = '';
    document.getElementById('userEmail').value = '';
    
    // Remove timer warning class
    document.getElementById('timer').classList.remove('timer-warning');
}

// ==========================================
// PREVENT ACCIDENTAL PAGE CLOSE
// ==========================================

window.addEventListener('beforeunload', function(e) {
    // Only show warning if quiz is in progress
    if (!document.getElementById('quizScreen').classList.contains('hidden')) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});