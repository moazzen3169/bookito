
    document.addEventListener("DOMContentLoaded", async function () {
        const urlParams = new URLSearchParams(window.location.search);
        const publisherId = urlParams.get("id");
        if (!publisherId) {
            document.body.innerHTML = "<h2>شناسه انتشارات مشخص نشده است!</h2>";
            return;
        }

        // آدرس‌های API بدون نیاز به توکن
        const booksApiUrl = `http://127.0.0.1:8000/books/`;
        const publisherApiUrl = `http://127.0.0.1:8000/publishers/${publisherId}/`;
        let allBooks = [];
        let filteredBooks = [];
        let currentPage = 1;
        const booksPerPage = 6;

        const publisherNameElement = document.getElementById("publisher-name");
        const publisherImageElement = document.getElementById("publisher-image");
        const booksContainer = document.querySelector(".books-container");
        const sortSelect = document.getElementById("sort");
        const prevPageBtn = document.getElementById("prevPage");
        const nextPageBtn = document.getElementById("nextPage");
        const pageInfo = document.getElementById("pageInfo");

        // دریافت اطلاعات انتشارات (نام و تصویر)
        async function fetchPublisher() {
            try {
                const response = await fetch(publisherApiUrl, {
                    // در اینجا توکن حذف شده است و فرض بر این است که API دسترسی عمومی دارد.
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const publisher = await response.json();
                publisherNameElement.textContent = publisher.name;
                publisherImageElement.src = publisher.logo || "default-publisher.jpg"; // اگر تصویر موجود نبود، از تصویر پیش‌فرض استفاده شود
            } catch (error) {
                console.error("❌ خطا در دریافت اطلاعات انتشارات:", error);
                publisherNameElement.textContent = "خطا در بارگذاری اطلاعات انتشارات";
            }
        }

        // دریافت کتاب‌ها و فیلتر کردن آن‌ها بر اساس انتشارات
        async function fetchBooks() {
            try {
                const response = await fetch(booksApiUrl, {
                    // توکن حذف شده است تا درخواست‌ها بدون نیاز به احراز هویت انجام شوند
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                allBooks = await response.json();
                filteredBooks = allBooks.filter(book =>
                    book.publisher && book.publisher.id === Number(publisherId)
                );
                renderBooks();
            } catch (error) {
                console.error("❌ خطا در دریافت کتاب‌ها:", error);
            }
        }

        // نمایش کتاب‌ها در صفحه
        function renderBooks() {
            booksContainer.innerHTML = "";
            const startIndex = (currentPage - 1) * booksPerPage;
            const endIndex = startIndex + booksPerPage;
            const booksToShow = filteredBooks.slice(startIndex, endIndex);

            booksToShow.forEach(book => {
                const bookCard = `
                <div class="product-card">
                    <img src="${book.cover_image || 'default-book.jpg'}" alt="${book.title}" class="product-image">
                    <div class="product-info">
                        <p>${book.title}</p>
                        <span id="discount">${book.discount ? book.discount + " %" : "بوکیتو"}</span>
                        <p>قیمت: ${book.price} تومان</p>
                        <a href="detail.html?id=${book.id}" class="view-details">مشاهده جزئیات</a>
                    </div>
                </div>
            `;
            
                booksContainer.innerHTML += bookCard;
            });

            updatePagination();
        }

        // مرتب‌سازی کتاب‌ها بر اساس انتخاب کاربر
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

        // به‌روزرسانی اطلاعات صفحه‌بندی
        function updatePagination() {
            const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
            pageInfo.textContent = `صفحه ${currentPage} از ${totalPages}`;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        }

        // تغییر صفحه با یک گام (+1 یا -1)
        function changePage(step) {
            currentPage += step;
            renderBooks();
        }

        // Event Listeners
        sortSelect.addEventListener("change", sortBooks);
        prevPageBtn.addEventListener("click", () => changePage(-1));
        nextPageBtn.addEventListener("click", () => changePage(1));

        // بارگذاری صفحه
        await fetchPublisher();
        await fetchBooks();
    });
