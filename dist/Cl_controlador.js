//import Cl_mP, { iJurado } from "./Cl_mJurado.js";
import Cl_mJurado from "./Cl_mJurado.js";
export default class Cl_controlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
    }
    addJurado({ dtJurado, callback, }) {
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
    Jurado(codigo) {
        let Jurado = this.modelo.Jurado(codigo);
        if (Jurado)
            return new Cl_mJurado(Jurado.toJSON());
        else
            return null;
    }
    get dtJurado() {
        let dtJurado = this.modelo.dtJurado();
        console.log("🔄 Controlador está retornando estos jurados:", dtJurado);
        dtJurado.sort((a, b) => a.nombre.localeCompare(b.nombre));
        return dtJurado;
    }
    /* get dtPuntuacion(): iPuntuacion[] {
        let dtPuntuacion = this.modelo.dtPuntuacion();
    
        return dtPuntuacion;
      }*/
    activarVista({ vista, opcion, objeto, }) {
        this.vista.activarVista({ vista, opcion, objeto });
    }
}
