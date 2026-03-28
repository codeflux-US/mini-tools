let backend = "https://your-backend.onrender.com";

function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  document.getElementById(tab).style.display = "block";
}

async function loadSite() {
  let url = document.getElementById("url").value;

  if (!url.startsWith("http")) {
    alert("Enter valid URL (https://...)");
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
    document.getElementById("elements").innerText = data.html;
    document.getElementById("network").innerText =
      "Status: " + data.status;

  } catch (e) {
    alert("Backend error");
  }
}

function runJS() {
  try {
    let result = eval(document.getElementById("code").value);
    document.getElementById("output").innerText = result;
  } catch (e) {
    document.getElementById("output").innerText = e;
  }
}
