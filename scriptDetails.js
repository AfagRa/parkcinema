const dropdown = document.getElementById("dropdown");
const dropdown_menu = document.getElementById("dropdown_menu");
const chevron = document.getElementById("chevron");
const copy = document.getElementById("copy");
const lang = document.getElementById("lang");
const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('menuOverlay');
const burgerMenu = document.getElementById('burgerMenu');

const languages = [`<i>Dil</i>`, 'AZ', 'EN', 'RU'];

function rotateChevron(div) {
  const dropdownMenu = div.querySelector(".dropdown-menu");
  const chevron = div.querySelector(".chevron");
  if (dropdownMenu) dropdownMenu.classList.toggle("hidden");
  if (chevron) chevron.classList.toggle("rotate-180");
}

hamburger.onclick = function OpenMenu() {
  hamburger.style.display = 'none';
  overlay.classList.remove('hidden');
  burgerMenu.classList.remove('translate-y-full');
}

overlay.onclick = function() {
  hamburger.style.display = 'flex';
  overlay.classList.add('hidden');
  burgerMenu.classList.add('translate-y-full');
};

copy.innerHTML = `&copy; Park Cinema, ${new Date().getFullYear()}`

const wordToNumber = {
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  ELEVEN: 11,
  TWELVE: 12,
  THIRTEEN: 13,
  FOURTEEN: 14,
  FIFTEEN: 15,
  SIXTEEN: 16,
  SEVENTEEN: 17,
  EIGHTEEN: 18,
  NINETEEN: 19,
  TWENTY: 20,
};

function formatDuration(minutes) {
  const hrs = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hrs}:${mins}:00`;
}

function getEmbedUrl(url) {
  return `https://www.youtube.com/embed/${url.match(/v=([^&]+)/)[1]}`;
}

function formatSubtitle(subtitle) {
    return subtitle === 'RU' ? 'Rus' :
           subtitle === 'AZ' ? 'Aze' :
           subtitle === 'EN' ? 'Eng' : 'No';
  }

function goToTicket(id) {
  window.location.href = `ticket.htm?id=${id}`;
}


const params = new URLSearchParams(window.location.search);
console.log("Params gorek nedi:", params);
const filmId = params.get("id");
console.log(filmId)

let data = [];
let detailsData = []

function loadData() {
  return fetch('https://parkcinema-data-eta.vercel.app/landing')
    .then(res => res.json())
    .then(json => {
      data = json;
      console.log('Data is loaded!', data);
      return fetch(`https://parkcinema-data-eta.vercel.app/detail`);
    })
    .then(sessionDataRes => sessionDataRes.json())
    .then(sessionData => {
      console.log("Raw sessionData:", sessionData);
      for (const elm of sessionData) {
        if (elm.movie?.id === filmId) {
          detailsData = elm;
          console.log('Details data is loaded!', detailsData);
          break;
        }
      }
    })
    .catch(err => console.error('Fetch error:', err));
}


