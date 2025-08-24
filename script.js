document.getElementById('search-btn').addEventListener('click', getWordData);
document.getElementById('word-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        getWordData();
    }
});

async function getWordData() {
    const word = document.getElementById('word-input').value.toLowerCase().trim();
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = ''; // Önceki sonuçları temizle

    if (!word) {
        resultContainer.innerHTML = '<p>Lütfen bir kelime girin.</p>';
        return;
    }
    
    // YENİ ve GÜNCEL API anahtarınız buraya eklendi.
    const apiKey = "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"; 
    
    // OpenAI API'sine gönderilecek talimatlar
    const promptText = `
        Aşağıdaki İngilizce kelime için bir sözlük girişi oluştur.
        1. Kelimenin İngilizce ve Türkçe kelime türünü (fiil, isim vb.) bul.
        2. Kelimeyle ilişkili üç farklı kavramı bul ve Türkçe karşılıklarını yaz.
        3. Her kavram için kelimeyi içeren İngilizce bir örnek cümle ve bu cümlenin Türkçe çevirisini oluştur.
        
        Tüm bilgileri aşağıdaki JSON formatında sun:
        {
          "word": "kelime",
          "partOfSpeech": "İngilizce Kelime Türü",
          "turkishPartOfSpeech": "Türkçe Kelime Türü",
          "relatedConcepts": [
            {
              "concept": "İngilizce Kavram",
              "turkishConcept": "Türkçe Kavram",
              "englishExample": "İngilizce örnek cümle.",
              "turkishExample": "Türkçe çeviri."
            }
          ]
        }
        Kelime: ${word}
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP Hata! Durum: ${response.status} - ${errorData.error.message}`);
        }
        
        const data = await response.json();
        
        const parsedData = JSON.parse(data.choices[0].message.content);
        
        let outputHTML = `
            <div class="word-info">
                <h2>${parsedData.word.charAt(0).toUpperCase() + parsedData.word.slice(1)} (${parsedData.partOfSpeech} - ${parsedData.turkishPartOfSpeech})</h2>
            </div>
            <div class="related-concepts">
                <h3>İlişkili Kavramlar:</h3>
            </div>
        `;
        
        parsedData.relatedConcepts.forEach(concept => {
            outputHTML += `
                <div class="example-sentence">
                    <p><strong>Kavram:</strong> ${concept.concept} (${concept.turkishConcept})</p>
                    <p><strong>İngilizce:</strong> ${concept.englishExample}</p>
                    <p><strong>Türkçe:</strong> ${concept.turkishExample}</p>
                </div>
            `;
        });

        resultContainer.innerHTML = outputHTML;

    } catch (error) {
        resultContainer.innerHTML = `<p>Bir hata oluştu: ${error.message}</p>`;
        console.error('Hata:', error);
    }
}
