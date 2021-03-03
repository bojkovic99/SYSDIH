import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Pacijent } from '../moduli/Pacijent';
import { Korisnik } from '../moduli/Korisnik';
import { Medicina } from '../moduli/MedSestre';
import { Router } from '@angular/router';
import { MojservisService } from '../mojservis.service';
import { Oboljenja } from '../moduli/Oboljenja';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', '../registracija/registracija.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router, private service: MojservisService) { }



  niz1: Pacijent[] = [];
  niz3: Korisnik[] = [];
  niz2: Medicina[] = [];

  oboljenja: Oboljenja[] = [];
  pom2: Medicina[] = [];
  pom1: Pacijent[] = [];

  ngOnInit(): void {

    if (localStorage.getItem('prijavljen') == null) {
      alert("Morate biti prijavljeni kao admin!"); this.router.navigate(['/logovanje']);
    }
    else {

      let kor = JSON.parse(localStorage.getItem('prijavljen'));
      if (kor.Tip != 'a') { alert("Morate biti prijavljeni kao admin!"); this.router.navigate(['/logovanje']); }
      else {
        let k = this.service.dohvatiZahteveM();
        k.subscribe(data => {
          this.pom2 = data;
          this.niz2 = [];
          console.log(data);

          let kp = this.service.dohvatiPristigleM();
          kp.subscribe(
            data2 => {
              this.niz2 = data2;
            }
          );
          if (this.niz1 == null) { this.niz1 = [] };

        });


        let k2 = this.service.dohvatiZahteveP();
        k2.subscribe(data => {
          this.pom1 = data;
          this.niz1 = [];
          let kp = this.service.dohvatiPristigleP();
          kp.subscribe(
            data2 => {
              this.niz1 = data2;
            }
          );
        });
        if (this.niz2 == null) { this.niz2 = [] };

        let mt = this.service.dohvatiOboljenja();
        mt.subscribe(
          data => {
            console.log(data);
            this.oboljenja = data;
            console.log(this.oboljenja);
          }
        )




      }
    }

  }


  prist: string = '2';
  pristigli() {
    this.msg = "";
    this.poruka = " ";
    this.prist = '2';


  }
  dodaj() {
    this.msg = "";
    this.poruka = " ";
    this.prist = '3';
  }
  registrujPW() {
    this.msg = "";
    this.poruka = " ";
    this.prist = '4';
  }
  registrujKW() {
    this.msg = "";
    this.poruka = " ";
    this.prist = '5';
  }
  kor: Korisnik;


  prihvati(index1: number, tip: number) {



    if (tip == 1) {
      this.pom2.forEach((element, index) => {
        if (index == index1) {

          this.niz2.push(element);




          this.service.prihvatiKorisnika(element.KorIme);
          this.pom2.splice(index, 1);




        }
      });
    }
    else {

      this.pom1.forEach((element, index) => {
        if (index == index1) {


          this.niz1.push(element);


          this.service.prihvatiKorisnika(element.KorIme);
          this.pom1.splice(index, 1);
        }
      });
    }



  }

  odbaci1(kori: Pacijent) {


    this.niz1.forEach((element, index) => {
      if (element.Id == kori.Id) {
        this.niz1.splice(index, 1);
      }
    });

    this.pom1.forEach((element, index) => {
      if (element.Id == kori.Id) {
        this.pom1.splice(index, 1);
      }
    });

    this.service.obrisiPacijenta(kori.KorIme);



  }
  odbaci2(kori: Medicina) {




    console.log(kori);

    this.niz2.forEach((element, index) => {
      if (element == kori) {
        this.niz2.splice(index, 1);
      }
    });

    this.pom2.forEach((element, index) => {
      if (element == kori) {
        this.pom2.splice(index, 1);
      }

    });
    this.service.obrisiMed(kori.KorIme);


  }




  azuriraj1(pr: Pacijent) {
    var isoDate = pr.DatumRodjenja;
    var mySQLDateString = JSON.stringify(isoDate).slice(1, 20).replace('T', ' ');
    var mySQLDateStringD = mySQLDateString as unknown as Date;
    pr.DatumRodjenja = mySQLDateStringD;
    this.service.azurirajPacijenta(pr);

    var isoDate = pr.DatumRodjenja;
    var mySQLDateString = JSON.stringify(isoDate).slice(1, 11).replace('T', ' ');
    var mySQLDateStringD = mySQLDateString as unknown as Date;
    pr.DatumRodjenja = mySQLDateStringD;

    alert("Uspesno ažurirano!");

  }
  azuriraj2(pr: Medicina) {


    this.service.azurirajMed(pr);


    alert("Uspesno ažurirano!");
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

  ppunoime: string;
  pusername: string;
  psifra1: string;
  psifra2: string;
  pmail: string;
  pdatum: Date;
  pmesto: string;
  msg: string = " ";

  poruka: string;

  niz: string[] = [];



  registracija: boolean;
  ko: Promise<Korisnik>;
  kori: Korisnik;




}
