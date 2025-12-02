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
    this.db = new Cl_dcytDb({ aliasCuenta: "TERANEXUS CORE" });
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
 editJurado({
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
        if (!error) {
          console.log("🔧 MODELO - Cambios guardados exitosamente");
          console.log("🔧 MODELO - Jurados recibidos de BD:", Jurados);
          
          // ✅ SOLUCIÓN: Recargar todos los datos desde la BD después de editar
          console.log("🔄 MODELO - Recargando todos los jurados desde la BD...");
          this.db.listRecords({
            tabla: this.tbJurado,
            callback: ({ objects, error: listError }: iResultJurados) => {
                         if (!listError && objects) {
  console.log("🔄 MODELO - Datos actualizados recibidos:", objects);
  
  // ✅ FORZAR RECARGA COMPLETA Y ACTUALIZACIÓN
  this.llenarJurados(objects);
  
  // ✅ VERIFICAR QUE LOS DATOS ESTÁN EN EL ARRAY
  console.log("🔄 MODELO - Array Jurados actualizado:", this.Jurados.length);
  console.log("🔄 MODELO - Jurados finales:", this.Jurados.map(j => `${j.nombre} (${j.categoria})`));
  
  // ✅ FORZAR ACTUALIZACIÓN DE LA VISTA
  setTimeout(() => {
    console.log("🔄 MODELO - Forzando recarga de la vista...");
    this.cargar((error: string | false) => {
      if (!error) {
        console.log("🔄 MODELO - Vista recargada exitosamente");
      }
    });
  }, 100);

}
  callback(false);
  }

          });
        } else {
          console.error("🔧 MODELO - Error al guardar cambios:", error);
          callback(error);
        }
      },
    });
}

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
  console.log("🔢 MODELO - Intentando agregar puntuación:", dtPuntuacion);
  let Puntuacion = new Cl_mPuntuacion(dtPuntuacion);
  
  // Validar que la puntuación sea correcta
  if (!Puntuacion.PuntuacionOk) {
    console.error("❌ MODELO - Puntuación inválida:", Puntuacion);
    callback("La puntuación no es correcta.");
    return;
  }
  
  console.log("✅ MODELO - Puntuación válida, guardando en BD...");
  this.db.addRecord({
    tabla: this.tbPuntuacion,
    registroAlias: `${dtPuntuacion.equipo.replace(/[^A-Z]/g, '').substring(0, 8)}_${(Date.now() % 10000).toString().padStart(4, '0')}`,
    object: Puntuacion,
    callback: ({ id, objects: Puntuacion, error }) => {
      if (!error) {
        console.log("✅ MODELO - Puntuación guardada exitosamente");
        console.log("🔢 MODELO - Datos recibidos de BD:", Puntuacion);
        this.llenarPuntuacion(Puntuacion);
        console.log("🔢 MODELO - Array Puntuacion actualizado:", this.Puntuacion.length, "elementos");
      } else {
        console.error("❌ MODELO - Error guardando puntuación:", error);
      }
      callback?.(error);
    },
  });
}

  


  dtJurado(): iJurado[] {
  console.log("🔍 MODELO - dtJurado() llamado - Retornando:", this.Jurados.length, "jurados");
  console.log("🔍 MODELO - Contenido actual:", this.Jurados.map(j => `${j.nombre} (${j.categoria})`));
  const result = this.Jurados.map((m) => m.toJSON());
  console.log("🔍 MODELO - dtJurado() retornando array:", result.length, "elementos");
  return result;
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
           console.log("🔄 MODELO - llenarJurados() llamado con:", this.Jurados.length, "jurados");
        console.log("🔄 MODELO - Datos recibidos:", this.Jurados);
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
