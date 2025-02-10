const textDecoder = new TextDecoder("utf-8");
let fakeDeafenEnabled = false;
let toggleButton = null;

// WebSocket Handling
const originalWebSocketSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
    try {
        if (data instanceof ArrayBuffer) {
            const decoded = textDecoder.decode(data);
            if (fakeDeafenEnabled && decoded.includes("self_deaf")) {
                const modifiedData = decoded.replace(
                    /"self_mute":(true|false)/g, 
                    '"self_mute":true'
                );
                return originalWebSocketSend.call(
                    this, 
                    new TextEncoder().encode(modifiedData)
                );
            }
        }
        originalWebSocketSend.call(this, data);
    } catch (error) {
        console.error("WebSocket Error:", error);
    }
};

// Steuerungsfunktionen
function toggleDeafenState() {
    try {
        fakeDeafenEnabled = !fakeDeafenEnabled;
        showStatusNotification();
        updateButtonAppearance();
    } catch (error) {
        console.error("Toggle Error:", error);
        showErrorNotification();
    }
}

// Button Erstellung
function createControlButton() {
    const btn = document.createElement("button");
    
    Object.assign(btn.style, {
        position: "fixed",
        bottom: "25px",
        right: "25px",
        zIndex: "2147483647",
        padding: "12px 24px",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "linear-gradient(145deg, #36393f, #2f3136)",
        color: "#dcddde",
        fontFamily: "'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease, transform 0.1s ease",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    });

    // Icon und Text
    btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" style="fill:currentColor">
            <path d="M12 3.75a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75zm0 12a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75zm8-4a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75zm-16 0a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75z"/>
            <path d="M18.75 12a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75zm-12 0a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75z"/>
        </svg>
        Fake Deafen
    `;

    btn.addEventListener("click", toggleDeafenState);
    
    // Hover-Effekte
    btn.addEventListener("mouseenter", () => {
        btn.style.transform = "translateY(-2px)";
        btn.style.boxShadow = "0 6px 12px rgba(0,0,0,0.2)";
    });
    
    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "none";
        btn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    });
    
    return btn;
}

// Status Anzeige
function showStatusNotification() {
    const notification = document.createElement("div");
    
    Object.assign(notification.style, {
        position: "fixed",
        bottom: "80px",
        right: "25px",
        padding: "12px 20px",
        background: fakeDeafenEnabled ? "#3a3f45" : "#2d2f33",
        color: fakeDeafenEnabled ? "#d34040" : "#43b581",
        borderRadius: "6px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
        fontSize: "13px",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        zIndex: "2147483646",
        animation: "slideIn 0.3s ease-out"
    });

    notification.innerHTML = `
        <div style="width:10px;height:10px;border-radius:50%;background:${
            fakeDeafenEnabled ? "#ed4245" : "#3ba55c"
        }"></div>
        ${fakeDeafenEnabled ? "Fake deafened active" : "Fake deafened disabled"}
    `;

    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = "0";
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function updateButtonAppearance() {
    if (!toggleButton) return;
    
    toggleButton.style.background = fakeDeafenEnabled 
        ? "linear-gradient(145deg, #ed4245, #d83538)"
        : "linear-gradient(145deg, #36393f, #2f3136)";
        
    toggleButton.style.color = fakeDeafenEnabled ? "#ffffff" : "#dcddde";
}

// Initialisierung
function initialize() {
    try {
        if (!toggleButton) {
            toggleButton = createControlButton();
            document.body.appendChild(toggleButton);
            updateButtonAppearance();
        }

        // Sicherheits-Check alle 2 Sekunden
        setInterval(() => {
            if (!document.body.contains(toggleButton)) {
                toggleButton = createControlButton();
                document.body.appendChild(toggleButton);
                updateButtonAppearance();
            }
        }, 2000);

    } catch (error) {
        console.error("Initialization Error:", error);
    }
}

// Error Handling
function showErrorNotification() {
    const err = document.createElement("div");
    err.textContent = "⚠️ Script Error - Refresh the page!";
    Object.assign(err.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "#ed4245",
        color: "white",
        padding: "12px 24px",
        borderRadius: "8px",
        zIndex: "2147483647",
        animation: "shake 0.5s ease-in-out"
    });
    document.body.appendChild(err);
    
    setTimeout(() => err.remove(), 3000);
}

// Stylesheet für Animationen
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
`;
document.head.appendChild(style);

// Start
if (document.readyState === "complete") {
    initialize();
} else {
    window.addEventListener("load", initialize);
}
