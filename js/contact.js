// ======= add links to logo and menus =======
document.querySelector(".letsEatLogo").addEventListener("click", function(){
    window.location = 'index.html';
});

const topDropdownMenu = document.querySelector(".dropdown-content");
document.querySelector("#topMenu").addEventListener("click", function(){
    if (topDropdownMenu.style.display === "block") {
        topDropdownMenu.style.display = "none";
      } else {
            topDropdownMenu.style.display = "block";
      }
});