loadData().then(() => {
  data.pop();
  
  const film = data.find(f => f.id === filmId);

  const filmInfo = document.getElementById('filmInfo');
  filmInfo.innerHTML = `
    <div class="text-white space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div class="max-lg:hidden lg:col-span-1 max-md:order-3 shrink h-auto flex justify-center">
          <img class="shrink w-full rounded-xl shadow-lg" src="../img/${film.image}" alt="Movie Poster">
        </div>

        <div class="md:col-span-1 space-y-2 max-md:order-2">
          <h1 class="text-3xl font-bold">${film.name}</h1>
          <p><strong>Janr:</strong> ${film.genres.map(g => g.title).join(', ')}</p>
          <p><strong>Dil:</strong> ${film.languages.map(lang => `
            <img src="../img/${lang.toLowerCase()}-flag.svg" class="w-5 h-5 inline-block mx-1" alt="${lang}">`).join('')}
          </p>
          <p><strong>Altyazı:</strong> ${film.subtitles.map(lang => `
            <img src="../img/${lang.toLowerCase()}-flag.svg" class="w-5 h-5 inline-block mx-1" alt="${lang}">`).join('')}
          </p>
          <p><strong>Müddət:</strong> ${formatDuration(film.duration)}</p>
          <p><strong>İl:</strong> ${film.year}</p>
          <p><strong>Ölkə:</strong> ${film.country}</p>
          <p><strong>Rejissor:</strong> ${film.director}</p>
          <p><strong>Aktyorlar:</strong> ${film.actors.join(', ')}</p>
          <p><strong>Yaş Həddi:</strong> ${wordToNumber[film.ageLimit.toUpperCase()]}+</p>
          <p><strong>Nümayiş Tarixi:</strong> ${new Date(film.firstScreeningDate).toLocaleDateString('ru-RU')}</p>
        </div>

        <div class="md:col-span-2 max-md:order-1">
          <iframe class="w-full h-80 rounded-lg" src="${getEmbedUrl(film.youtubeUrl)}" frameborder="0" allowfullscreen></iframe>
        </div>

        <div class="md:col-span-2 mt-4 max-md:order-4">
          <p class="leading-relaxed">${film.description}</p>
        </div>

        <div class="md:col-span-2"></div>

      </div>
    </div>
  `;

  const sliderWrapper = document.getElementById("sliderWrapper");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const scrollStep = 120;

  prevBtn.addEventListener("click", () => {
    sliderWrapper.scrollBy({ left: -scrollStep, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    sliderWrapper.scrollBy({ left: scrollStep, behavior: "smooth" });
  });


  const generateDates = (days = 7) => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        day: date.getDate(),
        month: date.toLocaleString("default", { month: "long" })
      });
    }

    return dates;
  };

  const renderDates = () => {
    const dates = generateDates();
    dates.forEach(({ day, month }) => {
      const card = document.createElement("div");
      card.className = "w-[60px] h-[90px] p-1 bg-[#474747] flex flex-col items-center text-white rounded-4xl";

      card.innerHTML = `
        <div class="px-4 py-1 text-sm">${month}</div>
        <div class="bg-[#606060] rounded-full w-10 h-10 flex justify-center items-center mt-1.5 text-lg font-medium">${day}</div>
      `;

      sliderWrapper.appendChild(card);
    });
  };
  renderDates()

  const languages = [`<i>Dil</i>`, 'AZ', 'EN', 'RU'];
  const theaters = [`<i>Kinoteatr</i>`,'Park Bulvar', 'Metro Park', 'Flame Towers', 'Sevinc Mall', 'Shahdag'];

  languages.forEach(elm => {
    lang.innerHTML += `<li class="flex items-center px-3 py-2">${elm}</li>`;
  });
  theaters.forEach(elm => {
      theater.innerHTML += `<li class="flex items-center px-3 py-2">${elm}</li>`;
  });


  const sessionsContainer = document.getElementById('sessionsContainer');

  console.log("data niye cixmir ki", detailsData)
  console.log("gorek teatr cixir", detailsData.theatreTitle)

  sessionsContainer.innerHTML += `
    <div class="flex justify-between items-center py-2 max-sm:px-2 sm:px-6 md:px-14 max-sm:space-x-2 border-b-2 border-b-white">
      <div class="text-left">${detailsData.time}</div>
      <div class="text-left">${detailsData.theatreTitle} | ${detailsData.hallTitle}</div>
      <div class="flex justify-center"> ${(detailsData.type).slice(1)}
        <div>
            <img src="../img/${detailsData.language.toLowerCase()}-flag.svg" alt="${detailsData.language} flag" class="w-5 h-5 inline-block mx-1" />
        </div>
      </div>
      <div id="subtitles" class="text-center border border-white p-1 rounded-lg text-white w-[50px]">
          <h5 class="m-0 max-sm:text-xs sm:text-sm">${formatSubtitle(detailsData.subtitle)}</h5>
          <span class="m-0 text-xs">sub</span>
      </div>
      <div class="text-right">
        <button onclick="goToTicket('${detailsData.id}')" class="bg-[#803131] hover:bg-red-700 text-white py-3 max-sm:px-4 sm:px-10 rounded-3xl text-sm">Bilet Al</button>
      </div>
    </div>
  `

});