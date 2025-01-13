var text = new TextDecoder("utf-8");

// Variable to keep track of whether Fake Deafen is enabled or not
let fakeDeafenEnabled = false;

// Save the original WebSocket.send function
WebSocket.prototype.original = WebSocket.prototype.send;

// Overriding the WebSocket.send method
WebSocket.prototype.send = function(data) {
    // Check if the data being sent is of type ArrayBuffer
    if (Object.prototype.toString.call(data) === "[object ArrayBuffer]") {
        // Only modify the data if Fake Deafen is enabled and "self_deaf" is found
        if (fakeDeafenEnabled && text.decode(data).includes("self_deaf")) {
            console.log("Found mute/deafen in the data");
            data = data.replace('"self_mute":false', 'NiceOneDiscord');
            console.log("Modified data to fake deafen - ag7-dev.de");
        }
    }
    // Call the original WebSocket.send function with the (possibly modified) data
    WebSocket.prototype.original.apply(this, [data]);
};

// Function to disable Fake Deafen
function stopdeaf() {
    fakeDeafenEnabled = false;
    console.log("Fake Deafen has been disabled.");
}

// Function to enable Fake Deafen
function startdeaf() {
    fakeDeafenEnabled = true;
    console.log("Fake Deafen has been enabled.");
}