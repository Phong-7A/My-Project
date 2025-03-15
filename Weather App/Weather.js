
const cityInput = document.getElementById('city');
const getWeatherBtn = document.getElementById('get-weather');
const weatherDisplay = document.getElementById('weather-display');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const weatherIcon = document.querySelector('.weather-icon i');
const weatherEffects = document.getElementById('weather-effects');
const errorMessage = document.getElementById('error-message');

const apiKey = '9eaedaede08578e80f574912ac611ddc';

function getWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name!');
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            errorMessage.classList.remove('show');

            cityName.textContent = data.name;
            temperature.textContent = `${Math.round(data.main.temp)}°C`;
            condition.textContent = data.weather[0].main;

            const weatherMain = data.weather[0].main.toLowerCase();
            updateWeatherIcon(weatherMain);
            updateWeatherEffects(weatherMain);
        })
        .catch(error => {
            showError('City not found! Please check the city name.');
            clearWeatherDisplay();
        });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function clearWeatherDisplay() {
    cityName.textContent = '';
    temperature.textContent = '';
    condition.textContent = '';
    weatherIcon.className = 'bx';
    weatherEffects.innerHTML = '';
}

function updateWeatherIcon(weatherMain) {
    weatherIcon.className = 'bx';
    if (weatherMain.includes('clear')) {
        weatherIcon.classList.add('bx-sun');
    } else if (weatherMain.includes('cloud')) {
        weatherIcon.classList.add('bx-cloud');
    } else if (weatherMain.includes('rain')) {
        weatherIcon.classList.add('bx-cloud-rain');
    } else if (weatherMain.includes('snow')) {
        weatherIcon.classList.add('bx-snowflake');
    } else {
        weatherIcon.classList.add('bx-question-mark');
    }
}

function updateWeatherEffects(weatherMain) {
    weatherEffects.innerHTML = '';
    switch (weatherMain) {
        case 'rain':
            for (let i = 0; i < 50; i++) {
                const rainDrop = document.createElement('div');
                rainDrop.className = 'rain';
                rainDrop.style.left = `${Math.random() * 100}%`;
                rainDrop.style.animationDelay = `${Math.random() * 0.8}s`;
                weatherEffects.appendChild(rainDrop);
            }
            break;
        case 'snow':
            for (let i = 0; i < 40; i++) {
                const snowFlake = document.createElement('div');
                snowFlake.className = 'snow';
                snowFlake.style.left = `${Math.random() * 100}%`;
                snowFlake.style.animationDelay = `${Math.random() * 2}s`;
                weatherEffects.appendChild(snowFlake);
            }
            break;
        case 'clouds':
            for (let i = 0; i < 5; i++) {
                const cloud = document.createElement('div');
                cloud.className = 'cloud';
                cloud.style.left = `${Math.random() * 80}%`;
                cloud.style.top = `${Math.random() * 50}%`;
                cloud.style.animationDelay = `${Math.random() * 4}s`;
                weatherEffects.appendChild(cloud);
            }
            break;
        default:
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 2}s`;
                weatherEffects.appendChild(particle);
            }
            break;
    }
}

getWeatherBtn.addEventListener('click', getWeather);

cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});