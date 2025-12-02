import Cl_vJurado from "./Cl_vJurado.js";
import Cl_vPuntuacion from "./Cl_vPuntuacion.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class principal extends Cl_vGeneral {
    constructor() {
        super({ formName: "principal" });
        this.vPuntuacion = new Cl_vPuntuacion();
        this.vPuntuacion.show({ ver: false });
        this.vJurado = new Cl_vJurado();
        this.vJurado.show({ ver: false });
        this.btJurado = this.crearHTMLButtonElement("btJurado", {
            onclick: () => this.controlador.activarVista({ vista: "jurado" }),
        });
        this.btPuntuacion = this.crearHTMLButtonElement("btPuntuacion", {
            onclick: () => this.controlador.activarVista({ vista: "puntuacion", opcion: opcionFicha.add }),
        });
    }
    set controlador(controlador) {
        super.controlador = controlador;
        this.vPuntuacion.controlador = controlador;
        this.vJurado.controlador = controlador;
    }
    get controlador() {
        return super.controlador;
    }
    activarVista({ vista, opcion, objeto, }) {
        this.show({ ver: vista === "principal", });
        this.vJurado.show({ ver: vista === "jurado", Jurado: objeto, opcion });
        this.vPuntuacion.show({ ver: vista === "puntuacion", opcion });
    }
}
