let backend = "https://mini-tools-kwap.onrender.com";

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

    // 🖥️ Preview
    let iframe = document.getElementById("frame");
    iframe.srcdoc = data.html;

    // 🧱 Elements (FIXED)
    document.getElementById("elements").textContent = data.html;

    // 🌐 Network
    document.getElementById("network").innerText =
      "Status: " + data.status;

    // 🔥 Element Inspector (click detect)
    setTimeout(() => {
      let doc = iframe.contentDocument || iframe.contentWindow.document;

      doc.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        let el = e.target;

        // 🧠 Show details
        document.getElementById("inspectBox").innerText =
          "Tag: " + el.tagName +
          "\nClass: " + el.className +
          "\nID: " + el.id;

        // 🎯 Highlight element
        el.style.outline = "2px solid red";
      });
    }, 500);

  } catch (e) {
    alert("Backend error");
  }
}

// 💻 JS Console
function runJS() {
  try {
    let result = eval(document.getElementById("code").value);
    document.getElementById("output").innerText = result;
  } catch (e) {
    document.getElementById("output").innerText = e;
  }
}
