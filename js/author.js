async function loadAuthorData() {
    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('id');

    if (!authorId || isNaN(authorId)) {
        document.body.innerHTML = "<h2>شناسه نویسنده معتبر نیست!</h2>";
        return;
    }

    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("لطفاً وارد شوید.");
            window.location.href = "login.html";
            return;
        }

        // دریافت اطلاعات نویسنده
        const response = await fetch(`http://127.0.0.1:8000/authors/${encodeURIComponent(authorId)}/`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`خطا در دریافت اطلاعات: ${response.status}`);
        }

        const result = await response.json();
        const author = result.data;

        document.getElementById('author-name').textContent = `${author.first_name} ${author.last_name}`;
        document.getElementById('author-bio').textContent = author.biography || "بیوگرافی موجود نیست.";
        document.getElementById('author-birth-date').textContent = author.birth_date || "نامشخص";
        document.getElementById('author-birth-place').textContent = author.birth_place || "نامشخص";
        document.getElementById('author-genres').textContent = author.genres.length > 0 ? author.genres.map(genre => genre.name).join(', ') : "مشخص نشده";
        document.getElementById('author-awards').textContent = author.awards || "ندارد";

        const profileImage = document.getElementById('author-image');
        if (author.profile_picture) {
            profileImage.src = author.profile_picture;
            profileImage.style.display = 'block';
        }

        await loadPublishers(token);
        await loadBooksForAuthor(authorId, token);

    } catch (error) {
        console.error("خطا در دریافت اطلاعات نویسنده:", error);
        document.body.innerHTML = `<h2>خطا در دریافت اطلاعات: ${error.message}</h2>`;
    }
}

async function loadPublishers(token) {
    try {
        const response = await fetch("http://127.0.0.1:8000/publishers/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`خطا در دریافت لیست انتشارات: ${response.status}`);
        }

        const publishers = await response.json();
        const publisherSelect = document.getElementById('publisher');
        publishers.forEach(publisher => {
            const option = document.createElement('option');
            option.value = publisher.id;
            option.textContent = publisher.name;
            publisherSelect.appendChild(option);
        });
    } catch (error) {
        console.error("خطا در دریافت لیست انتشارات:", error);
    }
}

async function loadBooksForAuthor(authorId, token) {
    try {
        const booksResponse = await fetch("http://127.0.0.1:8000/books/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!booksResponse.ok) {
            throw new Error(`خطا در دریافت لیست کتاب‌ها: ${booksResponse.status}`);
        }

        const books = await booksResponse.json();
        if (!Array.isArray(books)) {
            throw new Error("داده‌های دریافت‌شده معتبر نیستند.");
        }

        displayBooks(books, authorId);
    } catch (error) {
        console.error("خطا در دریافت کتاب‌ها:", error);
        document.body.innerHTML += `<p class="error-message">${error.message}</p>`;
    }
}

function displayBooks(books, authorId) {
    const container = document.querySelector('.books-container');
    container.innerHTML = "";

    const publisherFilter = document.getElementById('publisher').value;
    const sortType = document.getElementById('sort').value;

    let filteredBooks = books.filter(book => book.authors.some(author => Number(author.id) === Number(authorId)));
    if (publisherFilter !== "none" && publisherFilter !== "all") {
        filteredBooks = filteredBooks.filter(book => book.publisher.id == publisherFilter);
    }

    if (sortType === "cheap") {
        filteredBooks.sort((a, b) => a.price - b.price);
    } else if (sortType === "expensive") {
        filteredBooks.sort((a, b) => b.price - a.price);
    }

    if (filteredBooks.length === 0) {
        container.innerHTML = "<p>هیچ کتابی یافت نشد.</p>";
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
}

document.getElementById('sort').addEventListener('change', () => loadBooksForAuthor(new URLSearchParams(window.location.search).get('id'), localStorage.getItem("access_token")));
document.getElementById('publisher').addEventListener('change', () => loadBooksForAuthor(new URLSearchParams(window.location.search).get('id'), localStorage.getItem("access_token")));

loadAuthorData();
