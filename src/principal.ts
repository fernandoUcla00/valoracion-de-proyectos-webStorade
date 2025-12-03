import Cl_controlador from "./Cl_controlador.js";
import Cl_mJurado from "./Cl_mJurado.js";
import Cl_vJurado from "./Cl_vJurado.js";
import Cl_vPuntuacion from "./Cl_vPuntuacion.js";
import { iPuntuacion } from "./Cl_mPuntuacion.js";
import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
import { iResultadoReporte } from "./mPrincipal.js"; 

export default class principal extends Cl_vGeneral {
  private vPuntuacion: Cl_vPuntuacion;
  private vJurado: Cl_vJurado;
 // private btPuntuacion: HTMLButtonElement;
  private btJurado: HTMLButtonElement;
  private btPuntuacion: HTMLButtonElement;
  private btReporte: HTMLButtonElement;
  private reporteContainer: HTMLElement | null;
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
    this.btReporte = this.crearHTMLButtonElement("btReporte", {
  onclick: () => this.controlador!.activarVista({ vista: "reporte" }),
});

    this.reporteContainer = document.getElementById('reporte');
    
  }
 private mostrarReporte(resultados: iResultadoReporte[]): void {
    console.log("📊 VISTA - mostrarReporte() llamado con", resultados.length, "resultados");
    
    if (!this.reporteContainer) {
      console.error("❌ No se encontró el contenedor del reporte (id='reporte')");
      return;
    }
    
    // Buscar la tabla existente dentro del tbody
    const tbodyExistente = this.reporteContainer.querySelector('#reporte_tbody');
    
    if (!tbodyExistente) {
      console.error("❌ No se encontró el tbody del reporte");
      return;
    }
    
    // Limpiar contenido existente
    tbodyExistente.innerHTML = "";
    
    if (resultados.length === 0) {
      tbodyExistente.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #666;">No hay datos para mostrar</td></tr>';
      return;
    }
    
    resultados.forEach((r, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td style="padding: 8px; border: 1px solid #ddd;">${r.ranking}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${r.nombre_equipo}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${r.promedio.toFixed(2)}%</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${r.expresionMatematica}<br><small style="color: #666;">${r.expresionPesos}</small></td>
      `;
      tbodyExistente.appendChild(fila);
    });
    
    console.log("✅ VISTA - Reporte generado y mostrado con", resultados.length, "equipos");
  }


  // 🧭 Sobrescribir/Implementar activarVista para manejar la vista 'reporte'
  activarVista({
    vista,
    opcion,
    objeto,
    puntuacion,
    controlador // Recibimos el controlador como argumento para acceder a dtReporte
  }: {
    vista: string;
    opcion?: opcionFicha;
    objeto?: Cl_mJurado;
    puntuacion?: iPuntuacion;
    controlador?: Cl_controlador; // Lo añadimos para asegurar el acceso
  }): void {
    
    // Ocultar todas las vistas
    super.show({ ver: false }); 
    this.vPuntuacion.show({ ver: false });
    this.vJurado.show({ ver: false });
    if (this.reporteContainer) {
        (this.reporteContainer as HTMLElement).style.display = 'none';
    }
    
    switch (vista) {
      case 'principal':
        super.show({ ver: true });
        break;
      case 'jurado':
        this.vJurado.show({ ver: true, Jurado: objeto, opcion });
        break;
      case 'puntuacion':
        this.vPuntuacion.show({ ver: true, Puntuacion: puntuacion, opcion });
        break;
      case 'reporte':
        if (controlador) {
          const resultados = controlador.dtReporte;
          this.mostrarReporte(resultados);
          // Mostrar la sección del reporte
          if (this.reporteContainer) {
            (this.reporteContainer as HTMLElement).style.display = 'block';
          }
        }
        break;
      default:
        console.error(`Vista no reconocida: ${vista}`);
    }
  }


  
  set controlador(controlador: Cl_controlador) {
    super.controlador = controlador;
    this.vPuntuacion.controlador = controlador;
    this.vJurado.controlador = controlador;
  }
  get controlador(): Cl_controlador | null {
    return super.controlador;
  }
  /*activarVista({
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

}*/
}