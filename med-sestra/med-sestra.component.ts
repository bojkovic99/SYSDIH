import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MojservisService } from '../mojservis.service';
import { Korisnik } from '../moduli/Korisnik';
import { Pacijent } from '../moduli/Pacijent';
import { Raspored } from '../moduli/Raspored';
import { Medicina } from '../moduli/MedSestre';
import { Pomocno2 } from '../lekar/lekar.component';

@Component({
  selector: 'app-med-sestra',
  templateUrl: './med-sestra.component.html',
  styleUrls: ['./med-sestra.component.css', '../registracija/registracija.component.css']
})
export class MedSestraComponent implements OnInit {

  constructor(private router: Router, private service: MojservisService) { }

  korisnik: Korisnik;
  pacijenti: Pacijent[] = [];
  niz2: Pacijent[] = [];
  lekari: Medicina[] = [];
  pacijenti2: Pomocno2[] = [];

  ngOnInit(): void {

    if (localStorage.getItem('prijavljen') == null) {
      alert("Morate biti prijavljeni kao medicinska sestra!"); this.router.navigate(['/logovanje']);
    }
    else {

      this.korisnik = JSON.parse(localStorage.getItem('prijavljen'));
      if (this.korisnik.Tip != 'm') { alert("Morate biti prijavljeni kao medicinska sestra!"); this.router.navigate(['/logovanje']); }
      else {

        let z = this.service.dohvatiZahteveP();
        z.subscribe(
          data => {
            console.log(data[0]);
            this.pacijenti = data;
            let pomo = this.service.dohvatiPristigleP();
            pomo.subscribe(data => {
              this.niz2 = data;

              let m = this.service.dohvatiPristigleM();
              m.subscribe(
                data3 => {
                  let pomocno = data3;
                  pomocno.forEach(element => {
                    if (element.Tip == 'l') {
                      this.lekari.push(element);
                      console.log(element);
                    }
                  });
                }
              )
            })

          }
        );


      }

    }
  }

  odbaci1(kori: Pacijent) {


    this.pacijenti.forEach((element, index) => {
      if (element == kori) {
        this.pacijenti.splice(index, 1);
      }
    });

    this.niz2.forEach((element, index) => {
      if (element == kori) {
        this.niz2.splice(index, 1);
      }
    });

    this.service.obrisiPacijenta(kori.KorIme);



  }
  prihvati(index1: number) {




    this.pacijenti.forEach((element, index) => {
      if (index == index1) {

        this.niz2.push(element);




        this.service.prihvatiKorisnika(element.KorIme);
        this.pacijenti.splice(index, 1);




      }
    });


  }

  poruka: string = "";
  datum2: Date = new Date();
  datum: Date;
  vr: number;
  razlog: string;
  lekar: Medicina;
  prikazivanje: number = 0;
  izabr: number;
  dodajK() {

    console.log(this.datum2.toString());
    if (this.datum2 == null || this.vr == null || this.razlog == null) {
      this.poruka = "Morate uneti sve vrednosti!";
      return;
    }
    else if (this.vr < 8 || this.vr > 19) {
      this.poruka = "Uneto vreme je van radnog vremena!";
      return;

    }
    else {


      let ubaci = this.datum2.toString();
      ubaci = ubaci.substr(0, 5);
      let str2 = this.datum2.toString();
      str2 = str2.substr(6);
      console.log(str2);
      ubaci = ubaci.concat(str2);
      this.lekar = this.lekari[this.izabr];
      let r: Raspored = { LPIme: "", LPPrezime: "", Lekar: this.lekar.Id, LekarIme: this.lekar.KorIme, PacijentIme: "", Kasnjenje: this.razlog, Pacijent: 0, Vreme: this.vr, Datum: ubaci };
      this.service.dodajZakazivanje(r);
      this.poruka = "Uspesno ste dodali!";
    }

  }

  prikaziKonacno: number = 0;
  izaberi() {
    this.lekar = this.lekari[this.izabr];
    let novi: Date = new Date();
    let danas: string = novi.getFullYear() + "-" + (novi.getMonth() + 1) + "-" + novi.getDate();
    let kl = this.service.dohvatiPacijenteDanas(this.lekar.KorIme, danas);
    kl.subscribe(data => {

      this.pacijenti2 = data;
    });

    this.prikaziKonacno = 1;

  }



}


