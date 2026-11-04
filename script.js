const $ = (selector) => document.querySelector(selector);

const opening = $("#opening");
const page = $("#page");
const openButton = $("#openButton");
const acceptButton = $("#acceptButton");
const clueButton = $("#clueButton");
const clue = $("#clue");
const success = $("#success");
const closeSuccess = $("#closeSuccess");
const shareResponse = $("#shareResponse");
const editor = $("#editor");
const editorForm = $("#editorForm");
const generatedLink = $("#generatedLink");
const shareLink = $("#shareLink");
const copyLink = $("#copyLink");
const previewLink = $("#previewLink");

const defaults = {
  to: "Emanuella",
  from: "Alexander",
  date: "Your choice",
  time: "After sunset",
  place: "A table for two",
  dress: "Come exactly as you are",
  note: "Good food, better conversation, and a night made just for us."
};

const params = new URLSearchParams(window.location.search);
const details = Object.fromEntries(
  Object.entries(defaults).map(([key, fallback]) => [key, params.get(key)?.trim() || fallback])
);

function escapeQuotes(value) {
  return value.replace(/[“”\"]/g, "").trim();
}

function applyDetails(values) {
  $("#guestName").textContent = values.to;
  $("#terminalName").textContent = values.to;
  $("#hostName").textContent = values.from;
  $("#dateValue").textContent = values.date;
  $("#timeValue").textContent = values.time;
  $("#placeValue").textContent = values.place;
  $("#dressValue").textContent = values.dress;
  $("#noteValue").textContent = `“${escapeQuotes(values.note)}”`;
  $("#responseName").textContent = values.to;
  $(".success-note").textContent = `It’s officially a date, ${values.to}.`;
  $("#footerGuest").textContent = values.to.toUpperCase();
  $("#footerHost").textContent = values.from.toUpperCase();
  document.title = `An Invitation for ${values.to}`;
}

applyDetails(details);

document.body.classList.add("locked");

document.querySelectorAll(".code-line").forEach((line) => {
  window.setTimeout(() => line.classList.add("visible"), Number(line.dataset.delay));
});

function createSparks() {
  const field = $("#sparkField");
  for (let index = 0; index < 26; index += 1) {
    const spark = document.createElement("span");
    spark.className = "spark";
    spark.style.left = `${Math.random() * 100}%`;
    spark.style.top = `${Math.random() * 100}%`;
    spark.style.setProperty("--duration", `${4 + Math.random() * 8}s`);
    spark.style.setProperty("--delay", `${Math.random() * -8}s`);
    spark.style.setProperty("--x", `${-20 + Math.random() * 40}px`);
    field.appendChild(spark);
  }
}

createSparks();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

function openInvitation() {
  opening.classList.add("is-open");
  page.classList.add("is-visible");
  page.setAttribute("aria-hidden", "false");
  document.body.classList.remove("locked");
  window.setTimeout(() => $(".masthead").classList.add("visible"), 250);
  window.setTimeout(() => $(".hero").classList.add("visible"), 450);
}

openButton.addEventListener("click", openInvitation);

clueButton.addEventListener("click", () => {
  clue.classList.toggle("visible");
  clueButton.textContent = clue.classList.contains("visible") ? "Okay, that was a good reason" : "I need one more reason";
});

function heartBurst() {
  for (let index = 0; index < 30; index += 1) {
    const heart = document.createElement("span");
    heart.className = "burst";
    heart.textContent = index % 3 === 0 ? "✦" : "♥";
    const angle = (Math.PI * 2 * index) / 30;
    const distance = 90 + Math.random() * 260;
    heart.style.setProperty("--bx", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--by", `${Math.sin(angle) * distance}px`);
    heart.style.setProperty("--br", `${Math.random() * 360}deg`);
    heart.style.fontSize = `${0.6 + Math.random() * 1.2}rem`;
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1800);
  }
}

acceptButton.addEventListener("click", () => {
  success.classList.add("visible");
  success.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  heartBurst();
});

closeSuccess.addEventListener("click", () => {
  success.classList.remove("visible");
  success.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
});

shareResponse.addEventListener("click", async () => {
  const text = `It’s a date, ${details.from} 🤍`;
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    shareResponse.textContent = "Copied — send it to him";
  } catch {
    shareResponse.textContent = text;
  }
});

function populateEditor() {
  [...editorForm.elements].forEach((field) => {
    if (field.name && details[field.name]) field.value = params.get(field.name) || "";
  });
  editorForm.elements.to.value = details.to;
  editorForm.elements.from.value = details.from;
}

function openEditor() {
  populateEditor();
  editor.classList.add("visible");
  editor.setAttribute("aria-hidden", "false");
}

if (params.get("edit") === "1") {
  openInvitation();
  window.setTimeout(openEditor, 400);
}

$("#closeEditor").addEventListener("click", () => {
  editor.classList.remove("visible");
  editor.setAttribute("aria-hidden", "true");
});

editorForm.addEventListener("input", () => {
  const live = { ...defaults };
  new FormData(editorForm).forEach((value, key) => {
    if (String(value).trim()) live[key] = String(value).trim();
  });
  applyDetails(live);
});

editorForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const guestParams = new URLSearchParams();
  new FormData(editorForm).forEach((value, key) => {
    if (String(value).trim()) guestParams.set(key, String(value).trim());
  });
  const url = `${window.location.origin}${window.location.pathname}?${guestParams.toString()}`;
  shareLink.value = url;
  previewLink.href = url;
  generatedLink.hidden = false;
  generatedLink.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

copyLink.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value);
    copyLink.textContent = "Copied ✓";
  } catch {
    shareLink.select();
    document.execCommand("copy");
    copyLink.textContent = "Copied ✓";
  }
  window.setTimeout(() => { copyLink.textContent = "Copy link"; }, 1800);
});
