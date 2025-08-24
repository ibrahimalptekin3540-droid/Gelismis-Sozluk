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

    // Bu alanı kendi API anahtarınızla değiştirin!
    const apiKey = "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";
    const promptText = `
        Aşağıdaki İngilizce kelime için bir sözlük girişi oluştur.
        Kelimenin türünü (verb, noun, adjective) belirt.
        Kelimeyle ilgili üç farklı kavramı ve bu kavramların Türkçe karşılıklarını yaz.
        Her kavram için kelimeyi içeren İngilizce bir örnek cümle ve bu cümlenin Türkçe çevirisini oluştur.
        Bu bilgileri aşağıdaki JSON formatında sun:
        {
          "word": "kelime",
          "partOfSpeech": "fiil",
          "relatedConcepts": [
            {
              "concept": "Kavram",
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

        const data = await response.json();

        if (response.status !== 200) {
            resultContainer.innerHTML = `<p>Hata: ${data.error.message}</p>`;
            return;
        }

        const parsedData = JSON.parse(data.choices[0].message.content);
        let outputHTML = `
            <div class="word-info">
                <h2>${parsedData.word.charAt(0).toUpperCase() + parsedData.word.slice(1)} (${getTurkishPartOfSpeech(parsedData.partOfSpeech)})</h2>
                <p><strong>Kelime Tipi:</strong> ${parsedData.partOfSpeech} - ${getTurkishPartOfSpeech(parsedData.partOfSpeech)}</p>
                <p><strong>İlişkili Kavramlar:</strong></p>
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
        resultContainer.innerHTML = '<p>Bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>';
        console.error('Hata:', error);
    }
}

function getTurkishPartOfSpeech(partOfSpeech) {
    switch (partOfSpeech.toLowerCase()) {
        case 'noun': return 'İsim';
        case 'verb': return 'Fiil';
        case 'adjective': return 'Sıfat';
        case 'adverb': return 'Zarf';
        case 'preposition': return 'Edat';
        case 'conjunction': return 'Bağlaç';
        case 'pronoun': return 'Zamir';
        default: return partOfSpeech;
    }
}
