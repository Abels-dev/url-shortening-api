const inputLink = document.getElementById("longlink");
const shortLinkContainer = document.querySelector(".shortened");
const showMenu = document.querySelector(".showMenu");
const menu = document.querySelector(".menu-container");
const showError = document.querySelector(".error");
const shortenBtn = document.getElementById("shorten");

showMenu.onclick = () => menu.classList.toggle("display-menu");

shortenBtn.onclick = () => {
   inputLink.classList.remove("errorState");
   showError.textContent = "";
   if (inputLink.value == "") {
      showError.textContent = "please add a link";
      inputLink.classList.add("errorState");
      return;
   }
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
      shortLinkContainer.innerHTML += `<div class="display">
     <div class="longlink">${inputLink.value}</div>
     <div class="shortened-link">
        <div class="showshortlink">${shortenedLink}</div>
        <button class="copy">copy</button>
     </div>
  </div>`;
      const copyBtn = document.querySelectorAll(".copy");
      copyBtn.forEach((copyBtn) => {
         const showShortedUrl = copyBtn.previousElementSibling.textContent;
         copyBtn.onclick = () => {
            navigator.clipboard.writeText(showShortedUrl);
            copyBtn.textContent = "copied!";
            copyBtn.classList.add("copied");
         };
      });
   }
};
