const dropdown = document.getElementById("dropdown");
const dropdown_menu = document.getElementById("dropdown_menu");
const chevron = document.getElementById("chevron");
const copy = document.getElementById("copy");
const lang = document.getElementById("lang");
const hamburger = document.getElementById('hamburger');
const overlay = document.getElementById('menuOverlay');
const burgerMenu = document.getElementById('burgerMenu');

const languages = [`<i>Dil</i>`, 'AZ', 'EN', 'RU'];

const params = new URLSearchParams(window.location.search);
const sessionId = params.get("id");
let ticketData = []

const cover = document.getElementById('cover');
const seatZone = document.getElementById('seatZone');
const seatWrapper = document.getElementById('seat-wrapper');

const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
let currentScale = 1;

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


function formatDuration(minutes) {
  const hrs = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hrs}:${mins}:00`;
}

function formatSubtitle(subtitle) {
  return subtitle === 'RU' ? 'Rus' :
          subtitle === 'AZ' ? 'Aze' :
          subtitle === 'EN' ? 'Eng' : 'No';
}

function createCell(num) {
  const cell = document.createElement("div");
  cell.innerHTML = num;
  cell.classList = "w-[25px] h-[25px] bg-gray-400 rounded-lg p-1 mx-1 flex justify-center items-center text-center text-sm";
  return cell;
}

function zoomIn() {
  currentScale += 0.1;
  updateZoom();
}

function zoomOut() {
  currentScale = Math.max(0.5, currentScale - 0.1); 
  updateZoom();
}

function updateZoom() {
  seatWrapper.style.transform = `scale(${currentScale})`;
  seatWrapper.style.transformOrigin = 'top left'; 
}

zoomInBtn.addEventListener('click', zoomIn);
zoomOutBtn.addEventListener('click', zoomOut);





function loadData() {
  return fetch('https://parkcinema-data-eta.vercel.app/detail')
    .then(res => res.json())
    .then(data => {
      for (const elm of data) {
        if (elm.id === sessionId) {
          ticketData = elm;
          break;
        }
      }
    })
    .catch(err => console.error('Fetch error:', err));
}


loadData().then(() => {  
  const film = ticketData;

  cover.innerHTML = `
    <div class="h-full">
      <img src="img/${film.movie.image}" class="h-full" alt="${film.movie.name}">
    </div>
    <div class="text-white flex flex-col text-sm sm:text-lg leading-[1.8]">
      <h3 class="text-md sm:text-xl">${film.movie.name}</h3>
      <p>${film.type.slice(1)}</p>
      <p><i class="fa-solid fa-calendar mr-3"></i>${new Date(film.movie.firstScreeningDate).toLocaleDateString('ru-RU')}</p>
      <p><i class="fa-solid fa-clock mr-3"></i>${film.time}</p>
      <p>Dil: ${formatSubtitle(film.language)}</p>
      <p>Kinoteatr: ${film.theatreTitle}</p>
      <p>${film.hallTitle}</p>
      <p>Müddət: ${formatDuration(film.movie.duration)}</p>
    </div>
  `
  
  const seatContainer = document.getElementById('seat-container');
  let rows= [];
  for (let i = 12; i >= 1; i--) {
    rows.push(i); 
  }
  const maxCols = 17;

  rows.forEach(rowNum => {
    const row = document.createElement('div');
    row.className = 'flex items-center gap-2 mb-3';

    const label = document.createElement('div');
    label.innerText = rowNum;
    label.className = 'w-10 mr-6 text-center text-md text-white';
    row.appendChild(label);

    let x = 1; 

    for (let col = 1; col <= maxCols; col++) {
      let show = false;

      if (rowNum == 12) {
        show = true;
      } 
      else if (rowNum >= 7 && rowNum <= 11) {
        if (col == 1 || col == 2 || (col >= 5 && col <= 15)) show = true;
      } 
      else if (rowNum >= 2 && rowNum <= 6) {
        if (col >= 5 && col <= 15) show = true;
      } 
      else if (rowNum == 1) {
        if (col >= 6 && col <= 14) {
          show = true;
          if (col == 6) x+=1
        }   
      }

      if (show) {
        const seat = document.createElement('div');
        seat.innerText = x;
        seat.className = 'cursor-pointer bg-[#C7C7C7] text-black rounded p-1 text-sm text-center w-8';
        seat.id = `r${rowNum}s${x}`;
        seat.onclick = () => selectSeat(seat.id);
        row.appendChild(seat);
        x++; 
      } 
      else {
        const gap = document.createElement('div');
        if (rowNum >= 7 && rowNum <= 11) gap.className = 'w-10';
        else if (rowNum >= 1 && rowNum <= 6) gap.className = 'w-9';
        else gap.className = 'w-8';
        
        row.appendChild(gap);
      }
    }

    seatContainer.appendChild(row);
  });


  let aileMode = false;
  let aileDropdownUsed = false;
  let selectedSeats = []; 

  let lastDropdown = null;
  let lastOrangeSeat = null;
  let optionChosen = false;
  let aileCount = 0;

  const seatsInfoDiv = document.getElementById('seatsInfo');

  function selectSeat(seatId) {
    console.log('Selected seat:', seatId);
    const seat = document.getElementById(seatId);

    const index = selectedSeats.findIndex(s => s.id === seatId)

    if (index != -1) {
      selectedSeats.splice(index, 1); 
      seat.classList.remove('bg-red-500', 'text-white'); 
      seat.classList.add('bg-[#C7C7C7]', 'text-black'); 
      removeDropdown(); 
      updateSeatInfo(); 
      return;
    }

    if (aileMode && aileCount < 4) {
      if (aileMode && aileCount < 4) {
      seat.classList.remove('bg-[#C7C7C7]');
      seat.classList.add('bg-red-500');
      markSelected(seatId, 'Ailə');
      aileCount++;
      }
      if (aileCount == 4) {
        aileMode = false;
        aileDropdownUsed = true;
      }

      updateSeatInfo();
      return;
    }

    removeDropdown();

    seat.classList.add('bg-[#FF9C0E]');

    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown-menu p-0 absolute w-[60px] bg-[#ffffffca] rounded flex flex-col text-center justify-evenly z-50 text-sm';
    dropdown.style.top = seat.offsetTop + seat.offsetHeight + 'px';
    dropdown.style.left = seat.offsetLeft + seat.offsetWidth / 2 - 30 + 'px';

    if (!aileDropdownUsed) {
    const aileDiv = document.createElement('div');
    aileDiv.innerText = 'Ailə';
    aileDiv.className = 'cursor-pointer flex justify-center items-center h-[40px] text-center hover:bg-red-500 hover:text-white px-1 rounded';
    aileDiv.onclick = () => {
      chooseAile(seatId, dropdown);
      removeDropdown();
      optionChosen = true;
    };
    dropdown.appendChild(aileDiv);
  }

    const boyukDiv = document.createElement('div');
    boyukDiv.innerText = 'Böyük';
    boyukDiv.className = 'cursor-pointer flex justify-center items-center h-[40px] text-center hover:bg-red-500 hover:text-white px-1 rounded';
    boyukDiv.onclick = () => {
      chooseBoyuk(seatId, dropdown);
      removeDropdown();
      optionChosen = true;
    };
    dropdown.appendChild(boyukDiv);

    seatContainer.appendChild(dropdown);

    lastDropdown = dropdown;
    lastOrangeSeat = seat;
    optionChosen = false;
  }

  function chooseAile(seatId, dropdown) {
    const seat = document.getElementById(seatId);
    seat.classList.remove('bg-[#C7C7C7]');
    seat.classList.add('bg-red-500');

    markSelected(seatId, 'Ailə');
    aileCount++;

    if (aileCount === 1) {
      aileMode = true; 
    }

    if (aileCount === 4) {
      aileDropdownUsed = true;
      aileMode = false;
    }

    updateSeatInfo();
  }

  function chooseBoyuk(seatId, dropdown) {
    const seat = document.getElementById(seatId);
    seat.classList.remove('bg-orange-500');
    seat.classList.add('bg-red-500');

    markSelected(seatId, 'Böyük');
    updateSeatInfo();
  }

  function markSelected(seatId, type) {
    for (let i = 0; i < selectedSeats.length; i++) {
      if (selectedSeats[i].id == seatId) return;
    }
    const [row, num] = seatId.match(/r(\d+)s(\d+)/).slice(1).map(Number);
    selectedSeats.push({ id: seatId, row, num, type });
  }

  function updateSeatInfo() {
    seatsInfoDiv.innerHTML = '';

    let total = 0;
    selectedSeats.forEach(seat => {
      const p = document.createElement('p');
      p.innerText = `Sıra ${seat.row}, Yer ${seat.num} (${seat.type})`;
      seatsInfoDiv.appendChild(p);
      total += seat.type == 'Ailə' ? 7 : 8;
    });

    const existingButton = seatsInfoWrapper.querySelector('button');

    if (selectedSeats.length == 0) {
      if (existingButton) existingButton.remove();
      return;
    }

    const totalDiv = document.createElement('p');
    totalDiv.className = 'font-bold mt-2';
    totalDiv.innerText = `Ümumi: ${total} AZN`;
    seatsInfoDiv.appendChild(totalDiv);

    if (!existingButton) {
      const button = document.createElement('button');
      button.id = 'buyTicketButton';
      button.innerText = 'Bilet al';
      button.className = 'h-[50px] bg-red-500 text-white text-xl px-6 sm:px-10 py-2 rounded-full mt-4 hover:bg-red-600 transition';
      document.querySelector('#seatsInfoWrapper').appendChild(button);
    }
  }

  function removeDropdown() {
    if (lastDropdown) {
      lastDropdown.remove();

      if (!optionChosen && lastOrangeSeat) {
        lastOrangeSeat.classList.remove('bg-[#FF9C0E]');
      }

      lastDropdown = null;
      lastOrangeSeat = null;
      optionChosen = false;
    }
  }


});