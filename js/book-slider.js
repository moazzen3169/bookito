let isDown = false;
let startX;
let scrollLeft;

async function fetchBooks(sliderId) {
    const slider = document.getElementById(sliderId);
    try {
        let response = await fetch('http://127.0.0.1:8000/books/');
        let books = await response.json();

        // دو برابر کردن لیست کتاب‌ها برای ایجاد افکت بی‌نهایت
        let repeatedBooks = [...books, ...books];

        slider.innerHTML = '';
        repeatedBooks.forEach(product => {
            let productDiv = document.createElement('div');
            productDiv.classList.add('product-card');
            productDiv.innerHTML = `
                <img src="${product.cover_image}" alt="${product.title}" style="width: 100px; height: 150px;">
                <p id="discount">${product.discount} تومان</p>
                <p>${product.price} تومان</p>
                <a href="detail.html?id=${product.id}" class="view-details">مشاهده جزئیات</a>
            `;
            slider.appendChild(productDiv);
        });
    } catch (error) {
        console.error('خطا در دریافت داده‌ها:', error);
    }
}

function scrollSlider(direction, sliderId) {
    const slider = document.getElementById(sliderId);
    let scrollAmount = 400;
    slider.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function enableDragAndDrop(sliderId) {
    const slider = document.getElementById(sliderId);

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        slider.style.cursor = "grabbing";
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
        slider.style.cursor = "grab";
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
        slider.style.cursor = "grab";
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    fetchBooks('book-slider-1');
    fetchBooks('book-slider-2');
    fetchBooks('book-slider-3');

    enableDragAndDrop('book-slider-1');
    enableDragAndDrop('book-slider-2');
    enableDragAndDrop('book-slider-3');
});
