// 🔗 Backend URL
const backend = "https://mini-tools-kwap.onrender.com";

// 🔘 Show Tabs
function showTab(tab, btn = null) {
  // Hide all tabs
  document.querySelectorAll(".tab").forEach(t => {
    t.style.display = "none";
  });

  // Remove active class
  document.querySelectorAll(".tabs button").forEach(b => {
    b.classList.remove("active");
  });

  // Show selected tab
  const selected = document.getElementById(tab);
  if (selected) selected.style.display = "block";

  // Highlight button
  if (btn) btn.classList.add("active");
}

// 🔥 Default tab load
window.addEventListener("DOMContentLoaded", () => {
  const firstBtn = document.querySelector(".tabs button");
  showTab("preview", firstBtn);
});

// 🌐 Load Website
async function loadSite() {
  const input = document.getElementById("url");
  const url = input.value.trim();

  if (!url || !url.startsWith("http")) {
    alert("⚠️ Enter valid URL (https://...)");
    return;
  }

  try {
    const res = await fetch(`${backend}/fetch?url=${encodeURIComponent(url)}`);

    if (!res.ok) {
      throw new Error("Server response error");
    }

    const data = await res.json();

    if (data.error) {
      alert("❌ " + data.error);
      return;
    }

    // 🌐 Preview
    const frame = document.getElementById("frame");
    frame.srcdoc = data.html || "";

    // 🧱 Elements (formatted HTML)
    const elementsBox = document.getElementById("elementsContent");
    elementsBox.textContent = data.html || "";

    // 🌍 Network info
    const networkBox = document.getElementById("network");
    networkBox.innerText =
      `Status: ${data.status}\nCSS Files: ${data.css?.length || 0}\nJS Files: ${data.js?.length || 0}`;

  } catch (err) {
    console.error("Error:", err);
    alert("⚠️ Backend error or blocked site");
  }
}

// 📋 Copy Code
function copyCode() {
  const code = document.getElementById("elementsContent").textContent;

  if (!code) {
    alert("⚠️ No code to copy");
    return;
  }

  navigator.clipboard.writeText(code)
    .then(() => alert("✅ Copied"))
    .catch(() => alert("❌ Copy failed"));
}

// ⬇ Download Code
function downloadCode() {
  const code = document.getElementById("elementsContent").textContent;

  if (!code) {
    alert("⚠️ No code to download");
    return;
  }

  const blob = new Blob([code], { type: "text/html" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "source.html";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 💻 Run JS Console
function runJS() {
  const code = document.getElementById("code").value.trim();

  if (!code) {
    alert("⚠️ Write JS code first");
    return;
  }

  try {
    const result = eval(code);
    document.getElementById("output").innerText =
      result !== undefined ? result : "undefined";
  } catch (err) {
    document.getElementById("output").innerText = err;
  }
}
