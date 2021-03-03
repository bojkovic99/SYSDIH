import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MojservisService } from '../mojservis.service';
import { Zahtev } from '../moduli/Zahtev';
import { Korisnik } from '../moduli/Korisnik';
import { Pacijent } from '../moduli/Pacijent';
import { Karton } from '../moduli/Karton';
import { Raspored } from '../moduli/Raspored';
import { AdminComponent } from '../admin/admin.component';


export interface Pomocno extends Zahtev {
  Ime: string;
  prezime: string;
}
export interface Pomocno2 extends Raspored {
  Ime: string;
  prezime: string;
}

@Component({
  selector: 'app-lekar',
  templateUrl: './lekar.component.html',
  styleUrls: ['./lekar.component.css', '../registracija/registracija.component.css']
})
export class LekarComponent implements OnInit {

  constructor(private router: Router, private service: MojservisService) { }

  korisnik: Korisnik;
  prikazivanje: number = 0;
  prikaz2: number = 0;
  pomocno: Pomocno[] = [];
  kartoni: Karton[] = [];
  pacijenti: Pomocno2[] = [];
  kartoni2: Karton[] = [];
  izabraniPacijent: Pacijent;
  izabraniKaron: Karton;

  ngOnInit(): void {

    if (localStorage.getItem('prijavljen') == null) {
      alert("Morate biti prijavljeni kao lekar!"); this.router.navigate(['/logovanje']);
    }
    else {

      this.korisnik = JSON.parse(localStorage.getItem('prijavljen'));
      if (this.korisnik.Tip != 'l') { alert("Morate biti prijavljeni kao lekar!"); this.router.navigate(['/logovanje']); }
      else {

        let z = this.service.dohvatiZahteve(this.korisnik.KorIme);
        z.subscribe(
          data => {
            console.log(data[0]);
            this.pomocno = data;
            console.log(this.pomocno);

            let novi: Date = new Date();
            let danas: string = novi.getFullYear() + "-" + (novi.getMonth() + 1) + "-" + novi.getDate();
            let kl = this.service.dohvatiPacijenteDanas(this.korisnik.KorIme, danas);
            kl.subscribe(data => {
              console.log(data);
              this.pacijenti = data;
            })

          }
        )

      }

    }

  }
  dojagnozaKarton: Karton;
  prikaziK(a: Pomocno) {

    let b = this.service.dohvatiKartone(a.Pacijent);
    b.subscribe(
      data => {
        this.kartoni = data;
        this.kartoni.forEach(element => {
          if (element.Hro == 1) {
            this.dojagnozaKarton = element;
          }
        });
        this.prikaz2 = 1;
      }
    )
  }
  prikaziKarto(a: Pomocno2) {


    let b = this.service.dohvatiKartone(a.PacijentIme);
    console.log("Pac ime" + a.PacijentIme);
    b.subscribe(
      data => {
        console.log(data);
        console.log(data[0]);
        this.izabraniKaron = { Link: "", Lek: "", Id: 0, Hro: 0, Dijagnoza: "", Datum: "", IdKartona: data[0].IdKartona, Pacijent: data[0].Pacijent };
        console.log(this.izabraniKaron);
        this.kartoni2 = data;
        console.log(this.kartoni2);
        this.kartoni2.forEach(element => {
          if (element.Hro == 1) {
            this.dojagnozaKarton = element;

          }
        });
        this.prikaz2 = 2;
      }
    )
  }

  prihvati(a: Pomocno) {

    let danas = new Date();

    let novi = new Date();

    for (let i = 0; i < 30; i++) {
      novi.setSeconds(novi.getSeconds() + 24 * 60 * 60);


    }
    console.log(novi);

    let z: Zahtev = { Id: a.Id, Lekar: this.korisnik.KorIme, Pacijent: a.Pacijent, Datum: novi.getFullYear() + "-" + (novi.getMonth() + 1) + "-" + novi.getDate(), Bolest: a.Bolest, IdRec: a.IdRec }

    this.service.prihvatiZahtev(z);
    this.pomocno.forEach((element, index) => {
      if (element.Id == a.Id) {
        this.pomocno.splice(index, 1);
      }
    });
  }
  odbaci(a: Pomocno) {

    let danas = new Date();

    let novi = new Date();

    for (let i = 0; i < 31; i++) {
      novi.setSeconds(novi.getSeconds() - 24 * 60 * 60);

    }

    let z: Zahtev = { Id: a.Id, Lekar: this.korisnik.KorIme, Pacijent: a.Pacijent, Datum: novi.getFullYear() + "-" + (novi.getMonth() + 1) + "-" + novi.getDate(), Bolest: a.Bolest, IdRec: a.IdRec }


    this.service.prihvatiZahtev(z);
    this.pomocno.forEach((element, index) => {
      if (element.Id == a.Id) {
        this.pomocno.splice(index, 1);
      }
    });

  }

  dijag: string = "";
  hr: number;
  lek: string = "";
  link: string = "";
  msg: string = "";
  prikaz3: number = 1;


  dodajDi() {
    this.msg = "";
    let a = this.izabraniKaron;
    if (this.lek == "" || this.dijag == "") {
      this.msg = "Niste uneli sva polja!";
      return false;
    }
    let novi: Date = new Date();
    let danas: string = novi.getFullYear() + "-" + (novi.getMonth() + 1) + "-" + novi.getDate();
    let ka: Karton = { Datum: danas, Dijagnoza: this.dijag, Hro: null, Id: 0, IdKartona: a.IdKartona, Lek: this.lek, Link: this.link, Pacijent: a.Pacijent };
    this.service.dodajDijagnozu(ka);
    this.kartoni2.push(ka);
    this.prikaz3 = 0;
    this.dijag = "";
    this.lek = "";
    this.msg = "";
    this.link = "";

  }

  odustani() {
    this.dijag = "";
    this.lek = "";
    this.msg = "";
    this.link = "";
    this.prikaz3 = 0;

  }

}
