/**
 * This script enhances the Twiga AI with date and time awareness.
 * It intercepts the user's query in myFunction.
 */

// Keep a reference to the original myFunction if it exists
const originalMyFunction = window.myFunction;

window.myFunction = function() {
    const inputElement = document.getElementById('search');
    const chatContainer = document.getElementById('chat-container');

    if (!inputElement || !chatContainer) {
        console.error("Twiga AI: Elements 'search' or 'chat-container' not found.");
        return;
    }

    const userInput = inputElement.value.toLowerCase();

    // Check if the user is asking for the date or time
    if (/^(what|current|tell|show).*(date|time)|^\s*(date|time)\??\s*$/.test(userInput)) {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('user-message');
        userMessageDiv.textContent = `You: ${inputElement.value}`;
        chatContainer.appendChild(userMessageDiv);

        const aiResponseDiv = document.createElement('div');
        aiResponseDiv.classList.add('bot-message');
        aiResponseDiv.textContent = `Twiga Ai: Today's date is ${new Date().toDateString()}.`;
        chatContainer.appendChild(aiResponseDiv);

        inputElement.value = ''; // Clear the input field
    } else if (originalMyFunction) {
        // If it's not a date query, call the original function from Script.js
        originalMyFunction();
    }
};