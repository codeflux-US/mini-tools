// 🔥 Render backend URL yaha daalna
let backend = "https://your-backend.onrender.com";

const API_KEY = "mysecret123";

function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  document.getElementById(tab).style.display = "block";
}

async function loadSite() {
  let url = document.getElementById("url").value;

  let res = await fetch(`${backend}/fetch?url=${url}`, {
    headers: {
      "x-api-key": API_KEY
    }
  });

  let data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  document.getElementById("frame").srcdoc = data.html;
  document.getElementById("elements").innerText = data.html;
  document.getElementById("network").innerText =
    "Status: " + data.status;
}

function runJS() {
  try {
    let result = eval(document.getElementById("code").value);
    document.getElementById("output").innerText = result;
  } catch (e) {
    document.getElementById("output").innerText = e;
  }
}
