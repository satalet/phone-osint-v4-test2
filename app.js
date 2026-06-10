const phoneInput = document.getElementById("phoneInput");
const countrySelect = document.getElementById("countrySelect");
const analyzeBtn = document.getElementById("analyzeBtn");

const resultBox = document.getElementById("resultBox");
const linksBox = document.getElementById("linksBox");

const validity = document.getElementById("validity");
const country = document.getElementById("country");
const formatted = document.getElementById("formatted");
const rawNumber = document.getElementById("rawNumber");

const historyList = document.getElementById("historyList");

function loadHistory() {
    const history = JSON.parse(localStorage.getItem("phoneHistory")) || [];
    historyList.innerHTML = "";
    history.forEach(number => {
        const li = document.createElement("li");
        li.textContent = number;
        li.onclick = () => { phoneInput.value = number; };
        historyList.appendChild(li);
    });
}

function saveHistory(number) {
    let history = JSON.parse(localStorage.getItem("phoneHistory")) || [];
    history = history.filter(n => n !== number);
    history.unshift(number);
    history = history.slice(0, 10);
    localStorage.setItem("phoneHistory", JSON.stringify(history));
    loadHistory();
}

function buildLinks(number) {
    const clean = number.replace("+", "");
    const countryCode = countrySelect.value.toLowerCase();
    
    // 1. بحث جوجل الشامل (دولي + محلي)
    let localVariant = clean.startsWith(countrySelect.value) ? clean.substring(countrySelect.value.length) : clean;
    document.getElementById("googleLink").href = `https://www.google.com/search?q=%22${clean}%22+OR+%22${localVariant}%22+OR+%220${localVariant}%22`;
    
    // 2. تروكولر ذكي (دولي أو مخصص)
    if (countryCode === "other") {
        document.getElementById("truecallerLink").href = `https://www.truecaller.com/search/${encodeURIComponent(clean)}`;
    } else {
        document.getElementById("truecallerLink").href = `https://www.truecaller.com/search/${countryCode}/${clean}`;
    }
    
    // 3. باقي الروابط
    document.getElementById("waLink").href = `https://wa.me/${clean}`;
    document.getElementById("instagramLink").href = `https://www.google.com/search?q=site:instagram.com+"${clean}"`;
    document.getElementById("facebookLink").href = `https://www.facebook.com/search/top?q=${clean}`;
    document.getElementById("linkedinLink").href = `https://www.linkedin.com/search/results/all/?keywords=${clean}`;
    document.getElementById("xLink").href = `https://x.com/search?q=${clean}`;
    document.getElementById('tiktokLink').href = `https://www.tiktok.com/search?q=${clean}`;
    document.getElementById("archiveLink").href = `https://web.archive.org/web/*/${clean}`;
}

function normalizeNumber(number) {
    let cleaned = number.replace(/[^0-9+]/g, '');
    const countryVal = countrySelect.value;

    if (cleaned.startsWith("+")) return cleaned;

    const maps = { "PS": "+970", "JO": "+962", "SA": "+966", "EG": "+20", "IL": "+972" };
    if (maps[countryVal] && cleaned.startsWith("0")) {
        return maps[countryVal] + cleaned.substring(1);
    }
    return cleaned;
}

analyzeBtn.addEventListener("click", () => {
    let number = phoneInput.value.trim();
    if (!number) {
        alert("أدخل رقم هاتف");
        return;
    }

    number = normalizeNumber(number);
    validity.textContent = "✓ جاهز للبحث";
    country.textContent = countrySelect.options[countrySelect.selectedIndex].text;
    formatted.textContent = number;
    rawNumber.textContent = number;

    resultBox.classList.remove("hidden");
    linksBox.classList.remove("hidden");

    buildLinks(number);
    saveHistory(number);
});

loadHistory();
