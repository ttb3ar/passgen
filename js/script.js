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
        
        // Generate remaining characters with explicit maximum attempts
        const maxAttempts = length * 5; // Prevent infinite loop
        let attempts = 0;
        
        while (password.length < length && attempts < maxAttempts) {
            const char = this.getRandomChar(characters);
            
            // Skip consecutive repeats if not allowed
            if (noConsecutiveRepeats && 
                password.length > 0 && 
                char === password[password.length - 1]) {
                attempts++;
                continue;
            }
            
            password.push(char);
            attempts = 0; // Reset attempts when a valid character is added
        }

        // If we couldn't generate a full-length password, force-fill it
        while (password.length < length) {
            password.push(this.getRandomChar(characters));
        }
        
        // Shuffle to randomize final password
        return this.shuffleArray(password).join('');
    },

    // Rest of the methods remain the same...
};
