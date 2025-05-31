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

  const filmContainer = document.getElementById('filmContainer');

  filmContainer.innerHTML = ``


});








