import Cl_mPuntuacion from "./Cl_mPuntuacion.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vPuntuacion extends Cl_vGeneral {
    constructor() {
        // La sección se llama "puntuacion" en el HTML; usar el mismo id
        super({ formName: "puntuacion" });
        // los elementos internos también usan el prefijo en minúscula 'puntuacion_...'
        this.formName = "puntuacion";
        this.opcion = null;
        this.Puntuacion = new Cl_mPuntuacion({
            id: 0,
            creadoEl: new Date().toISOString(),
            alias: "",
            Jurado: "",
            equipo: "",
            puntuacionMax: 0,
            observacion: "",
        });
        this.inJurado = this.crearHTMLInputElement("inJurado", {
            oninput: () => {
                this.inJurado.value = this.Puntuacion.Jurado = this.inJurado.value
                    .toUpperCase()
                    .trim();
                this.refresh();
            },
            refresh: () => (this.inJurado.style.borderColor = this.Puntuacion.JuradoOk ? "" : "red"),
        });
        this.inJurado.disabled = this.opcion === opcionFicha.edit;
        this.inEquipo = this.crearHTMLElement("inEquipo", {
            type: tHTMLElement.SELECT,
            onchange: () => {
                this.Puntuacion.equipo = this.inEquipo.value
                    .trim()
                    .toUpperCase();
                this.refresh();
            },
            refresh: () => (this.inEquipo.style.borderColor = this.Puntuacion.equipo ? "" : "red"),
        });
        this.inPuntuacionMax = this.crearHTMLInputElement("inPuntuacionMax", {
            oninput: () => {
                const valor = this.inPuntuacionMax.valueAsNumber;
                this.Puntuacion.puntuacionMax = isNaN(valor) ? 0 : valor;
                this.inPuntuacionMax.valueAsNumber = this.Puntuacion.puntuacionMax;
                this.refresh();
            },
            refresh: () => (this.inPuntuacionMax.style.borderColor = this.Puntuacion.PuntuacionMaxOk ? "" : "red"),
        });
        this.inPuntuacionMax.disabled = this.opcion === opcionFicha.edit;
        this.inObservacion = this.crearHTMLInputElement("inObservacion", {
            oninput: () => {
                this.inObservacion.value = this.Puntuacion.observacion = this.inObservacion.value;
                this.refresh();
            },
            refresh: () => (this.inObservacion.style.borderColor = this.Puntuacion.observacion ? "" : "red"),
        });
        this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
            onclick: () => this.AgregarPuntuacion(),
            refresh: () => {
                this.btAgregar.disabled = this.Puntuacion.PuntuacionOk !== true;
            },
        });
        this.btCancelar = this.crearHTMLButtonElement("btVolver", {
            onclick: () => this.controlador.activarVista({ vista: "principal" }),
        });
        this.tablaValoraciones = this.crearHTMLElement("tablaValoraciones", {
            type: tHTMLElement.CONTAINER,
            refresh: () => this.mostrarTablaValoraciones(),
        });
    }
    addPuntuacion() {
        var _a;
        // Si el botón tiene addJurado, el flujo correcto debe ser primero agregar y luego limpiar/refrescar.
        // Asumiendo que addJurado es solo para iniciar el modo ADD (como en el repositorio de referencia):
        (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.activarVista({
            vista: "puntuacion",
            opcion: opcionFicha.add,
        });
    }
    AgregarPuntuacion() {
        console.log("🎯 VISTA - Iniciando agregar puntuación...");
        console.log("🎯 VISTA - Opción actual:", this.opcion);
        if (this.opcion === opcionFicha.add) {
            console.log("✅ VISTA - Validaciones pasadas, agregando puntuación...");
            const puntuacionesActuales = this.controlador.dtPuntuacion;
            if (!Cl_mPuntuacion.puedePuntuarJuradoEquipo(this.Puntuacion.Jurado, this.Puntuacion.equipo, puntuacionesActuales)) {
                alert(Cl_mPuntuacion.obtenerErrorJuradoYaPuntuo(this.Puntuacion.Jurado, this.Puntuacion.equipo));
                return;
            }
            this.controlador.addPuntuacion({
                dtPuntuacion: this.Puntuacion.toJSON(),
                callback: (error) => {
                    if (!error) {
                        console.log("✅ VISTA - Puntuación agregada exitosamente");
                        // Limpiar inputs después de guardar
                        this.Puntuacion.Jurado = this.inJurado.value = "";
                        this.Puntuacion.equipo = this.inEquipo.value = "";
                        this.Puntuacion.puntuacionMax = this.inPuntuacionMax.valueAsNumber;
                        this.Puntuacion.observacion = this.inObservacion.value = "";
                        this.refresh();
                    }
                    else {
                        console.log("❌ VISTA - Error al agregar puntuación:", error);
                        alert(`Error: ${error}`);
                    }
                },
            });
        }
        else {
            console.log("⚠️ VISTA - Opción no es 'add', es:", this.opcion);
        }
    }
    /**
     * ✅ Muestra la tabla de valoraciones con todas las puntuaciones registradas
     */
    mostrarTablaValoraciones() {
        var _a;
        this.tablaValoraciones.innerHTML = "";
        const puntuaciones = ((_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtPuntuacion) || [];
        console.log("📋 VISTA - Mostrando tabla de valoraciones:", puntuaciones.length, "puntuaciones");
        if (puntuaciones.length === 0) {
            this.tablaValoraciones.innerHTML = `
      <tr>
        <td colspan="3" style="text-align: center; color: #666; padding: 20px;">No hay valoraciones registradas</td>
      </tr>
    `;
            return;
        }
        // Agregar filas para cada puntuación
        puntuaciones.forEach((puntuacion) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
      <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; border-right: 1px solid #dee2e6; text-align: left; color: #333; background-color: #ffffff;">${puntuacion.Jurado}</td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; border-right: 1px solid #dee2e6; text-align: left; color: #333; background-color: #ffffff;">${puntuacion.equipo}</td>
      <td style="padding: 12px 15px; border-bottom: 1px solid #dee2e6; border-right: 1px solid #dee2e6; text-align: left; color: #333; background-color: #ffffff;">${puntuacion.puntuacionMax}</td>
    `;
            this.tablaValoraciones.appendChild(fila);
        });
        console.log("✅ VISTA - Tabla de valoraciones actualizada con", puntuaciones.length, "puntuaciones");
    }
    show({ ver = false, Puntuacion = new Cl_mPuntuacion({
        id: 0,
        creadoEl: new Date().toISOString(),
        alias: "",
        Jurado: "",
        equipo: "",
        puntuacionMax: 0,
        observacion: "",
    }), opcion, } = {
        ver: false,
        Puntuacion: new Cl_mPuntuacion({
            id: 0,
            creadoEl: new Date().toISOString(),
            alias: "",
            Jurado: "",
            equipo: "",
            puntuacionMax: 0,
            observacion: "",
        }),
    }) {
        super.show({ ver });
        if (opcion) {
            this.opcion = opcion;
            this.Puntuacion.puntuacionMax = this.inPuntuacionMax.valueAsNumber = Puntuacion.puntuacionMax;
            this.Puntuacion.equipo = this.inEquipo.value = Puntuacion.equipo;
            this.refresh();
        }
        // ✅ ACTUALIZAR TABLA: Siempre actualizar la tabla cuando se muestre la vista
        if (ver) {
            this.mostrarTablaValoraciones();
        }
    }
}
