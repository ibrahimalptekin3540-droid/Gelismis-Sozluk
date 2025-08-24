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
    const replitUrl = "https://b57a5440-94d8-4594-88af-046107c1c643-00-2631g0p2m7vcu.sisko.replit.dev/api/lookup"; 
    
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
        
        const parsedData = JSON.parse(data.choices[0].message.content);
        
        // Yeni HTML içeriği oluşturma
        let outputHTML = `
            <div class="word-info">
                <h2>${parsedData.word.charAt(0).toUpperCase() + parsedData.word.slice(1)}</h2>
                <p><strong>Kelime Türü:</strong> ${parsedData.partOfSpeech} - ${parsedData.turkishPartOfSpeech}</p>
                <p><strong>Türkçe Karşılıkları:</strong> ${parsedData.turkishMeanings.join(', ')}</p>
            </div>
        `;

        if (parsedData.synonyms && parsedData.synonyms.length > 0) {
            outputHTML += `
                <div class="synonyms-section">
                    <h3>Eş Anlamlılar</h3>
                </div>
            `;
            
            parsedData.synonyms.forEach(synonym => {
                outputHTML += `
                    <div class="synonym-card">
                        <h4>${synonym.synonym} (${synonym.turkishMeanings.join(', ')})</h4>
                        <p><strong>İngilizce Örnek:</strong> ${synonym.englishExample}</p>
                        <p><strong>Türkçe Çeviri:</strong> ${synonym.turkishExample}</p>
                    </div>
                `;
            });
        }

        resultContainer.innerHTML = outputHTML;

    } catch (error) {
        resultContainer.innerHTML = `<p>Bir hata oluştu: ${error.message}</p>`;
        console.error('Hata:', error);
    }
}
