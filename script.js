function filter() {
    let val = document.getElementById('search').value.toLowerCase();
    document.querySelectorAll('.contact-card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(val) ? "" : "none";
    });
}

Papa.parse("data/kontakte.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
        const container = document.getElementById('directory');
        let lastDept = "";

        // Filtert Zeilen ohne Abteilung/Name
        const validData = results.data.filter(p => p.Abteilung && p.Name);

        // Sortierung nach Abteilung
        validData.sort((a, b) => {
            return (a.Abteilung || "").localeCompare(b.Abteilung || "");
        });

        validData.forEach(p => {
            // Header für neue Abteilungen erstellen
            if(p.Abteilung !== lastDept) {
                lastDept = p.Abteilung;
                let h = document.createElement('h2'); 
                h.className = "section-header"; 
                h.innerText = lastDept;
                container.appendChild(h);
            }

            let deptClass = p.Abteilung ? p.Abteilung.toLowerCase().replace(/\s/g, '') : 'unknown';
            let cls = "cat-" + deptClass;

            let div = document.createElement('div');
            div.className = `contact-card ${cls}`;
            
            // Hilfsfunktion: Gibt HTML nur zurück, wenn Daten vorhanden sind
            const renderField = (label, value) => {
                if (!value || value.trim() === "" || value === "-") return "";
                return `${label}: ${value}<br>`;
            };

            // Card Inhalt zusammenbauen
            div.innerHTML = `
                <h3>${p.Name}</h3>
                ${p.Position ? `<p class="job-position">${p.Position}</p>` : ''}
                <p>
                    ${renderField('Tel', p.Telefon)}
                    ${renderField('Mobil', p.Mobiltelefon)}
                    ${renderField('E-Mail', p.Email)}
                </p>
            `;
            
            container.appendChild(div);
        });
    }
});