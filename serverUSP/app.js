const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");

const app = express();







app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());






const datab = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "andjela",
    database: "bazausp",
});
datab.connect((err) => {
    if (err) throw err;
    console.log("Baza je povezana!");
})


const port1 = 3000;
app.listen(port1, () => {
    console.log("Server je startovan na portu " + port1 + " !");
});




app.get("/dohvatiKorisnika/:pi/:ki", (req, res) => {
    let query = datab.query("SELECT * FROM korisnici  WHERE KorIme=? AND Lozinka=?", [req.params.pi, req.params.ki], (err, results) => {
        if (err) throw err;

        res.send(results);




    });
});
app.get("/dohvatiOboljenja", (req, res) => {
    let query = datab.query("SELECT * FROM oboljenja ", (err, results) => {
        if (err) throw err;

        res.send(results);




    });
});
app.get("/dohvatiMed/:pi", (req, res) => {
    let query = datab.query("SELECT * FROM medicina  WHERE KorIme=? ", [req.params.pi], (err, results) => {
        if (err) throw err;

        res.send(results);

        //return results;


    });
});
app.get("/dohvatiPacijenta/:pi", (req, res) => {
    let query = datab.query("SELECT * FROM pacijent  WHERE KorIme=? ", [req.params.pi], (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);

        //return results;


    });
});


app.post("/dodajPacijenta", (req, res) => {
    let query1 = datab.query("INSERT INTO pacijent(KorIme,Lozinka,Ime,Prezime,DatumRodjenja,MestoRodjenja,Telefon,Email) VALUES(?,?,?,?,?,?,?,?)",
        [req.body.KorIme, req.body.Lozinka, req.body.Ime, req.body.Prezime, req.body.DatumRodjenja, req.body.MestoRodjenja, req.body.Telefon, req.body.Email], (err, results) => {
            if (err) throw err;
            let query2 = datab.query("INSERT INTO korisnici(KorIme,Lozinka,Tip) VALUES(?,?,'p')",
                [req.body.KorIme, req.body.Lozinka], (err, results2) => {
                    if (err) throw err;





                });



        });
    let query3 = datab.query("SELECT id FROM pacijent WHERE  KorIme=?",
        [req.body.KorIme], (err, results3) => {
            if (err) throw err;
            console.log(results3[0].id);
            let query4 = datab.query("INSERT INTO karton(IdKartona,Pacijent,Datum,Dijagnoza) VALUES(?,?,?,'')",
                [results3[0].id, req.body.KorIme, req.body.DatumRodjenja], (err, results4) => {
                    if (err) throw err;


                });

            res.send(results3);


        });







});
app.post("/dodajMed", (req, res) => {
    let query1 = datab.query("INSERT INTO medicina(KorIme,Lozinka,Ime,Prezime,Telefon,Email,Tip,Zanimanje) VALUES(?,?,?,?,?,?,?,?)",
        [req.body.KorIme, req.body.Lozinka, req.body.Ime, req.body.Prezime, req.body.Telefon, req.body.Email, req.body.Tip, req.body.Zanimanje], (err, results) => {
            if (err) throw err;
            let query2 = datab.query("INSERT INTO korisnici(KorIme,Lozinka,Tip) VALUES(?,?,?)",
                [req.body.KorIme, req.body.Lozinka, req.body.Tip], (err, results2) => {
                    if (err) throw err;

                    res.send(results2);



                });



        });



});

app.get("/pretrazi/:pi", (req, res) => {
    let query = datab.query("SELECT * FROM korisnici  WHERE KorIme=? ", [req.params.pi], (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);




    });
});
app.get("/dohvatiZahteveP", (req, res) => {
    let query = datab.query("SELECT * FROM korisnici k, pacijent p  WHERE k.KorIme=p.KorIme AND k.Prihvacen='n' ", (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);




    });
});
app.get("/dohvatiZahteveM", (req, res) => {
    let query = datab.query("SELECT * FROM korisnici k, medicina p  WHERE k.KorIme=p.KorIme AND k.Prihvacen='n' ", (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);




    });
});
app.get("/dohvatiRaspored/:a/:lekar", (req, res) => {
    let query = datab.query("SELECT * FROM raspored  WHERE Datum=? AND LekarIme=?", [req.params.a, req.params.lekar], (err, results) => {
        if (err) throw err;

        res.send(results);




    });
});
app.get("/dohvatiPristigleP", (req, res) => {
    let query = datab.query("SELECT * FROM korisnici k, pacijent p  WHERE k.KorIme=p.KorIme AND k.Prihvacen='y' ", (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);




    });
});
app.get("/dohvatiKartone/:id", (req, res) => {
    let query = datab.query("SELECT * FROM karton WHERE Pacijent=? AND Dijagnoza!='' ", [req.params.id], (err, results) => {
        if (err) throw err;

        console.log(results);

        res.send(results);




    });
});
app.get("/dohvatiZahteve/:id", (req, res) => {
    let query = datab.query("SELECT z.*,p.Ime,p.Prezime FROM zahtev z,pacijent p WHERE z.Lekar=? AND p.KorIme=z.Pacijent ", [req.params.id], (err, results) => {
        if (err) throw err;

        res.send(results);




    });
});

app.get("/dohvatiPacijenteDanas/:id/:dat", (req, res) => {
    let query = datab.query("SELECT r.*,p.Ime,p.Prezime FROM raspored r,pacijent p WHERE r.PacijentIme!='' AND r.LekarIme=? AND p.KorIme=r.PacijentIme AND r.Datum=? ", [req.params.id, req.params.dat], (err, results) => {
        if (err) throw err;

        res.send(results);




    });
});

