require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) 3000;

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));

app.use(express.static(path.join(__dirname, "public")));

// ربط قاعدة البيانات اختياري عند تشغيل الموقع للتجربة.
let supabase = null;

if (
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
) {
    const { createClient } = require("@supabase/supabase-js");

    supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
}

// عروض تجريبية فقط؛ ليست شراكات حقيقية.
const offers = [{
        id: 1,
        title: "أدوات الذكاء الاصطناعي",
        category: "الذكاء الاصطناعي",
        description: "اكتشف أدوات تساعدك في الكتابة والإنتاجية.",
        commission: "يُحدد بعد قبولك في برنامج الشراكة",
        url: "#",
        cta: "قريبًا"
    },
    {
        id: 2,
        title: "أدوات إنشاء المواقع",
        category: "تطوير المواقع",
        description: "تعرّف على خدمات تصميم واستضافة المواقع.",
        commission: "يُحدد بعد قبولك في برنامج الشراكة",
        url: "#",
        cta: "قريبًا"
    },
    {
        id: 3,
        title: "أدوات التعليم عبر الإنترنت",
        category: "التعليم",
        description: "اكتشف منصات تساعدك على تعلم مهارات جديدة.",
        commission: "يُحدد بعد قبولك في برنامج الشراكة",
        url: "#",
        cta: "قريبًا"
    }
];

// اختبار حالة الخادم.
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "الخادم يعمل بنجاح",
        databaseConnected: Boolean(supabase)
    });
});

// عرض قائمة العروض.
app.get("/api/offers", (req, res) => {
    res.json(offers);
});

// استقبال طلبات الزوار.
app.post("/api/leads", async(req, res) => {
    try {
        const {
            name,
            email,
            interest,
            consent,
            source
        } = req.body {};

        if (
            typeof name !== "string"
            typeof email !== "string"
            typeof interest !== "string"
            consent !== true
        ) {
            return res.status(400).json({
                error: "يرجى ملء البيانات المطلوبة والموافقة على سياسة الخصوصية."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanInterest = interest.trim();

        if (
            cleanName.length < 2 cleanName.length > 100 cleanEmail.length > 200!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) cleanInterest.length < 2 cleanInterest.length > 1000
        ) {
            return res.status(400).json({
                error: "تحقق من الاسم والبريد الإلكتروني والاهتمام."
            });
        }

        if (!supabase) {
            return res.status(503).json({
                error: "قاعدة البيانات غير مربوطة. لم يتم حفظ الطلب."
            });
        }

        const record = {
            name: cleanName,
            email: cleanEmail,
            interest: cleanInterest,
            consent: true,
            source: typeof source === "string" ?
                source.slice(0, 100) :
                "website"
        };

        const { error } = await supabase
            .from("leads")
            .insert(record);

        if (error) {
            console.error("Database error:", error.message);

            return res.status(500).json({
                error: "تعذر حفظ الطلب. حاول مرة أخرى لاحقًا."
            });
        }

        return res.status(201).json({
            message: "تم استقبال طلبك بنجاح."
        });
    } catch (error) {
        console.error("Request error:", error.message);

        return res.status(500).json({
            error: "حدث خطأ غير متوقع في الخادم."
        });
    }
});

// معالجة الروابط غير الموجودة في API.
app.use("/api", (req, res) => {
    res.status(404).json({
        error: "المسار المطلوب غير موجود."
    });
});

// تشغيل الخادم.
app.listen(PORT, () => {
            console.log(الموقع يعمل على http: //localhost:${PORT});
            });