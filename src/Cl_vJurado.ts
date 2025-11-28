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
      refresh: () => this.mostrarJurado(),
    }) as HTMLTableSectionElement;
  }

  addJurado() {
    this.controlador?.activarVista({
      vista: "jurado",
      opcion: opcionFicha.add,
    });
  }

  Agregar() {
    // CORRECCIÓN: Cambiar la condición para que funcione directamente
    if (this.opcion === opcionFicha.add || this.opcion === null) {
      console.log("Intentando agregar jurado:", this.jurado.toJSON());
      
      this.controlador!.addJurado({
        dtJurado: this.jurado.toJSON(),
        callback: (error: string | boolean) => {
          if (!error){ 
            console.log("Jurado agregado exitosamente");
            
            // Limpiar inputs después de guardar
            this.jurado.nombre = this.inNombre.value = ""; 
            this.jurado.categoria = this.inCategoria.value = "";
            
            // ACTUALIZAR LA TABLA - Esto faltaba
            this.mostrarJurado();
        }
          else {
            console.error("Error al agregar jurado:", error);
            alert(`Error: ${error}`);
          }
        },
      });
    } 
    // else no hacer nada en modo editar por ahora
  }
  deleteJurado(nombre: string) {
    console.log("🗑️ Intentando eliminar jurado:", nombre);
    
    // VALIDACIÓN: Verificar que el nombre no esté vacío
    if (!nombre || nombre.trim() === "") {
      console.error("❌ Error: Nombre del jurado está vacío");
      alert("Error: Nombre del jurado está vacío. Recarga la página e inténtalo de nuevo.");
      return;
    }
    
    console.log("✅ Nombre válido, mostrando confirmación...");
    
    // Confirmación antes de eliminar
    if (confirm(`¿Está seguro de eliminar el jurado "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      console.log("👤 Usuario confirmó eliminación del jurado:", nombre);
      
      this.controlador?.deleteJurado({
        nombre: nombre.trim(), // Asegurar que esté trim
        callback: (error) => {
          if (error) {
            console.error("❌ Error al eliminar jurado:", error);
            alert(`❌ No se pudo eliminar el jurado "${nombre}".\n\nError: ${error}`);
          } else {
            console.log("✅ Jurado eliminado exitosamente:", nombre);
            alert(`✅ Jurado "${nombre}" eliminado exitosamente.`);
            // Actualizar la tabla después de eliminar
            this.mostrarJurado();
          }
        },
      });
    } else {
      console.log("🚫 Usuario canceló eliminación del jurado:", nombre);
    }
  }
  editarJurado(nombre: string) {
    let jurado = this.controlador?.Jurado(nombre);
    if (jurado)
      this.controlador?.activarVista({
        vista: "jurado",
        opcion: opcionFicha.edit,
        objeto: jurado,
      });
  }


  /*mostrarJurado() {
    this.divJurado.innerHTML = "";
    let Jurado = this.controlador?.dtJurado; 
    console.log("Vista recibe jurados:", Jurado); // CORREGIDO: Agregar Jurado
    
    if (!Jurado || Jurado.length === 0) {
      this.divJurado.innerHTML = '<tr><td colspan="3">No hay jurados registrados</td></tr>';
      return;
    }
    
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

   Jurado.forEach((Jurado: iJurado, index) => {
      this.crearHTMLButtonElement(`btEditar_${index}`, {
        onclick: () => this.editarJurado(Jurado.nombre),
      });
      this.crearHTMLButtonElement(`btEliminar_${index}`, {
        onclick: () => this.deleteJurado(Jurado.nombre),
      });
    });
}
    */
   mostrarJurado() {
    this.divJurado.innerHTML = "";
    let Jurado = this.controlador?.dtJurado; 
    console.log("📋 Vista recibe jurados:", Jurado);
    
    if (!Jurado || Jurado.length === 0) {
      this.divJurado.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #666;">No hay jurados registrados</td></tr>';
      return;
    }
    
    // ✅ CORRECCIÓN: Crear botones CONECTADOS
    Jurado.forEach((jurado: iJurado, index: number) => {
      console.log(`🔗 Procesando jurado ${index}:`, jurado);
      
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${jurado.nombre}</td>
        <td>${jurado.categoria}</td>
        <td>
          <button id="Jurado_btEditar_${index}" style="margin-right: 5px;">Editar</button>
          <button id="Jurado_btEliminar_${index}" style="background: #ff4444; color: white; border: none; padding: 4px 8px;">X</button>
        </td>
      `;
      
      // 🔗 CONECTAR EL BOTÓN DE ELIMINAR - CRÍTICO
      const btnEliminar = fila.querySelector(`#Jurado_btEliminar_${index}`) as HTMLButtonElement;
      btnEliminar.addEventListener('click', () => {
        console.log("🖱️ Click en eliminar para:", jurado.nombre);
        this.deleteJurado(jurado.nombre);
      });
      
      // 🔗 CONECTAR EL BOTÓN DE EDITAR
      const btnEditar = fila.querySelector(`#Jurado_btEditar_${index}`) as HTMLButtonElement;
      btnEditar.addEventListener('click', () => {
        alert(`Funcionalidad de editar "${jurado.nombre}" aún no implementada`);
      });
      
      this.divJurado.appendChild(fila);
    });
    
    console.log(`✅ Tabla actualizada con ${Jurado.length} jurados`);
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
    
    // IMPORTANTE: Actualizar la tabla cada vez que se muestra la vista
    if (ver) {
      this.mostrarJurado();
    }
  }
}


