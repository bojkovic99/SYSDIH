import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { MojservisService } from '../mojservis.service';
import { Raspored } from '../moduli/Raspored';
import { Medicina } from '../moduli/MedSestre';
import { Korisnik } from '../moduli/Korisnik';
import { Karton } from '../moduli/Karton';
import { Oboljenja } from '../moduli/Oboljenja';
import { Recept } from '../moduli/Recept';
import { Zahtev } from '../moduli/Zahtev';
import { IfStmt } from '@angular/compiler';


@Component({
  selector: 'app-pacijent',
  templateUrl: './pacijent.component.html',
  styleUrls: ['./pacijent.component.css', '../registracija/registracija.component.css']
})
export class PacijentComponent implements OnInit {

  constructor(private router: Router, private service: MojservisService) { }

  niz: number[] = [];
  zakazano: number[] = [];
  komentari: string[] = [];
  rasporedi: Raspored[] = [];
  rasporediPom: Raspored[] = [];
  lekari: Medicina[] = [];
  izabraniLekar: Medicina;
  prikazivanje: number = 0;
  korisnik: Korisnik;
  vecZakazano: number = 0;
  pregledi: Karton[] = [];
  hronicno: Oboljenja;
  recept2: Recept;
  recept: Recept;
  poslato: number = 0;
  dojagnozaKarton: Karton;
  ngOnInit(): void {
    if (localStorage.getItem('prijavljen') == null) {
      alert("Morate biti prijavljeni kao pacijent!"); this.router.navigate(['/logovanje']);
    }
    else {

      this.korisnik = JSON.parse(localStorage.getItem('prijavljen'));
      if (this.korisnik.Tip != 'p') { alert("Morate biti prijavljeni kao pacijent!"); this.router.navigate(['/logovanje']); }
      else {
        let danas = new Date();
        let broj;

        let m = this.service.dohvatiPristigleM();
        m.subscribe(
          data => {
            let pomocno = data;
            pomocno.forEach(element => {
              if (element.Tip == 'l') {
                this.lekari.push(element);
              }
            });
          }
        )

      }

      for (let i = 8, j = 0; i < 20; i++, j++) {

        let danas = new Date();
        this.zakazano[i - 8] = 1;
        this.rasporedi[i - 8] = { Datum: danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate(), LPIme: "", LPPrezime: "", Lekar: 0, LekarIme: "", Pacijent: this.korisnik.Id, PacijentIme: this.korisnik.KorIme, Vreme: i, Kasnjenje: "" };

        this.komentari[i - 8] = "";
      }

    }
  }
  izabr: number;
  sutra: number = 0;

  izaberi() {
    this.vecZakazano = 0;
    this.niz = [];
    this.rasporediPom = [];
    this.rasporedi = [];
    this.zakazano = [];
    let danas = new Date();
    console.log(this.izabr);
    this.izabraniLekar = this.lekari[this.izabr];

    for (let i = 8; i < 20; i++) {
      this.niz.push(i);
      this.zakazano.push(0);
      this.komentari.push("");
      console.log(danas.getFullYear() + "-" + danas.getMonth() + "-" + danas.getDate());
      let r: Raspored = { LPIme: this.izabraniLekar.Ime, LPPrezime: this.izabraniLekar.Prezime, Datum: danas.getFullYear() + "-" + danas.getMonth() + "-" + danas.getDate(), Lekar: 0, Pacijent: 0, Vreme: 0, LekarIme: "", PacijentIme: "", Kasnjenje: "" }
      this.rasporedi.push(r);
    }
    let r = this.service.dohvatiRaspored(danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate(), this.izabraniLekar.KorIme);
    r.subscribe(
      data => {
        console.log(JSON.stringify(data));
        this.rasporediPom = data;
        this.rasporediPom.forEach(element => {

          for (let i = 8, j = 0; i < 20; i++, j++) {
            if (i == element.Vreme && element.Pacijent != null) {
              this.zakazano[i - 8] = 1;
              this.rasporedi[i - 8] = element;
            }
            else if (i == element.Vreme && element.Pacijent == null) {
              console.log(element.Kasnjenje);
              this.komentari[i - 8] = element.Kasnjenje;
            }
            if (element.Pacijent != null && element.Pacijent == this.korisnik.Id) {
              this.vecZakazano = 1;
            }
          }



        });



      }
    );

    if (this.prikazivanje != 5) {
      this.prikazivanje = 1;
    }

    console.log(this.komentari);

  }

