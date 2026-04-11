

class KinoSala {
  constructor(podaci) {
    this.podaci = podaci;
    this.trenutnaProjekcija = 0;
    this.validiraj();
  }

  // Validacija podataka
  validiraj() {
    if (!this.podaci.projekcije || this.podaci.projekcije.length === 0) {
      console.error("Podaci nisu validni!");
      return false;
    }

    for (let projekcija of this.podaci.projekcije) {
      if (!projekcija.sjedista) continue;
      for (let sjediste of projekcija.sjedista) {
        const validniStatusi = ["slobodno", "zauzeto", "rezervisano"];
        if (!validniStatusi.includes(sjediste.status)) {
          console.error("Podaci nisu validni!");
          return false;
        }
      }
    }
    return true;
  }

  // Dohvati trenutnu projekciju
  uzmiTrenutnuProjekciju() {
    return this.podaci.projekcije[this.trenutnaProjekcija];
  }

  // Organizuj sjedišta po redovima
  organizujSjedista(sjedista) {
    const redovi = {};
    for (let sjediste of sjedista) {
      if (!redovi[sjediste.red]) {
        redovi[sjediste.red] = [];
      }
      redovi[sjediste.red].push(sjediste);
    }
    return redovi;
  }

  // Prikaži salu
  prikaziSalu(idDiva) {
    const div = document.getElementById(idDiva);
    if (!div) {
      console.error("Div sa id '" + idDiva + "' nije pronađen!");
      return;
    }

    const projekcija = this.uzmiTrenutnuProjekciju();
    div.innerHTML = "";

    // Naslov
    const naslovSekcija = document.createElement("section");
    naslovSekcija.className = "hall-header";
    naslovSekcija.innerHTML = `
      <h1>${projekcija.film}</h1>
      <div class="hall-meta">
        <span>Vrijeme projekcije: ${projekcija.vrijeme}</span>
        <span>Broj sale: 3</span>
      </div>
    `;
    div.appendChild(naslovSekcija);

    // Platno
    const platnoSekcija = document.createElement("section");
    platnoSekcija.className = "screen-section";
    platnoSekcija.innerHTML = `<div class="screen">PLATNO</div>`;
    div.appendChild(platnoSekcija);

    // Legenda
    const legendaSekcija = document.createElement("section");
    legendaSekcija.className = "legend";
    legendaSekcija.innerHTML = `
      <div class="legend-item"><span class="seat-sample free"></span> Slobodno</div>
      <div class="legend-item"><span class="seat-sample taken"></span> Zauzeto</div>
      <div class="legend-item"><span class="seat-sample reserved"></span> Rezervisano</div>
    `;
    div.appendChild(legendaSekcija);

    // Raspored sjedišta
    const redovi = this.organizujSjedista(projekcija.sjedista);
    const hallLayout = document.createElement("section");
    hallLayout.className = "hall-layout";

    const sortiraniRedovi = Object.keys(redovi).sort();
    for (let red of sortiraniRedovi) {
      // Red label
      const rowLabel = document.createElement("div");
      rowLabel.className = "row-label";
      rowLabel.textContent = red;
      hallLayout.appendChild(rowLabel);

      // Sjedišta u redu
      const seatsRow = document.createElement("div");
      seatsRow.className = "seats-row";

      for (let sjediste of redovi[red]) {
        const seat = document.createElement("span");
        seat.className = "seat " + sjediste.status;
        seat.setAttribute("data-red", sjediste.red);
        seat.setAttribute("data-broj", sjediste.broj);
        
        // Klik na sjedište
        seat.addEventListener("click", () => this.kliklNaSjediste(sjediste));

        seatsRow.appendChild(seat);
      }

      hallLayout.appendChild(seatsRow);
    }

    div.appendChild(hallLayout);

    // Dugmadi za navigaciju
    const navDugmadi = document.createElement("div");
    navDugmadi.style.display = "flex";
    navDugmadi.style.justifyContent = "center";
    navDugmadi.style.gap = "16px";
    navDugmadi.style.marginTop = "32px";

    const prethodna = document.createElement("button");
    prethodna.textContent = "← Prethodna projekcija";
    prethodna.style.padding = "12px 24px";
    prethodna.style.fontSize = "1rem";
    prethodna.style.fontWeight = "600";
    prethodna.style.border = "1px solid rgba(0,0,0,0.2)";
    prethodna.style.borderRadius = "10px";
    prethodna.style.cursor = "pointer";
    prethodna.style.backgroundColor = "#ffffff";
    prethodna.style.color = "#0f172a";
    prethodna.style.transition = "0.2s ease";
    
    prethodna.addEventListener("mouseover", () => {
      prethodna.style.backgroundColor = "#e2e8f0";
    });
    prethodna.addEventListener("mouseout", () => {
      prethodna.style.backgroundColor = "#ffffff";
    });
    prethodna.addEventListener("click", () => this.prethodnaProjekcija(idDiva));

    const sljedeca = document.createElement("button");
    sljedeca.textContent = "Sljedeća projekcija →";
    sljedeca.style.padding = "12px 24px";
    sljedeca.style.fontSize = "1rem";
    sljedeca.style.fontWeight = "600";
    sljedeca.style.border = "1px solid rgba(0,0,0,0.2)";
    sljedeca.style.borderRadius = "10px";
    sljedeca.style.cursor = "pointer";
    sljedeca.style.backgroundColor = "#ffffff";
    sljedeca.style.color = "#0f172a";
    sljedeca.style.transition = "0.2s ease";
    
    sljedeca.addEventListener("mouseover", () => {
      sljedeca.style.backgroundColor = "#e2e8f0";
    });
    sljedeca.addEventListener("mouseout", () => {
      sljedeca.style.backgroundColor = "#ffffff";
    });
    sljedeca.addEventListener("click", () => this.sljedecaProjekcija(idDiva));

    navDugmadi.appendChild(prethodna);
    navDugmadi.appendChild(sljedeca);
    div.appendChild(navDugmadi);
  }

  // Klik na sjedište
  kliklNaSjediste(sjediste) {
    if (sjediste.status === "slobodno") {
      sjediste.status = "rezervisano";
      this.prikaziSalu("sala");
    }
  }

  // Prethodna projekcija
  prethodnaProjekcija(idDiva) {
    if (this.trenutnaProjekcija > 0) {
      this.trenutnaProjekcija--;
      this.prikaziSalu(idDiva);
    }
  }

  // Sljedeća projekcija
  sljedecaProjekcija(idDiva) {
    if (this.trenutnaProjekcija < this.podaci.projekcije.length - 1) {
      this.trenutnaProjekcija++;
      this.prikaziSalu(idDiva);
    }
  }
}

// Inicijalizacija nakon što se stranna učita
document.addEventListener("DOMContentLoaded", () => {
  if (typeof podaci !== "undefined") {
    const sala = new KinoSala(podaci);
    sala.prikaziSalu("sala");
  }
});
