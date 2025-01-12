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
    themeToggle.addEventListener('change', toggleTheme);

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
        
        // Validate inputs
        if (minLength > maxLength) {
            alert('Minimum length cannot be greater than maximum length');
            return;
        }
        
        const passwordsList = document.getElementById('passwordsList');
        passwordsList.innerHTML = '';
        
        // Generate passwords
        for (let i = 0; i < numPasswords; i++) {
            const password = generatePassword(
                minLength, maxLength, useSpecialChars, specialCharsList,
                useNumbers, allowCapitalLetters, noConsecutiveRepeats,
                ensureOneOfEach
            );
            
            // Create password item with copy button
            const passwordItem = document.createElement('div');
            passwordItem.className = 'password-item';
            passwordItem.innerHTML = `
                <span>${i + 1}. ${password}</span>
                <button onclick="copyToClipboard('${password}')">Copy</button>
            `;
            passwordsList.appendChild(passwordItem);
        }
        
        // Show results
        document.getElementById('results').classList.add('show');
    });
});

// Utility function to copy password to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Password copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy password:', err);
    });
}
