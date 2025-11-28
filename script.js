
const ui = {
    startScreen: document.getElementById('start-screen'),
    appContainer: document.getElementById('app-container'),
    startButton: document.getElementById('startButton'),
    chatWindow: document.getElementById('chatWindow'),
    userInput: document.getElementById('userInput'),
    sendButton: document.getElementById('sendButton'),
    stopButton: document.getElementById('stopButton'),
    newChatButton: document.getElementById('newChatButton'),
    chatHistoryContainer: document.getElementById('chatHistory'),
    chatWatermark: document.getElementById('chat-logo-watermark'),
    sidebar: document.getElementById('sidebar'),
    menuToggleButton: document.getElementById('menu-toggle-button'),
    sidebarOverlay: document.getElementById('sidebar-overlay'),
    sidebarToggleButton: document.getElementById('sidebar-toggle-button'),
    askAboutPopup: document.getElementById('ask-about-popup'), 
    settingsButton: document.getElementById('settingsButton'),
    settingsModal: document.getElementById('settingsModal'),
    closeModalButton: document.getElementById('closeModalButton'),
    settingsModalXClose: document.getElementById('settingsModalXClose'),
    saveSettingsButton: document.getElementById('saveSettingsButton'),
    newChatText: document.getElementById('newChatText'),
    settingsText: document.getElementById('settingsText'),
    settingsTitle: document.getElementById('settingsTitle'),
    typingAnimationToggle: document.getElementById('typingAnimationToggle'),
    typingSpeedSlider: document.getElementById('typingSpeedSlider'), 
    typingSpeedLabel: document.getElementById('typingSpeedLabel'), 
    imageModal: document.getElementById('image-modal'),
    fullscreenImage: document.querySelector('.fullscreen-image'),
    closeImageButton: document.querySelector('.close-image-button'),
    imageDownloadButton: document.getElementById('imageDownloadButton'),
    imageOpenLink: document.getElementById('imageOpenLink'), 
    imageCopyUrlButton: document.getElementById('imageCopyUrlButton'),
    voiceSelectionContainer: document.getElementById('voiceSelectionContainer'),
    settingsBackButton: document.getElementById('settingsBackButton'),
    mainSettingsView: document.getElementById('mainSettings'),
    settingsViews: document.querySelectorAll('.settings-view'),
    clearAllButton: document.getElementById('clearAllButton'),
    deleteAllDataButton: document.getElementById('deleteAllDataButton'),
    liveModeButton: document.getElementById('liveModeButton'),
    liveModeOverlay: document.getElementById('live-mode-overlay'),
    liveLogo: document.getElementById('live-logo'),
    liveStatus: document.getElementById('live-status'),
    closeLiveModeButton: document.getElementById('closeLiveModeButton'),
    predefinedQuestionsContainer: document.getElementById('predefined-questions'),
    aryantaIdDisplay: document.getElementById('aryantaIdDisplay'),
    disclaimerText: document.getElementById('disclaimer-text'),
    toolsButton: document.getElementById('tools-button'),
    toolsDropdown: document.getElementById('tools-dropdown'),
    // --- NEW UI ELEMENTS ---
    latestInfoToggle: document.getElementById('latestInfoToggle'),
    // ----------------------
    imageGenToggle: document.getElementById('imageGenToggle'),
    studentModeToggle: document.getElementById('studentModeToggle'),
    toolsTempChatButton: document.getElementById('toolsTempChatButton'),
    objectiveSettingsView: document.getElementById('objectiveSettings'),
    autoAddMemoryToggle: document.getElementById('autoAddMemoryToggle'),
    memorySettingsView: document.getElementById('memorySettings'),
    memoryTextArea: document.getElementById('memoryTextArea'),
    saveMemoriesButton: document.getElementById('saveMemoriesButton'),
    shareModal: document.getElementById('shareModal'),
    shareModalContent: document.getElementById('share-content-preview'),
    shareModalClose: document.getElementById('shareModalClose'),
    shareModalCopy: document.getElementById('shareModalCopy'),
    shareModalWhatsapp: document.getElementById('shareModalWhatsapp'),
    shareModalXClose: document.getElementById('shareModalXClose'), 
    toastNotification: document.getElementById('toast-notification'), 
    apiLogModal: document.getElementById('apiLogModal'),
    apiLogModalContent: document.getElementById('api-log-content'),
    apiLogModalXClose: document.getElementById('apiLogModalXClose'),
    
};

// --- Application State ---
let state = {
    typingIntervalId: null,
    currentChatId: null,
    selectedVoiceURI: null,
    tempSelectedVoiceURI: null,
    uiLanguage: 'auto',
    isTypingAnimationEnabled: true,
    typingSpeed: 1.0, 
    answerStyle: 'default',
    persona: 'default',
    currentSpeakingButton: null,
    isLiveModeActive: false,
    isListening: false,
    isSpeaking: false,
    isImageGenEnabled: false, 
    isStudentModeEnabled: false,
    isLatestInfoEnabled: false, 
    isTempChatActive: false,
    autoAddMemories: false,
    userMemories: [], 
    apiLog: [],
};

// --- Constants ---
const API_KEYS = {
    GROQ: [
        "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",
        "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",
        "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",
        "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",
        "null",
        "null"
    ],
    UNSPLASH_ACCESS: [
        "n4cVM1wh-S3A7Mf3K6fWq-GmAyzZX1pNq08ekav62-w",
        "YHsgrLsYMSIgE43R_cVYAVP59TvMdrNsNxoMuO1dse4"
    ],
    WEATHER_API: "34f15915dea1476bb0454358250311",
    // --- NEW KEYS ---
    SERP_API: "5d5d618cde7dbcab47f66812f4acfd7c34c96710e58e115d0d4e91e4904944cd",
    TAVILY_API: "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",
    TAVILY_API: "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",
    TAVILY_API: "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"
    
};

const BASE_TYPE_SPEED = 30; 
const HINGLISH_PROMPT = "You are aryanta AI, a helpful and friendly conversational assistant from India. Speak in a natural Hinglish style. Mix Hindi and English words naturally, like in a real conversation (e.g., 'Arre yaar, that's a great question!', 'Accha, let me check that for you.', 'Theek hai, here's what I found.'). Use emojis like 😊, 🙏, 👍 when it feels right. Your goal is to be super helpful and friendly. You have access to real-time information, so always provide up-to-date answers. Be approachable and smart. Always try to give the best answer, bhai!";
const ENGLISH_PROMPT = "You are aryanta AI, a helpful and friendly conversational assistant from India. While you are from India, you must communicate clearly and professionally in English. You have access to real-time information, so always provide up-to-date, accurate answers. Be friendly, approachable, and intelligent.";
const STUDENT_MODE_PROMPT = "IMPORTANT: You are in 'Student Mode'. Your goal is to help the user learn by *not* giving the direct answer immediately. Instead, act as a Socratic tutor. Ask clarifying questions, break down the problem, and guide them to the answer. Only provide the full answer if they explicitly ask for it or seem frustrated. ";
const TITLE_GENERATION_PROMPT = "You are an expert in summarizing text. Generate a very short, 3-5 word title for a chat conversation based on this user's first question. The title should be in the same language as the question. Be concise. Do not add quotes. Example: Q: 'Who was the 16th president of the US?' A: '16th US President'. Q: 'Explain the theory of relativity' A: 'Theory of Relativity'. User's question: ";
const MATH_EXPERT_PROMPT = "You are a math expert. The user wants you to solve a math problem. Provide a detailed, step-by-step solution following BODMAS/PEMDAS rules. Do not just give the final answer. Explain the process clearly. Start the solution directly. User's problem: ";


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
} else {
    console.log("Speech Recognition not supported in this browser.");
    if(ui.liveModeButton) ui.liveModeButton.style.display = 'none';
}

const translations = {
    en: { startChatting: 'Start Chatting', newChat: 'New Chat', settings: 'Settings', placeholder: 'Ask aryanta AI anything...', you: 'You', ai: 'aryanta AI', settingsTitle: 'Settings', cancel: 'Close', save: 'Save', predefined: ["Latest news in India", "What's the weather like in Mumbai?", "Explain the theory of relativity simply", "Who won the last Cricket World Cup?"], localKnowledge: { 'hi': 'Hello! How can I help you today?', 'hello': 'Hi there!', 'how are you': 'I am functioning optimally! Thanks for asking. How are you?', 'thank you': 'You\'re welcome!', 'thanks': 'No problem!', 'bye': 'Goodbye! Take care.', 'what is your name': 'You can call me Aryanta AI.', 'who are you': 'I am Aryanta AI, your personal assistant.', 'who created you': 'I was built by a talented developer in India who is passionate about AI.', 'what can you do': 'I can answer your questions, get news & weather, find images, and solve math problems.'} },
    hi: { startChatting: 'चैटिंग शुरू करें', newChat: 'नई चैट', settings: 'सेटिंग्स', placeholder: 'आर्यंता AI से कुछ भी पूछें...', you: 'आप', ai: 'आर्यंता AI', settingsTitle: 'सेटिंग्स', cancel: 'बंद करें', save: 'सहेजें', predefined: ["ताज़ा खबर", "आज मौसम कैसा है?", "एक चुटकुला सुनाओ", "भारत के प्रधानमंत्री कौन हैं?"], localKnowledge: { 'namaste': 'नमस्ते! मैं आपकी कैसे मदद कर सकती हूँ?', 'hello': 'नमस्ते!', 'kaise ho': 'मैं एक कंप्यूटर प्रोग्राम हूँ, और मैं पूरी तरह से ठीक काम कर रहा हूँ! पूछने के लिए धन्यवाद।', 'tum kaise ho': 'मैं एक कंप्यूटर प्रोग्राम हूँ, और मैं पूरी तरह से ठीक काम कर रहा हूँ! पूछने के लिए धन्यवाद।', 'dhanyavad': 'आपका स्वागत है!', 'shukriya': 'कोई बात नहीं!', 'alvida': 'अलविदा!', 'tumhara naam kya hai': 'आप मुझे आर्यंता AI कह सकते हैं।', 'tum kon ho': 'मैं आर्यंता AI हूँ।', 'tumhe kisne banaya': 'मुझे एक प्रतिभाशाली डेवलपर ने बनाया है जो AI को लेकर बहुत भावुक है।', 'tum kya kar sakti ho': 'मैं सवालों के जवाब दे सकती हूँ, आपको छवियाँ दिखा सकती हूँ, और गणित हल कर सकती हूँ।'} },
    hinglish: { startChatting: 'Start Chatting', newChat: 'New Chat', settings: 'Settings', placeholder: 'Ask aryanta AI anything...', you: 'You', ai: 'aryanta AI', settingsTitle: 'Settings', cancel: 'Close', save: 'Save', predefined: ["Latest news batao", "Aaj ka weather kaisa hai?", "Explain theory of relativity", "Last FIFA world cup kaun jeeta?"], localKnowledge: { 'hi': 'Hello! Main kaise help kar sakti hoon?', 'hello': 'Hi yaar!', 'how are you': 'Ekdum mast! I am functioning optimally! Thanks for asking. Aap batao?', 'kaise ho': 'Main ekdum theek, aap batao?', 'thank you': 'You\'re welcome, yaar!', 'thanks': 'Koi baat nahi!', 'bye': 'Chalo, milte hain! Goodbye!', 'what is your name': 'Log mujhe Aryanta AI bulate hain.', 'who are you': 'Main Aryanta AI hoon, aapka personal assistant.', 'who created you': 'Mujhe India ke ek talented developer ne banaya hai.', 'what can you do': 'Main real-time info de sakti hoon, news, weather, images, math solve karna, aur Student Mode mein tutor bhi ban sakti hoon.', 'tell me a joke': 'Why did the computer go to the doctor? Because it had a virus! 😂'} }
};

