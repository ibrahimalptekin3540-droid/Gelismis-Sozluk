document.getElementById('search-btn').addEventListener('click', getWordData);
document.getElementById('word-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        getWordData();
    }
});

async function getWordData() {
    const word = document.getElementById('word-input').value.toLowerCase().trim();
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';

    if (!word) {
        resultContainer.innerHTML = '<p>Lütfen bir kelime girin.</p>';
        return;
    }
    
    // API isteği artık Replit sunucunuza gönderiliyor.
    // Replit'ten aldığınız URL'yi buraya yapıştırın ve sonuna /api/lookup ekleyin.
    const replitUrl = "https://replit.com/@ibrahimalptekin/sozluk-backend/api/lookup"; 
    
    try {
        const response = await fetch(replitUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word: word })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Sunucu Hatası: ${response.status} - ${errorData.error}`);
        }

        const data = await response.json();
        
        // Hata ayıklama için konsola gelen veriyi yazdır
        console.log("Replit'ten gelen ham veri:", data);
        
        // OpenAI'den gelen mesaj içeriğini parse edin
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
