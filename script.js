const apiKey = "YOUR_API_KEY";

async function getAQI() {
    const city = document.getElementById("city").value;

    // Step 1: Get coordinates
    const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    );
    const geoData = await geoRes.json();

    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    // Step 2: Get AQI
    const aqiRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const aqiData = await aqiRes.json();

    const aqi = aqiData.list[0].main.aqi;

    showResult(aqi);
    drawChart(aqiData.list[0].components);
}

function showResult(aqi) {
    let status = "";
    let className = "";

    if (aqi === 1) { status = "Good"; className = "good"; }
    else if (aqi === 2) { status = "Moderate"; className = "moderate"; }
    else { status = "Poor"; className = "poor"; }

    document.getElementById("result").innerHTML =
        `<h2 class="${className}">AQI: ${aqi} (${status})</h2>`;
}

function drawChart(data) {
    const ctx = document.getElementById("chart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["CO", "NO2", "O3", "PM2.5"],
            datasets: [{
                label: "Pollution Level",
                data: [data.co, data.no2, data.o3, data.pm2_5]
            }]
        }
    });
}