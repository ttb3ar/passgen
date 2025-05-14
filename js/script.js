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

// Language handling
function setLanguage(language) {
    document.documentElement.setAttribute('data-language', language);
    localStorage.setItem('language', language);
    
    // Update all text content based on language
    const elements = document.querySelectorAll('[data-en][data-jp]');
    elements.forEach(element => {
        if (language === 'jp') {
            element.textContent = element.getAttribute('data-jp');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
    
    // Update copy button text
    const copyButtons = document.querySelectorAll('.password-item button');
    const copyText = language === 'jp' ? 'コピー' : 'Copy';
    copyButtons.forEach(button => {
        button.textContent = copyText;
    });
}

function toggleLanguage() {
    if (document.documentElement.getAttribute('data-language') === 'en') {
        setLanguage('jp');
    } else {
        setLanguage('en');
    }
}

// Character sets
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';

function generatePassword(minLength, maxLength, useSpecialChars, specialCharsList, 
                        useNumbers, allowCapitalLetters, noConsecutiveRepeats, 
                        ensureOneOfEach) {
    // Initialize character set with lowercase letters
    let characters = LOWERCASE;
    let password = [];
    
    // Add other character sets based on options
    if (allowCapitalLetters) characters += UPPERCASE;
    if (useNumbers) characters += NUMBERS;
    if (useSpecialChars) characters += specialCharsList;
    
    // Random length between min and max
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    
    // Ensure one of each type if requested
    if (ensureOneOfEach) {
        if (allowCapitalLetters) {
            password.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]);
        }
        if (useNumbers) {
            password.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
        }
        if (useSpecialChars) {
            password.push(specialCharsList[Math.floor(Math.random() * specialCharsList.length)]);
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

// UI Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    const themeToggle = document.getElementById('checkbox');
    themeToggle.checked = savedTheme === 'dark';
    
    // Language initialization
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
    const languageToggle = document.getElementById('language-checkbox');
    languageToggle.checked = savedLanguage === 'jp';
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', toggleTheme);
    
    // Language toggle event listener
    languageToggle.addEventListener('change', toggleLanguage);

    // Password generator initialization
    const generateBtn = document.getElementById('generateBtn');
    const specialCharsCheckbox = document.getElementById('specialChars');
    const specialCharsInput = document.getElementById('specialCharsInput');
    
    // Toggle special characters input visibility
    specialCharsCheckbox.addEventListener('change', () => {
        specialCharsInput.style.display = specialCharsCheckbox.checked ? 'block' : 'none';
    });
    
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
        const currentLanguage = document.documentElement.getAttribute('data-language');
        
        // Validation messages based on language
        const validationMsg = currentLanguage === 'jp' 
            ? '最小長は最大長より大きくなることはできません'
            : 'Minimum length cannot be greater than maximum length';
        
        // Validate inputs
        if (minLength > maxLength) {
            alert(validationMsg);
            return;
        }
        
        const passwordsList = document.getElementById('passwordsList');
        passwordsList.innerHTML = '';
        
        // Generate passwords
        const copyText = currentLanguage === 'jp' ? 'コピー' : 'Copy';
        
        for (let i = 0; i < numPasswords; i++) {
            const password = generatePassword(
                minLength, maxLength, useSpecialChars, specialCharsList,
                useNumbers, allowCapitalLetters, noConsecutiveRepeats,
                ensureOneOfEach
            );
            
            // Create password item with copy button
            const passwordItem = document.createElement('div');
            passwordItem.className = 'password-item';
            
            // Use textContent to safely display the password
            const passwordText = document.createElement('span');
            passwordText.textContent = `${i + 1}. ${password}`;
            passwordItem.appendChild(passwordText);
            
            // Create the copy button and append it
            const copyButton = document.createElement('button');
            copyButton.textContent = copyText;
            copyButton.onclick = () => copyToClipboard(password, currentLanguage);
            passwordItem.appendChild(copyButton);
            
            // Append the password item to the list
            passwordsList.appendChild(passwordItem);
        }
        
        // Show results
        document.getElementById('results').classList.add('show');
    });
});

// Utility function to copy password to clipboard
function copyToClipboard(text, language) {
    const successMsg = language === 'jp' 
        ? 'パスワードがクリップボードにコピーされました！' 
        : 'Password copied to clipboard!';
    
    const errorMsg = language === 'jp'
        ? 'パスワードのコピーに失敗しました:'
        : 'Failed to copy password:';
    
    navigator.clipboard.writeText(text).then(() => {
        alert(successMsg);
    }).catch(err => {
        console.error(errorMsg, err);
    });
}