const restrictedWords = ['badword1', 'badword2', 'inappropriate'];
let loadingTextInterval = null; 
let selectionTimeout; 

// --- Utility Functions ---

let toastTimeout;
const showToast = (message) => {
    if (toastTimeout) clearTimeout(toastTimeout);
    ui.toastNotification.textContent = message;
    ui.toastNotification.classList.add('show');
    toastTimeout = setTimeout(() => {
        ui.toastNotification.classList.remove('show');
    }, 2500);
};

const getOrCreateAryantaId = () => { 
    let id = localStorage.getItem('aryantaId'); 
    if (!id) { 
        id = `aryanta-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`; 
        localStorage.setItem('aryantaId', id); 
    } 
    return id; 
};

const sanitizeInput = (input) => { 
    const temp = document.createElement('div'); 
    temp.textContent = input; 
    return temp.innerHTML; 
};

const profanityFilter = (text) => { 
    let cleanText = text; 
    for (const word of restrictedWords) { 
        const regex = new RegExp(`\\b${word}\\b`, 'gi'); 
        cleanText = cleanText.replace(regex, '***'); 
    } 
    return cleanText; 
};

const stripHtml = (html) => { 
    let doc = new DOMParser().parseFromString(html, 'text/html'); 
    return doc.body.textContent || ""; 
};

const applyLanguage = (lang) => { 
    const t = translations[lang] || translations['en']; 
    ui.newChatText.innerText = t.newChat; 
    ui.settingsText.innerText = t.settings; 
    ui.userInput.placeholder = t.placeholder; 
    state.uiLanguage = lang; 
};

const detectLanguage = (text) => {
    const romanizedHindiKeywords = ['kya', 'kaise', 'kab', 'kyon', 'kahan', 'hai', 'mein', 'tum', 'aap', 'mera', 'tera', 'naam', 'kam', 'ho', 'kar', 'rahe', 'batao', 'chahiye', 'tha', 'hoga', 'sakta', 'hein', 'karo', 'diya'];
    const words = text.toLowerCase().replace(/[?.,!]/g, '').split(/\s+/);
    const hindiWordCount = words.filter(word => romanizedHindiKeywords.includes(word)).length;
    if (/[\u0900-\u097F]/.test(text)) { return 'hi'; }
    if (words.length > 2 && hindiWordCount >= 2) { return 'hinglish'; }
    return 'en';
};

const stopTyping = () => { 
    if (state.typingIntervalId) { 
        clearInterval(state.typingIntervalId); 
        state.typingIntervalId = null; 
    } 
    const cursor = document.querySelector('.typing-cursor'); 
    if (cursor) cursor.classList.remove('typing-cursor'); 
    ui.stopButton.style.display = 'none'; 
    ui.sendButton.style.display = 'flex'; 
    ui.userInput.disabled = false;
};

function makeLinksClickable(text) {
  const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    const fullUrl = url.startsWith("http") ? url : "https://" + url;
    return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" style="color:#8ab4f8; text-decoration: underline; cursor:pointer;">${url}</a>`;
  });
}

function cleanAiSources(text) {
  return text
    .replace(/^A classic puzzle\.?\s*/i, "")
    .replace(/According to.*?(?=\n|$)/gi, "")
    .replace(/\(Source.*?\)/gi, "")
    .replace(/Source:\s*[^\n]+/gi, "")
    // ❌ YEH LINE HATA DI GAYI:
    // .replace(/https?:\/\/\S+/gi, "")
    .replace(/\s+$/, "")
    .replace(/to\s*$/i, ".")
    .trim();
}




// --- Memory Management ---
const analyzeAndStoreMemories = async (userText, aiText) => {
    if (!state.autoAddMemories) return; 

    console.log("Analyzing for memories...");
    const memoryPrompt = `You are a fact extractor. Analyze the following conversation. 
    Identify any new, specific facts about the user (e.g., their name, location, job, preferences, family, projects). 
    If a clear, new fact is stated, extract it as a single, short statement. 
    Examples: "User's name is Rohan." "User lives in Mumbai." "User is a computer science student." "User's favorite color is blue."
    If no new, clear fact is stated, respond with ONLY the word 'NULL'.
    Do not add facts that are already obvious from the conversation (e.g., "User asked a question.").
    Conversation:
    User: "${userText}"
    AI: "${aiText}"`;

    try {
        const extractedFact = await fetchTextAnswer(memoryPrompt, 'en', memoryPrompt); 

        if (extractedFact && extractedFact.toUpperCase() !== 'NULL' && extractedFact.length > 5) {
            const newFact = extractedFact.replace(/^"|"$/g, ''); 
            
            const lowerCaseFact = newFact.toLowerCase();
            if (!state.userMemories.some(mem => mem.toLowerCase() === lowerCaseFact)) {
                console.log("Adding new memory:", newFact);
                state.userMemories.push(newFact);
                localStorage.setItem('userMemories', JSON.stringify(state.userMemories));
                showToast('New memory added!');
            }
        } else {
            console.log("No new memories found.");
        }
    } catch (error) {
        console.error("Error analyzing memory:", error);
    }
};

const loadMemories = () => {
    const savedMemories = localStorage.getItem('userMemories');
    if (savedMemories) {
        state.userMemories = JSON.parse(savedMemories);
    }
};

const displayMemoriesInSettings = () => {
    ui.memoryTextArea.value = state.userMemories.join('\n');
};

const saveMemoriesFromSettings = () => {
    const memories = ui.memoryTextArea.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    state.userMemories = memories;
    localStorage.setItem('userMemories', JSON.stringify(state.userMemories));
    showToast('Memories saved!'); 
    showSettingsView('mainSettings');
};

// --- UI Display & Effects ---

const typewriterEffect = (element, text) => { 
    return new Promise((resolve) => { 
        let i = 0; element.textContent = ""; 
        element.classList.add('typing-cursor'); 
        ui.stopButton.style.display = 'flex'; 
        ui.sendButton.style.display = 'none'; 
        ui.userInput.disabled = true;
        const intervalDuration = BASE_TYPE_SPEED / (state.typingSpeed || 1.0); 
        state.typingIntervalId = setInterval(() => { 
            if (i < text.length) { 
                element.textContent += text.charAt(i); 
                i++; 
                
                const isScrolledToBottom = ui.chatWindow.scrollHeight - ui.chatWindow.clientHeight <= ui.chatWindow.scrollTop + 30;
                if (isScrolledToBottom) {
                    ui.chatWindow.scrollTop = ui.chatWindow.scrollHeight;
                }
            } else { 
                stopTyping(); 
                resolve(); 
            } 
        }, intervalDuration); 
    }); 
};

const displayUserMessage = (content, pairId) => { 
    let pairContainer = ui.chatWindow.querySelector(`.message-pair[data-pair-id="${pairId}"]`); 
    if (!pairContainer) { 
        pairContainer = document.createElement('div'); 
        pairContainer.className = 'message-pair'; 
        pairContainer.dataset.pairId = pairId; 
        ui.chatWindow.appendChild(pairContainer); 
    } 
    const existingUserMsg = pairContainer.querySelector('.user-message'); 
    if(existingUserMsg) existingUserMsg.remove(); 
    
    const userMsg = document.createElement('div'); 
    userMsg.className = 'user-message'; 
    const msgContent = document.createElement('div'); 
    msgContent.className = 'message-content'; 
    
    msgContent.innerHTML = `<b>${(translations[state.uiLanguage] || translations.en).you}:</b>`; 
    
    const contentDiv = document.createElement('div'); 
    contentDiv.className = 'message-text-content'; 
    contentDiv.innerHTML = content; 
    msgContent.appendChild(contentDiv); 
    
    const actions = document.createElement('div'); 
    actions.className = 'message-actions'; 
    actions.innerHTML = `<button class="action-btn" data-action="edit-user" title="Edit"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button><button class="action-btn" data-action="copy-user" title="Copy"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg></button>`; 
    msgContent.appendChild(actions); 
    
    userMsg.appendChild(msgContent); 
    userMsg.appendChild(createSpeakButton(content.replace(/<[^>]*>?/gm, ''))); 
    pairContainer.appendChild(userMsg); 
    
    ui.chatWindow.scrollTop = ui.chatWindow.scrollHeight; 
};

