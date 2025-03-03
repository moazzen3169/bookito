document.addEventListener("DOMContentLoaded", async function () {
    const apiUrl = "http://127.0.0.1:8000/books/"; // لینک API را جایگزین کنید
    const swiperWrapper = document.querySelector(".swiper-wrapper");

    try {
        const response = await fetch(apiUrl);
        const products = await response.json();

        products.forEach(product => {
            const productCard = `
                <div class="swiper-slide">
                    <div class="product-card">
                        <img src="${product.cover_image}" alt="${product.title}">
                        <p id="discount">${product.discount} تومان</p>
                        <p>${product.price} تومان</p>
                        <a href="detail.html?id=${product.id}" class="view-details">مشاهده جزئیات</a>

                    </div>
                </div>
            `;
            swiperWrapper.innerHTML += productCard;
        });

        // مقداردهی اولیه Swiper بعد از لود شدن داده‌ها
        new Swiper(".swiper", {
            slidesPerView: "auto",
            spaceBetween: 1,
            loop: true,

        });

    } catch (error) {
        console.error("خطا در دریافت محصولات:", error);
    }
});