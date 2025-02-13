document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.querySelector(".cart-items");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    let cart = [
        { id: 1, title: "بیگانه", author: "آلبر کامو", price: 150000, img: "image/bookcover.jpg", quantity: 1 },
        { id: 2, title: "دنیای سوفی", author: "یوستین گردر", price: 200000, img: "image/bookcover.jpg", quantity: 1 },
        { id: 3, title: "شازده کوچولو", author: "آنتوان دوسنت اگزوپری", price: 120000, img: "image/bookcover.jpg", quantity: 1 },
        { id: 4, title: "شازده کوچولو", author: "آنتوان دوسنت اگزوپری", price: 120000, img: "image/bookcover.jpg", quantity: 1 },
        { id: 5, title: "شازده کوچولو", author: "آنتوان دوسنت اگزوپری", price: 120000, img: "image/bookcover.jpg", quantity: 1 }
    ];

    function renderCart() {
        cartItems.innerHTML = "";
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <p>✍ نویسنده: ${item.author}</p>
                </div>
                <p class="item-price">${(item.price * item.quantity).toLocaleString()} تومان</p>
                <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}">
                <button class="remove-btn" data-id="${item.id}">❌</button>
            `;
            cartItems.appendChild(cartItem);
        });

        // آپدیت قیمت‌ها
        subtotalEl.innerText = `${subtotal.toLocaleString()} تومان`;
        totalEl.innerText = `${(subtotal + 10000 + 15000).toLocaleString()} تومان`;

        // حذف آیتم‌ها
        document.querySelectorAll(".remove-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const id = parseInt(e.target.getAttribute("data-id"));
                cart = cart.filter(item => item.id !== id);
                renderCart();
            });
        });

        // تغییر تعداد
        document.querySelectorAll(".item-quantity").forEach(input => {
            input.addEventListener("input", (e) => {
                const id = parseInt(e.target.getAttribute("data-id"));
                const newQuantity = parseInt(e.target.value);
                const item = cart.find(item => item.id === id);
                if (item && newQuantity > 0) {
                    item.quantity = newQuantity;
                    renderCart();
                }
            });
        });
    }

    renderCart();
});