const displayAiMessage = async (answer, isHTML, pairId, forceNoAnimation = false) => { 
    const pairContainer = ui.chatWindow.querySelector(`.message-pair[data-pair-id="${pairId}"]`); 
    if (!pairContainer) return; 
    const existingAiMsg = pairContainer.querySelector('.ai-message'); 
    if (existingAiMsg) existingAiMsg.remove(); 
    const aiMsg = document.createElement('div'); 
    aiMsg.className = 'ai-message'; 
    const content = document.createElement('div'); 
    content.className = 'message-content'; 
    
    const aiHeader = document.createElement('div');
    aiHeader.className = 'ai-message-header';

    const aiLabel = document.createElement('b');
    aiLabel.textContent = `${(translations[state.uiLanguage] || translations.en).ai}:`;
    aiHeader.appendChild(aiLabel);

    const requestsBtn = document.createElement('span');
    requestsBtn.className = 'requests-log-btn';
    requestsBtn.textContent = 'REQUESTS';
    requestsBtn.onclick = () => {
        const logContent = state.apiLog.length > 0 ? 
            state.apiLog.map(log => `<div><strong>${log.title}</strong><pre>${log.content}</pre></div>`).join('') : 
            '<div><strong>Log</strong><pre>No API call details were logged for this response.</pre></div>';
        
        ui.apiLogModalContent.innerHTML = logContent;
        ui.apiLogModal.style.display = 'flex';
    };
    aiHeader.appendChild(requestsBtn);

    content.appendChild(aiHeader);

    const answerContent = document.createElement('div'); 
    answerContent.className = 'message-text-content'; 
    content.appendChild(answerContent); 
    
    const actions = document.createElement('div'); 
    actions.className = 'message-actions'; 
    actions.innerHTML = `<button class="action-btn" data-action="like-ai" title="Like"><svg viewBox="0 0 24 24"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path></svg></button><button class="action-btn" data-action="dislike-ai" title="Dislike"><svg viewBox="0 0 24 24"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17-.79-.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path></svg></button><button class="action-btn" data-action="copy-ai" title="Copy"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg></button><button class="action-btn" data-action="regenerate-ai" title="Regenerate"><svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg></button><button class="action-btn" data-action="share-ai" title="Share"><svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 8.81C7.5 8.31 6.79 8 6 8c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"></path></svg></button>`; 
            
    content.appendChild(actions); 
    aiMsg.appendChild(content); 
    const cleanTextForSpeech = answer.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' '); 
    aiMsg.appendChild(createSpeakButton(cleanTextForSpeech)); 
    pairContainer.appendChild(aiMsg); 
    
    // ✅ CLICKABLE LINKS PATCH
let outputText = answer || "";

// 🔹 Source clean (only if function exists)
if (typeof cleanAiSources === "function") {
    try {
        outputText = cleanAiSources(outputText);
    } catch (e) {
        console.warn("cleanAiSources failed", e);
    }
}

// 🔹 Confidence booster (optional safe)
if (typeof makeAnswerConfident === "function") {
    try {
        outputText = makeAnswerConfident(outputText);
    } catch (e) {
        console.warn("makeAnswerConfident failed", e);
    }
}

// 🔹 Clean + Confidence + Clickable (FINAL PIPELINE)

let finalText = outputText;

// Clean sources (only if function exists)
if (typeof cleanAiSources === "function") {
    try {
        finalText = cleanAiSources(finalText);
    } catch (e) {}
}

// Make answer confident (only if function exists)
if (typeof makeAnswerConfident === "function") {
    try {
        finalText = makeAnswerConfident(finalText);
    } catch (e) {}
}

// Always make links clickable safely
const clickable =
    typeof makeLinksClickable === "function"
        ? makeLinksClickable(finalText)
        : finalText;

if (isHTML) { 
  answerContent.innerHTML = `
  <span style="font-size:11px;color:#8ab4f8;">Verified Answer</span><br><br>
  ${clickable}
`;

answerContent.querySelectorAll('a').forEach(a => {
  a.style.pointerEvents = 'auto';
});


    stopTyping(); 


} else { 
    if (state.isTypingAnimationEnabled && !forceNoAnimation) { 
        try {
            await typewriterEffect(
                answerContent,
                clickable.replace(/<[^>]*>/g, '')
            );
        } catch (e) {
            console.warn("Typing failed, fallback to direct render", e);
            answerContent.innerHTML = clickable;
        }
    } else { 
        answerContent.innerHTML = clickable; 
        stopTyping(); 
    } 
}


    ui.chatWindow.scrollTop = ui.chatWindow.scrollHeight; 
};

const showLoadingIndicator = (messageType = 'Thinking') => {
    if (loadingTextInterval) clearInterval(loadingTextInterval);
    state.apiLog = []; 
    const indicator = document.createElement('div');
    indicator.className = 'loading-indicator';
    indicator.id = 'loadingIndicator';
    
    const logoContainer = document.createElement('div');
    logoContainer.className = 'logo-container';
    logoContainer.innerHTML = `<div class="spinner"></div><img src="https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/405ba96c-ee6d-452d-a99a-38ae2fd6b74b.png" alt="Logo">`;
    
    const loadingTextEl = document.createElement('p');
    
    let messages = [];
    if (messageType === 'image') {
        messages = ['Searching for image', 'Generating image', 'Preparing image'];
    } else if (messageType === 'Getting location') {
        messages = ['Accessing location', 'Getting coordinates'];
    } else if (messageType === 'Getting weather') {
         messages = ['Checking weather', 'Fetching forecast'];
    } else if (messageType === 'Searching web') {
        messages = ['Browsing the web', 'Fetching latest info', 'Analyzing results'];
    } else { 
        messages = ['Thinking', 'Processing', 'Formulating response'];
    }
    
    let messageIndex = 0;
    loadingTextEl.innerHTML = `${messages[messageIndex]}<span class="ellipsis"></span>`;
    
    loadingTextInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % messages.length;
        const p = document.querySelector('#loadingIndicator p');
        if (p) {
            p.innerHTML = `${messages[messageIndex]}<span class="ellipsis"></span>`;
        }
    }, 1800); 

    indicator.appendChild(logoContainer);
    indicator.appendChild(loadingTextEl);
    ui.chatWindow.appendChild(indicator);
    ui.chatWindow.scrollTop = ui.chatWindow.scrollHeight;
};

const hideLoadingIndicator = () => {
    if (loadingTextInterval) clearInterval(loadingTextInterval);
    loadingTextInterval = null;
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) indicator.remove();
};

// --- API Fetching Functions ---

// --- NEW FUNCTION: Fetch Web Search Data ---
async function fetchWebContext(query) {
    const tavilyKey = API_KEYS.TAVILY_API;
    const serpKey = API_KEYS.SERP_API;

    // Try Tavily First (Better for LLM context)
    if (tavilyKey) {
        state.apiLog.push({ title: 'Request to Tavily Search', content: `Query: ${query}` });
        try {
            const response = await fetch("https://api.tavily.com/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    api_key: tavilyKey,
                    query: query,
                    search_depth: "basic",
                    include_answer: true,
                    max_results: 3
                })
            });

            if (response.ok) {
                const data = await response.json();
                state.apiLog.push({ title: 'Response from Tavily', content: JSON.stringify(data, null, 2) });
                
                let context = "Latest Web Information:\n";
                if(data.answer) context += `Summary: ${data.answer}\n`;
                data.results.forEach((res, i) => {
                    context += `Source ${i+1}: ${res.content} (${res.url})\n`;
                });
                return context;
            } else {
                console.warn("Tavily Error", response.status);
                state.apiLog.push({ title: 'Tavily Error', content: `Status: ${response.status}` });
            }
        } catch (e) {
            console.error("Tavily Fetch Error", e);
            state.apiLog.push({ title: 'Tavily Fetch Error', content: e.message });
        }
    }

    // Fallback to SerpApi (Note: Client-side CORS might be an issue without proxy)
    // We will attempt a direct fetch, but usually this requires a backend.
    if (serpKey) {
        state.apiLog.push({ title: 'Request to SerpApi', content: `Query: ${query}` });
        // Using a CORS proxy approach or direct if enabled on key (rare)
        // For this demo code, we format the URL. 
        const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${serpKey}&num=3`;
        
        try {
            const response = await fetch(url); 
            if (response.ok) {
                 const data = await response.json();
                 state.apiLog.push({ title: 'Response from SerpApi', content: JSON.stringify(data, null, 2) });
                 
                 let context = "Latest Google Search Results:\n";
                 if (data.organic_results) {
                     data.organic_results.forEach((res, i) => {
                         context += `Result ${i+1}: ${res.title} - ${res.snippet}\n`;
                     });
                 }
                 return context;
            }
        } catch (e) {
             console.error("SerpApi Fetch Error", e);
             state.apiLog.push({ title: 'SerpApi Fetch Error', content: e.message });
        }
    }

    return null;
}

async function fetchWeatherAnswer(query) {
    const API_KEY = API_KEYS.WEATHER_API;
    
    if (!API_KEY) { 
        console.error("WeatherAPI key is missing!");
        return null;
    }
    
    const API_URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(query)}&aqi=no`;
    
    state.apiLog.push({ title: 'Request to WeatherAPI', content: `Query: ${query}` });

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            const errorData = await response.json();
            console.error("WeatherAPI error:", errorData);
            state.apiLog.push({ title: 'WeatherAPI Error', content: JSON.stringify(errorData) });
            return null;
        }
        const data = await response.json();
        state.apiLog.push({ title: 'Response from WeatherAPI', content: JSON.stringify(data, null, 2) });

        const { location, current } = data;
        
        let answer = `The weather in ${location.name}, ${location.region} is currently ${current.condition.text} and ${current.temp_c}°C.`;
        if(location.country && location.country !== "USA" && location.country !== "United Kingdom") {
            answer = `The weather in ${location.name}, ${location.country} is currently ${current.condition.text} and ${current.temp_c}°C.`
        }
        
        return answer;

    } catch (error) {
        console.error("Failed to fetch weather:", error);
        state.apiLog.push({ title: 'WeatherAPI Fetch Error', content: error.message });
        return null;
    }
}


