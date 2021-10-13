document.querySelector('header form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = event.target.location.value;
  const apiURL = 'https://wttr.in/' + input + '?format=j1';
  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        return response;
      }
    })
    .then((apiData) => apiData.json())
    .then((weatherInfo) => {
      postInfo(weatherInfo);
      postHistory(weatherInfo, apiURL);
      event.target.reset();
    })
    .catch((error) => {
      document.querySelector('#general').innerHTML =
        error + ', Please input a valid location.';
      document.querySelector('#today').innerHTML = '';
      document.querySelector('#tomorrow').innerHTML = '';
      document.querySelector('#after').innerHTML = '';
      event.target.reset();
    });
});

const postInfo = (info) => {
  const general = document.querySelector('#general');
  const today = document.querySelector('#today');
  const tomorrow = document.querySelector('#tomorrow');
  const after = document.querySelector('#after');
  const [todayInfo, tomorrowInfo, afterInfo] = info.weather;
  general.innerHTML = `<p><ul><h1>${info.nearest_area[0].areaName[0].value}</h1>
  <li><strong>Area:</strong> ${info.nearest_area[0].areaName[0].value}</li>
  <li><strong>Region:</strong> ${info.nearest_area[0].region[0].value}</li>
  <li><strong>Country:</strong> ${info.nearest_area[0].country[0].value}</li>
  <li><strong>Currently:</strong> Feels Like ${info.current_condition[0].FeelsLikeF}°F</li>
  </ul></p>`;
  today.innerHTML = `<ul><h3>Today</h3>
  <li><strong>Average Temperature:</strong> ${todayInfo.avgtempF}°F</li>
  <li><strong>Max Temperature:</strong> ${todayInfo.maxtempF}°F</li>
  <li><strong>Min Temperature:</strong> ${todayInfo.mintempF}°F</li>
  </ul>`;
  tomorrow.innerHTML = `<ul><h3>Tomorrow</h3>
  <li><strong>Average Temperature:</strong> ${tomorrowInfo.avgtempF}°F</li>
  <li><strong>Max Temperature:</strong> ${tomorrowInfo.maxtempF}°F</li>
  <li><strong>Min Temperature:</strong> ${tomorrowInfo.mintempF}°F</li>
  </ul>`;
  after.innerHTML = `<ul><h3>Day After Tomorrow</h3>
  <li><strong>Average Temperature:</strong> ${afterInfo.avgtempF}°F</li>
  <li><strong>Max Temperature:</strong> ${afterInfo.maxtempF}°F</li>
  <li><strong>Min Temperature:</strong> ${afterInfo.mintempF}°F</li>
  </ul>`;
};

const postHistory = (info, url) => {
  const history = document.querySelector('.history ul');
  if (history.textContent.includes('No previous searches')) {
    history.textContent = '';
  }
  const area = info.nearest_area[0].areaName[0].value;
  if (!history.textContent.includes(area)) {
    const newPost = document.createElement('li');
    newPost.innerHTML = `<a href=''>${area}</a> - ${info.current_condition[0].FeelsLikeF}°F`;
    newPost.addEventListener('click', (event) => {
      event.preventDefault();
      fetch(url)
        .then((apiData) => apiData.json())
        .then((weatherInfo) => {
          postInfo(weatherInfo);
        });
    });
    history.append(newPost);
  }
};
