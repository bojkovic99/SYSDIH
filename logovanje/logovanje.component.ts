import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MojservisService } from '../mojservis.service';

import { Korisnik } from '../moduli/Korisnik';
import { Medicina } from '../moduli/MedSestre';
import { Pacijent } from '../moduli/Pacijent';

@Component({
  selector: 'app-logovanje',
  templateUrl: './logovanje.component.html',
  styleUrls: ['./logovanje.component.css']
})
export class LogovanjeComponent implements OnInit {

  constructor(private router: Router, private service: MojservisService) { }

  password: string;
  username: string;
  korisnik: Korisnik;
  medicina: Medicina;
  pacijent: Pacijent;


  poruka: string;
  ngOnInit(): void {
    localStorage.clear();
  }


  logovanje() {
    let k = this.service.dohvatKorisnika(this.username, this.password);
    k.subscribe(data => {
      this.korisnik = data[0];
      console.log(this.korisnik);
      if (this.korisnik == null || (JSON.stringify(this.korisnik) == "[]")) {
        this.poruka = "Nisu uneti dobri podaci";
      }
      if (this.korisnik.Prihvacen == 'n') {
        this.poruka = "Vas zahtev jos nije prihvacen!";
      }
      else {
        console.log(this.korisnik.Tip);
        if (this.korisnik.Tip == 'p' && this.korisnik.Prihvacen == 'y') {

          let p = this.service.dohvatiPacijenta(this.username);
          p.subscribe(
            data => {
              this.pacijent = data[0];
              localStorage.setItem("prijavljen", JSON.stringify(this.korisnik));
              this.router.navigate(['/pacijent']);
            }
          );

        }
        else if (this.korisnik.Tip == 'a') {
          this.router.navigate(['/admin']);
          localStorage.setItem("prijavljen", JSON.stringify(this.korisnik));
        }
        else if (this.korisnik.Tip == 'm' && this.korisnik.Prihvacen == 'y') {
          let p = this.service.dohvatiMed(this.username);
          p.subscribe(
            data => {
              this.medicina = data[0];
              localStorage.setItem("prijavljen", JSON.stringify(this.korisnik));
              this.router.navigate(['/medSestra']);
            }
          );



        }
        else if (this.korisnik.Tip == 'l' && this.korisnik.Prihvacen == 'y') {
          let p = this.service.dohvatiMed(this.username);
          p.subscribe(
            data => {
              this.medicina = data[0];
              localStorage.setItem("prijavljen", JSON.stringify(this.korisnik));
              this.router.navigate(['/lekar']);
            }
          );



        }

      }
    });



  }

}
