// Password Generation Utility
const PasswordGenerator = {
    LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
    UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    NUMBERS: '0123456789',

    generatePassword(options) {
        const {
            minLength, 
            maxLength, 
            useSpecialChars, 
            specialCharsList, 
            useNumbers, 
            allowCapitalLetters, 
            noConsecutiveRepeats, 
            ensureOneOfEach
        } = options;

        let characters = this.LOWERCASE;
        let password = [];
        
        // Add character sets
        if (allowCapitalLetters) characters += this.UPPERCASE;
        if (useNumbers) characters += this.NUMBERS;
        if (useSpecialChars) characters += specialCharsList;
        
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        
        // Ensure one of each type
        if (ensureOneOfEach) {
            if (allowCapitalLetters) password.push(this.getRandomChar(this.UPPERCASE));
            if (useNumbers) password.push(this.getRandomChar(this.NUMBERS));
            if (useSpecialChars) password.push(this.getRandomChar(specialCharsList));
        }
        
        // Generate remaining characters
        while (password.length < length) {
            const char = this.getRandomChar(characters);
            
            // Skip consecutive repeats if not allowed
            if (noConsecutiveRepeats && password.length > 0 && char === password[password.length - 1]) {
                continue;
            }
            
            password.push(char);
        }
        
        // Shuffle password
        return this.shuffleArray(password).join('');
    },

    getRandomChar(charSet) {
        return charSet[Math.floor(Math.random() * charSet.length)];
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};

// Theme Handling
const ThemeManager = {
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
    },

    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);

        const themeToggle = document.getElementById('checkbox');
        themeToggle.checked = savedTheme === 'dark';
        themeToggle.addEventListener('change', () => this.toggleTheme());
    }
};

// UI Handler
const PasswordGeneratorUI = {
    init() {
        const specialCharsCheckbox = document.getElementById('specialChars');
        const specialCharsInput = document.getElementById('specialCharsInput');
        const generateBtn = document.getElementById('generateBtn');

        // Special characters input visibility toggle
        specialCharsCheckbox.addEventListener('change', () => {
            specialCharsInput.style.display = specialCharsCheckbox.checked ? 'block' : 'none';
        });

        generateBtn.addEventListener('click', () => this.generatePasswords());
    },

    generatePasswords() {
        // Validate and collect input options
        const minLength = parseInt(document.getElementById('minLength').value);
        const maxLength = parseInt(document.getElementById('maxLength').value);
        
        if (minLength > maxLength) {
            alert('Minimum length cannot be greater than maximum length');
            return;
        }

        const options = {
            minLength,
            maxLength,
            useSpecialChars: document.getElementById('specialChars').checked,
            specialCharsList: document.getElementById('specialCharsList').value,
            useNumbers: document.getElementById('numbers').checked,
            allowCapitalLetters: document.getElementById('capital').checked,
            noConsecutiveRepeats: document.getElementById('noRepeats').checked,
            ensureOneOfEach: document.getElementById('ensureOne').checked
        };

        const numPasswords = parseInt(document.getElementById('numPasswords').value);
        const passwordsList = document.getElementById('passwordsList');
        passwordsList.innerHTML = '';

        // Generate and display passwords
        for (let i = 0; i < numPasswords; i++) {
            const password = PasswordGenerator.generatePassword(options);
            const passwordItem = document.createElement('div');
            passwordItem.className = 'password-item';
            passwordItem.innerHTML = `
                <span>${i + 1}. ${password}</span>
                <button onclick="PasswordGeneratorUI.copyToClipboard('${password}')">Copy</button>
            `;
            passwordsList.appendChild(passwordItem);
        }

        document.getElementById('results').classList.add('show');
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => alert('Password copied to clipboard!'))
            .catch(err => console.error('Copy failed:', err));
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    PasswordGeneratorUI.init();
});
