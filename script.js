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
