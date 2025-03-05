async function loadPublisherData() {
    const urlParams = new URLSearchParams(window.location.search);
    const publisherId = urlParams.get('id');

    if (!publisherId) {
        document.body.innerHTML = "<h2>شناسه انتشارات مشخص نشده است!</h2>";
        return;
    }

    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("لطفاً وارد شوید.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(`http://127.0.0.1:8000/publishers/${publisherId}/`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`خطا در دریافت اطلاعات (کد: ${response.status})`);
        }

        const publisher = await response.json();

        document.getElementById('publisher-name').textContent = publisher.name || "نام مشخص نیست";


        const profileImage = document.getElementById('publisher-image');
        if (publisher.logo) {
            profileImage.src = publisher.logo;
            profileImage.style.display = 'block';
        }
    } catch (error) {
        console.error("خطا در دریافت اطلاعات انتشارات:", error);
        document.getElementById('publisher-name').textContent = "خطا در دریافت اطلاعات";
        document.body.innerHTML += `<p class="error-message">${error.message}</p>`;
    }
}

loadPublisherData();