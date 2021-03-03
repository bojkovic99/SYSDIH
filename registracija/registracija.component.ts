import { Component, OnInit } from '@angular/core';
import { Pacijent } from '../moduli/Pacijent';
import { Medicina } from '../moduli/MedSestre';
import { MojservisService } from '../mojservis.service';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent implements OnInit {

  constructor(private service: MojservisService) { }

  p: Pacijent = { IdKartona: 0, Id: 0, DatumRodjenja: new Date(), Email: "", Ime: "", KorIme: "", Lozinka: "", MestoRodjenja: "", Hronicno: "", Prezime: "", Telefon: 0 };
  m: Medicina = { KorIme: "", Email: "", Lozinka: "", Id: 0, Telefon: "", Tip: "m", Zanimanje: "", Ime: "", Prezime: "" };
  ngOnInit(): void {
  }

  tip: string;

  kime: string;
  kprezime: string;
  kusername: string;
  ksifra1: string;
  ksifra2: string;
  kmesto: string;
  kdatum: Date;
  ktelefon: string;
  kmail: string;
  prikaz: number = 1;
  zanimanje: string;




  msg: string = " ";

  poruka: string;

  k: any;
  niz: string[] = [];



  registracija: boolean;

  reg1() {
    this.ksifra1 = "";
    this.ksifra2 = "";
    this.kprezime = "";
    this.poruka = "";
    this.prikaz = 1;
  }
  reg2() {
    this.ksifra1 = "";
    this.ksifra2 = "";
    this.kprezime = "";
    this.poruka = "";
    this.prikaz = 2

  }
  pred() {
    this.tip = 'p';
  }
  polj() {
    this.tip = 'k';
  }

  registrujP() {
    this.poruka = "";
    this.msg = "";

    if (this.p.DatumRodjenja == null || this.p.Email == "" || this.p.Ime == "" || this.p.KorIme == "" || this.p.Lozinka == "" || this.p.MestoRodjenja == "" || this.p.Prezime == "" || this.ksifra2 == "") {
      this.msg = "Morate uneti sva polja!";
      return;
    }
    else {
      if (this.ksifra2 != this.p.Lozinka) {
        this.msg = "Lozinke se ne poklapaju!";
        return;
      }
      else {
        let a = this.service.pretrazi(this.p.KorIme);
        a.subscribe(data => {
          if (JSON.stringify(data) != "[]") {
            this.msg = "Već postoji korisnik sa datim korisničkim imenom!";
            return;
          }
          else {
            this.service.dodajPacijenta(this.p);
            this.poruka = "Vas zahtev je uspesno poslat!";

          }

        });


      }


    }




  }
  registrujSe() {
    this.poruka = "";
    this.msg = "";
    if (this.m.Email == "" || this.m.Ime == "" || this.m.KorIme == "" || this.m.Lozinka == "" || this.m.Prezime == "" || this.m.Zanimanje == "") {
      this.msg = "Morate uneti sva polja!";
      return;

    }
    else {
      if (this.ksifra2 != this.m.Lozinka) {
        this.msg = "Lozinke se ne poklapaju!";
        return;
      }
      else {
        let a = this.service.pretrazi(this.m.KorIme);
        a.subscribe(data => {
          if (JSON.stringify(data) != "[]") {
            this.msg = "Već postoji korisnik sa datim korisničkim imenom!";
            return;
          }
          else {
            this.service.dodajMed(this.m);
            this.poruka = "Vas zahtev je uspesno poslat!";

          }

        });


      }

    }

  }

}