  zakazi(a: number) {
    this.zakazano[a - 8] = 1;
    this.rasporedi[a - 8].Pacijent = this.korisnik.Id;
    this.vecZakazano = 1;
    let danas = new Date();
    let r: Raspored = { Datum: danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate(), LPIme: this.izabraniLekar.Ime, LPPrezime: this.izabraniLekar.Prezime, Lekar: this.izabraniLekar.Id, LekarIme: this.izabraniLekar.KorIme, Kasnjenje: "", Pacijent: this.korisnik.Id, PacijentIme: this.korisnik.KorIme, Vreme: a };

    this.service.dodajZakazivanje(r);

  }

  zakaziSutra() {

    this.vecZakazano = 0;
    this.niz = [];
    this.rasporediPom = [];
    this.rasporedi = [];
    this.zakazano = [];
    this.komentari = [];
    let danas = new Date();
    let danas1 = new Date();

    danas.setSeconds((danas1.getSeconds() + 24 * 60 * 60));
    console.log(danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate());


    for (let i = 8; i < 20; i++) {
      this.niz.push(i);
      this.zakazano.push(0);
      this.komentari.push("");
      console.log(danas.getFullYear() + "-" + danas.getMonth() + "-" + danas.getDate());
      let r: Raspored = { LPIme: this.izabraniLekar.Ime, LPPrezime: this.izabraniLekar.Prezime, Datum: danas.getFullYear() + "-" + danas.getMonth() + "-" + danas.getDate(), Lekar: 0, Pacijent: 0, Vreme: 0, LekarIme: "", PacijentIme: "", Kasnjenje: "" }
      this.rasporedi.push(r);
    }
    let r = this.service.dohvatiRaspored(danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate(), this.izabraniLekar.KorIme);
    r.subscribe(
      data => {

        this.rasporediPom = data;
        this.rasporediPom.forEach(element => {
          for (let i = 8, j = 0; i < 20; i++, j++) {
            if (i == element.Vreme && element.Pacijent != null) {
              this.zakazano[i - 8] = 1;
              this.rasporedi[i - 8] = element;
            }
            else if (i == element.Vreme && element.Pacijent == null) {
              this.komentari[i - 8] = element.Kasnjenje;
            }
            if (element.Pacijent == this.korisnik.Id) {
              this.vecZakazano = 1;
            }
          }
        });
      }
    );
    this.prikazivanje = 2;
  }
  zakaziPrekosutra() {
    this.vecZakazano = 0;
    this.niz = [];
    this.rasporediPom = [];

    this.komentari = [];
    this.rasporedi = [];
    this.zakazano = [];

    let danas1 = new Date();
    let danas = new Date();
    danas.setSeconds(danas1.getSeconds() + 2 * 24 * 60 * 60);


    for (let i = 8; i < 20; i++) {
      this.niz.push(i);
      this.zakazano.push(0);
      this.komentari.push("");
      console.log(danas.getFullYear() + "-" + danas.getMonth() + "-" + danas.getDate());
      let r: Raspored = { LPIme: this.izabraniLekar.Ime, LPPrezime: this.izabraniLekar.Prezime, Datum: danas.getFullYear() + "-" + danas.getMonth() + "-" + danas.getDate(), Lekar: 0, Pacijent: 0, Vreme: 0, LekarIme: "", PacijentIme: "", Kasnjenje: "" }
      this.rasporedi.push(r);
    }
    let r = this.service.dohvatiRaspored(danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate(), this.izabraniLekar.KorIme);
    r.subscribe(
      data => {

        this.rasporediPom = data;
        this.rasporediPom.forEach(element => {
          for (let i = 8, j = 0; i < 20; i++, j++) {
            if (i == element.Vreme && element.Pacijent != null) {
              this.zakazano[i - 8] = 1;
              this.rasporedi[i - 8] = element;
            }
            else if (i == element.Vreme && element.Pacijent == null) {
              this.komentari[i - 8] = element.Kasnjenje;
            }
            if (element.Pacijent == this.korisnik.Id) {
              this.vecZakazano = 1;
            }
          }
        });
      }
    );


    this.prikazivanje = 3;


  }
  zakaziZaSutra(a: number) {
    this.zakazano[a - 8] = 1;
    this.rasporedi[a - 8].Pacijent = this.korisnik.Id;
    this.vecZakazano = 1;
    let danas1 = new Date();
    let danas = new Date();
    danas.setSeconds(danas1.getSeconds() + 24 * 60 * 60);
    console.log(danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate());
    //danas.setDate(danas1.getDate() + 1);
    let r: Raspored = { Datum: danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate(), LPIme: this.izabraniLekar.Ime, LPPrezime: this.izabraniLekar.Prezime, Lekar: this.izabraniLekar.Id, LekarIme: this.izabraniLekar.KorIme, Pacijent: this.korisnik.Id, PacijentIme: this.korisnik.KorIme, Vreme: a, Kasnjenje: "" };
    this.service.dodajZakazivanje(r);

  }
  zakaziZaPrekoSutra(a: number) {
    this.zakazano[a - 8] = 1;
    this.rasporedi[a - 8].Pacijent = this.korisnik.Id;
    this.vecZakazano = 1;
    let danas1 = new Date();
    let danas = new Date();
    danas.setSeconds(danas1.getSeconds() + 2 * 24 * 60 * 60);
    console.log(danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate() + "Jaasas");

    let r: Raspored = { Datum: danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate(), LPIme: this.izabraniLekar.Ime, LPPrezime: this.izabraniLekar.Prezime, Lekar: this.izabraniLekar.Id, LekarIme: this.izabraniLekar.KorIme, Pacijent: this.korisnik.Id, PacijentIme: this.korisnik.KorIme, Vreme: a, Kasnjenje: "" };
    this.service.dodajZakazivanje(r);

  }


