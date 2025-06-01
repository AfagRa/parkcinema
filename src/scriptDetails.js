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

const params = new URLSearchParams(window.location.search);
const filmId = params.get("id");
console.log(filmId)


let data = [];

function loadData() {
  return fetch('https://parkcinema-data-eta.vercel.app/landing')
    .then(res => res.json())
    .then(json => {
      data = json;
      console.log('Data is loaded!');
      console.log(data);
    })
    .catch(err => console.error('Fetch error:', err));
}


loadData().then(() => {
  data.pop();
  
  const film = data.find(f => f.id === filmId);
  console.log("Film:", film);

  const filmInfo = document.getElementById('filmInfo');

  filmInfo.innerHTML = `
    <div class="text-white space-y-6">
    
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div class="lg:col-span-1 flex justify-center">
          <img class="rounded-xl shadow-lg w-60" src="../img/${film.image}" alt="Movie Poster">
        </div>

        <div class="lg:col-span-1 space-y-2">
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

        <!-- YouTube Trailer: 50% -->
        <div class="lg:col-span-2">
          <iframe class="w-full h-64 rounded-lg" src="${film.youtubeUrl}" frameborder="0" allowfullscreen></iframe>
        </div>

        <!-- Description: spans poster + info (50%) -->
        <div class="lg:col-span-2 mt-4">
          <h2 class="text-2xl font-semibold mb-2">Məzmun</h2>
          <p class="leading-relaxed">${film.description}</p>
        </div>

        <!-- Empty cell under YouTube -->
        <div class="lg:col-span-2"></div>

      </div>
    </div>
  `;







});








