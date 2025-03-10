document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const publisherId = urlParams.get("id");
    if (!publisherId) {
        document.body.innerHTML = "<h2>شناسه انتشارات مشخص نشده است!</h2>";
        return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
        alert("لطفاً وارد شوید.");
        window.location.href = "login.html";
        return;
    }

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

    // Fetch publisher data (name and image)
    async function fetchPublisher() {
        try {
            const response = await fetch(publisherApiUrl, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const publisher = await response.json();
            publisherNameElement.textContent = publisher.name;
            publisherImageElement.src = publisher.logo || "default-publisher.jpg"; // Use a default image if none is available
        } catch (error) {
            console.error("❌ خطا در دریافت اطلاعات انتشارات:", error);
            publisherNameElement.textContent = "خطا در بارگذاری اطلاعات انتشارات";
        }
    }

    // Fetch all books and filter them by publisher
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
                book.publisher && book.publisher.id === Number(publisherId)
            );
            renderBooks();
        } catch (error) {
            console.error("❌ خطا در دریافت کتاب‌ها:", error);
        }
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
    prevPageBtn.addEventListener("click", () => changePage(-1));
    nextPageBtn.addEventListener("click", () => changePage(1));

    // Initialize page
    await fetchPublisher();
    await fetchBooks();
});
