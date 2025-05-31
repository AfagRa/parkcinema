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