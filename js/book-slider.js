let isDown = false;
let startX;
let scrollLeft;

async function fetchBooks(sliderId, sortBy, maxBooks = 25, genre = null) {
    const slider = document.getElementById(sliderId);
    try {
        let response = await fetch('http://127.0.0.1:8000/books/');
        let books = await response.json();

        // اگر ژانر مشخص شده، ابتدا از API ژانرها را دریافت کنیم
        if (genre) {
            let genreResponse = await fetch('http://127.0.0.1:8000/genres/');
            let genres = await genreResponse.json();
            let genreObj = genres.find(g => g.name === genre);
            if (genreObj) {
                // فیلتر کردن کتاب‌ها بر اساس ژانر
                books = books.filter(book => book.genre_id === genreObj.id);
            }
        }

        // مرتب‌سازی داده‌ها بر اساس معیار مشخص‌شده
        if (sortBy === 'sold_count') {
            books.sort((a, b) => b.sold_count - a.sold_count);
        } else if (sortBy === 'rating') {
            books.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'discount') {
            // مرتب‌سازی بر اساس تخفیف بیشتر
            books.sort((a, b) => {
                if (b.discount && a.discount) {
                    return b.discount - a.discount; // مرتب‌سازی بر اساس تخفیف بیشتر
                } else {
                    return 0; // اگر تخفیفی وجود نداشته باشد، تغییر ایجاد نخواهد شد
                }
            });
        }

        // محدود کردن تعداد کتاب‌ها بر اساس مقدار maxBooks
        books = books.slice(0, maxBooks);

        // نمایش کتاب‌ها در اسلایدر
        slider.innerHTML = '';
        books.forEach(product => {
            let productDiv = document.createElement('div');
            productDiv.classList.add('product-card');
            productDiv.innerHTML = `
                <img src="${product.cover_image}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <p>${product.title}</p>
                    <span id="discount">${product.discount ? product.discount + " %" : "بوکیتو"}</span>
                    <p> ${product.price} تومان</p>
                    <a href="detail.html?id=${product.id}" class="view-details">مشاهده جزئیات</a>
                </div>
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
    fetchBooks('book-slider-1', 'sold_count', 10); // پرفروش‌ترین کتاب‌ها با حداکثر 10 عدد
    fetchBooks('book-slider-2', 'rating', 10); // کتاب‌های با بالاترین امتیاز با حداکثر 10 عدد

    // فقط برای اسلاید 3 کتاب‌های با بیشترین تخفیف نمایش داده می‌شوند
    fetchBooks('book-slider-3', 'discount', 10); // کتاب‌های با بیشترین تخفیف با حداکثر 10 عدد

    enableDragAndDrop('book-slider-1');
    enableDragAndDrop('book-slider-2');
    enableDragAndDrop('book-slider-3');
});
