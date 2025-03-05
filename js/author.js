async function loadAuthorData() {
    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('id');

    if (!authorId) {
        document.body.innerHTML = "<h2>شناسه نویسنده مشخص نشده است!</h2>";
        return;
    }

    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("لطفاً وارد شوید.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(`http://127.0.0.1:8000/authors/${authorId}/`, {
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
        document.getElementById('author-status').textContent = author.is_alive ? "زنده" : `درگذشته (${author.date_of_death || "تاریخ نامشخص"})`;
        document.getElementById('author-books').textContent = author.number_of_books || "0";
        document.getElementById('author-genres').textContent = author.genres.length > 0 ? author.genres.join(', ') : "مشخص نشده";
        document.getElementById('author-nationality').textContent = author.nationality || "مشخص نشده";
        document.getElementById('author-awards').textContent = author.awards || "ندارد";

        const websiteElement = document.getElementById('author-website');
        if (author.website) {
            websiteElement.href = author.website;
            websiteElement.textContent = author.website;
        } else {
            websiteElement.textContent = "ندارد";
            websiteElement.removeAttribute("href");
        }

        const profileImage = document.getElementById('author-image');
        if (author.profile_picture) {
            profileImage.src = author.profile_picture;
            profileImage.style.display = 'block';
        }

        // دریافت و نمایش کتاب‌های نویسنده
        await loadAuthorBooks(authorId, token);
    } catch (error) {
        console.error("خطا در دریافت اطلاعات نویسنده:", error);
        document.body.innerHTML = `<h2>خطا در دریافت اطلاعات: ${error.message}</h2>`;
    }
}



async function loadAuthorBooks(authorId, token) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/books/filter/?author_id=${authorId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            // چاپ کد وضعیت و متن پاسخ برای کمک به شناسایی دقیق‌تر مشکل
            const errorText = await response.text();
            throw new Error(`خطا در دریافت لیست کتاب‌ها: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("API Response: ", result);  // چاپ پاسخ API برای بررسی ساختار

        // بررسی اینکه آیا داده‌ها موجود هستند
        if (result && result.data && Array.isArray(result.data)) {
            let books = result.data;

            // فیلتر دقیق کتاب‌هایی که نویسنده آن‌ها با authorId یکسان است
            books = books.filter(book => book.author_id == authorId);
            
            const booksContainer = document.getElementById('author-books-list');
            booksContainer.innerHTML = '';

            if (books.length === 0) {
                booksContainer.innerHTML = "<p>کتابی یافت نشد.</p>";
                return;
            }

            books.forEach(book => {
                const bookElement = document.createElement('div');
                bookElement.classList.add('book-item');
                bookElement.innerHTML = `
                    <div class="book-details">
                        <h3>${book.title}</h3>
                        <p><strong>سال انتشار:</strong> ${book.publication_year || "نامشخص"}</p>
                        <p><strong>ژانر:</strong> ${book.genre || "نامشخص"}</p>
                        <p><strong>تعداد صفحات:</strong> ${book.pages || "نامشخص"}</p>
                    </div>
                `;
                booksContainer.appendChild(bookElement);
            });
        } else {
            console.error("داده‌ها به درستی بارگذاری نشده‌اند.");
            document.getElementById('author-books-list').innerHTML = "<p>خطا در دریافت کتاب‌ها</p>";
        }
    } catch (error) {
        console.error("خطا در دریافت کتاب‌های نویسنده:", error);
        document.getElementById('author-books-list').innerHTML = `<p>خطا در دریافت کتاب‌ها: ${error.message}</p>`;
    }
}

async function loadAuthorData() {
    const urlParams = new URLSearchParams(window.location.search);
    const authorId = urlParams.get('id');

    if (!authorId) {
        document.body.innerHTML = "<h2>شناسه نویسنده مشخص نشده است!</h2>";
        return;
    }

    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("لطفاً وارد شوید.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(`http://127.0.0.1:8000/authors/${authorId}/`, {
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
        document.getElementById('author-genres').textContent = author.genres.length > 0 ? author.genres.join(', ') : "مشخص نشده";
        document.getElementById('author-awards').textContent = author.awards || "ندارد";



        const profileImage = document.getElementById('author-image');
        if (author.profile_picture) {
            profileImage.src = author.profile_picture;
            profileImage.style.display = 'block';
        }

        // دریافت و نمایش کتاب‌های نویسنده
        await loadAuthorBooks(authorId, token);
    } catch (error) {
        console.error("خطا در دریافت اطلاعات نویسنده:", error);
        document.body.innerHTML = `<h2>خطا در دریافت اطلاعات: ${error.message}</h2>`;
    }
}

loadAuthorData();



loadAuthorData();