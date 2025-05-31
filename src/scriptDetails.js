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
  const film = data.find(f => f.id === filmId);

  if (!film) {
    document.body.innerHTML = "<h1 class='text-red-500 text-xl'>Film not found</h1>";
    return;
  }
  data.pop();

  console.log("Film:", film);
  console.log("Name:", film.name);

  // Now build your HTML dynamically
  const container = document.getElementById('film-detail');
  container.innerHTML = `
    <div class="max-w-3xl mx-auto text-white p-6">
      <img src="../img/${film.image}" alt="${film.name}" class="rounded-xl w-full h-auto mb-4">
      <h1 class="text-3xl font-bold mb-2">${film.name}</h1>
      <p class="text-sm mb-2">Screening: ${new Date(film.firstScreeningDate).toLocaleDateString()}</p>
      <p class="text-sm mb-2">Age: ${film.ageLimit}</p>
      <div class="mt-4">
        ${film.languages.map(lang => `<img src="../img/${lang.toLowerCase()}-flag.svg" class="inline-block w-6 h-6 mr-2" />`).join('')}
      </div>
    </div>
  `;
});









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






