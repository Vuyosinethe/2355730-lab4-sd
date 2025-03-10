document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("button").addEventListener("click", fetchCountryInfo);
});

async function fetchCountryInfo() {
    const countryName = document.getElementById("country-name").value.trim();
    if (!countryName) {
        alert("Please enter a country name.");
        return;
    }
    
    const countryInfoArticle = document.getElementById("details");
    const bordersList = document.getElementById("borders");
    countryInfoArticle.innerHTML = "Loading...";
    bordersList.innerHTML = "";
    
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) throw new Error("Country not found.");
        
        const data = await response.json();
        const country = data[0];
        
        countryInfoArticle.innerHTML = `
            <h3>${country.name.common}</h3>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.png}" alt="Flag of ${country.name.common}" width="150">
        `;

        if (country.borders) {
            const borderCountries = await fetch(`https://restcountries.com/v3.1/alpha?codes=${country.borders.join(",")}`);
            const borderData = await borderCountries.json();
            
            borderData.forEach(border => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <p><strong>${border.name.common}:</strong></p>
                    <img src="${border.flags.png}" alt="Flag of ${border.name.common}" width="100">
                `;
                bordersList.appendChild(listItem);
            });
        } else {
            bordersList.innerHTML = "<p>No bordering countries.</p>";
        }
    } catch (error) {
        countryInfoArticle.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
}
