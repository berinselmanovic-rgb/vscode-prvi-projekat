let trenutnaProjekcija = 0;

function prikaziSalu() {
  const sala = document.getElementById('sala');
  if (!sala) return;

  const p = podaci.projekcije[trenutnaProjekcija];
  
  let html = `
    <section class="hall-header">
      <h1>${p.film}</h1>
      <div class="hall-meta">
        <span>Vrijeme projekcije: ${p.vrijeme}</span>
        <span>Broj sale: 3</span>
      </div>
    </section>

    <section class="screen-section">
      <div class="screen">PLATNO</div>
    </section>

    <section class="legend">
      <div class="legend-item"><span class="seat-sample free"></span> Slobodno </div>
      <div class="legend-item"><span class="seat-sample taken"></span> Zauzeto </div>
      <div class="legend-item"><span class="seat-sample reserved"></span> Rezervisano </div>
    </section>

    <section class="hall-layout">
  `;

  const redovi = {};
  for (let s of p.sjedista) {
    if (!redovi[s.red]) redovi[s.red] = [];
    redovi[s.red].push(s);
  }

  const sortiraniRedovi = Object.keys(redovi).sort();

  for (let red of sortiraniRedovi) {
    html += `<div class="row-label">${red}</div>`;
    html += `<div class="seats-row">`;
    
    for (let i = 0; i < redovi[red].length; i++) {
      const s = redovi[red][i];
      const sjedIdx = p.sjedista.indexOf(s);
      html += `<span id="seat-${sjedIdx}" class="seat ${s.status}" onclick="klikNaSjediste(${sjedIdx}); return false;"></span>`;
    }
    
    html += `</div>`;
  }

  html += `
    </section>

    <div class="nav-buttons">
      <button onclick="prethodna()" ${trenutnaProjekcija === 0 ? 'disabled' : ''}>← Prethodna</button>
      <button onclick="sljedeca()" ${trenutnaProjekcija === podaci.projekcije.length - 1 ? 'disabled' : ''}>Sljedeća →</button>
    </div>
  `;

  sala.innerHTML = html;
}

function klikNaSjediste(idx) {
  if (!podaci || !podaci.projekcije || !podaci.projekcije[trenutnaProjekcija]) {
    console.error('Nema podataka');
    return false;
  }
  
  const s = podaci.projekcije[trenutnaProjekcija].sjedista[idx];
  const redZaSjediste = s.red;
  const brojZaSjediste = (idx % 10) + 1;
  
  if (s.status === 'slobodno') {
    s.status = 'rezervisano';
    prikaziSalu();
    alert('✓ Sjedište ' + redZaSjediste + brojZaSjediste + ' je uspješno rezervisano!');
  } else if (s.status === 'zauzeto') {
    alert('✗ Sjedište ' + redZaSjediste + brojZaSjediste + ' je već zauzeto!');
  } else if (s.status === 'rezervisano') {
    alert('✗ Sjedište ' + redZaSjediste + brojZaSjediste + ' je već rezervisano!');
  }
  
  return false;
}

function prethodna() {
  if (trenutnaProjekcija > 0) {
    trenutnaProjekcija--;
    prikaziSalu();
  }
}

function sljedeca() {
  if (trenutnaProjekcija < podaci.projekcije.length - 1) {
    trenutnaProjekcija++;
    prikaziSalu();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (typeof podaci !== 'undefined') {
    prikaziSalu();
  } else {
    console.error('podaci nije definiran!');
  }
});
