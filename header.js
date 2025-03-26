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
        

document.addEventListener("DOMContentLoaded", function () {
    const cartCountElement = document.getElementById('cart-count'); // المنت نمایش تعداد محصولات

    // به‌روزرسانی تعداد محصولات داخل سبد خرید
    function updateCartCount() {
        // خواندن داده‌های سبد خرید از localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; 
        
        // محاسبه تعداد کل محصولات (با در نظر گرفتن quantity)
        const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0); // جمع تعداد کل محصولات
        
        // نمایش تعداد محصولات یا مخفی کردن شمارنده
        if (cartCount > 0) {
            cartCountElement.textContent = cartCount; // نمایش تعداد در شمارنده
            cartCountElement.style.display = 'inline-block';  // نمایش شمارنده
        } else {
            cartCountElement.style.display = 'none';  // اگر سبد خرید خالی است، شمارنده را مخفی کنیم
        }
    }

    // فراخوانی به‌روزرسانی شمارنده هنگام بارگذاری صفحه
    updateCartCount();
});