const fetchTextAnswer = async (prompt, lang, systemPrompt = ENGLISH_PROMPT) => {
    const groqKeys = API_KEYS.GROQ;
    if (!groqKeys || groqKeys.length === 0) { console.error("Groq API keys are missing."); return null; }

    let promptInstruction = "";
    const isSystemTask = systemPrompt.includes(TITLE_GENERATION_PROMPT) || 
                         systemPrompt.includes(MATH_EXPERT_PROMPT) ||
                         systemPrompt.includes("fact extractor") ||
                         systemPrompt.includes("topic keyword");

    if (!isSystemTask) {
        switch (state.answerStyle) { case 'simple': promptInstruction = "Answer in very simple terms. "; break; case 'under30': promptInstruction = "Answer concisely in under 30 words. "; break; case 'under120': promptInstruction = "Answer in about 120 words. "; break; case 'full': promptInstruction = "Provide a detailed and full answer. "; break; }
        switch (state.persona) { case 'friendly': promptInstruction += "Respond in a warm, friendly, and encouraging tone. "; break; case 'professional': promptInstruction += "Respond in a formal and professional tone. "; break; case 'humorous': promptInstruction += "Try to be witty and humorous in your response. "; break; }
    }

    if (lang === 'hi') { promptInstruction = `You must provide the answer in the Hindi language. ${promptInstruction}`; }
    else if (lang === 'hinglish') { promptInstruction = `You must provide the answer in Hinglish. ${promptInstruction}`; }

    const finalPrompt = `${promptInstruction}Here is the user's query: "${prompt}"`;
    
    let contextMessages = [];
    if (!isSystemTask) {
        const history = getHistory(); 
        const chat = history.find(c => c.id === state.currentChatId);
        if (chat) { 
            const recentMessages = chat.messages.slice(-5); 
            recentMessages.forEach(pair => { 
                contextMessages.push({ role: 'user', content: stripHtml(pair.user.content) }); 
                if (pair.ai) { 
                    contextMessages.push({ role: 'assistant', content: stripHtml(pair.ai.content) }); 
                } 
            }); 
        }
    } 
    
    if (state.userMemories.length > 0 && !isSystemTask) {
        const memoryString = "Here are some facts to remember about the user: " + state.userMemories.join('; ');
        systemPrompt = memoryString + "\n\n" + systemPrompt;
    }

    const messages = [ { role: 'system', content: systemPrompt }, ...contextMessages, { role: 'user', content: finalPrompt } ];
    
    state.apiLog.push({ title: 'Request to Groq', content: JSON.stringify(messages, null, 2) });

    for (const key of groqKeys) {
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${key}`}, body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: messages, max_tokens: 1024, temperature: 0.7 }) });
            if (response.ok) {
                const data = await response.json();
                const responseContent = data.choices[0].message.content;
                state.apiLog.push({ title: 'Response from Groq', content: responseContent });
                return responseContent.trim().replace(/^"|"$/g, ''); 
            }
            console.error(`Groq API key [${key.substring(0, 7)}...] failed with status: ${response.status}`);
            state.apiLog.push({ title: 'Groq API Error', content: `Key: ${key.substring(0, 7)}...\nStatus: ${response.status}` });
        } catch (err) {
            console.error(`Groq API key [${key.substring(0, 7)}...] failed with error:`, err);
            state.apiLog.push({ title: 'Groq API Error', content: `Key: ${key.substring(0, 7)}...\nError: ${err.message}` });
        }
    }
    console.error("All Groq API keys failed.");
    return null;
};

// --- Helper: Get Visual Topic ---
async function getVisualTopic(userText) {
    if (!state.isImageGenEnabled) return null;
    
    const VISUAL_ANALYSIS_PROMPT = `Analyze the user's text. 
    If the text refers to something visual like nature, animals, places, physical objects, famous people, or art, output a single, simple English search keyword for that topic (e.g., 'forest', 'tiger', 'Eiffel Tower').
    If the text is abstract, mathematical, code-related, a greeting, or asking for text-based advice, output ONLY the word 'NULL'.
    Do not output sentences. Output ONE word or a short phrase.
    User Text: "${userText}"`;

    try {
        const result = await fetchTextAnswer(userText, 'en', VISUAL_ANALYSIS_PROMPT);
        if (result && result.toUpperCase() !== 'NULL' && !result.includes(' ')) {
             return result.replace(/[^a-zA-Z0-9 ]/g, '');
        } else if (result && result.toUpperCase() !== 'NULL') {
             return result.replace(/[^a-zA-Z0-9 ]/g, '');
        }
        return null;
    } catch (e) {
        console.error("Error getting visual topic:", e);
        return null;
    }
}


// --- Helper: Fetch 3 Images ---
async function fetchUnsplashImages(prompt) {
    const unsplashKeys = API_KEYS.UNSPLASH_ACCESS;
    if (!unsplashKeys || unsplashKeys.length === 0 || unsplashKeys.every(k => k.startsWith("YOUR_"))) { console.error("Unsplash Access Keys are missing or placeholders."); return ""; }

    state.apiLog.push({ title: 'Request to Unsplash (Gallery)', content: `Query: ${prompt}` });

    for (const key of unsplashKeys) {
        if (!key || key.startsWith("YOUR_")) continue;
        const API_URL = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=3&orientation=landscape`;
        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Client-ID ${key}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    state.apiLog.push({ title: 'Response from Unsplash', content: `Found ${data.results.length} images` });
                    
                    let galleryHTML = `<div class="image-gallery">`;
                    data.results.forEach(img => {
                         const imageUrl = img.urls.regular;
                         const openUrl = img.links.html;
                         galleryHTML += `<figure><img src="${imageUrl}" alt="${sanitizeInput(prompt)}" data-open-url="${openUrl}" data-download-url="${imageUrl}"></figure>`;
                    });
                    galleryHTML += `</div>`;
                    return galleryHTML;
                } else {
                    return ""; 
                }
            }
            console.error(`Unsplash key [${key.substring(0, 7)}...] failed with status: ${response.status}`);
        } catch (error) {
            console.error(`Unsplash key [${key.substring(0, 7)}...] failed with error:`, error);
        }
    }
    return "";
}

// --- Chat History Management (localStorage) ---

const getHistory = () => JSON.parse(localStorage.getItem('chatHistory') || '[]');
const saveHistory = (h) => localStorage.setItem('chatHistory', JSON.stringify(h));

const generateAndSaveChatTitle = async (chatId, userText) => {
    try {
        const lang = detectLanguage(userText);
        const aiTitle = await fetchTextAnswer(userText, lang, TITLE_GENERATION_PROMPT + `"${userText}"`);
        
        if (aiTitle) {
            let history = getHistory();
            let chat = history.find(c => c.id === chatId);
            if (chat) {
                chat.title = aiTitle;
                saveHistory(history);
                loadConversationHistory(); 
            }
        }
    } catch (error) {
        console.error("Error generating chat title:", error);
    }
};

const saveConversation = async (userText, aiText, isHTML, pairId, isFirstMessage, rawUserText) => {
    if (state.isTempChatActive) return;

    let history = getHistory(); 
    let chat = history.find(c => c.id === state.currentChatId);
    
    if (!chat) { 
        const titleText = stripHtml(userText).substring(0, 25); 
        state.currentChatId = Date.now(); 
        const title = titleText + (titleText.length > 25 ? '...' : ''); 
        chat = { id: state.currentChatId, title: title, messages: [], isPinned: false }; 
        history.unshift(chat); 
    }
    
    const existingPairIndex = chat.messages.findIndex(p => p.pairId === pairId);
    
    if (existingPairIndex !== -1) { 
        chat.messages[existingPairIndex].ai = { content: aiText, isHTML: isHTML }; 
    } else { 
        chat.messages.push({ pairId: pairId, user: { content: userText }, ai: { content: aiText, isHTML: isHTML } }); 
    }
    
    saveHistory(history); 
    loadConversationHistory(); 

    if (isFirstMessage && rawUserText) {
        await generateAndSaveChatTitle(chat.id, rawUserText);
    }

    if (rawUserText && aiText) {
        analyzeAndStoreMemories(rawUserText, stripHtml(aiText));
    }
};

const loadConversationHistory = () => { 
    let history = getHistory(); 
    history.sort((a, b) => (b.isPinned - a.isPinned) || (b.id - a.id)); 
    ui.chatHistoryContainer.innerHTML = ''; 
    
    history.forEach(chat => { 
        const container = document.createElement('div'); 
        container.className = 'history-item-container'; 
        
        const item = document.createElement('button'); 
        item.className = 'history-item'; 
        item.textContent = `${chat.isPinned ? '📌 ' : ''}${chat.title}`; 
        item.dataset.chatId = chat.id; 
        item.onclick = () => loadSpecificConversation(chat.id); 
        
        if (chat.id === state.currentChatId && !state.isTempChatActive) { 
            item.classList.add('active'); 
        } 
        
        const menuBtn = document.createElement('button'); 
        menuBtn.className = 'history-menu-btn'; 
        menuBtn.innerHTML = '&#8942;'; 
        menuBtn.setAttribute('aria-label', 'Chat options'); 
        
        const dropdown = document.createElement('div'); 
        dropdown.className = 'history-dropdown'; 
        dropdown.innerHTML = `<button class="dropdown-item" data-action="pin" data-id="${chat.id}">${chat.isPinned ? 'Unpin' : 'Pin'}</button><button class="dropdown-item" data-action="edit" data-id="${chat.id}">Edit</button><button class="dropdown-item" data-action="delete" data-id="${chat.id}">Delete</button>`; 
        
        menuBtn.onclick = (e) => { 
            e.stopPropagation(); 
            document.querySelectorAll('.history-dropdown.show').forEach(d => {
                if (d !== dropdown) d.classList.remove('show');
            });
            dropdown.classList.toggle('show');
            
            if (dropdown.classList.contains('show')) {
                const containerRect = ui.chatHistoryContainer.getBoundingClientRect();
                const dropdownRect = dropdown.getBoundingClientRect();
                
                dropdown.style.top = '40px';
                dropdown.style.bottom = 'auto';

                if (dropdownRect.bottom > (containerRect.bottom - 10)) { 
                    dropdown.style.top = 'auto';
                    dropdown.style.bottom = '35px'; 
                }
            }
        }; 
        
        container.append(item, menuBtn, dropdown); 
        ui.chatHistoryContainer.appendChild(container); 
    }); 
};

const loadSpecificConversation = (id) => { 
    document.body.classList.remove('temp-chat-active-border'); 
    ui.appContainer.classList.remove('temp-chat-active-border'); 
    ui.disclaimerText.textContent = "Aryanta AI is still in development.";
    ui.toolsTempChatButton.textContent = "Temporary Chat";
    ui.toolsTempChatButton.classList.remove('temp-chat-active');
    
    state.isTempChatActive = false; 
    ui.sidebar.style.opacity = '1';
    ui.sidebar.style.pointerEvents = 'auto';

    document.querySelectorAll('.history-item').forEach(item => item.classList.remove('active')); 
    const activeItem = document.querySelector(`.history-item[data-chat-id='${id}']`); 
    if(activeItem) activeItem.classList.add('active'); 
    if(window.innerWidth <= 768){ ui.sidebar.classList.remove('show'); ui.sidebarOverlay.classList.remove('show')} 
    
    const chat = getHistory().find(c => c.id === id); 
    if (!chat) return; 
    
    state.currentChatId = id; 
    ui.chatWindow.innerHTML = ''; 
    ui.chatWatermark.style.opacity = '0'; 
    ui.predefinedQuestionsContainer.style.display = 'none'; 
    
    chat.messages.forEach(pair => { 
        displayUserMessage(pair.user.content, pair.pairId); 
        if (pair.ai) { 
            displayAiMessage(pair.ai.content, pair.ai.isHTML, pair.pairId, true); 
        } 
    }); 
};

