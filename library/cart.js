document.addEventListener("DOMContentLoaded", function () {
    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // به‌روزرسانی جدول سبد خرید
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ""; // پاک کردن محتوای قبلی

        let subtotal = 0;
        let rowNumber = 1; // شماره ردیف‌ها از 1 شروع می‌شود

        // ایجاد ردیف جدول برای هر کتاب
        cart.forEach((book, index) => {
            // بررسی و جایگزینی مقدارهای پیش‌فرض
            let title = book.title || "نامشخص";
            let price = book.price ? Number(book.price) : 0;
            let quantity = book.quantity ? Number(book.quantity) : 1;

            
            // ایجاد ردیف جدول برای هر کتاب
            const cartItemRow = document.createElement("tr");
            cartItemRow.innerHTML = `
                <td>${rowNumber}</td> <!-- شماره ردیف -->
                <td>${title}</td>
                <td>${price.toLocaleString()} </td>
                <td>${quantity}</td>
                <td><button class="remove-btn" data-index="${index}">❌</button></td>
            `;
            cartItemsContainer.appendChild(cartItemRow);
            rowNumber++; // افزایش شماره ردیف

            let itemTotal = price * quantity;
            subtotal += itemTotal;
        });

        // محاسبه قیمت کل
        subtotalElement.textContent = `${subtotal.toLocaleString()} تومان`;
        let total = subtotal + 60000; // اضافه کردن هزینه ارسال و مالیات
        totalElement.textContent = `${total.toLocaleString()} تومان`;

        // افزودن عملکرد حذف آیتم
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", function () {
                let index = this.getAttribute("data-index");
                cart.splice(index, 1); // حذف آیتم از آرایه
                localStorage.setItem("cart", JSON.stringify(cart)); // ذخیره مجدد در localStorage
                updateCartDisplay(); // به‌روزرسانی جدول
            });
        });
    }

    updateCartDisplay();
});

document.addEventListener("DOMContentLoaded", function () {
    const checkoutBtn = document.querySelector(".checkout-btn");

    checkoutBtn.addEventListener("click", function () {
        // بررسی وضعیت ورود کاربر
        const accessToken = localStorage.getItem("access_token");

        if (accessToken) {
            // اگر کاربر وارد شده است، به صفحه پرداخت هدایت شود
            window.location.href = "/get-address.html"; // به صفحه پرداخت هدایت می‌کند
        } else {
            // اگر کاربر وارد نشده است، به صفحه ورود هدایت شود
            window.location.href = "/register.html"; // به صفحه ورود هدایت می‌کند
        }
    });
});