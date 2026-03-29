console.log("JS Loaded ✅");

let backend = "https://mini-tools-kwap.onrender.com";

function showTab(tab, btn) {
  console.log("Tab clicked:", tab);

  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));

  document.getElementById(tab).style.display = "block";

  if (btn) btn.classList.add("active");
}

window.onload = () => {
  console.log("Page loaded");
  showTab("preview", document.querySelector(".tabs button"));
};

async function loadSite() {
  console.log("Load clicked");

  let url = document.getElementById("url").value;

  if (!url.startsWith("http")) {
    alert("Enter valid URL");
    return;
  }

  try {
    let res = await fetch(`${backend}/fetch?url=${encodeURIComponent(url)}`);
    let data = await res.json();

    document.getElementById("frame").srcdoc = data.html;
    document.getElementById("elementsContent").textContent = data.html;
    document.getElementById("network").innerText = "Status: " + data.status;

  } catch (e) {
    console.error(e);
    alert("Error");
  }
}

function runJS() {
  console.log("Run JS clicked");

  try {
    let result = eval(document.getElementById("code").value);
    document.getElementById("output").innerText = result;
  } catch (e) {
    document.getElementById("output").innerText = e;
  }
}