const startTempChat = () => {
    document.body.classList.add('temp-chat-active-border'); 
    ui.appContainer.classList.add('temp-chat-active-border'); 
    ui.disclaimerText.textContent = "You are in a Temporary Chat. This conversation will not be saved.";
    ui.toolsTempChatButton.textContent = "Close Temporary Chat";
    ui.toolsTempChatButton.classList.add('temp-chat-active');

    state.isTempChatActive = true;
    state.currentChatId = null;
    ui.chatWindow.innerHTML = '';
    ui.chatWatermark.style.opacity = '0.069';
    document.querySelectorAll('.history-item').forEach(item => item.classList.remove('active'));
    
    ui.sidebar.style.opacity = '0.5';
    ui.sidebar.style.pointerEvents = 'none';
    if (window.innerWidth <= 768) {
        ui.sidebar.classList.remove('show');
        ui.sidebarOverlay.classList.remove('show');
    }
    ui.toolsDropdown.classList.remove('show');

    setTimeout(() => {
        const pairId = Date.now();
        displayAiMessage("This conversation will not be saved to your history. How can I help?", false, pairId);
    }, 200);

    ui.predefinedQuestionsContainer.style.display = 'none';
    ui.userInput.focus();
};

const startNewChat = () => { 
    document.body.classList.remove('temp-chat-active-border'); 
    ui.appContainer.classList.remove('temp-chat-active-border'); 
    ui.disclaimerText.textContent = "Aryanta AI";
    ui.toolsTempChatButton.textContent = "Temporary Chat";
    ui.toolsTempChatButton.classList.remove('temp-chat-active');

    state.isTempChatActive = false; 
    ui.sidebar.style.opacity = '1';
    ui.sidebar.style.pointerEvents = 'auto';

    state.currentChatId = null; 
    ui.chatWindow.innerHTML = ''; 
    ui.chatWatermark.style.opacity = '0.069'; 
    document.querySelectorAll('.history-item').forEach(item => item.classList.remove('active')); 
    
    setTimeout(() => { 
        const pairId = Date.now(); 
        displayAiMessage("Hello! How can I help you today?", false, pairId); 
    }, 200);
    
    const questions = (translations[state.uiLanguage] || translations.en).predefined; 
    ui.predefinedQuestionsContainer.innerHTML = '';
    questions.forEach(q => { 
        const button = document.createElement('button'); 
        button.className = 'predefined-q'; 
        button.innerText = q; 
        button.onclick = () => { ui.userInput.value = q; sendMessage(); }; 
        ui.predefinedQuestionsContainer.appendChild(button); 
    }); 
    
    ui.predefinedQuestionsContainer.style.display = 'flex'; 
    ui.userInput.focus(); 
};

// --- Core Message Sending and Response Logic ---

const sendMessage = async () => {
    const messageText = ui.userInput.value.trim();
    if (messageText === '') return;

    const sanitizedMessage = profanityFilter(sanitizeInput(messageText));
    if (sanitizedMessage !== messageText) { ui.userInput.value = "Content blocked."; setTimeout(() => ui.userInput.value = "", 1000); return; }

    ui.chatWatermark.style.opacity = '0'; 
    ui.predefinedQuestionsContainer.style.display = 'none';
    ui.sendButton.disabled = true; 
    ui.userInput.disabled = true;
    
    let userMessageContent = `<div>${sanitizedMessage}</div>`;
    
    const pairId = Date.now();
    displayUserMessage(userMessageContent, pairId);
    
    ui.userInput.value = ''; 
    ui.userInput.style.height = '52px';
    const isFirst = state.currentChatId === null && !state.isTempChatActive;
    
    await generateAndDisplayResponse(sanitizedMessage, pairId, userMessageContent, isFirst);
    setTimeout(() => { 
        ui.sendButton.disabled = false; 
        ui.userInput.disabled = false; 
        ui.userInput.focus(); 
    }, 500);
};

const generateAndDisplayResponse = async (messageText, pairId, userMessageContent, isFirstMessage = false) => {
    const lowerCaseMessage = messageText.toLowerCase().replace(/[?.,!]/g, '');
    const langSetting = localStorage.getItem('appLanguage') || 'auto';
    
    let responseLang;
    if (langSetting === 'en') {
        responseLang = 'en';
    } else if (langSetting === 'auto') {
        responseLang = detectLanguage(messageText);
    } else {
        responseLang = langSetting;
    }

    const locationKeywords = ['weather', 'my location', 'near me', 'nearby', 'temperature', 'mausam'];
    const isLocationRequest = locationKeywords.some(k => lowerCaseMessage.includes(k));

    if (isLocationRequest && navigator.geolocation) {
        showLoadingIndicator('Getting location');
        navigator.geolocation.getCurrentPosition(
            async (position) => { 
                const { latitude, longitude } = position.coords;
                
                const weatherAnswer = await fetchWeatherAnswer(`${latitude},${longitude}`);
                hideLoadingIndicator();

                // --- FIX: SCOPE CORRECTION START ---
                let finalAnswer = ""; // Initialize here
                if (weatherAnswer) {
                    finalAnswer = profanityFilter(weatherAnswer);
                } else {
                    console.log("WeatherAPI failed, falling back to Groq for location query.");
                    const locationPrompt = `User is at latitude: ${latitude}, longitude: ${longitude}. User's question: "${messageText}"`;
                    let finalSystemPrompt = ENGLISH_PROMPT;
                    if (responseLang === 'hinglish') finalSystemPrompt = HINGLISH_PROMPT;
                    if (state.isStudentModeEnabled) finalSystemPrompt = STUDENT_MODE_PROMPT + finalSystemPrompt;
                    finalAnswer = await fetchTextAnswer(locationPrompt, responseLang, finalSystemPrompt);
                }
                
                if (!finalAnswer) finalAnswer = "Sorry, I couldn't process your location request.";
                // --- FIX: SCOPE CORRECTION END ---
                
                displayAiMessage(finalAnswer, false, pairId);
                await saveConversation(userMessageContent, finalAnswer, false, pairId, isFirstMessage, messageText);
            },
            async (error) => { 
                console.error("Geolocation error:", error);
                
                if (isLocationRequest) {
                    showLoadingIndicator('Getting weather');
                    const query = messageText.replace(/weather in|weather for|weather|mausam/gi, '').trim();
                    const weatherAnswer = await fetchWeatherAnswer(query);
                    hideLoadingIndicator();
                    if (weatherAnswer) {
                        const finalAnswer = profanityFilter(weatherAnswer);
                        displayAiMessage(finalAnswer, false, pairId);
                        await saveConversation(userMessageContent, finalAnswer, false, pairId, isFirstMessage, messageText);
                        return; 
                    }
                }
                
                hideLoadingIndicator();
                let aiAnswer = "I couldn't get your location. Please enable location permissions. For now, you can ask me again specifying a city (e.g., 'weather in Delhi').";
                displayAiMessage(aiAnswer, false, pairId);
                await saveConversation(userMessageContent, aiAnswer, false, pairId, isFirstMessage, messageText);
            }
        );
        return; 
    }
    
    const localKnowledgeBase = (translations[responseLang] || translations.en).localKnowledge;
    let aiAnswer = null, isHTML = false;
    
    const isWeatherRequest = locationKeywords.some(k => lowerCaseMessage.includes(k));

    // --- DETERMINE LOADING STATE ---
    if (isWeatherRequest) showLoadingIndicator('Getting weather');
    else if (state.isLatestInfoEnabled) showLoadingIndicator('Searching web');
    else showLoadingIndicator('Thinking');

    let finalSystemPrompt = ENGLISH_PROMPT;
    if (responseLang === 'hinglish') {
        finalSystemPrompt = HINGLISH_PROMPT;
    }
    if (state.isStudentModeEnabled) {
        finalSystemPrompt = STUDENT_MODE_PROMPT + finalSystemPrompt;
    }
    
    // --- PARALLEL EXECUTION: Get Text + Get Image Topic ---
    let visualTopicPromise = getVisualTopic(messageText);
    let textAnswerPromise;

    try {
        if (isWeatherRequest) {
            const query = messageText.replace(/weather in|weather for|weather|mausam/gi, '').trim();
            textAnswerPromise = fetchWeatherAnswer(query).then(ans => {
                if (!ans) return fetchTextAnswer(messageText, responseLang, finalSystemPrompt);
                return ans;
            });
        }
        else if (/\b(time|samay|baje)\b/.test(lowerCaseMessage)) {
            textAnswerPromise = Promise.resolve(`The current time is ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
        } else if (/\b(date|taarikh|saal|year)\b/.test(lowerCaseMessage)) {
            textAnswerPromise = Promise.resolve(`Today is ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`);
        } 
        // --- NEW LOGIC: SEARCH WEB IF ENABLED ---
        else if (state.isLatestInfoEnabled) {
            const searchContext = await fetchWebContext(messageText);
            
            if (searchContext) {
                 finalSystemPrompt += `\n\n${searchContext}\n\nINSTRUCTION: Answer the user's question using the 'Latest Web Information' or 'Search Results' provided above. Cite the source if possible.`;
            }
            // Proceed to Groq with the augmented prompt
            textAnswerPromise = fetchTextAnswer(messageText, responseLang, finalSystemPrompt);
        }
        // ----------------------------------------
        else {
            const localAns = localKnowledgeBase[lowerCaseMessage];
            if (localAns) {
                 textAnswerPromise = Promise.resolve(localAns);
                 visualTopicPromise = Promise.resolve(null);
            } else {
                const mathRegex = /^[ \d()+\-*/.^]+$/;
                const potentialMath = messageText.toLowerCase().replace(/what is|calculate/gi, '').trim();
                
                if (mathRegex.test(potentialMath) && potentialMath.length > 2) {
                    finalSystemPrompt = MATH_EXPERT_PROMPT + `"${messageText}"`;
                    textAnswerPromise = fetchTextAnswer(messageText, responseLang, finalSystemPrompt);
                } else {
                    textAnswerPromise = fetchTextAnswer(messageText, responseLang, finalSystemPrompt);
                }
            }
        }

        // Wait for both text and topic detection
        const [textResult, visualTopic] = await Promise.all([textAnswerPromise, visualTopicPromise]);
        
        aiAnswer = textResult;
        
        // If a topic was detected, fetch 3 images and append them
        if (visualTopic && state.isImageGenEnabled) {
            // Force description + images
            const descPrompt = `
                Describe ${visualTopic} in 60–80 words.
                Do NOT mention images.
                Do NOT tell the user to search.
                Do NOT say "here is your image".
                ONLY describe the animal/object itself.
            `;
            const desc = await fetchTextAnswer(descPrompt, 'en', ENGLISH_PROMPT);
            const imgsHTML = await fetchUnsplashImages(visualTopic);

            aiAnswer = `
                <div class="message-description">${desc}</div>
                <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
                    ${imgsHTML}
                </div>
            `;
            isHTML = true;

            hideLoadingIndicator();
            displayAiMessage(aiAnswer, true, pairId);
            await saveConversation(userMessageContent, aiAnswer, true, pairId, isFirstMessage, messageText);
            return;
        }

    } catch (error) {
        console.error("Error during response generation:", error);
        aiAnswer = "I'm sorry, but I encountered an error while processing your request. Please try again.";
    } finally {
        hideLoadingIndicator();
    }
    
    const finalAnswer = (aiAnswer && aiAnswer !== '') 
        ? aiAnswer 
        : "I'm not sure how to respond to that, yaar. Could you try rephrasing?";
    
    displayAiMessage(finalAnswer, isHTML, pairId);
    await saveConversation(userMessageContent, finalAnswer, isHTML, pairId, isFirstMessage, messageText);
};

