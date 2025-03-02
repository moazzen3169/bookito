document.addEventListener("DOMContentLoaded", function() {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML("afterbegin", data);

            // پس از لود شدن هدر، المان‌ها را دریافت کنید
            const searchBtn = document.getElementById("searchBtn");
            const searchContainer = document.getElementById("searchContainer");
            const menuBtn = document.getElementById("menuBtn");
            const closeBtn = document.getElementById("closeBtn");
            const sidebar = document.getElementById("sidebar");
            const overlay = document.getElementById("overlay");

            // ایونت کلیک برای نمایش و مخفی کردن نوار جستجو
            searchBtn.addEventListener("click", function() {
                searchContainer.style.display = searchContainer.style.display === "block" ? "none" : "block";
            });

            // ایونت کلیک برای نمایش و مخفی کردن سایدبار
            menuBtn.addEventListener("click", function() {
                sidebar.classList.add("active");
                overlay.classList.add("active");
            });

            closeBtn.addEventListener("click", function() {
                sidebar.classList.remove("active");
                overlay.classList.remove("active");
            });

            overlay.addEventListener("click", function() {
                sidebar.classList.remove("active");
                overlay.classList.remove("active");
            });
        })
        .catch(error => console.error("خطا در بارگذاری هدر:", error));
});
        