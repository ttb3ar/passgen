// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    if (document.documentElement.getAttribute('data-theme') === 'light') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

// Character sets
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';

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
        showPasswords: "Show Passwords",
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
        showPasswords: "パスワードを表示",
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
    // Get all content elements that need transition
    const contentElements = document.querySelectorAll('h1, p, label, button, .input-hint, #results h2, .footer p');
    
    // First add the transition class to all elements
    contentElements.forEach(element => {
        element.classList.add('transition-content');
    });
    
    // Then trigger reflow to ensure the transition class is applied
    // before adding the fade-out class
    document.body.offsetHeight;
    
    // Fade out all content elements
    contentElements.forEach(element => {
        element.classList.add('fade-out');
    });
    
    // Short delay before changing language
    setTimeout(() => {
        // Change language
        const currentLang = document.documentElement.getAttribute('data-language');
        const newLang = currentLang === 'en' ? 'jp' : 'en';
        
        // Update language attribute and localStorage
        document.documentElement.setAttribute('data-language', newLang);
        localStorage.setItem('language', newLang);
        
        // Update UI text
        updateUILanguage(newLang);
        
        // Show language indicator
        showLanguageIndicator(newLang);
        
        // Fade in content elements
        setTimeout(() => {
            contentElements.forEach(element => {
                element.classList.remove('fade-out');
            });
            
            // Remove transition class after animation completes to avoid
            // interfering with other transitions
            setTimeout(() => {
                contentElements.forEach(element => {
                    element.classList.remove('transition-content');
                });
            }, 300);
        }, 50); // Small delay to ensure DOM updates first
    }, 300); // Match the CSS transition duration
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
    document.querySelector('label[for="showPasswords"]').textContent = texts.showPasswords;
    
    // Update button text
    document.getElementById('generateBtn').textContent = texts.generateBtn;
    
    // Update results heading
    document.querySelector('#results h2').textContent = texts.generatedPasswords;
    
    // Update copy buttons
    const copyButtons = document.querySelectorAll('.password-item button');
    copyButtons.forEach(button => {
        if (!button.disabled) {
            button.textContent = texts.copy;
        }
    });
    
    // Update footer
    document.querySelector('.footer p').textContent = texts.footer;
    
    // Update page title
    document.title = texts.title;
}

function generatePassword(minLength, maxLength, useSpecialChars, specialCharsList, 
                        useNumbers, allowCapitalLetters, noConsecutiveRepeats, 
                        ensureOneOfEach, excludeChars) {
    // Initialize character set with lowercase letters
    let characters = LOWERCASE;
    let password = [];
    
    // Add other character sets based on options
    if (allowCapitalLetters) characters += UPPERCASE;
    if (useNumbers) characters += NUMBERS;
    if (useSpecialChars) characters += specialCharsList;
    
    // Remove excluded characters from the character set
    if (excludeChars) {
        characters = characters.split('')
            .filter(char => !excludeChars.includes(char))
            .join('');
            
        // Check if we have enough characters left to generate a password
        if (characters.length === 0) {
            throw new Error('All characters have been excluded. Cannot generate password.');
        }
    }
    
    // Random length between min and max
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    
    // Ensure one of each type if requested
    if (ensureOneOfEach) {
        if (allowCapitalLetters) {
            const availableUppercase = UPPERCASE.split('')
                .filter(char => !excludeChars?.includes(char));
            if (availableUppercase.length > 0) {
                password.push(availableUppercase[Math.floor(Math.random() * availableUppercase.length)]);
            }
        }
        if (useNumbers) {
            const availableNumbers = NUMBERS.split('')
                .filter(char => !excludeChars?.includes(char));
            if (availableNumbers.length > 0) {
                password.push(availableNumbers[Math.floor(Math.random() * availableNumbers.length)]);
            }
        }
        if (useSpecialChars) {
            const availableSpecial = specialCharsList.split('')
                .filter(char => !excludeChars?.includes(char));
            if (availableSpecial.length > 0) {
                password.push(availableSpecial[Math.floor(Math.random() * availableSpecial.length)]);
            }
        }
    }
    
    // Generate remaining characters
    while (password.length < length) {
        const char = characters[Math.floor(Math.random() * characters.length)];
        
        // Check for consecutive repeats if not allowed
        if (noConsecutiveRepeats && password.length > 0 && char === password[password.length - 1]) {
            continue;
        }
        
        password.push(char);
    }
    
    // Shuffle the password array
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }
    
    return password.join('');
}

