import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mPuntuacion, { iPuntuacion } from "./Cl_mPuntuacion.js";
import Cl_mJurado, { iJurado } from "./Cl_mJurado.js";
interface iResultJurados {
  objects: [iJurado] | null;
  error: string | false;
}
interface iResultPuntuacion {
  Puntuacion: [iPuntuacion] | null;
  error: string | false;
}

export default class mPrincipal {
  private db: Cl_dcytDb;
  private Jurados: Cl_mJurado[];
  private Puntuacion: Cl_mPuntuacion[];
  readonly tbJurado: string = "Jurado";
  readonly tbPuntuacion: string = "Puntuacion";
  constructor() {
    this.db = new Cl_dcytDb({ aliasCuenta: "PROFESOR" });
    this.Jurados = [];
    this.Puntuacion = [];
  }

  addJurado({
    dtJurado,
    callback,
  }: {
    dtJurado: iJurado;
    callback: (error: string | false) => void;
  }): void {
    let Jurado = new Cl_mJurado(dtJurado);
    // Validar que no exista otra Jurado con el mismo código
    // Validar que la Jurado sea correcta
         if (!Jurado.juradoOk) callback(" Jurado no es correcta.");
        // Guardar la Jurado
        else
          this.db.addRecord({
        tabla: this.tbJurado,
        registroAlias: dtJurado.categoria,
        object: Jurado,
        callback: ({ id, objects: Jurados, error }) => {
          if (!error) this.llenarJurados(Jurados);
          console.log("ID nuevo Jurado:", this.Jurados);
          callback?.(error);
        },
      });
  }
  /**  editJurado({
    dtJurado,
    callback,
  }: {
    dtJurado: iJurado;
    callback: (error: string | boolean) => void;
  }): void {
    let Jurado = new Cl_mJurado(dtJurado);
    // Validar que la Jurado sea correcta
        if (!Jurado.juradoOk) callback("El Jurado no es correcto.");
        else
          this.db.editRecord({
        tabla: this.tbJurado,
        object: Jurado,
        callback: ({ objects: Jurados, error }) => {
          if (!error) this.llenarJurados(Jurados);
          callback?.(error);
        },
      });
  }**/
  deleteJurado({
    nombre,
    callback,
  }: {
    nombre: string;
    callback: (error: string | boolean) => void;
  }): void {
    console.log("🔍 Modelo - Intentando eliminar jurado:", nombre);
    
    // VALIDACIÓN: Verificar que el nombre no esté vacío
    if (!nombre || nombre.trim() === "") {
      console.error("❌ Error: Nombre está vacío en el modelo");
      callback("El nombre del jurado está vacío");
      return;
    }
    
    const nombreTrim = nombre.trim();
    console.log("🔍 Buscando jurado con nombre:", nombreTrim);
    
    let indice = this.Jurados.findIndex((m) => m.nombre === nombreTrim);
    // Verificar si la Jurado existe
    if (indice === -1) {
      console.error("❌ Jurado no encontrado:", nombreTrim);
      console.log("🔍 Jurados disponibles:", this.Jurados.map(j => j.nombre));
      callback(`el Jurado con Nombre ${nombreTrim} no existe.`);
    } else {
      // Verificar si están inscritos Puntuacions en la Jurado
      // Eliminar la Jurado
        this.db.deleteRecord({
          tabla: this.tbJurado,
          object: this.Jurados[indice],
          callback: ({ objects: Jurados, error }) => {
            if (!error) this.llenarJurados(Jurados);
            callback?.(error);
          },
        });
    }
  }

// codigo para Puntuacion

 addPuntuacion({
  dtPuntuacion,
  callback,
}: {
  dtPuntuacion: iPuntuacion;
  callback: (error: string | false) => void;
}): void {
  let Puntuacion = new Cl_mPuntuacion(dtPuntuacion);
  // Validar que la puntuación sea correcta
  if (!Puntuacion.PuntuacionOk) callback("La puntuación no es correcta.");
  else
    this.db.addRecord({
      tabla: this.tbPuntuacion,
      registroAlias: dtPuntuacion.equipo,
      object: Puntuacion,
      callback: ({ id, objects: Puntuaciones, error }) => {
        if (!error) this.llenarPuntuacion(Puntuaciones);
        callback?.(error);
      },
    });
}

  


  dtJurado(): iJurado[] {
    return this.Jurados.map((m) => m.toJSON());
  }
  dtPuntuacion(): iPuntuacion[] {
    return this.Puntuacion.map((e) => e.toJSON());
  }
  Jurado(nombre: string): Cl_mJurado | null {
    let Jurado = this.Jurados.find((m) => m.nombre === nombre);
    return Jurado ? Jurado : null;
  }
  cargar(callback: (error: string | false) => void): void {
    // Obtener la información desde la Web Storage
    this.db.listRecords({
      tabla: this.tbJurado,
      callback: ({ objects, error }: iResultJurados) => {
        if (error) callback(`Error cargando Jurados: ${error}`);
        else
          this.db.listRecords({
            tabla: this.tbPuntuacion,
            callback: ({ Puntuacion, error }: iResultPuntuacion) => {
              if (error) callback(`Error cargando Puntuacions: ${error}`);
              else {
                this.llenarJurados(objects ?? []);
                this.llenarPuntuacion(Puntuacion ?? []);
                callback(false);
              }
            },
          });
      },
    });
  }
  llenarJurados(Jurados: iJurado[]): void {
    this.Jurados = [];
    Jurados.forEach((Jurado: iJurado) =>
      this.Jurados.push(new Cl_mJurado(Jurado))
    );
  }
 llenarPuntuacion(Puntuacion: iPuntuacion[]): void {
    this.Puntuacion = [];
    Puntuacion.forEach((Puntuacion: iPuntuacion) =>
      this.Puntuacion.push(new Cl_mPuntuacion(Puntuacion))
    );
  }
}
