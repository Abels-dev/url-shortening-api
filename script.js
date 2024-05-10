const inputLink = document.getElementById("longlink");
const shortLinkContainer = document.querySelector(".shortened");
const showMenu = document.querySelector(".showMenu");
const menu = document.querySelector(".menu-container");
const showError = document.querySelector(".error");
const shortenBtn = document.getElementById("shorten");
const clearBtn = document.querySelector(".clear");
let shortenLinks = [];
let longlinks = [];
showMenu.onclick = () => menu.classList.toggle("display-menu");
let storedShortLinks = JSON.parse(localStorage.getItem("shortedLinks"));
let storedLongLinks = JSON.parse(localStorage.getItem("longLinks"));
getLinks();
function getLinks() {
   if (storedShortLinks && storedLongLinks) {
      for (let i = 0; i < storedShortLinks.length; i++) {
         shortLinkContainer.innerHTML += `<div class="display">
         <div class="longlink">${storedLongLinks[i]}</div>
         <div class="shortened-link">
            <div class="showshortlink">${storedShortLinks[i]}</div>
            <button class="copy">copy</button>
         </div>
      </div>`;
      }
      const copyBtn = document.querySelectorAll(".copy");
      copyBtn.forEach((copyBtn) => {
         copyBtn.onclick = () => {
            const showShortedUrl = copyBtn.previousElementSibling.textContent;
            copy(showShortedUrl, copyBtn);
         };
      });
      shortenLinks = storedShortLinks;
      longlinks = storedLongLinks;
   }
}
clearBtn.onclick = () => {
   localStorage.clear();
   storedLongLinks = [];
   storedShortLinks = [];
   shortLinkContainer.innerHTML = "";
};
shortenBtn.onclick = () => {
   inputLink.classList.remove("errorState");
   showError.textContent = "";
   if (inputLink.value == "") {
      showError.textContent = "please add a link";
      inputLink.classList.add("errorState");
      return;
   }
   longlinks.push(inputLink.value);
   localStorage.setItem("longLinks", JSON.stringify(longlinks));
   displayUrl();
};
const shortenUrl = async () => {
   try {
      let longUrl = inputLink.value;
      const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
         longUrl
      )}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
         showError.textContent = "invalid Url";
         return null;
      }
      const data = await response.text();
      return data;
   } catch (error) {
      showError.textContent = "Network Error, check your connection";
   }
};
const displayUrl = async () => {
   const shortenedLink = await shortenUrl();
   if (shortenedLink) {
      shortenLinks.push(shortenedLink);
      localStorage.setItem("shortedLinks", JSON.stringify(shortenLinks));
      shortLinkContainer.innerHTML += `<div class="display">
     <div class="longlink">${inputLink.value}</div>
     <div class="shortened-link">
        <div class="showshortlink">${shortenedLink}</div>
        <button class="copy">copy</button>
     </div>
  </div>`;
      clearBtn.style.display = "block";
      const copyBtn = document.querySelectorAll(".copy");
      copyBtn.forEach((copyBtn) => {
         copyBtn.onclick = () => {
            const showShortedUrl = copyBtn.previousElementSibling.textContent;
            copy(showShortedUrl, copyBtn);
         };
      });
   }
};
const copy = (url, copyBtn) => {
   navigator.clipboard.writeText(url);
   copyBtn.textContent = "copied!";
   copyBtn.classList.add("copied");
};
