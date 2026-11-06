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
  to: "Dylan",
  from: "Alexander",
  date: "November 11, 2026",
  time: "7:00 PM",
  place: "Il Porcellino",
  dress: "Come exactly as you are",
  note: "Good pasta, good conversation, and hopefully a night we’ll want to do again."
};

const params = new URLSearchParams(window.location.search);
const details = Object.fromEntries(
  Object.entries(defaults).map(([key, fallback]) => [key, params.get(key)?.trim() || fallback])
);

function escapeQuotes(value) {
  return value.replace(/[“”\"]/g, "").trim();
}

function applyDetails(values) {
  const guestInitial = values.to.trim().charAt(0).toUpperCase() || "D";
  $("#sealInitial").textContent = guestInitial;
  $("#headerInitial").textContent = guestInitial;
  $(".monogram").setAttribute("aria-label", `${guestInitial} and A`);
  document.documentElement.style.setProperty("--guest-initial", `"${guestInitial}"`);
  $("#guestName").textContent = values.to;
  $("#terminalName").textContent = values.to;
  $("#hostName").textContent = values.from;
  $("#dateValue").textContent = values.date;
  $("#timeValue").textContent = values.time;
  $("#placeValue").textContent = values.place;
  $("#dressValue").textContent = values.dress;
  $("#noteValue").textContent = `“${escapeQuotes(values.note)}”`;
  $("#responseName").textContent = values.to;
  $(".success-note").textContent = `See you then, ${values.to}.`;
  $("#footerGuest").textContent = values.to.toUpperCase();
  $("#footerHost").textContent = values.from.toUpperCase();
  document.title = `An Invitation for ${values.to}`;
}

function applyDistanceMode(values) {
  $("#editionText").textContent = "CHICAGO · MICHIGAN · WORTH THE WAIT";
  $("#heroTitle").innerHTML = "Until we’re in<br /><em>the same city.</em>";
  $("#heroLede").innerHTML = "Chicago and Michigan aren’t exactly next door.<br />But I still wanted to make you something.";
  $("#planKicker").textContent = "FOR WHEN THE MAP COOPERATES";
  $("#inviteTitle").textContent = "A date worth waiting for";
  $("#cardCopy").innerHTML = `No exact day yet—just something I hope we get to make real.<br />You and <strong id="hostName">${values.from}</strong>.`;
  $("#dateValue").textContent = "When we’re finally in the same city";
  $("#timeValue").textContent = "Whenever neither of us has to rush";
  $("#placeValue").textContent = "Chicago, Michigan—or halfway";
  $("#dressValue").textContent = "Whatever makes you feel like you";
  $("#noteValue").textContent = "“No pressure. No countdown. Just something sweet waiting for us.”";
  $("#promiseLabel").textContent = "UNTIL THEN";
  $("#promiseTitle").innerHTML = "A little patience.<br />A lot of intention.<br /><em>One date waiting for us.</em>";
  $("#promiseCopy").textContent = "I’ll keep the plan warm. You keep being worth the drive.";
  $("#responseKicker").textContent = "WHEN THE TIMING WORKS";
  $("#responseTitle").innerHTML = `So… <span id="responseName">${values.to}</span>,<br /><em>can I take you out?</em>`;
  acceptButton.innerHTML = 'Yes, when it works <span aria-hidden="true">→</span>';
  clueButton.textContent = "You’ll have to be patient";
  clueButton.dataset.closed = "You’ll have to be patient";
  clueButton.dataset.open = "I can do patient";
  clue.textContent = "Good things are worth a little distance.";
  $("#successTitle").textContent = "Then it’s worth the wait.";
  $("#successPlan").textContent = "No date to force. We’ll make it happen when it feels right.";
  $(".success-note").textContent = `Whenever it works, ${values.to}. I’ll be ready.`;
}

applyDetails(details);
if (params.get("mode") === "distance") applyDistanceMode(details);

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
  clueButton.textContent = clue.classList.contains("visible") ? (clueButton.dataset.open || "Okay, fair") : (clueButton.dataset.closed || "Need more convincing?");
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
  const text = `I’m in 🤍`;
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
    shareResponse.textContent = "Copied — text it to Alexander";
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
