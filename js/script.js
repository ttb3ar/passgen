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
    
    // Theme toggle event listener