  istorija() {

    this.izabraniLekar = null;

    let a = this.service.dohvatiKartone(this.korisnik.KorIme);
    a.subscribe(
      data => {
        this.pregledi = data;

        this.pregledi.forEach(element => {
          if (element.Hro == 1) {
            this.dojagnozaKarton = element;
          }
        });


        console.log(data);
        let b = this.service.dohvatiHronicno(this.korisnik.KorIme);
        b.subscribe(
          data2 => {
            console.log(JSON.stringify(data2));
            console.log("ovde");


            let pom = data2;
            console.log(data2.Naziv);
            if (JSON.stringify(pom) == `[{"Hronicno":null}]`) {
              this.prikazivanje = 4;
            }
            else {
              this.hronicno = pom[0];
              console.log(this.hronicno.Naziv);

              let r = this.service.dohvatiRecept(this.korisnik.KorIme);
              r.subscribe(
                data3 => {
                  if (JSON.stringify(data3) == '[]') {
                    this.recept = null;
                  }
                  else {
                    let danas = new Date();
                    this.recept2 = data3[0];
                    console.log(this.recept2.Id);
                    console.log(data3[0]);
                    console.log(data3);
                    let dat: string = danas.getFullYear() + "-" + (danas.getMonth() + 1) + "-" + danas.getDate();
                    console.log(data3[0].Vazenje);
                    console.log(dat);
                    console.log(data3[0].Vazenje > dat);
                    if (data3[0].Vazenje > dat) {
                      this.recept = data3[0];
                      console.log(this.recept);
                      if (this.recept.Postalo == 1) {
                        this.poslato = 1;
                        this.recept = null;
                      }
                    }
                    else {
                      if (data3[0].Postalo == 1) {
                        this.poslato = 1;
                      }
                      this.recept = null;
                    }
                  }
                }
              )
              this.prikazivanje = 5;
            }
          }
        );

      }


    );



  }
  // Proveri this.recept i Id
  poruka: string = "";
  zahtevRec() {
    if (this.izabraniLekar == null) {
      this.poruka = "izaberite lekara!";

    }
    else {

      let z: Zahtev = { Bolest: this.hronicno.Naziv, Lekar: this.izabraniLekar.KorIme, Id: 0, Pacijent: this.korisnik.KorIme, Datum: "", IdRec: this.recept2.Id };
      this.service.dodajZahtev(z);
      this.poruka = "Uspesno je poslato!";
      this.poslato = 1;
    }


  }

}
