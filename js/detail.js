  // گرفتن آیدی کتاب از URL
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  if (!bookId) {
    document.getElementById('book-detail-section').innerHTML = '<p class="error-text">آیدی کتاب پیدا نشد.</p>';
  }

  // دریافت توکن از localStorage (اگر موجود باشد)
  const accessToken = localStorage.getItem('access_token');

  // تابع دریافت و نمایش جزئیات کتاب
  async function fetchBookDetail() {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // اگر توکن وجود داشته باشد، آن را به هدر اضافه کن
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`http://localhost:8000/books/detail/${bookId}/`, {
        method: 'GET',
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        const bookDetailContainer = document.getElementById('book-detail-section');

        // قرار دادن اطلاعات کتاب در صفحه
        bookDetailContainer.innerHTML = `
          <div class="book-detail-flex">
            <!-- بخش تصویر کتاب -->
            <div class="book-image-container">
              <img src="http://localhost:8000${data.data.cover_image || '/images/default-book-cover.jpg'}" 
                   alt="${data.data.title}" 
                   class="book-image">
            </div>
            <!-- بخش اطلاعات کتاب -->
            <div id="content-top" class="book-info-container">
              <h1 class="book-title">${data.data.title}</h1>
              <p class="book-info">

    <strong>نویسنده:</strong> 
    ${data.data.authors.map(author => 
        `<a href="authors.html?id=${author.id}">
            ${author.first_name} ${author.last_name}
        </a>`
    ).join(', ') || 'نامشخص'}


  <p class="book-info">
    <strong>مترجم:</strong> 
    ${data.data.translators.length > 0 
      ? data.data.translators.map(translator => 
          `<a href="translator.html?id=${translator.id || ''}">
            ${translator.first_name} ${translator.last_name}
          </a>`
        ).join(', ') 
      : 'ندارد'}
  </p>

  <p class="book-info">
    <strong>ناشر:</strong> 
    <a href="publisher.html?id=${data.data.publisher.id || ''}">
      ${data.data.publisher.name || 'نامشخص'}
    </a>
  </p>


              <p class="book-info">
                <strong>تعداد صفحات:</strong> ${data.data.page_count || 'نامشخص'}
              </p>
              <p class="book-price">
                <strong>قیمت:</strong> ${data.data.price} تومان
              </p>
              <p class="book-rating">
                <strong>امتیاز:</strong> ${data.data.rating} از ۵
              </p>
              
              <button id="buybutton" onclick="handleBuyClick('${data.data.id}')" class="buy-button">
                افزودن به سبد خرید
              </button>
            </div>
          </div>
          <!-- خلاصه کتاب -->
          <div id="description" class="book-description">
            <h2 class="description-title">خلاصه کتاب و توضیحات</h2>
            <p class="description-text">${data.data.summary || 'خلاصه‌ای برای این کتاب موجود نیست.'}</p>
          </div>
          <a href="index.html" class="back-link">بازگشت به لیست کتاب‌ها</a>
        `;
      } else {
        const errorData = await response.json();
        document.getElementById('book-detail-section').innerHTML = `<p class="error-text">خطا: ${errorData.message}</p>`;
      }
    } catch (error) {
      document.getElementById('book-detail-section').innerHTML = '<p class="error-text">خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.</p>';
    }
  }

  // فراخوانی تابع برای دریافت جزئیات کتاب
  fetchBookDetail();

function handleBuyClick(bookId) {
fetch(`http://localhost:8000/books/detail/${bookId}/`) // بدون فاصله اضافی!
      .then(response => {
          if (!response.ok) {
              throw new Error("مشکل در دریافت اطلاعات کتاب");
          }
          return response.json();
      })
      .then(apiResponse => {
          const data = apiResponse.data || apiResponse; // اگر داده‌ها داخل `data` بودن، درست دریافت کن

          if (!data.id || !data.title) {
              throw new Error("اطلاعات کتاب ناقص است!");
          }

          let cart = JSON.parse(localStorage.getItem("cart")) || [];

          let existingItem = cart.find(item => item.id === data.id);
          if (existingItem) {
              existingItem.quantity += 1;
          } else {
              cart.push({
                  id: data.id,
                  title: data.title || "عنوان نامشخص",
                  price: data.price ? Number(data.price) : 0,
                  quantity: 1,
                  cover_image: data.cover_image 
                      ? `http://localhost:8000${data.cover_image}` 
                      : "http://localhost:8000/images/default-book-cover.jpg"
              });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          showFullscreenToast(`✅ "${data.title}" به سبد خرید اضافه شد!`);

      })
      .catch(error => {
        console.error("❌ خطا در دریافت اطلاعات کتاب:", error);
        showFullscreenToast("مشکلی در افزودن کتاب به سبد خرید پیش آمد.", "error");

      });
}


    // تابع نمایش پیام تمام‌صفحه
    function showFullscreenToast(message, type = "success") {
        const toast = document.getElementById("fullscreen-toast");

        // تنظیم متن و رنگ پیام
        toast.textContent = message;
        toast.className = type === "success" ? "show-toast" : "show-toast error";

        // بعد از 3 ثانیه پیام محو شود
        setTimeout(() => {
            toast.classList.add("hide-toast");

            // بعد از محو شدن کامل، visibility را هم تغییر دهیم
            setTimeout(() => {
                toast.classList.remove("show-toast", "hide-toast", "error");
                toast.style.visibility = "hidden";
            }, 500); // این مدت‌زمان باید برابر با `transition: opacity 0.5s` باشد
        }, 1500);
    }
