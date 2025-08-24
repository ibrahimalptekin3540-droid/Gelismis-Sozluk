// ... (kodun geri kalan kısmı)

async function getWordData() {
    // ... (kelime alma ve hata kontrolü kısmı)

    // API anahtarını buraya olduğu gibi yapıştırın.
    const apiKey = "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";

    const promptText = `
        Aşağıdaki İngilizce kelime için bir sözlük girişi oluştur.
        // ... (prompt'ın geri kalan kısmı)
    `;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: promptText }],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();

        if (response.status !== 200) {
            // ... (hata mesajı kısmı)
        }

        // ... (sonuçları işleme kısmı)
    } catch (error) {
        // ... (hata yakalama kısmı)
    }
}
