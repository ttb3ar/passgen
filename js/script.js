/* Password item container */
.password-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.password-text {
    flex-grow: 1;
    word-wrap: break-word;
    margin-right: 10px;
}

.copy-btn {
    padding: 5px 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.copy-btn:hover {
    background-color: #0056b3;
}

/* Handle responsive layout for smaller screens */
@media (max-width: 600px) {
    .password-item {
        flex-direction: column;
        align-items: flex-start;
    }
}
