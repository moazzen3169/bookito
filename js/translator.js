async function loadTranslatorData() {
    const urlParams = new URLSearchParams(window.location.search);
    const translatorId = urlParams.get('id');

    if (!translatorId) {
        document.body.innerHTML = "<h2>شناسه مترجم مشخص نشده است!</h2>";
        return;
    }

    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("لطفاً وارد شوید.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(`http://127.0.0.1:8000/translators/translator/${translatorId}/`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`خطا در دریافت اطلاعات (کد: ${response.status})`);
        }

        const translator = await response.json(); 
        const data = translator.data; // اطلاعات اصلی مترجم در اینجا قرار دارد

        // نمایش اطلاعات در صفحه
        document.getElementById('translator-name').textContent = `${data.first_name} ${data.last_name}` || "نام مشخص نیست";
        document.getElementById('translator-bio').textContent = data.biography || "توضیحات موجود نیست.";
        document.getElementById('translator-nationality').textContent = data.nationality || "نامشخص";
        document.getElementById('translator-birth-date').textContent = data.birth_date || "نامشخص";

        // نمایش زبان‌ها
        if (data.languages && data.languages.length > 0) {
            document.getElementById('translator-languages').textContent = 
                data.languages.map(lang => lang.name).join(', ');
        } else {
            document.getElementById('translator-languages').textContent = "نامشخص";
        }

        // تنظیم تصویر مترجم
        const profileImage = document.getElementById('translator-image');
        if (data.profile_picture) {
            profileImage.src = data.profile_picture;
            profileImage.style.display = 'block';
        }

    } catch (error) {
        console.error("خطا در دریافت اطلاعات مترجم:", error);
        document.getElementById('translator-name').textContent = "خطا در دریافت اطلاعات";
        document.body.innerHTML += `<p style="color: red;">${error.message}</p>`;
    }
}

loadTranslatorData();