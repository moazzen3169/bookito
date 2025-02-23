document.addEventListener("DOMContentLoaded", function () {
    let footerContainer = document.getElementById("footer");

    fetch("./footer.html") // مسیر را تنظیم کنید
        .then(response => {
            if (!response.ok) {
                throw new Error("خطا در بارگیری فوتر!");
            }
            return response.text();
        })
        .then(data => {
            footerContainer.innerHTML = data;
        })
        .catch(error => console.error("مشکل در بارگذاری فوتر:", error));
});