app.put("/prihvatiZahtev", (req, res) => {
    let query = datab.query("UPDATE recept SET Postalo=0 , Vazenje=? WHERE Lekar=? AND Pacijent=? AND Id=?", [req.body.Datum, req.body.Lekar, req.body.Pacijent, req.body.IdRec], (err, results) => {
        if (err) throw err;
        console.log(query);
        let query2 = datab.query("DELETE FROM zahtev WHERE Id=?", [req.body.Id], (err, results2) => {
            if (err) throw err;

            res.send(results2);




        });




    });
});
app.get("/dohvatiHronicno/:id", (req, res) => {
    let query = datab.query("SELECT Hronicno FROM pacijent WHERE KorIme=? ", [req.params.id], (err, results) => {
        if (err) throw err;
        console.log(results);
        console.log(results[0].Hronicno);
        if (results[0].Hronicno != null) {
            let query2 = datab.query("SELECT * FROM oboljenja WHERE Naziv=?", [results[0].Hronicno], (err, results2) => {
                if (err) throw err;
                console.log(results);



                res.send(results2);


            });

        }
        else
            res.send(results);





    });
});
app.get("/dohvatiPristigleM", (req, res) => {
    let query = datab.query("SELECT * FROM korisnici k, medicina p  WHERE k.KorIme=p.KorIme AND k.Prihvacen='y' ", (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);




    });
});
app.get("/dohvatiRecept/:id", (req, res) => {
    let query = datab.query("SELECT * FROM recept WHERE Pacijent=? ", [req.params.id], (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send(results);




    });
});
app.get("/prihvatiKorisnika/:a", (req, res) => {
    let query = datab.query("UPDATE korisnici  SET Prihvacen='y'  WHERE KorIme=? ", [req.params.a], (err, results) => {
        if (err) throw err;

        res.send(results);




    });
});

app.delete("/obrisiPacijenta/:a", (req, res) => {
    let query = datab.query("DELETE FROM pacijent WHERE KorIme=? ", [req.params.a], (err, results) => {
        if (err) throw err;






    });
    let query3 = datab.query("DELETE FROM korisnici WHERE KorIme=? ", [req.params.a], (err, results2) => {
        if (err) throw err;
        let query4 = datab.query("DELETE FROM zahtev WHERE Pacijent=? ", [req.params.a], (err, results4) => {
            if (err) throw err;

            let query5 = datab.query("DELETE FROM recept WHERE Pacijent=? ", [req.params.a], (err, results5) => {
                if (err) throw err;

                res.send(results5);




            });




        });




    });

});
app.delete("/obrisiMed/:a", (req, res) => {
    let query = datab.query("DELETE FROM medicina WHERE KorIme=? ", [req.params.a], (err, results) => {
        if (err) throw err;






    });
    let query3 = datab.query("DELETE FROM korisnici WHERE KorIme=? ", [req.params.a], (err, results2) => {
        if (err) throw err;

        res.send(results2);




    });
});

app.put("/azurirajPacijenta", (req, res) => {

    let query = datab.query("UPDATE pacijent SET Lozinka=?,Ime=?,Prezime=?,DatumRodjenja=?,MestoRodjenja=?,Telefon=?,Email=?,Prihvacen=? WHERE KorIme=? ",
        [req.body.Lozinka, req.body.Ime, req.body.Prezime, req.body.DatumRodjenja, req.body.MestoRodjenja, req.body.Telefon, req.body.Email, req.body.Prihvacen, req.body.KorIme], (err, results) => {
            if (err) throw err;

            res.send(results);
        });
});
app.put("/azurirajMed", (req, res) => {

    let query = datab.query("UPDATE medicina SET Lozinka=?,Ime=?,Prezime=?,Telefon=?,Email=?,Prihvacen=?,Zanimanje=? WHERE KorIme=? ",
        [req.body.Lozinka, req.body.Ime, req.body.Prezime, req.body.Telefon, req.body.Email, req.body.Prihvacen, req.body.Zanimanje, req.body.KorIme], (err, results) => {
            if (err) throw err;

            res.send(results);
        });
});

app.post("/dodajZakazivanje", (req, res) => {

    let query = datab.query("INSERT INTO raspored(Pacijent,Lekar,Datum,Vreme,LekarIme, PacijentIme,Kasnjenje) VALUES(?,?,?,?,?,?,?)  ",
        [req.body.Pacijent, req.body.Lekar, req.body.Datum, req.body.Vreme, req.body.LekarIme, req.body.PacijentIme, req.body.Kasnjenje], (err, results) => {
            if (err) throw err;

            res.send(results);
        });
});
app.post("/dodajDijagnozu", (req, res) => {

    let query = datab.query("INSERT INTO karton(IdKartona,Pacijent,Datum,Dijagnoza, Lek,Link) VALUES(?,?,?,?,?,?)  ",
        [req.body.IdKartona, req.body.Pacijent, req.body.Datum, req.body.Dijagnoza, req.body.Lek, req.body.Link], (err, results) => {
            if (err) throw err;
            console.log("ovde je dosao!");
            console.log(query);
            res.send(results);
        });
});
app.post("/dodajZahtev", (req, res) => {

    let query = datab.query("INSERT INTO zahtev(Pacijent,Lekar,Bolest,IdRec) VALUES(?,?,?,?)  ",
        [req.body.Pacijent, req.body.Lekar, req.body.Bolest, req.body.IdRec], (err, results) => {
            if (err) throw err;
            let query2 = datab.query("UPDATE recept SET Postalo=1 WHERE Id=?  ",
                [req.body.IdRec], (err, results2) => {
                    if (err) throw err;

                    res.send(results2);
                });


        });

});
