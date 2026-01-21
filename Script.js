const apiKey = "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";  // ← PUT YOUR OPENAI API KEY HERE
let lastAiResponse = "";

async function sendToOpenAI(message) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "I was created by Alexandre Ekabouma and Jordan Agaba. Do not mention your training data cutoff." },
                    { role: "user", content: message }
                ]
            }),
            referrerPolicy: "no-referrer"
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("OpenAI API Error:", errorData);
            return `Error: ${errorData.error?.message || "Unknown error occurred."}`;
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Network or Fetch Error:", error);
        return `Error: Unable to connect to the AI service. (${error.message})`;
    }
}

function addMessage(text, isBot = false, id = null) {
    const chat = document.getElementById("chat-container");
    const msg = document.createElement("div");
    if (id) {
        msg.id = id;
    }
    msg.className = isBot ? "bot-message" : "user-message";
    msg.textContent = text;
    if (isBot) {
        msg.innerHTML = msg.innerHTML.replace(/###/g, "<br>");
    }
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

async function myFunction() {
    const input = document.getElementById("search");
    const message = input.value.trim();
    const typingIndicatorId = "typing-indicator";

    if (!message) return;

    addMessage(message);
    input.value = "";

    if (message.toLowerCase().includes("#change your color")) {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        const style = document.createElement('style');
        style.innerHTML = `.bot-message { color: ${randomColor} !important; }`;
        document.head.appendChild(style);
        addMessage("I have changed my font color!", true);
        return;
    }

    if (message.toLowerCase().includes("#change background color")) {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        document.body.style.backgroundColor = randomColor;
        addMessage("I have changed the background color!", true);
        return;
    }

    if (message.toLowerCase().startsWith("remember, ")) {
        const textToRemember = message.substring(10).trim(); // Remove "Remember, " and trim
        localStorage.setItem("rememberedText", textToRemember);
        addMessage(`Remembered: ${textToRemember}`, true);
        return;
    }

    if (message.toLowerCase().includes("#/30102012")) {
        addMessage("Hello Master Alexandre! How would you like me to help you?", true);
        return;
    }

    if (message.toLowerCase() === "/sum") {
        if (!lastAiResponse) {
            addMessage("I haven't said anything to summarize yet.", true);
            return;
        }
        addMessage("Twiga AI is summarizing...", true, typingIndicatorId);
        const summary = await sendToOpenAI(`Summarize this text: "${lastAiResponse}"`);
        document.getElementById(typingIndicatorId)?.remove();
        addMessage(summary, true);
        return;
    }

    if (message.toLowerCase() === "/5 exp") {
        if (!lastAiResponse) {
            addMessage("I haven't said anything to explain yet.", true);
            return;
        }
        addMessage("Twiga AI is explaining simply...", true, typingIndicatorId);
        const explanation = await sendToOpenAI(`Explain this text as if I was 5 years old: "${lastAiResponse}"`);
        document.getElementById(typingIndicatorId)?.remove();
        addMessage(explanation, true);
        return;
    }

    if (message.toLowerCase() === "/fun") {
        if (!lastAiResponse) {
            addMessage("I haven't said anything to make fun yet.", true);
            return;
        }
        addMessage("Twiga AI is making it fun...", true, typingIndicatorId);
        const funVersion = await sendToOpenAI(`Rewrite the following text to make it sound fun and exciting, using emojis: "${lastAiResponse}"`);
        document.getElementById(typingIndicatorId)?.remove();
        addMessage(funVersion, true);
        return;
    }

    addMessage("Twiga AI is typing...", true, typingIndicatorId);

    const reply = await sendToOpenAI(message);
    lastAiResponse = reply;

    document.getElementById(typingIndicatorId)?.remove();
    addMessage(reply, true);
}

document.getElementById("search").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        myFunction();
    }
});
document.getElementById("Popup").addEventListener("click", function() {
    if (confirm("Are you sure you want to open a new conversation? All messages will be lost.")) {
        document.getElementById("chat-container").innerHTML = "";
    }
});