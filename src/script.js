const dropdown = document.getElementById("dropdown");
const dropdown_menu = document.getElementById("dropdown_menu");
const chevron = document.getElementById("chevron");
const next = document.getElementById("next");
const header = document.querySelector('#header'); 
const copy = document.getElementById("copy");
const lang = document.getElementById("lang");
const theater = document.getElementById("theater");
const table = document.getElementById("table");
const slider = document.getElementById("slider");
const list = document.getElementById('list');
const trailers = document.getElementById('trailers');
const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('menuOverlay');
const burgerMenu = document.getElementById('burgerMenu');

const languages = [`<i>Dil</i>`, 'AZ', 'EN', 'RU'];
const theaters = [`<i>Kinoteatr</i>`,'Park Bulvar', 'Metro Park', 'Flame Towers', 'Sevinc Mall', 'Shahdag'];

function rotateChevron(div) {
  const dropdownMenu = div.querySelector(".dropdown-menu");
  const chevron = div.querySelector(".chevron");
  if (dropdownMenu) dropdownMenu.classList.toggle("hidden");
  if (chevron) chevron.classList.toggle("rotate-180");
}

const allImages = [
    'minecraft_sayt_banner.webp',
    'belkede_sayt_banner.webp',
    'tagiyev_sayt_banner.webp',
    'wolt_post_sayt_banner.webp'
]
const bgImages = allImages.filter(name => name.includes('sayt_banner.webp'));
let x = 0;

next.onclick = function changeBgImage() {
    x = (x + 1) % bgImages.length; 
    const nextImage = bgImages[x];
    slider.style.backgroundImage = `linear-gradient(to bottom, #000000e0,#00000067, transparent, #00000067, #000000e0), url('../img/${nextImage}')`;
}

list.addEventListener('click', () => {
  list.classList.add('glow');
  trailers.classList.remove('glow');
});

trailers.addEventListener('click', () => {
  trailers.classList.add('glow');
  list.classList.remove('glow');
});

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

const subHeadings = document.querySelectorAll('#subheadings h3');

subHeadings.forEach(heading => {
  heading.addEventListener('click', () => {
    subHeadings.forEach(h => h.classList.remove('active-tab'));
    heading.classList.add('active-tab');
  });
});

copy.innerHTML = `&copy; Park Cinema, ${new Date().getFullYear()}`

languages.forEach(elm => {
    lang.innerHTML += `<li class="flex items-center px-3 py-2">${elm}</li>`;
});
theaters.forEach(elm => {
    theater.innerHTML += `<li class="flex items-center px-3 py-2">${elm}</li>`;
});



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

const films = document.querySelector("#films")
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


function filmCards() {
  let code = ''
  data.forEach(film => {
    code += `
    <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
      <div onclick="goToDetails('${film.id}')" class="rounded-xl overflow-hidden">
        <div class="relative h-[450px] group">
          <div class="absolute inset-0 bg-center bg-cover transition-transform duration-300 group-hover:scale-110"
                style="background-image: linear-gradient(to top, rgba(0,0,0,0.8) 33%, transparent 100%), url('../img/${film.image}');">
          </div>
          <div class="relative z-10 h-full flex flex-col justify-end p-4 text-white">
            <h3 class="text-lg font-bold">${film.name}</h3>
            <p class="text-sm">${new Date(film.firstScreeningDate).toLocaleDateString('ru-RU')}</p>
            <div class="flex justify-between items-center mt-2">
              <p class="text-s">${wordToNumber[film.ageLimit.toUpperCase()]}+</p>
              <div>
                ${film.languages.map(lang => `<img src="../img/${lang.toLowerCase()}-flag.svg" alt="${lang} flag" class="w-5 h-5 inline-block mx-1" />`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    `
  });
  films.innerHTML = code
  
}

function goToDetails(id) {
  window.location.href = `details.htm?id=${id}`;
}

function testImg() {
  data.forEach(film => {
  console.log(film.name)
  console.log(film.firstScreeningDate)
  console.log(new Date(film.firstScreeningDate).toLocaleDateString('ru-RU'))
  });
}

loadData().then(() => {
  data.pop()
  // testImg()
  filmCards()
});

