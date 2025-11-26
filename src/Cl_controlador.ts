//import Cl_mP, { iJurado } from "./Cl_mJurado.js";
import Cl_mJurado, { iJurado } from "./Cl_mJurado.js";
import { iPuntuacion } from "./Cl_mPuntuacion.js";
import mPrincipal from "./mPrincipal.js";
import principal from "./principal.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_controlador {
  public modelo: mPrincipal;
  public vista: principal;
  constructor(modelo:mPrincipal, vista: principal) {
    this.modelo = modelo;
    this.vista = vista;
  }
  addJurado({
    dtJurado,
    callback,
  }: {
    dtJurado: iJurado;
    callback: (error: string | false) => void;
  }): void {
    this.modelo.addJurado({
      dtJurado,
      callback,
    });
  }
  /**editJurado({
    dtJurado,
    callback,
  }: {
    dtJurado: iJurado;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.editJurado({
      dtJurado,
      callback,
    });
  }
  /**deleteJurado({
    codigo,
    callback,
  }: {
    codigo: string;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.deleteJurado({
      codigo,
      callback,
    });
  }**/
  Jurado(codigo: string): Cl_mJurado | null {
    let Jurado = this.modelo.Jurado(codigo);
    if (Jurado) return new Cl_mJurado(Jurado.toJSON());
    else return null;
  }
  get dtJurado(): iJurado[] {
    let dtJurado = this.modelo.dtJurado();
    console.log("🔄 Controlador está retornando estos jurados:", dtJurado);
    dtJurado.sort((a, b) => a.nombre.localeCompare(b.nombre));
    return dtJurado;
  }
/* get dtPuntuacion(): iPuntuacion[] {
    let dtPuntuacion = this.modelo.dtPuntuacion();

    return dtPuntuacion;
  }*/
  activarVista({
    vista,
    opcion,
    objeto,
  }: {
    vista: string;
    opcion?: opcionFicha;
    objeto?: Cl_mJurado;
  }): void {
    this.vista.activarVista({ vista, opcion, objeto });
  }

 /**  agregarPuntuacionRegistrado({
    dtPuntuacion,
    callback,
  }: {
    dtPuntuacion: any;
    callback?: (error?: string | false) => void;
  }): void {
    // Si el modelo implementa addPuntuacion, delegar; si no, responder sin error
    // para no romper la UI minimalmente.
    // @ts-ignore
    if (typeof this.modelo.addPuntuacion === "function") {
      // @ts-ignore
      this.modelo.addPuntuacion({ dtPuntuacion, callback });
    } else {
      if (callback) callback(false);
    }
  }*/
}