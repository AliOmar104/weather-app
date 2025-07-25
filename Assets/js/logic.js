const API_KEY = 'cf008cfee3044f5fa4169c7354212a11';

const cities = [
  { name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { name: 'London', country: 'UK', timezone: 'Europe/London' },
  { name: 'Miami', country: 'USA', timezone: 'America/New_York' },
  { name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { name: 'Paris', country: 'France', timezone: 'Europe/Paris' }
];

let currentCityIndex = 0;

const toggle = document.getElementById('theme-toggle');
const body = document.body;

document.addEventListener("DOMContentLoaded", () => {
  updateWeatherForCurrentCity();
  setDateToday();
});

function updateWeatherForCurrentCity() {
  const city = cities[currentCityIndex].name;
  const timeZone = cities[currentCityIndex].timezone;

  getCurrentWeather(city);
  getFiveDaysForecast(city);
  updateClockForCity(timeZone);
  autoSetThemeForCity(timeZone);
}

async function getCurrentWeather(city) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=en`);
  const data = await res.json();
  const temp = parseInt(data.main.temp);

  const countryCode = data.sys.country;
  const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });
  const countryFullName = regionNamesInEnglish.of(countryCode);
  document.querySelectorAll('.count').forEach(el => { el.textContent = countryFullName; });

  document.getElementById('city').textContent = data.name;
  document.getElementById('temperature').textContent = `${temp}°`;
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('timezone').textContent = `Time Zone : ${data.timezone}`;

  const weatherMain = data.weather[0].main;
  updateWeatherIcon(weatherMain);
}

async function getFiveDaysForecast(city) {
  const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=en`);
  const data = await res.json();

  const container = document.getElementById('forecast');
  container.innerHTML = '';

  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00")).slice(0, 4);

  dailyData.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long'
    });
    const maxTemp = day.main.temp_max;
    const description = day.weather[0].description;

    const card = document.createElement('div');
    card.classList.add('forecast-day');

    card.innerHTML = `
      <div class="temp2">
        <p>${date}</p>
        <h2>${Math.round(maxTemp)}°</h2>
      </div>
      <div class="des2">
        <h4>${description}</h4>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi</p>
      </div>
    `;

    container.appendChild(card);
  });
}

document.getElementById('next-btn').addEventListener('click', () => {
  currentCityIndex = (currentCityIndex + 1) % cities.length;
  updateWeatherForCurrentCity();
});

document.getElementById('prev-btn').addEventListener('click', () => {
  currentCityIndex = (currentCityIndex - 1 + cities.length) % cities.length;
  updateWeatherForCurrentCity();
});

function updateClockForCity(timeZone) {
  const now = new Date();
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: timeZone
  };

  const timeString = now.toLocaleTimeString('en-US', options);
  const [currentTime, ampm] = timeString.split(' ');

  document.querySelector('.clock').textContent = currentTime;
  document.getElementById('am').textContent = ampm;
}

setInterval(() => {
  const timeZone = cities[currentCityIndex].timezone;
  updateClockForCity(timeZone);
}, 1000);

toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
});

function autoSetThemeForCity(timeZone) {
  const now = new Date();
  const hour = parseInt(new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone: timeZone
  }).format(now));

  const isNight = hour >= 18 || hour < 6;

  if (isNight) {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    toggle.checked = false;
  }
}

function setDateToday() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const formattedDate = `${month}/${day}`;
  document.querySelector('.dandm').textContent = formattedDate;
}

function updateWeatherIcon(weather) {
  const weatherIcon = document.getElementById("weather-icon");

  switch (weather) {
    case "Clear":
      weatherIcon.src = "Assets/imgs/clear.png";
      break;
    case "Clouds":
      weatherIcon.src = "Assets/imgs/cloud.png";
      break;
    case "Rain":
      weatherIcon.src = "Assets/imgs/rain.png";
      break;
    case "Snow":
      weatherIcon.src = "Assets/imgs/snow.png";
      break;
    case "Thunderstorm":
      weatherIcon.src = "Assets/imgs/thunder.png";
      break;
    case "Drizzle":
      weatherIcon.src = "Assets/imgs/rain.png";
      break;
    case "Mist":
    case "Fog":
    case "Haze":
      weatherIcon.src = "Assets/imgs/mist.png";
      break;
    default:
      weatherIcon.src = "Assets/imgs/default.png";
      break;
  }
}
