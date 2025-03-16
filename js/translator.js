document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const translatorId = urlParams.get("id");
    if (!translatorId) {
        document.body.innerHTML = "<h2>شناسه مترجم مشخص نشده است!</h2>";
        return;
    }

    const token = localStorage.getItem("access_token");

    const booksApiUrl = `http://127.0.0.1:8000/books/`;
    const translatorApiUrl = `http://127.0.0.1:8000/translators/translator/${translatorId}/`;
    const publishersApiUrl = `http://127.0.0.1:8000/publishers/`;  // API برای دریافت انتشارات
    let allBooks = [];
    let filteredBooks = [];
    let currentPage = 1;
    const booksPerPage = 6;

    const translatorNameElement = document.getElementById("translator-name");
    const translatorImageElement = document.getElementById("translator-image");
    const translatorBioElement = document.getElementById("translator-bio");
    const translatorNationalityElement = document.getElementById("translator-nationality");
    const translatorLanguagesElement = document.getElementById("translator-languages");
    const booksContainer = document.querySelector(".books-container");
    const sortSelect = document.getElementById("sort");
    const publisherSelect = document.getElementById("publisher");  // المنت select برای انتخاب انتشارات
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    // Fetch translator data (name, bio, languages, etc.)
    async function fetchTranslator() {
        try {
            const headers = {
                "Content-Type": "application/json"
            };

            // اگر توکن موجود باشد، به هدر اضافه می‌شود
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(translatorApiUrl, { headers });
            const translator = await response.json();
            const data = translator.data;
            translatorNameElement.textContent = `${data.first_name} ${data.last_name}`;
            translatorBioElement.textContent = data.biography || "توضیحات موجود نیست";
            translatorNationalityElement.textContent = data.nationality || "نامشخص";
            translatorLanguagesElement.textContent = data.languages && data.languages.length ? data.languages.map(lang => lang.name).join(", ") : "نامشخص";

            if (data.profile_picture) {
                translatorImageElement.src = data.profile_picture;
                translatorImageElement.style.display = "block";
            }
        } catch (error) {
            console.error("❌ خطا در دریافت اطلاعات مترجم:", error);
            translatorNameElement.textContent = "خطا در بارگذاری اطلاعات مترجم";
        }
    }

    // Fetch all books and filter them by translator
    async function fetchBooks() {
        try {
            const headers = {
                "Content-Type": "application/json"
            };

            // اگر توکن موجود باشد، به هدر اضافه می‌شود
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(booksApiUrl, { headers });
            allBooks = await response.json();
            filteredBooks = allBooks.filter(book =>
                book.translators && book.translators.some(translator => translator.id === Number(translatorId))
            );
            renderBooks();
        } catch (error) {
            console.error("❌ خطا در دریافت کتاب‌ها:", error);
        }
    }

    // Fetch publishers and populate the select dropdown
    async function fetchPublishers() {
        try {
            const headers = {
                "Content-Type": "application/json"
            };

            // اگر توکن موجود باشد، به هدر اضافه می‌شود
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(publishersApiUrl, { headers });
            const publishers = await response.json();
            populatePublisherSelect(publishers);
        } catch (error) {
            console.error("❌ خطا در دریافت انتشارات:", error);
        }
    }

    // Populate publisher select dropdown
    function populatePublisherSelect(publishers) {
        publisherSelect.innerHTML = '<option value="none">انتخاب انتشارات</option>'; // Reset select
        publisherSelect.innerHTML += '<option value="all">همه نشرها</option>'; // گزینه نمایش همه نشرها

        publishers.forEach(publisher => {
            publisherSelect.innerHTML += `<option value="${publisher.id}">${publisher.name}</option>`;
        });
    }

    // Filter books by publisher
    function filterBooksByPublisher() {
        const publisherId = publisherSelect.value;
        if (publisherId === "all") {
            filteredBooks = allBooks.filter(book =>
                book.translators && book.translators.some(translator => translator.id === Number(translatorId))
            );
        } else if (publisherId !== "none") {
            filteredBooks = allBooks.filter(book =>
                book.translators && book.translators.some(translator => translator.id === Number(translatorId)) &&
                book.publisher && book.publisher.id === Number(publisherId)
            );
        } else {
            filteredBooks = allBooks.filter(book =>
                book.translators && book.translators.some(translator => translator.id === Number(translatorId))
            );
        }
        renderBooks();
    }

    // Render books on the page
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

    // Sort books based on the selected option
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

    // Update pagination info and buttons
    function updatePagination() {
        const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
        pageInfo.textContent = `صفحه ${currentPage} از ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    // Change page by a step (+1 or -1)
    function changePage(step) {
        currentPage += step;
        renderBooks();
    }

    // Event Listeners
    sortSelect.addEventListener("change", sortBooks);
    publisherSelect.addEventListener("change", filterBooksByPublisher);
    prevPageBtn.addEventListener("click", () => changePage(-1));
    nextPageBtn.addEventListener("click", () => changePage(1));

    // Initialize page
    await fetchTranslator();
    await fetchBooks();
    await fetchPublishers();
});
