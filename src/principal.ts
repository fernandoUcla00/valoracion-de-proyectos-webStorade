import Cl_controlador from "./Cl_controlador.js";
import Cl_mJurado from "./Cl_mJurado.js";
import Cl_vJurado from "./Cl_vJurado.js";
import Cl_vPuntuacion from "./Cl_vPuntuacion.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class principal extends Cl_vGeneral {
  private vPuntuacion: Cl_vPuntuacion;
  private vJurado: Cl_vJurado;
 // private btPuntuacion: HTMLButtonElement;
  private btJurado: HTMLButtonElement;
  private btPuntuacion: HTMLButtonElement;
  constructor() {
    super({ formName: "principal" });
    this.vPuntuacion = new Cl_vPuntuacion();
    this.vPuntuacion.show({ ver: false });
    this.vJurado = new Cl_vJurado();
    this.vJurado.show({ ver: false });
   
    this.btJurado = this.crearHTMLButtonElement("btJurado", {
      onclick: () => this.controlador!.activarVista({ vista: "jurado" }),
    });
   
    this.btPuntuacion = this.crearHTMLButtonElement("btPuntuacion", {
      onclick:() => this.controlador!.activarVista({ vista: "puntuacion", opcion: opcionFicha.add }),
    });
    
  }
  set controlador(controlador: Cl_controlador) {
    super.controlador = controlador;
    this.vPuntuacion.controlador = controlador;
    this.vJurado.controlador = controlador;
  }
  get controlador(): Cl_controlador | null {
    return super.controlador;
  }
  activarVista({
    vista,
    opcion,
    objeto,
  }: {
    vista: string;
    opcion?: opcionFicha;
    objeto?: Cl_mJurado;
  }): void {
    this.show({ ver: vista === "principal", });
    this.vJurado.show({ ver: vista === "jurado", Jurado: objeto, opcion });
    this.vPuntuacion.show({ ver: vista === "puntuacion",opcion });
    
  }
}
