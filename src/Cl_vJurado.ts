import Cl_mJurado, { iJurado } from "./Cl_mJurado.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_vJurado extends Cl_vGeneral {
  private inNombre: HTMLInputElement;
  private inCategoria: HTMLSelectElement;
  private btAgregar: HTMLButtonElement;
  private btCancelar: HTMLButtonElement;
  private lblOpcion: HTMLLabelElement;
  private opcion: opcionFicha | null;
  private jurado: Cl_mJurado;
  private divJurado: HTMLDivElement;

  constructor() {
    super({ formName: "jurado" });
 
    this.opcion = null;
    this.jurado = new Cl_mJurado({
      id: 0,
      creadoEl: new Date().toISOString(),
      alias: "",
      nombre: "",
      categoria: "",
    });
    this.lblOpcion = this.crearHTMLLabelElement("lblOpcion", {
      refresh: () =>
        (this.lblOpcion.innerHTML =
          this.opcion === opcionFicha.add ? "Agregar " : "Editar "),
    });
    this.inNombre = this.crearHTMLInputElement("inNombre", {
      oninput: () => {
        this.inNombre.value = this.jurado.nombre = this.inNombre.value
          .toUpperCase()
          .trim();
        this.refresh();
      },
      refresh: () =>
        (this.inNombre.style.borderColor = this.jurado.nombreOk ? "" : "red"),
    });
    this.inNombre.disabled = this.opcion === opcionFicha.edit;

    this.inCategoria = this.crearHTMLElement("inCategoria", {
      type: tHTMLElement.SELECT,
      onchange: () => {
        // CORRECCIÓN: Solo asignar al modelo para evitar conflicto con el DOM
        this.jurado.categoria = this.inCategoria.value 
            .trim()
            .toUpperCase();
        this.refresh();
      },
      refresh: () =>
        (this.inCategoria.style.borderColor = this.jurado.juradoOk ? "" : "red"),
    }) as HTMLSelectElement;

    this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
      onclick: () => this.Agregar(),
      refresh: () => {
        this.btAgregar.disabled = this.jurado.juradoOk !== true;
      },
    });
    
    this.btCancelar = this.crearHTMLButtonElement("btVolver", {
      onclick: () => this.controlador!.activarVista({ vista: "principal" }),
    });

    this.divJurado = this.crearHTMLElement("divJurado", {
      type: tHTMLElement.CONTAINER,
      // El refresco del div llama a mostrarJurado
      refresh: () => this.mostrarJurado(),
    }) as HTMLTableSectionElement;
  }

  addJurado() {
    // Si el botón tiene addJurado, el flujo correcto debe ser primero agregar y luego limpiar/refrescar.
    // Asumiendo que addJurado es solo para iniciar el modo ADD (como en el repositorio de referencia):
    this.controlador?.activarVista({
      vista: "jurado",
      opcion: opcionFicha.add,
    });
  }

  Agregar() {
    if (this.opcion === opcionFicha.add)
      this.controlador!.addJurado({
        dtJurado: this.jurado.toJSON(),
        callback: (error: string | boolean) => {
          if (!error){ 
            
            
            // Limpiar inputs después de guardar
            this.jurado.nombre = this.inNombre.value = ""; 
            this.jurado.categoria = this.inCategoria.value = "";
        }
          else alert(`Error: ${error}`);
        },
      });
   /** else {
      // ... (código de edición comentado)
    }*/
  }

  mostrarJurado() {
    this.divJurado.innerHTML = "";
    let Jurado = this.controlador?.dtJurado; 
    console.log(" Vista recibe jurados:",);
    if (!Jurado) return;
    Jurado.forEach(
      (jurado: iJurado, index: number) =>
        (this.divJurado.innerHTML += `<tr>
            <td>${jurado.nombre}</td>
            <td>${jurado.categoria}</td>
            <td>
                <button id="Jurado_btEditar_${index}">Editar</button>
                <button id="Jurado_btEliminar_${index}">X</button>
            </td>
        </tr>`)
    );
}

  show(
    {
      ver = false,
      Jurado = new Cl_mJurado({
        id: 0,
        creadoEl: new Date().toISOString(),
        alias: "",
        nombre: "",
        categoria: "",
      }),
      opcion,
    }: { ver?: boolean; Jurado?: Cl_mJurado; opcion?: opcionFicha } = {
      ver: false,
      Jurado: new Cl_mJurado({
        id: 0,
        creadoEl: new Date().toISOString(),
        alias: "",
        nombre: "",
        categoria: "",
      }),
    }
  ): void {
    super.show({ ver });
    if (opcion) {
      this.opcion = opcion;
      this.jurado.nombre = this.inNombre.value = Jurado!.nombre;
      this.jurado.categoria = this.inCategoria.value = Jurado!.categoria;
      this.refresh();
    }
  }
}