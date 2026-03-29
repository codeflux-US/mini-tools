let backend = "https://mini-tools-kwap.onrender.com";

// 🔘 Tabs control
function showTab(tab, btn) {
  // hide all tabs
  document.querySelectorAll(".tab").forEach(t => {
    t.style.display = "none";
  });

  // remove active class
  document.querySelectorAll(".tabs button").forEach(b => {
    b.classList.remove("active");
  });

  // show selected tab
  document.getElementById(tab).style.display = "block";

  // highlight active button
  if (btn) btn.classList.add("active");
}

// 🔥 Default tab
window.onload = () => {
  showTab("preview", document.querySelector(".tabs button"));
};

// 🌐 Load website
async function loadSite() {
  let url = document.getElementById("url").value.trim();

  if (!url || !url.startsWith("http")) {
    alert("Enter valid URL (https://...)");
    return;
  }

  try {
    let res = await fetch(`${backend}/fetch?url=${encodeURIComponent(url)}`);

    if (!res.ok) {
      throw new Error("Server error");
    }

    let data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // 🌐 Preview
    document.getElementById("frame").srcdoc = data.html;

    // 🧱 Elements (formatted HTML)
    document.getElementById("elementsContent").textContent = data.html;

    // 🌍 Network info
    document.getElementById("network").innerText =
      `Status: ${data.status}\nCSS files: ${data.css.length}\nJS files: ${data.js.length}`;

  } catch (e) {
    console.error(e);
    alert("Backend error or blocked site");
  }
}

// 💻 Run JS console
function runJS() {
  let code = document.getElementById("code").value;

  if (!code.trim()) {
    alert("Write some JS code first");
    return;
  }

  try {
    let result = eval(code);

    // show result
    document.getElementById("output").innerText =
      result !== undefined ? result : "undefined";

  } catch (e) {
    document.getElementById("output").innerText = e;
  }
}