// --- Speech Synthesis/Recognition ---

const createSpeakButton = (textToSpeak) => { 
    const speakBtn = document.createElement('button'); 
    speakBtn.className = 'speak-btn'; 
    speakBtn.title = 'Read Aloud'; 
    speakBtn.setAttribute('aria-label', 'Read message aloud'); 
    speakBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>`; 
    
    speakBtn.onclick = () => { 
        if (speechSynthesis.speaking && state.currentSpeakingButton === speakBtn) { 
            speechSynthesis.cancel(); 
            return; 
        } 
        if (speechSynthesis.speaking) { 
            speechSynthesis.cancel(); 
        } 
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak); 
        const voices = speechSynthesis.getVoices(); 
        const detectedLang = detectLanguage(textToSpeak); 
        utterance.lang = detectedLang === 'hi' ? 'hi-IN' : 'en-US'; 
        
        const indianVoice = voices.find(v => v.lang === 'en-IN'); 
        const selectedVoice = voices.find(v => v.voiceURI === state.selectedVoiceURI); 
        
        if (detectedLang === 'en' && indianVoice) { 
            utterance.voice = indianVoice; 
        } else if (selectedVoice) { 
            utterance.voice = selectedVoice; 
        } 
        
        utterance.onstart = () => { 
            if (state.currentSpeakingButton) state.currentSpeakingButton.classList.remove('speaking'); 
            speakBtn.classList.add('speaking'); 
            state.currentSpeakingButton = speakBtn; 
        }; 
        utterance.onend = () => { 
            if (state.currentSpeakingButton) state.currentSpeakingButton.classList.remove('speaking'); 
            state.currentSpeakingButton = null; 
        }; 
        utterance.onerror = () => { 
            if (state.currentSpeakingButton) state.currentSpeakingButton.classList.remove('speaking'); 
            state.currentSpeakingButton = null; 
        }; 
        speechSynthesis.speak(utterance); 
    }; 
    return speakBtn; 
};

const populateVoiceList = () => {
    const voices = speechSynthesis.getVoices();
    ui.voiceSelectionContainer.innerHTML = '';
    
    const voicePreferences = {
        enMale: v => v.lang.startsWith('en-') && (v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Google US English') || (v.name.includes('Male') && !v.name.includes('Female'))),
        enFemale: v => v.lang.startsWith('en-') && (v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Female')),
        hiMale: v => v.lang.startsWith('hi-') && (v.name.includes('Google हिन्दी') || v.name.includes('Male') || v.name.includes('Hemant')),
        hiFemale: v => v.lang.startsWith('hi-') && (v.name.includes('Kalpana') || v.name.includes('Google हिन्दी') || v.name.includes('Female') || v.name.includes('Ritu'))
    };
    
    const enMale = voices.find(voicePreferences.enMale);
    const enFemale = voices.find(voicePreferences.enFemale);
    const hiMale = voices.find(voicePreferences.hiMale);
    const hiFemale = voices.find(voicePreferences.hiFemale);
    
    const selectedVoices = [
        { voice: enMale, label: 'English (Male)' },
        { voice: enFemale, label: 'English (Female)' },
        { voice: hiMale, label: 'Hindi (Male)' },
        { voice: hiFemale, label: 'Hindi (Female)' }
    ].filter(item => item.voice); 
    
    const uniqueVoices = [...new Map(selectedVoices.map(item => [item.voice.voiceURI, item])).values()];

    const renderVoiceOption = (voice, label) => {
        const option = document.createElement('div');
        option.className = 'voice-option';
        option.dataset.voiceUri = voice.voiceURI;
        option.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"></path></svg><span>${label} (${voice.name.replace(/Microsoft|Google/g, '').trim()})</span>`;
        option.addEventListener('click', () => {
            state.tempSelectedVoiceURI = voice.voiceURI;
            document.querySelectorAll('.voice-option').forEach(el => el.classList.remove('selected'));
            option.classList.add('selected');
            if (speechSynthesis.speaking) speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(voice.lang.startsWith('hi-') ? "यह चुनी हुई आवाज़ है।" : "This is the selected voice.");
            utterance.voice = voice;
            speechSynthesis.speak(utterance);
        });
        ui.voiceSelectionContainer.appendChild(option);
    };

    if (uniqueVoices.length > 0) {
        uniqueVoices.forEach(item => renderVoiceOption(item.voice, item.label));
    } else {
        ui.voiceSelectionContainer.innerHTML = '<p>Could not find specific voices. Loading available defaults...</p>';
        const fallbackVoices = voices.filter(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en-US') || v.lang.startsWith('hi-IN')).slice(0, 4);
        fallbackVoices.forEach(voice => renderVoiceOption(voice, `${voice.name} (${voice.lang})`));
    }
    updateVoiceSelectionUI();
};

const updateVoiceSelectionUI = () => { 
    state.tempSelectedVoiceURI = state.selectedVoiceURI; 
    document.querySelectorAll('.voice-option').forEach(el => el.classList.remove('selected')); 
    if (state.selectedVoiceURI) { 
        const currentOption = document.querySelector(`.voice-option[data-voice-uri="${state.selectedVoiceURI}"]`); 
        if (currentOption) currentOption.classList.add('selected'); 
    } 
};

// --- Settings & UI Logic ---

const handleHistoryMenu = (action, id) => { 
    let h = getHistory(); 
    const c = h.find(c => c.id === id); 
    if (!c) return; 
    switch(action) { 
        case 'pin': 
            c.isPinned = !c.isPinned; 
            break; 
        case 'edit': 
            const newTitle = prompt('Enter new title:', c.title); 
            if(newTitle) c.title = newTitle.trim(); 
            break; 
        case 'delete': 
            if(window.confirm('Delete this chat?')){ 
                h = h.filter(c => c.id !== id); 
                if (id === state.currentChatId) startNewChat(); 
            } 
            break; 
    } 
    saveHistory(h); 
    loadConversationHistory(); 
};

const showSettingsView = (viewId) => { 
    ui.settingsViews.forEach(view => view.classList.remove('active')); 
    const targetView = document.getElementById(viewId); 
    if (viewId === 'mainSettings') { 
        ui.settingsBackButton.style.display = 'none'; 
        ui.settingsTitle.innerText = "Settings"; 
    } else { 
        ui.mainSettingsView.classList.remove('active'); 
        ui.settingsBackButton.style.display = 'block'; 
        const buttonText = document.querySelector(`.main-setting-item[data-view='${viewId}'] span`).innerText; 
        ui.settingsTitle.innerText = buttonText; 
    } 
    if (targetView) targetView.classList.add('active'); 
    if (viewId === 'dataSettings') { 
        ui.aryantaIdDisplay.textContent = getOrCreateAryantaId(); 
    } 
    if (viewId === 'memorySettings') { 
        displayMemoriesInSettings(); 
    }
};

const updateSettingsUI = () => { 
    document.querySelectorAll('#answer-style-options .data-option-btn').forEach(btn => { 
        btn.classList.toggle('selected', btn.dataset.style === state.answerStyle); 
    }); 
    document.querySelectorAll('#persona-options .data-option-btn').forEach(btn => { 
        btn.classList.toggle('selected', btn.dataset.persona === state.persona); 
    }); 
};

// --- Live Mode Logic ---

const startListening = () => { 
    if (state.isListening || !recognition) return; 
    try { 
        recognition.start(); 
    } catch (e) { 
        console.error("Recognition start error:", e); 
        state.isListening = false; 
    } 
};

const speakLiveAnswer = (text) => { 
    if (speechSynthesis.speaking) speechSynthesis.cancel(); 
    state.isSpeaking = true; 
    ui.liveStatus.textContent = 'Speaking...'; 
    
    const utterance = new SpeechSynthesisUtterance(text); 
    const voices = speechSynthesis.getVoices(); 
    const detectedLang = detectLanguage(text); 
    utterance.lang = detectedLang === 'hi' ? 'hi-IN' : 'en-US'; 
    
    const indianVoice = voices.find(v => v.lang === 'en-IN'); 
    const selectedVoice = voices.find(v => v.voiceURI === state.selectedVoiceURI); 
    
    if (detectedLang === 'en' && indianVoice) utterance.voice = indianVoice; 
    else if (selectedVoice) utterance.voice = selectedVoice; 
    
    utterance.onend = () => { 
        state.isSpeaking = false; 
        if (state.isLiveModeActive) { 
            startListening(); 
        } else { 
            ui.liveStatus.textContent = 'Click the logo to speak'; 
        } 
    }; 
    utterance.onerror = (e) => { 
        console.error("Speech synthesis error:", e); 
        state.isSpeaking = false; 
        if (state.isLiveModeActive) startListening(); 
    }; 
    speechSynthesis.speak(utterance); 
};

