// Language translations object
const translations = {
    en: {
        title: "Secure Password Generator",
        subtitle: "Generate strong, customizable passwords for your security needs",
        minLength: "Minimum Length:",
        maxLength: "Maximum Length:",
        specialChars: "Special Characters",
        allowedSpecialChars: "Allowed Special Characters:",
        excludeChars: "Exclude Characters:",
        excludeCharsHint: "Enter any characters you want to exclude from the generated passwords",
        includeNumbers: "Include Numbers",
        includeCapital: "Include Capital Letters",
        ensureOne: "One of Each Type",
        noRepeats: "No Consecutive Repeats",
        numPasswords: "Number of Passwords:",
        generateBtn: "Generate Passwords",
        generatedPasswords: "Generated Passwords",
        copy: "Copy",
        copied: "Copied!",
        error: "Error",
        footer: "Created by TTB3AR"
    },
    jp: {
        title: "安全なパスワード生成ツール",
        subtitle: "セキュリティニーズに合わせた強力でカスタマイズ可能なパスワードを生成",
        minLength: "最小長:",
        maxLength: "最大長:",
        specialChars: "特殊文字",
        allowedSpecialChars: "許可される特殊文字:",
        excludeChars: "除外する文字:",
        excludeCharsHint: "生成されるパスワードから除外したい文字を入力してください",
        includeNumbers: "数字を含める",
        includeCapital: "大文字を含める",
        ensureOne: "各タイプを少なくとも1つ",
        noRepeats: "連続する繰り返しなし",
        numPasswords: "パスワードの数:",
        generateBtn: "パスワードを生成",
        generatedPasswords: "生成されたパスワード",
        copy: "コピー",
        copied: "コピー完了!",
        error: "エラー",
        footer: "TTB3AR制作"
    }
};

// Function to set the language
function setLanguage(language) {
    document.documentElement.setAttribute('data-language', language);
    localStorage.setItem('language', language);
    
    // Update UI text
    updateUILanguage(language);
}

// Function to toggle between languages
function toggleLanguage() {
    if (document.documentElement.getAttribute('data-language') === 'en') {
        setLanguage('jp');
    } else {
        setLanguage('en');
    }
}

// Function to update UI text based on language selection
function updateUILanguage(language) {
    const texts = translations[language];
    
    // Update header
    document.querySelector('header h1').textContent = texts.title;
    document.querySelector('header p').textContent = texts.subtitle;
    
    // Update form labels
    document.querySelector('label[for="minLength"]').textContent = texts.minLength;
    document.querySelector('label[for="maxLength"]').textContent = texts.maxLength;
    document.querySelector('label[for="specialChars"]').textContent = texts.specialChars;
    document.querySelector('label[for="specialCharsList"]').textContent = texts.allowedSpecialChars;
    document.querySelector('label[for="excludeChars"]').textContent = texts.excludeChars;
    document.querySelector('.input-hint').textContent = texts.excludeCharsHint;
    document.querySelector('label[for="numbers"]').textContent = texts.includeNumbers;
    document.querySelector('label[for="capital"]').textContent = texts.includeCapital;
    document.querySelector('label[for="ensureOne"]').textContent = texts.ensureOne;
    document.querySelector('label[for="noRepeats"]').textContent = texts.noRepeats;
    document.querySelector('label[for="numPasswords"]').textContent = texts.numPasswords;
    
    // Update button text
    document.getElementById('generateBtn').textContent = texts.generateBtn;
    
    // Update results heading
    document.querySelector('#results h2').textContent = texts.generatedPasswords;
    
    // Update copy buttons
    const copyButtons = document.querySelectorAll('.password-item button');
    copyButtons.forEach(button => {
        if (button.textContent === 'Copy' || button.textContent === 'コピー') {
            button.textContent = texts.copy;
        }
    });
    
    // Update footer
    document.querySelector('.footer p').textContent = texts.footer;
    
    // Update page title
    document.title = texts.title;
}

// For the copyToClipboard function, we'll need to update it to handle language
function copyToClipboard(text, button) {
    const language = document.documentElement.getAttribute('data-language') || 'en';
    const texts = translations[language];
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = texts.copied;
        button.disabled = true;
        
        // Reset button after 1.5 seconds
        setTimeout(() => {
            button.textContent = texts.copy;
            button.disabled = false;
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy password:', err);
        button.textContent = texts.error;
        
        // Reset button after 1.5 seconds
        setTimeout(() => {
            button.textContent = texts.copy;
            button.disabled = false;
        }, 1500);
    });
}

// Add these event listeners to the DOMContentLoaded event handler in script.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language
    const savedLanguage = localStorage.getItem('language') || 'en';
    document.documentElement.setAttribute('data-language', savedLanguage);
    
    // Set initial language toggle state
    const languageToggle = document.getElementById('language-checkbox');
    languageToggle.checked = savedLanguage === 'jp';
    
    // Language toggle event listener
    languageToggle.addEventListener('change', toggleLanguage);
    
    // Initial UI update
    updateUILanguage(savedLanguage);
    
    // Original code continues from here...
});
