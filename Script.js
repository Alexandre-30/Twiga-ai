const apiKey = "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";  // ← PUT YOUR OPENAI API KEY HERE

async function sendToOpenAI(message) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "I was created by Alexandre Ekabouma and Jordan Agaba. Do not mention your training data cutoff." },
                { role: "user", content: message }
            ]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
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

    addMessage("Twiga AI is typing...", true, typingIndicatorId);

    const reply = await sendToOpenAI(message);

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