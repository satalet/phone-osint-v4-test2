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

```
const history =
    JSON.parse(localStorage.getItem("phoneHistory")) || [];

historyList.innerHTML = "";

history.forEach(number => {

    const li = document.createElement("li");

    li.textContent = number;

    li.onclick = () => {
        phoneInput.value = number;
    };

    historyList.appendChild(li);

});
```

}

function saveHistory(number){

```
let history =
    JSON.parse(localStorage.getItem("phoneHistory")) || [];

history = history.filter(n => n !== number);

history.unshift(number);

history = history.slice(0,10);

localStorage.setItem(
    "phoneHistory",
    JSON.stringify(history)
);

loadHistory();
```

}

function buildLinks(number){

```
const clean =
    number.replace("+","");

document.getElementById("googleLink").href =
    `https://www.google.com/search?q="${number}"`;

document.getElementById("truecallerLink").href =
    `https://www.truecaller.com/search/${clean}`;

document.getElementById("waLink").href =
    `https://wa.me/${clean}`;

document.getElementById("tiktokLink").href =
    `https://www.tiktok.com/search?q=${clean}`;

document.getElementById("instagramLink").href =
    `https://www.google.com/search?q=site:instagram.com+"${clean}"`;

document.getElementById("facebookLink").href =
    `https://www.facebook.com/search/top?q=${clean}`;

document.getElementById("linkedinLink").href =
    `https://www.linkedin.com/search/results/all/?keywords=${clean}`;

document.getElementById("xLink").href =
    `https://x.com/search?q=${clean}`;

document.getElementById("archiveLink").href =
    `https://web.archive.org/web/*/${clean}`;
```

}

function normalizeNumber(number){

```
let cleaned =
    number.replace(/[^0-9+]/g,'');

const country =
    countrySelect.value;

if(cleaned.startsWith("+"))
    return cleaned;

if(country === "PS"){
    if(cleaned.startsWith("0"))
        return "+970" + cleaned.substring(1);
}

if(country === "JO"){
    if(cleaned.startsWith("0"))
        return "+962" + cleaned.substring(1);
}

if(country === "SA"){
    if(cleaned.startsWith("0"))
        return "+966" + cleaned.substring(1);
}

if(country === "EG"){
    if(cleaned.startsWith("0"))
        return "+20" + cleaned.substring(1);
}

if(country === "IL"){
    if(cleaned.startsWith("0"))
        return "+972" + cleaned.substring(1);
}

return cleaned;
```

}

analyzeBtn.addEventListener("click",()=>{

```
let number =
    phoneInput.value.trim();

if(!number){

    alert("أدخل رقم هاتف");

    return;
}

number =
    normalizeNumber(number);

validity.textContent =
    "✓ جاهز للبحث";

country.textContent =
    countrySelect.options[
        countrySelect.selectedIndex
    ].text;

formatted.textContent =
    number;

rawNumber.textContent =
    number;

resultBox.classList.remove("hidden");

linksBox.classList.remove("hidden");

buildLinks(number);

saveHistory(number);
```

});

loadHistory();