// Function to show language indicator briefly
function showLanguageIndicator(language) {
    // Check if indicator already exists
    let indicator = document.querySelector('.language-indicator');
    
    // If not, create it
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'language-indicator';
        document.body.appendChild(indicator);
    }
    
    // Set text based on current language
    indicator.textContent = language === 'en' ? 'English' : '日本語';
    
    // Show the indicator
    indicator.classList.add('show');
    
    // Hide after a delay
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 1500);
}

// Function to toggle password visibility
function togglePasswordVisibility() {
    const showPasswords = document.getElementById('showPasswords').checked;
    const passwordTexts = document.querySelectorAll('.password-text');
    
    passwordTexts.forEach(passwordText => {
        if (showPasswords) {
            passwordText.classList.remove('hidden');
        } else {
            passwordText.classList.add('hidden');
        }
    });
}

// UI Event Handlers
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

    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    const themeToggle = document.getElementById('checkbox');
    themeToggle.checked = savedTheme === 'dark';
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', toggleTheme);

    // Password generator initialization
    const generateBtn = document.getElementById('generateBtn');
    const specialCharsCheckbox = document.getElementById('specialChars');
    const specialCharsInput = document.getElementById('specialCharsInput');
    const showPasswordsCheckbox = document.getElementById('showPasswords');

    // Create language indicator element
    const languageIndicator = document.createElement('div');
    languageIndicator.className = 'language-indicator';
    document.body.appendChild(languageIndicator);
    
    // Toggle special characters input visibility
    specialCharsCheckbox.addEventListener('change', () => {
        specialCharsInput.style.display = specialCharsCheckbox.checked ? 'block' : 'none';
    });
    
    // Show/hide passwords event listener
    showPasswordsCheckbox.addEventListener('change', togglePasswordVisibility);
    
    generateBtn.addEventListener('click', () => {
        const minLength = parseInt(document.getElementById('minLength').value);
        const maxLength = parseInt(document.getElementById('maxLength').value);
        const useSpecialChars = document.getElementById('specialChars').checked;
        const specialCharsList = document.getElementById('specialCharsList').value;
        const useNumbers = document.getElementById('numbers').checked;
        const allowCapitalLetters = document.getElementById('capital').checked;
        const noConsecutiveRepeats = document.getElementById('noRepeats').checked;
        const ensureOneOfEach = document.getElementById('ensureOne').checked;
        const numPasswords = parseInt(document.getElementById('numPasswords').value);
        const excludeChars = document.getElementById('excludeChars').value;
        const showPasswords = document.getElementById('showPasswords').checked;
        
        // Validate inputs
        if (minLength > maxLength) {
            const language = document.documentElement.getAttribute('data-language') || 'en';
            const errorMsg = language === 'en' 
                ? 'Minimum length cannot be greater than maximum length'
                : '最小長は最大長より大きくできません';
            alert(errorMsg);
            return;
        }
        
        const passwordsList = document.getElementById('passwordsList');
        passwordsList.innerHTML = '';
        
        try {
            const language = document.documentElement.getAttribute('data-language') || 'en';
            const texts = translations[language];
            
            // Generate passwords
            for (let i = 0; i < numPasswords; i++) {
                const password = generatePassword(
                    minLength, maxLength, useSpecialChars, specialCharsList,
                    useNumbers, allowCapitalLetters, noConsecutiveRepeats,
                    ensureOneOfEach, excludeChars
                );
                
                // Create password item with copy button
                const passwordItem = document.createElement('div');
                passwordItem.className = 'password-item';
                
                // Create password text element with proper class for show/hide functionality
                const passwordText = document.createElement('span');
                passwordText.className = 'password-text';
                passwordText.textContent = `${i + 1}. ${password}`;
                
                // Apply initial visibility state
                if (!showPasswords) {
                    passwordText.classList.add('hidden');
                }
                
                passwordItem.appendChild(passwordText);
                
                // Create the copy button and append it
                const copyButton = document.createElement('button');
                copyButton.textContent = texts.copy;
                copyButton.onclick = () => copyToClipboard(password, copyButton);
                passwordItem.appendChild(copyButton);
                
                // Append the password item to the list
                passwordsList.appendChild(passwordItem);
            }
            
            // Show results
            document.getElementById('results').classList.add('show');
        } catch (error) {
            const language = document.documentElement.getAttribute('data-language') || 'en';
            const errorMsg = language === 'en' ? error.message : 'エラーが発生しました: ' + error.message;
            alert(errorMsg);
        }
    });
});

// Updated copy to clipboard function with button state feedback
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
        }, 1000);
    });
}
