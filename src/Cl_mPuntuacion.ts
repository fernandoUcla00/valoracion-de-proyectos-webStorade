import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";

export interface iPuntuacion {
  id: number | null;
  creadoEl: string | null;
  alias: string | null;
  Jurado: string;
  equipo: string;
  puntuacionMax: number;
  observacion: string;

}

export default class Cl_mPuntuacion extends Cl_mTablaWeb {
    private _Jurado: string = "";
    private _equipo: string = "";
    private _puntuacionMax: number = 0;
    private _observacion: string = "";

  constructor({ id, creadoEl, alias,  Jurado, equipo, puntuacionMax, observacion}: iPuntuacion) {
    super({ id, creadoEl, alias });
    this.Jurado = Jurado;
    this.equipo = equipo;
    this.puntuacionMax = puntuacionMax;
    this.observacion = observacion;
  }
  set observacion(observacion: string) {
    this._observacion = observacion;
  }
    get observacion(): string {
    return this._observacion;
  }
  set equipo(equipo: string) {
    this._equipo = equipo;
  }
  get equipo(): string {
    return this._equipo;
  }
  set Jurado(Jurado: string) {
    this._Jurado = Jurado;
  }
  get Jurado(): string {
    return this._Jurado;
  }
  set puntuacionMax(puntuacionMax: number) {
    this._puntuacionMax = puntuacionMax;
  }
    get puntuacionMax(): number {
    return this._puntuacionMax;
  }

  get JuradoOk(): boolean {
    return this.Jurado.length > 5;
  }
  get PuntuacionOk(): boolean {
  return this.equipo.length > 0 && this.JuradoOk && this.PuntuacionMaxOk;
}
get PuntuacionMaxOk(): boolean {
  return this.puntuacionMax >= 0 && this.puntuacionMax <= 100;
}
 static determinarPesoJurado(categoria: string): number {
    const categoriaLower = categoria.toLowerCase();
    if (categoriaLower.includes('maestro')) {
      return 20;
    } else if (categoriaLower.includes('autoridad') || categoriaLower.includes('docente')) {
      return 5;
    } else {
      // Invitado, etc.
      return 1;
    }
  }
  calcularPromedio(): number {
    // Lógica para calcular el promedio
    return 0; // Valor de ejemplo
  }
  
  pocicionEnClasificacion(): number {
    // Lógica para determinar la posición en la clasificación
    return 0; // Valor de ejemplo
  }
  
  toJSON(): iPuntuacion {
    // unir los datos de la clase base con los de la clase derivada, usando super.toJSON()
    return {
      ...super.toJSON(),
      Jurado: this._Jurado,
      equipo: this._equipo,
      puntuacionMax: this._puntuacionMax,
      observacion: this._observacion,

     
    };
  }
}