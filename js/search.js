
document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.trim(); // حذف فاصله‌های اضافی
    if (query) {
        searchBooks(query);
    } else {
        alert("لطفاً نام کتاب را وارد کنید.");
    }
});

function searchBooks(query) {
    const url = `http://127.0.0.1:8000/books/`; // آدرس API که تمام کتاب‌ها را برمی‌گرداند

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('خطا در دریافت اطلاعات از سرور.');
            }
            return response.json();
        })
        .then(data => {
            displayResults(data, query);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('searchShow').textContent = 'خطا در دریافت اطلاعات.';
        });
}

function displayResults(data, query) {
    const searchShow = document.getElementById('searchShow');
    searchShow.innerHTML = ''; // پاک کردن نتایج قبلی

    // فیلتر کردن کتاب‌ها بر اساس نام دقیق
    const foundBook = data.find(book => book.title.toLowerCase() === query.toLowerCase());

    if (foundBook) {
        // ایجاد کارت برای نمایش اطلاعات کتاب
        const card = document.createElement('div');
        card.className = 'book-card';

        // نمایش عکس کتاب
        const image = document.createElement('img');
        image.src = foundBook.cover_image; // فرض می‌کنیم API فیلد `image` را برمی‌گرداند
        image.alt = foundBook.title;
        image.className = 'book-image';
        card.appendChild(image);

        // نمایش نام کتاب
        const title = document.createElement('h2');
        title.textContent = foundBook.title;
        card.appendChild(title);

        // نمایش نام نویسنده(ها)
        const author = document.createElement('p');
        if (Array.isArray(foundBook.authors)) {
            const authorsList = foundBook.authors.map(author => `${author.first_name} ${author.last_name}`).join('، ');
            author.textContent = `نویسنده(ها): ${authorsList}`;
        } else {
            author.textContent = `نویسنده: ${foundBook.authors}`;
        }
        card.appendChild(author);

        // اضافه کردن کارت به بخش نمایش نتایج
        searchShow.appendChild(card);
    } else {
        searchShow.textContent = 'کتابی با این نام یافت نشد.';
    }
}