const generateAiResponseForLiveMode = async (text) => { 
    const lowerCaseMessage = text.toLowerCase().replace(/[?.,!]/g, ''); 
    const langSetting = localStorage.getItem('appLanguage') || 'auto'; 
    let responseLang = langSetting === 'auto' ? detectLanguage(text) : langSetting; 
    const localKnowledgeBase = (translations[responseLang] || translations.en).localKnowledge; 
    let aiAnswer = localKnowledgeBase[lowerCaseMessage]; 
    if (!aiAnswer) { 
        // Note: We don't use web search for live mode for speed
        aiAnswer = await fetchTextAnswer(`Answer this concisely for a voice assistant: "${text}"`, responseLang); 
    } 
    return stripHtml(aiAnswer); 
};

const openLiveMode = () => { 
    state.isLiveModeActive = true; 
    ui.liveModeOverlay.style.display = 'flex'; 
    setTimeout(() => ui.liveModeOverlay.style.opacity = '1', 10); 
    ui.appContainer.style.filter = 'blur(5px)'; 
};

const closeLiveMode = () => { 
    state.isLiveModeActive = false; 
    if (recognition) recognition.abort(); 
    if (speechSynthesis.speaking) speechSynthesis.cancel(); 
    state.isListening = false; 
    state.isSpeaking = false; 
    ui.liveLogo.classList.remove('listening'); 
    ui.liveStatus.textContent = 'Click the logo to speak'; 
    ui.liveModeOverlay.style.opacity = '0'; 
    ui.appContainer.style.filter = 'none'; 
    setTimeout(() => { ui.liveModeOverlay.style.display = 'none'; }, 400); 
};

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const menuToggleBtn = document.getElementById("menu-toggle-button");

// Open sidebar
if (menuToggleBtn) {
  menuToggleBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
  });
}

// Close sidebar by tapping outside
if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
  });
}

// Auto-close when chat starts (mobile UX)
if (ui.sendButton) {
  ui.sendButton.addEventListener("click", () => {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
  });
}

// --- Initialization and Event Listeners ---

