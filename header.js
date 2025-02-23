document.addEventListener("DOMContentLoaded", function () {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);
            setupMenu(); // بعد از بارگذاری، رویدادها تنظیم شوند
        })
        .catch(error => console.error("Error loading header:", error));
});

function setupMenu() {
    let menu = document.getElementById("nav-menu");
    let menuBtn = document.querySelector(".menu-btn");
    let closeBtn = document.querySelector(".close-btn");

    if (menuBtn && closeBtn) { 
        menuBtn.addEventListener("click", () => {
            menu.classList.toggle("active");
            document.body.style.overflow = menu.classList.contains("active") ? "hidden" : "auto";
        });

        closeBtn.addEventListener("click", () => {
            menu.classList.remove("active");
            document.body.style.overflow = "auto";
        });
    }
}
