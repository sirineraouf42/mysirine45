const grid = document.getElementById("offerGrid");
const form = document.getElementById("leadForm");
const statusEl = document.getElementById("formStatus");

document.getElementById("year").textContent =
    new Date().getFullYear();

async function loadOffers() {
    try {
        const response = await fetch("/api/offers");

        if (!response.ok) return;

        const data = await response.json();

        if (!Array.isArray(data.offers)) return;

        grid.innerHTML = data.offers.map((offer, i) =>
            <
            article class = "offer-card" >
            <
            div class = "offer-icon" > $ {
                ["⌘", "◇", "▶"][i % 3] } < /div> <
            span class = "tag" > $ { escapeHtml(offer.category || "عرض") } < /span> <
            h3 > $ { escapeHtml(offer.title) } < /h3> <
            p > $ { escapeHtml(offer.description) } < /p> <
            a href = "${safeHref(offer.url)}"
            $ {
                offer.url && offer.url !== "#contact" ?
                    'target="_blank" rel="sponsored nofollow noopener"' :
                    ""
            } >
            $ {
                offer.url && offer.url !== "#contact" ?
                    "عرض التفاصيل" :
                    "اطلب معلومات"
            } <
            span > ← < /span> <
            /a> <
            /article>
        ).join("");

    } catch (error) {
        // تبقى البطاقات التجريبية ظاهرة إذا تعذر الاتصال بالخادم.
    }
}

function escapeHtml(value) {
    return String(value ? ? "").replace(/[&<>"']/g, ch => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[ch]));
}

function safeHref(value) {
    const href = String(value "#contact");

    if (href.startsWith("#")) return href;

    try {
        const parsed = new URL(href);

        return ["https:", "http:"].includes(parsed.protocol) ?
            escapeHtml(parsed.href) :
            "#contact";

    } catch {
        return "#contact";
    }
}

form.addEventListener("submit", async(event) => {
    event.preventDefault();

    statusEl.textContent = "جارٍ إرسال الطلب...";

    const formData = new FormData(form);

    const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        interest: formData.get("interest"),
        consent: formData.get("consent") === "on",
        source: new URLSearchParams(location.search).get("utm_source")
        "website"
    };

    try {
        const response = await fetch("/api/leads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error "تعذر إرسال الطلب.");
        }

        statusEl.textContent = result.message;
        form.reset();

    } catch (error) {
        statusEl.textContent =
            error.message "تعذر الاتصال بالخادم. حاول لاحقًا.";
    }
});

loadOffers();