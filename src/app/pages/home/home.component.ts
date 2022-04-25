import { Component, OnInit, Input } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Recruiting_api } from '../services/recruiting-api.service'


import { Observable, tap } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  coin: any = [];
  vacio!: boolean;
  auxEscala: any  = [];
  Origen!: string;
  Destino!: string;
  Journey: any;

  handleSearch(value: string) {
    //Valor que se escribe en el input
    this.Origen = value;
  }
  handleSearch2(value: string) {
    //Valor que se escribe en el input
    this.Destino = value;
  }

  API_REST : any = [];

  userLogged = this.authSvc.getUserLogged();

  constructor(
    private readonly authSvc: AuthService,
    private readonly router: Router,
    private readonly API: Recruiting_api,
  ) { }

  ngOnInit() {
    this.vacio = false;
    this.API.getInfoAPI().subscribe(
      res => {
        this.API_REST = res; //Guardo la informacion pedida a la API-REST
        // console.log(this.API_REST);
      },
      err => console.log(err)
    );
  }

  private redirectUser(): void {
    // this.router.navigate(['/dashboard']);
  }

  IngresarConGoogle() { //Inicia sesion con una cuenta de google
    this.authSvc.loginWithGoogle().then(user => {
  }
  )}

  async onLogout():Promise<void> {
    this.authSvc.logout();
  }

  buscarRuta() {
    this.coin = [];
    this.auxEscala.splice(0, this.auxEscala.length);
    let lengthAPI = this.API_REST.length; //Numero de datos que tenemos de la API-REST
    if (this.Origen.toUpperCase() === this.Destino.toUpperCase()) {
      console.log('Introduzca una ciudad de Destino diferente a la de Origen');
    } else {
        this.busqueda()
    }
    // console.log(this.auxEscala, 'estamos en la otra funcion')
    // console.log(this.Origen, this.Destino);
    return this.auxEscala, this.vacio;
  }

    async busqueda() {
    let jSONauxAPI : any = [];
    let escalaorigendepartureStation: any;
    let escaladestinodepartureStation: any;
    let respuesta;
    let pushEscala3: number;

    do {
      jSONauxAPI.push( this.API_REST.filter( (res: { departureStation: string; }) => res.departureStation === this.Origen.toUpperCase() ) );
      jSONauxAPI.push( this.API_REST.filter( (res: { arrivalStation: string; }) => res.arrivalStation === this.Destino.toUpperCase() ) );
      jSONauxAPI[0].forEach( (origen: { arrivalStation: string , departureStation: string; }) => {
        jSONauxAPI[1].every( (destino: { arrivalStation: string , departureStation: string; }) => {
          if (origen.departureStation === this.Origen.toUpperCase() && origen.arrivalStation === this.Destino.toUpperCase()) {
            console.log('respuesta 1 escala');
            //Muestra un array con el vuelo directo al destino que necesita
            this.auxEscala.push( origen );
            respuesta = 1;
            pushEscala3 = 1;
          }
          if (destino.departureStation === origen.arrivalStation && pushEscala3 !==1) {
            console.log('respuesta 2 escalas');
            //Muestra en un array adicional el vuelo que se debe escoger para hacer escala
            this.auxEscala.push( origen );
            this.auxEscala.push( destino );
            respuesta = 1;
            pushEscala3 = 1;
          }
          if (pushEscala3 !== 1) {
            //Agrego todos los vuelos que salen de los destinos de la ciudad de origen que ingresa el usuario
            jSONauxAPI.push( this.API_REST.filter( (res: { departureStation: string; }) => res.departureStation === origen.arrivalStation ) );
          }
        } );
      } );
      if (respuesta !== 1) {
        let longitud = jSONauxAPI.length;
        // console.log(longitud, 'Longitud del jSONauxAPI');
        jSONauxAPI[1].forEach( (escaladestino: { departureStation: string, arrivalStation: string }) => { //Aca estan todos los vuelos que llegan al destino requerido
          for (let i = 2; i < jSONauxAPI.length; i++) {
            jSONauxAPI[i].forEach( (escalaorigen: { arrivalStation: string, departureStation: string; }) => { //Aca estan todos los vuelos que podrian ser una escala hacia el destino
              if (escalaorigen.arrivalStation === escaladestino.departureStation) { //Si la ruta destino que va desde las posibles escalas es igual al origen del vuelo que llega hasta la ciudad requerida
                this.auxEscala.push(escalaorigen);
                escalaorigendepartureStation = escalaorigen.departureStation;
                escaladestinodepartureStation = escaladestino.departureStation;
                respuesta = 1;
                this.auxEscala.unshift(jSONauxAPI[0].find( (element: { arrivalStation: any; }) => element.arrivalStation === escalaorigendepartureStation));
                this.auxEscala.push(jSONauxAPI[1].find( (element: { departureStation: any; }) => element.departureStation === escaladestinodepartureStation));
                // console.log(escalaorigen.departureStation, escaladestino.departureStation, 'Escala 3 respuesta')
              }
            });
          }
        });
      }
      if (respuesta !== 1) {
        console.log('No hay un ruta que lo lleve a su destino');
        respuesta = 1;
      }
      this.vacio = true;
    } while (respuesta!=1);
    // console.log(auxEscala, 'Respuesta')
    return this.auxEscala, this.vacio //VACIO ES PARA RENDERIZAR EL NG TEMPLATE;
  }

  totalCoin() {
    this.coin = [];
    let pricecoin = 0;
    for (let i = 0; i < this.auxEscala.length; i++) {
      this.coin.push(this.auxEscala[i].price);
    }
    this.coin = JSON.stringify(this.coin);
    let data = JSON.parse(this.coin);
    // //Recorriendo el objeto
    for(let i = 0; i < this.auxEscala.length; i++){
      pricecoin += data[i];//Ahora que es un objeto javascript, tiene propiedades
    }
    // console.log(pricecoin, this.coin)
    this.coin = pricecoin;
    // console.log('las edades suman: ' + suma);
    return this.coin;
  }

  coinGBP() {
    this.coin = this.totalCoin() * 0.78;
  }
  coinEUR() {
    this.coin = this.totalCoin() * 0.93;
  }

}


    // this.Origen = '';
    // this.Destino = '';
    // let Journey : any = {
      //   flight: [],
      //   origen: '',
      //   destino: '',
      //   price: 0,
      // };
      // let Flight : any = {
      //   transport: [],
      //   origen: '',
      //   destino: '',
      //   price: 0,
      // };
      // let Transport : any = {
      //   flightCarrier: '',
      //   flightNumber: ''
      // }
