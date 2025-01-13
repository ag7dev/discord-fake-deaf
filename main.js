var text = new TextDecoder("utf-8");
let fakeDeafenEnabled = false;
let toggleButton = null; // Store the button reference globally

WebSocket.prototype.original = WebSocket.prototype.send;

WebSocket.prototype.send = function(data) {
    try {
        if (Object.prototype.toString.call(data) === "[object ArrayBuffer]") {
            let decodedData = text.decode(data);
            if (fakeDeafenEnabled && decodedData.includes("self_deaf")) {
                console.log("Found mute/deafen in the data");
                decodedData = decodedData.replace('"self_mute":false', 'NiceOneDiscord');
                const modifiedData = new TextEncoder().encode(decodedData); // Convert back to ArrayBuffer
                WebSocket.prototype.original.apply(this, [modifiedData]);
            } else {
                WebSocket.prototype.original.apply(this, [data]);
            }
        } else {
            WebSocket.prototype.original.apply(this, [data]);
        }
    } catch (error) {
        console.error("Error in WebSocket.send override:", error);
    }
};

function stopdeaf() {
    try {
        fakeDeafenEnabled = false;
        console.log("Fake Deafen has been disabled.");
        showNotification("Fake Deafen Disabled", "You are no longer muted/deafened.");
        updateButtonState();
    } catch (error) {
        console.error("Error in stopdeaf function:", error);
    }
}

function startdeaf() {
    try {
        fakeDeafenEnabled = true;
        console.log("Fake Deafen has been enabled.");
        showNotification("Fake Deafen Enabled", "You are now fake deafened.");
        updateButtonState();
    } catch (error) {
        console.error("Error in startdeaf function:", error);
    }
}

function toggleDeafen() {
    try {
        fakeDeafenEnabled ? stopdeaf() : startdeaf();
    } catch (error) {
        console.error("Error in toggleDeafen function:", error);
    }
}

function addToggleButton() {
    try {
        toggleButton = document.createElement("button");
        toggleButton.innerText = "Toggle Fake Deafen";
        toggleButton.style.position = "fixed";
        toggleButton.style.bottom = "20px";
        toggleButton.style.right = "20px";
        toggleButton.style.zIndex = 1000;
        toggleButton.style.padding = "10px 20px";
        toggleButton.style.backgroundColor = "#7289DA";
        toggleButton.style.color = "#FFFFFF";
        toggleButton.style.border = "none";
        toggleButton.style.borderRadius = "5px";
        toggleButton.style.cursor = "pointer";

        toggleButton.addEventListener("click", toggleDeafen);

        document.body.appendChild(toggleButton);

        updateButtonState(); // Initial button state update
    } catch (error) {
        console.error("Error adding toggle button:", error);
    }
}

function updateButtonState() {
    try {
        if (toggleButton) {
            if (fakeDeafenEnabled) {
                toggleButton.style.backgroundColor = "#FF5C8D"; // Change to a red color when fake deafen is enabled
                toggleButton.innerText = "Fake Deafen Enabled";
            } else {
                toggleButton.style.backgroundColor = "#7289DA"; // Revert to the original color
                toggleButton.innerText = "Fake Deafen Disabled";
            }
        }
    } catch (error) {
        console.error("Error updating button state:", error);
    }
}

function showNotification(title, message) {
    try {
        const notification = document.createElement("div");
        notification.style.position = "fixed";
        notification.style.bottom = "100px";
        notification.style.right = "20px";
        notification.style.backgroundColor = "#333";
        notification.style.color = "#fff";
        notification.style.padding = "10px 20px";
        notification.style.borderRadius = "5px";
        notification.style.zIndex = 999;
        notification.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        
        notification.innerHTML = `<strong>${title}</strong><br>${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    } catch (error) {
        console.error("Error showing notification:", error);
    }
}

addToggleButton();