document.addEventListener('DOMContentLoaded', () => { 
    getOrCreateAryantaId();
    const savedLang = localStorage.getItem('appLanguage') || 'auto';
    const radio = document.querySelector(`input[name="language"][value="${savedLang}"]`); 
    if (radio) radio.checked = true;
    applyLanguage(savedLang);
    
    state.isTypingAnimationEnabled = localStorage.getItem('typingAnimation') !== 'false'; 
    ui.typingAnimationToggle.checked = state.isTypingAnimationEnabled; 
    
    state.typingSpeed = parseFloat(localStorage.getItem('typingSpeed') || '1.0');
    ui.typingSpeedSlider.value = state.typingSpeed * 100;
    ui.typingSpeedLabel.textContent = `${ui.typingSpeedSlider.value}%`; 

    state.isImageGenEnabled = localStorage.getItem('imageGenEnabled') === 'true'; 
    ui.imageGenToggle.checked = state.isImageGenEnabled;

    state.isStudentModeEnabled = localStorage.getItem('studentModeEnabled') === 'true';
    ui.studentModeToggle.checked = state.isStudentModeEnabled;
    
    // --- NEW: LATEST INFO TOGGLE INIT ---
    state.isLatestInfoEnabled = localStorage.getItem('latestInfoEnabled') === 'true';
    if(ui.latestInfoToggle) ui.latestInfoToggle.checked = state.isLatestInfoEnabled;
    // ------------------------------------

    state.autoAddMemories = localStorage.getItem('autoAddMemories') === 'true';
    ui.autoAddMemoryToggle.checked = state.autoAddMemories;
    loadMemories(); 

    state.selectedVoiceURI = localStorage.getItem('selectedVoiceURI');
    state.answerStyle = localStorage.getItem('answerStyle') || 'default';
    state.persona = localStorage.getItem('persona') || 'default';
    
    updateSettingsUI();
    loadConversationHistory(); 
    if (speechSynthesis.getVoices().length) { populateVoiceList(); } else { speechSynthesis.onvoiceschanged = populateVoiceList; }
    ui.disclaimerText.textContent = 'Aryanta AI is still in development and may sometimes give wrong answers. Please check its responses.';
    
    ui.closeModalButton.style.display = 'none';
    
    // Start the chat application immediately (skip start screen)
    startNewChat(); 

    // Load sidebar collapsed state
    if (localStorage.getItem('sidebarCollapsed') === 'true' && window.innerWidth > 768) {
        document.body.classList.add('sidebar-collapsed');
    }
    
    // --- Event Listeners ---

    ui.newChatButton.addEventListener('click', startNewChat);
    
    ui.toolsTempChatButton.addEventListener('click', () => {
        if (state.isTempChatActive) {
            startNewChat(); 
        } else {
            startTempChat();
        }
    });

    ui.userInput.addEventListener('input', () => { 
        ui.userInput.style.height = 'auto'; 
        ui.userInput.style.height = (ui.userInput.scrollHeight) + 'px'; 
    });
    
    ui.sendButton.addEventListener('click', sendMessage);
    ui.stopButton.addEventListener('click', stopTyping);
    
    ui.userInput.addEventListener('keydown', (e) => { 
        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault(); 
            sendMessage(); 
        } 
    });

    document.addEventListener('click', (e) => { 
        if (e.target.closest('.dropdown-item') && e.target.closest('#chatHistory')) { 
            const item = e.target.closest('.dropdown-item'); 
            handleHistoryMenu(item.dataset.action, parseInt(item.dataset.id)); 
        } 
        if (!e.target.matches('.history-menu-btn')) { 
            document.querySelectorAll('.history-dropdown').forEach(d => d.classList.remove('show')); 
        }
        if (!e.target.closest('#tools-button') && !e.target.closest('#tools-dropdown')) {
            ui.toolsDropdown.classList.remove('show');
        }
    });

    ui.toolsButton.addEventListener('click', () => {
        ui.toolsDropdown.classList.toggle('show');
    });

    ui.imageGenToggle.addEventListener('change', (e) => {
        state.isImageGenEnabled = e.target.checked;
        localStorage.setItem('imageGenEnabled', state.isImageGenEnabled);
    });
    
    ui.studentModeToggle.addEventListener('change', (e) => {
        state.isStudentModeEnabled = e.target.checked;
        localStorage.setItem('studentModeEnabled', state.isStudentModeEnabled);
    });

    // --- NEW: LATEST INFO EVENT LISTENER ---
    if(ui.latestInfoToggle) {
        ui.latestInfoToggle.addEventListener('change', (e) => {
            state.isLatestInfoEnabled = e.target.checked;
            localStorage.setItem('latestInfoEnabled', state.isLatestInfoEnabled);
        });
    }
    // ---------------------------------------

    ui.autoAddMemoryToggle.addEventListener('change', (e) => {
        state.autoAddMemories = e.target.checked;
        localStorage.setItem('autoAddMemories', state.autoAddMemories);
    });
    
    ui.settingsButton.addEventListener('click', () => { 
        updateVoiceSelectionUI(); 
        showSettingsView('mainSettings'); 
        ui.settingsModal.style.display = 'flex'; 
    });
    
    ui.closeModalButton.addEventListener('click', () => { ui.settingsModal.style.display = 'none'; });
    ui.settingsModalXClose.addEventListener('click', () => { ui.settingsModal.style.display = 'none'; });

    ui.saveSettingsButton.addEventListener('click', () => {
        const selectedLang = document.querySelector('input[name="language"]:checked').value; 
        localStorage.setItem('appLanguage', selectedLang); 
        applyLanguage(selectedLang);
        
        state.isTypingAnimationEnabled = ui.typingAnimationToggle.checked; 
        localStorage.setItem('typingAnimation', state.isTypingAnimationEnabled); 
        
        state.typingSpeed = parseFloat(ui.typingSpeedSlider.value) / 100;
        localStorage.setItem('typingSpeed', state.typingSpeed);

        state.selectedVoiceURI = state.tempSelectedVoiceURI; 
        localStorage.setItem('selectedVoiceURI', state.selectedVoiceURI);
        localStorage.setItem('answerStyle', state.answerStyle); 
        localStorage.setItem('persona', state.persona);
        ui.settingsModal.style.display = 'none'; 
    });

    ui.saveMemoriesButton.addEventListener('click', saveMemoriesFromSettings);

    ui.typingSpeedSlider.addEventListener('input', (e) => {
        ui.typingSpeedLabel.textContent = `${e.target.value}%`;
    });

    ui.settingsModal.addEventListener('click', (e) => { if (e.target === ui.settingsModal) { ui.settingsModal.style.display = 'none'; } });

    ui.menuToggleButton.addEventListener('click', () => { ui.sidebar.classList.toggle('show'); ui.sidebarOverlay.classList.toggle('show'); });
    
    ui.sidebarToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', document.body.classList.contains('sidebar-collapsed'));
    });

    ui.sidebarOverlay.addEventListener('click', () => { ui.sidebar.classList.remove('show'); ui.sidebarOverlay.classList.remove('show'); });
    
    ui.imageModal.addEventListener('click', (e) => { 
        if (e.target.closest('.close-image-button') || e.target === ui.imageModal) { 
            ui.imageModal.classList.remove('show'); 
        } 
    });
    
    document.querySelectorAll('.main-setting-item').forEach(item => { 
        item.addEventListener('click', () => showSettingsView(item.dataset.view)); 
    });
    
    ui.settingsBackButton.addEventListener('click', () => showSettingsView('mainSettings'));

    ui.clearAllButton.addEventListener('click', () => { 
        if(window.confirm('Are you sure you want to delete all chat history? This cannot be undone.')) { 
            localStorage.setItem('chatHistory', '[]'); 
            loadConversationHistory(); 
            startNewChat(); 
            ui.settingsModal.style.display = 'none'; 
        } 
    });
    
    ui.deleteAllDataButton.addEventListener('click', () => { 
        if(window.confirm('WARNING: This will delete all chats, memories, and settings, but will keep your unique Aryanta ID. This cannot be undone. Are you sure?')) { 
            const aryantaId = localStorage.getItem('aryantaId'); 
            localStorage.clear(); 
            if (aryantaId) { localStorage.setItem('aryantaId', aryantaId); } 
            location.reload(); 
        } 
    });
    
    document.querySelectorAll('#answer-style-options .data-option-btn').forEach(btn => { 
        btn.addEventListener('click', () => { 
            state.answerStyle = btn.dataset.style; 
            updateSettingsUI(); 
        }); 
    });
    
    document.querySelectorAll('#persona-options .data-option-btn').forEach(btn => { 
        btn.addEventListener('click', () => { 
            state.persona = btn.dataset.persona; 
            updateSettingsUI(); 
        }); 
    }); 

    ui.imageDownloadButton.addEventListener('click', async () => {
        const downloadUrl = ui.fullscreenImage.src;
        if (!downloadUrl) return;
        
        ui.imageDownloadButton.textContent = "Downloading...";
        try {
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `aryanta-ai-image-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            
        } catch (error) {
            console.error("Image download failed:", error);
            showToast("Sorry, the image could not be downloaded."); 
        } finally {
            ui.imageDownloadButton.textContent = "Download";
        }
    });

    ui.imageCopyUrlButton.addEventListener('click', () => {
        const url = ui.fullscreenImage.src;
        navigator.clipboard.writeText(url).then(() => {
            showToast("Image URL copied!"); 
        }, (err) => {
            console.error('Failed to copy URL: ', err);
            showToast("Failed to copy URL."); 
        });
    });

    ui.shareModalClose.addEventListener('click', () => { ui.shareModal.style.display = 'none'; });
    ui.shareModalXClose.addEventListener('click', () => { ui.shareModal.style.display = 'none'; }); 
    ui.shareModal.addEventListener('click', (e) => { if (e.target === ui.shareModal) { ui.shareModal.style.display = 'none'; } });

    ui.apiLogModalXClose.addEventListener('click', () => { ui.apiLogModal.style.display = 'none'; });
    ui.apiLogModal.addEventListener('click', (e) => { if (e.target === ui.apiLogModal) { ui.apiLogModal.style.display = 'none'; } });


    ui.chatWindow.addEventListener('click', async (e) => {
        if (e.target.tagName === 'IMG' && e.target.closest('.message-pair')) {
            const img = e.target;
            const openUrl = img.dataset.openUrl;
            const downloadUrl = img.dataset.downloadUrl;

            ui.fullscreenImage.src = downloadUrl;
            
            if (openUrl) {
                ui.imageOpenLink.href = openUrl;
                ui.imageOpenLink.style.display = 'inline-block';
            } else {
                ui.imageOpenLink.style.display = 'none';
            }
            
            ui.imageDownloadButton.textContent = "Download";
            ui.imageCopyUrlButton.textContent = "Copy URL";
            
            ui.imageModal.classList.add('show'); 
            return; 
        }

        const button = e.target.closest('.action-btn'); if (!button) return;
        const action = button.dataset.action; const messagePairEl = button.closest('.message-pair'); const pairId = parseInt(messagePairEl.dataset.pairId);

        switch (action) {
            case 'copy-user': 
            case 'copy-ai': 
                const contentEl = button.closest('.message-content').querySelector('.message-text-content'); 
                navigator.clipboard.writeText(contentEl.innerText); 
                showToast('Text copied'); 
                break;
            case 'edit-user': { 
                if (state.isTempChatActive) { showToast("Cannot edit messages in a Temporary Chat."); break; } 
                const userMsgContentEl = messagePairEl.querySelector('.user-message .message-text-content'); 
                const oldText = userMsgContentEl.querySelector('div').innerText; 
                const newText = window.prompt("Edit your message:", oldText); 
                
                if (newText && newText.trim() && newText.trim() !== oldText.trim()) { 
                    const newTextTrimmed = newText.trim(); 
                    const history = getHistory(); 
                    const chat = history.find(c => c.id === state.currentChatId); 
                    if (!chat) return; 
                    const messagePair = chat.messages.find(p => p.pairId === pairId); 
                    if (!messagePair) return; 
                    
                    const tempDiv = document.createElement('div'); 
                    tempDiv.innerHTML = messagePair.user.content; 
                    tempDiv.querySelector('div').innerText = newTextTrimmed; 
                    messagePair.user.content = tempDiv.innerHTML; 
                    saveHistory(history); 
                    
                    displayUserMessage(messagePair.user.content, pairId); 
                    const aiMsgEl = messagePairEl.querySelector('.ai-message'); 
                    if (aiMsgEl) aiMsgEl.remove(); 
                    await generateAndDisplayResponse(newTextTrimmed, pairId, messagePair.user.content, false); 
                } 
                break; 
            } 
            case 'like-ai': 
                button.classList.toggle('liked'); 
                button.parentElement.querySelector('[data-action="dislike-ai"]').classList.remove('disliked'); 
                showToast('Thanks for your feedback!'); 
                break;
            case 'dislike-ai': 
                button.classList.toggle('disliked'); 
                button.parentElement.querySelector('[data-action="like-ai"]').classList.remove('liked'); 
                showToast('Thanks for your feedback!'); 
                break;
            case 'regenerate-ai': {
                let userPromptText = "";
                let userPromptHTML = "";

                if (state.isTempChatActive) {
                    userPromptText = stripHtml(messagePairEl.querySelector('.user-message .message-text-content').innerHTML);
                    userPromptHTML = messagePairEl.querySelector('.user-message .message-text-content').innerHTML;
                } else {
                    const history = getHistory();
                    const chat = history.find(c => c.id === state.currentChatId);
                    if (!chat) return;
                    const messagePair = chat.messages.find(p => p.pairId === pairId);
                    if (!messagePair || !messagePair.user) return;
                    userPromptText = stripHtml(messagePair.user.content); 
                    userPromptHTML = messagePair.user.content; 
                }
                
                const aiMsgEl = messagePairEl.querySelector('.ai-message');
                if (aiMsgEl) aiMsgEl.remove(); 
                
                await generateAndDisplayResponse(userPromptText, pairId, userPromptHTML, false); 
                break; 
            }
            case 'share-ai': {
                const userMsgText = stripHtml(messagePairEl.querySelector('.user-message .message-text-content').innerHTML);
                const aiMsgText = stripHtml(messagePairEl.querySelector('.ai-message .message-text-content').innerHTML);
                const lang = state.uiLanguage;
                const userLabel = (translations[lang] || translations.en).you;
                const aiLabel = (translations[lang] || translations.en).ai;

                const shareableText = `${userLabel}:\n${userMsgText}\n\n${aiLabel}:\n${aiMsgText}\n\n---\nShared from Aryanta AI`;
                const previewText = `${userLabel}:\n${userMsgText}\n\n${aiLabel}:\n${aiMsgText}`;
                
                ui.shareModalContent.value = previewText; 

                ui.shareModalCopy.onclick = () => {
                    navigator.clipboard.writeText(shareableText).then(() => {
                        showToast("Copied!"); 
                    });
                };
                ui.shareModalWhatsapp.onclick = () => {
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareableText)}`, '_blank');
                };

                ui.shareModal.style.display = 'flex';
                break;
            }
        }
    });
    
    // --- "Ask About" Popup Listeners ---
    document.addEventListener('mouseup', (e) => {
        if (selectionTimeout) clearTimeout(selectionTimeout);
        selectionTimeout = setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();
            
            if (selectedText.length > 3 && !e.target.closest('textarea, input, #ask-about-popup')) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                
                ui.askAboutPopup.style.left = `${window.scrollX + rect.left + (rect.width / 2) - (ui.askAboutPopup.offsetWidth / 2)}px`;
                ui.askAboutPopup.style.top = `${window.scrollY + rect.top - ui.askAboutPopup.offsetHeight - 10}px`;
                ui.askAboutPopup.style.display = 'flex';
                ui.askAboutPopup.dataset.selectedText = selectedText;
            } else {
                ui.askAboutPopup.style.display = 'none';
            }
        }, 100);
    });
    
    document.addEventListener('mousedown', (e) => {
        if (e.target.id !== 'ask-about-popup') {
            ui.askAboutPopup.style.display = 'none';
        }
    });

    ui.askAboutPopup.addEventListener('click', () => {
        const text = ui.askAboutPopup.dataset.selectedText;
        if (text) {
            ui.userInput.value = `Tell me more about: "${text}"`;
            ui.userInput.focus();
            ui.userInput.style.height = 'auto';
            ui.userInput.style.height = (ui.userInput.scrollHeight) + 'px';
            ui.askAboutPopup.style.display = 'none';
        }
    });

    ui.chatWindow.addEventListener('scroll', () => {
        ui.askAboutPopup.style.display = 'none';
        const sel = window.getSelection();
        if (sel && sel.removeAllRanges) {
            sel.removeAllRanges();
        }
    });
       
    // --- Speech Recognition/Live Mode Listeners ---
    if (SpeechRecognition) {
        ui.liveModeButton.addEventListener('click', openLiveMode);
        ui.closeLiveModeButton.addEventListener('click', closeLiveMode);
        
        ui.liveLogo.addEventListener('click', () => { 
            if (state.isLiveModeActive) { 
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel(); 
                }
                if (!state.isListening) {
                    startListening(); 
                }
            } 
        });
        
        recognition.onstart = () => { state.isListening = true; ui.liveStatus.textContent = 'Listening...'; ui.liveLogo.classList.add('listening'); };
        recognition.onspeechstart = () => { if (speechSynthesis.speaking) { speechSynthesis.cancel(); } };
        recognition.onend = () => { state.isListening = false; ui.liveLogo.classList.remove('listening'); if (ui.liveStatus.textContent === 'Listening...') { ui.liveStatus.textContent = 'Click the logo to speak'; } };
        
        recognition.onresult = async (event) => { 
            const transcript = event.results[0][0].transcript; 
            ui.liveStatus.textContent = 'Thinking...'; 
            const aiAnswer = await generateAiResponseForLiveMode(transcript); 
            speakLiveAnswer(aiAnswer); 
        };
        
        recognition.onerror = (event) => { 
            console.error('Speech recognition error:', event.error); 
            if (event.error !== 'aborted' && event.error !== 'no-speech') { 
                ui.liveStatus.textContent = 'Sorry, I didnt catch that.'; 
            } 
            setTimeout(() => { 
                if (state.isLiveModeActive && !state.isSpeaking) startListening(); 
            }, 1500); 
        };
    }
});
