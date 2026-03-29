const backend = "https://mini-tools-kwap.onrender.com";

// Tabs
function showTab(tab, btn) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));

  document.getElementById(tab).style.display = "block";
  if (btn) btn.classList.add("active");
}

// Default tab
window.onload = () => {
  showTab("preview", document.querySelector(".tabs button"));
};

// Load site
async function loadSite() {
  let url = document.getElementById("url").value;

  if (!url.startsWith("http")) {
    alert("Enter valid URL");
    return;
  }

  try {
    let res = await fetch(`${backend}/fetch?url=${encodeURIComponent(url)}`);
    let data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    document.getElementById("frame").srcdoc = data.html;
    document.getElementById("elementsContent").textContent = data.html;

    let apiList = data.apis?.join("\n") || "No APIs found";

    document.getElementById("network").innerText =
`URL: ${url}
Status: ${data.status}
Time: ${data.load_time}s
Size: ${data.size} bytes

--- APIs ---
${apiList}`;

  } catch (e) {
    alert("Backend error");
  }
}

// Copy
function copyCode() {
  let code = document.getElementById("elementsContent").textContent;
  navigator.clipboard.writeText(code);
  alert("Copied");
}

// Download
function downloadCode() {
  let code = document.getElementById("elementsContent").textContent;

  let blob = new Blob([code], { type: "text/html" });
  let a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "source.html";
  a.click();
}

// Console
function runJS() {
  try {
    let result = eval(document.getElementById("code").value);
    document.getElementById("output").innerText = result;
  } catch (e) {
    document.getElementById("output").innerText = e;
  }
}
