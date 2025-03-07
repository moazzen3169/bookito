async function loadGenreData() {
    const urlParams = new URLSearchParams(window.location.search);
    const genreId = urlParams.get('id');

    if (!genreId) {
        document.body.innerHTML = "<h2>شناسه ژانر مشخص نشده است!</h2>";
        return;
    }

    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("لطفاً وارد شوید.");
            window.location.href = "login.html";
            return;
        }

        // دریافت اطلاعات ژانر
        const genreResponse = await fetch(`http://127.0.0.1:8000/genres/${genreId}/`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!genreResponse.ok) {
            throw new Error(`خطا در دریافت اطلاعات ژانر (کد: ${genreResponse.status})`);
        }

        const genre = await genreResponse.json();
        document.getElementById('genre-name').textContent = genre.name || "نام مشخص نیست";

        // دریافت لیست کتاب‌های مرتبط با ژانر
        await loadGenreBooks(Number(genreId), token);
    } catch (error) {
        console.error("خطا در دریافت اطلاعات:", error);
        document.body.innerHTML += `<p class="error-message">${error.message}</p>`;
    }
}

async function loadGenreBooks(genreId, token) {
    try {
        const booksResponse = await fetch(`http://127.0.0.1:8000/books/`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!booksResponse.ok) {
            throw new Error(`خطا در دریافت لیست کتاب‌ها (کد: ${booksResponse.status})`);
        }

        const books = await booksResponse.json();

        if (!Array.isArray(books)) {
            throw new Error("داده‌های دریافت‌شده معتبر نیستند.");
        }

        displayBooks(books, genreId);
    } catch (error) {
        console.error("خطا در دریافت کتاب‌ها:", error);
        document.body.innerHTML += `<p class="error-message">${error.message}</p>`;
    }
}

function displayBooks(books, genreId) {
    let oldContainer = document.querySelector('.books-container');
    if (oldContainer) {
        oldContainer.remove();
    }

    const container = document.createElement('div');
    container.classList.add('books-container');


    

    // فیلتر کتاب‌هایی که متعلق به این ژانر هستند
    const filteredBooks = books.filter(book => 
        book.genres && book.genres.some(genre => Number(genre.id) === genreId)
    );
    
    if (filteredBooks.length === 0) {
        container.innerHTML = "<p>هیچ کتابی برای این ژانر یافت نشد.</p>";
    } else {
        filteredBooks.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('product-card');

            bookElement.innerHTML = `
                <img src="${book.cover_image || 'default-book.jpg'}" alt="${book.title}">
                <p id="discount">${book.discount ? book.discount + " %" : "بوکیتو"}</p>
                <p>${book.price} تومان</p>
                <a href="detail.html?id=${book.id}" class="view-details">مشاهده جزئیات</a>
            `;

            container.appendChild(bookElement);
        });
    }

    document.body.appendChild(container);
}



document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const genreId = urlParams.get("id");
    if (!genreId) {
        document.body.innerHTML = "<h2>شناسه ژانر مشخص نشده است!</h2>";
        return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("لطفاً وارد شوید.");
        window.location.href = "login.html";
        return;
    }

    const booksApiUrl = "http://127.0.0.1:8000/books/";
    const publishersApiUrl = "http://127.0.0.1:8000/publishers/";
    let allBooks = [];
    let filteredBooks = [];
    let currentPage = 1;
    const booksPerPage = 6;
    
    const booksContainer = document.querySelector(".books-container");
    const sortSelect = document.getElementById("sort");
    const publisherSelect = document.getElementById("publisher");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");
    
    async function fetchBooks() {
        try {
            const response = await fetch(booksApiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            allBooks = await response.json();
            filteredBooks = allBooks.filter(book => 
                book.genres && book.genres.some(genre => Number(genre.id) === Number(genreId))
            );
            renderBooks();
        } catch (error) {
            console.error("❌ خطا در دریافت کتاب‌ها:", error);
        }
    }
    
    async function fetchPublishers() {
        try {
            const response = await fetch(publishersApiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const publishers = await response.json();
            publishers.forEach(publisher => {
                const option = document.createElement("option");
                option.value = publisher.id;
                option.textContent = publisher.name;
                publisherSelect.appendChild(option);
            });
        } catch (error) {
            console.error("❌ خطا در دریافت ناشران:", error);
        }
    }
    
    function renderBooks() {
        booksContainer.innerHTML = "";
        const startIndex = (currentPage - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;
        const booksToShow = filteredBooks.slice(startIndex, endIndex);

        booksToShow.forEach(book => {
            const bookCard = `
                <div class="product-card">
                    <img src="${book.cover_image || 'default-book.jpg'}" alt="${book.title}">
                    <p id="discount">${book.discount ? book.discount + " %" : "بوکیتو"}</p>
                    <p>${book.price} تومان</p>
                    <a href="detail.html?id=${book.id}" class="view-details">مشاهده جزئیات</a>
                </div>
            `;
            booksContainer.innerHTML += bookCard;
        });

        updatePagination();
    }
    function filterBooks() {
const selectedPublisher = publisherSelect.value;
if (selectedPublisher === "all") {
// فیلتر بدون انتخاب ناشر خاص
filteredBooks = allBooks.filter(book => 
    book.genres && book.genres.some(genre => Number(genre.id) === Number(genreId))
);
} else {
// فیلتر با انتخاب ناشر خاص
filteredBooks = allBooks.filter(book => 
    book.genres && book.genres.some(genre => Number(genre.id) === Number(genreId)) &&
    book.publisher && book.publisher.id == selectedPublisher
);
}
currentPage = 1; // صفحه به اول برگشت
sortBooks(); // بعد از فیلتر مرتب‌سازی هم انجام می‌شود
}

function sortBooks() {
const sortBy = sortSelect.value;
if (sortBy === "cheap") {
filteredBooks.sort((a, b) => a.price - b.price);
} else if (sortBy === "expensive") {
filteredBooks.sort((a, b) => b.price - a.price);
} else if (sortBy === "newest") {
filteredBooks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
renderBooks();
}

    
    function updatePagination() {
        const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
        pageInfo.textContent = `صفحه ${currentPage} از ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }
    
    function changePage(step) {
        currentPage += step;
        renderBooks();
    }
    
    sortSelect.addEventListener("change", sortBooks);
    publisherSelect.addEventListener("change", filterBooks);
    prevPageBtn.addEventListener("click", () => changePage(-1));
    nextPageBtn.addEventListener("click", () => changePage(1));
    
    await fetchPublishers();
    await fetchBooks();
});






// اجرای تابع اصلی
loadGenreData();
