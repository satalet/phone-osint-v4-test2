// ====== Constants ======
const COUNTRY_CODES = {
  PS: "970", JO: "962", SA: "966", EG: "20", IL: "972"
};

const MIN_LENGTH = 7;
const MAX_LENGTH = 15; // E.164 standard

// ====== DOM Elements ======
const phoneInput     = document.getElementById("phoneInput");
const countrySelect  = document.getElementById("countrySelect");
const analyzeBtn     = document.getElementById("analyzeBtn");
const resultBox      = document.getElementById("resultBox");
const linksBox       = document.getElementById("linksBox");
const validity       = document.getElementById("validity");
const country        = document.getElementById("country");
const formatted      = document.getElementById("formatted");
const rawNumber      = document.getElementById("rawNumber");
const historyList    = document.getElementById("historyList");

// ====== LocalStorage (safe) ======
function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("phoneHistory")) || [];
  } catch {
    return [];
  }
}

function saveHistory(number) {
  try {
    let history = getHistory().filter(n => n !== number);
    history.unshift(number);
    localStorage.setItem("phoneHistory", JSON.stringify(history.slice(0, 10)));
    loadHistory();
  } catch {
    console.warn("localStorage غير متاح");
  }
}

function loadHistory() {
  historyList.innerHTML = "";
  getHistory().forEach(number => {
    const li = document.createElement("li");
    li.textContent = number;
    li.onclick = () => { phoneInput.value = number; };
    historyList.appendChild(li);
  });
}

// ====== Normalize ======
function normalizeNumber(number) {
  let cleaned = number.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;

  const countryVal = countrySelect.value;
  const code = COUNTRY_CODES[countryVal];

  if (code) {
    if (cleaned.startsWith("0")) return `+${code}${cleaned.substring(1)}`;
    if (!cleaned.startsWith(code)) return `+${code}${cleaned}`;
    return `+${cleaned}`;
  }

  return cleaned;
}

// ====== Validate ======
function validateNumber(number) {
  const digitsOnly = number.replace(/\D/g, "");
  if (digitsOnly.length < MIN_LENGTH) return "رقم قصير جداً";
  if (digitsOnly.length > MAX_LENGTH) return "رقم طويل جداً";
  return null; // null = صحيح
}

// ====== Build Links ======
function buildLinks(number) {
  const clean = number.replace("+", "");
  const countryVal = countrySelect.value;
  const code = COUNTRY_CODES[countryVal] || "";
  const localVariant = (code && clean.startsWith(code))
    ? clean.substring(code.length)
    : clean;

  // query شامل لكل الصيغ
  const fullQuery = `"${clean}" OR "0${localVariant}" OR "${localVariant}"`;
  const encodedFull = encodeURIComponent(fullQuery);
  const encodedClean = encodeURIComponent(clean);

  document.getElementById("googleLink").href =
    `https://www.google.com/search?q=${encodedFull}`;

  const tcCountry = (countryVal && countryVal !== "other")
    ? `${countryVal.toLowerCase()}/` : "";
  document.getElementById("truecallerLink").href =
    `https://www.truecaller.com/search/${tcCountry}${encodedClean}`;

  document.getElementById("waLink").href =
    `https://wa.me/${clean}`;

  // إنستغرام، فيسبوك، X، تيك توك — كلهم بالصيغ الثلاث
  document.getElementById("instagramLink").href =
    `https://www.google.com/search?q=site:instagram.com+${encodedFull}`;
  document.getElementById("facebookLink").href =
    `https://www.facebook.com/search/posts/?q=${encodedFull}`;
  document.getElementById("xLink").href =
    `https://x.com/search?q=${encodedFull}`;
  document.getElementById("tiktokLink").href =
    `https://www.tiktok.com/search?q=${encodedFull}`;

  document.getElementById("linkedinLink").href =
    `https://www.linkedin.com/search/results/all/?keywords=${encodedFull}`;
  document.getElementById("archiveLink").href =
    `https://web.archive.org/web/*/${encodedClean}`;
}

// ====== Main Analyze ======
function analyze() {
  let number = phoneInput.value.trim();
  if (!number) { alert("أدخل رقم هاتف"); return; }

  number = normalizeNumber(number);

  const error = validateNumber(number);
  if (error) {
    validity.textContent = `✗ ${error}`;
    validity.style.color = "red";
    resultBox.classList.remove("hidden");
    linksBox.classList.add("hidden");
    return;
  }

  validity.textContent = "✓ جاهز للبحث";
  validity.style.color = "green";
  country.textContent  = countrySelect.options[countrySelect.selectedIndex].text;
  formatted.textContent = number;
  rawNumber.textContent = number;

  resultBox.classList.remove("hidden");
  linksBox.classList.remove("hidden");

  buildLinks(number);
  saveHistory(number);
}

// ====== Events ======
analyzeBtn.addEventListener("click", analyze);

// دعم Enter
phoneInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") analyze();
});

// ====== Init ======
loadHistory();
