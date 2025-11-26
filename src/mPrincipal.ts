import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mPuntuacion, { iPuntuacion } from "./Cl_mPuntuacion.js";
import Cl_mJurado, { iJurado } from "./Cl_mJurado.js";
interface iResultJurados {
  objects: [iJurado] | null;
  error: string | false;
}
interface iResultPuntuacions {
  Puntuacions: [iPuntuacion] | null;
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
  /**deleteJurado({
    nombre,
    callback,
  }: {
    nombre: string;
    callback: (error: string | boolean) => void;
  }): void {
    let indice = this.Jurados.findIndex((m) => m.categoria === nombre);
    // Verificar si la Jurado existe
    if (indice === -1) callback(`La Jurado con código ${nombre} no existe.`);
    else {
      // Verificar si están inscritos Puntuacions en la Jurado
      let algunInscrito = false;
      for (let Puntuacion of this.Puntuacions)
        if (Puntuacion.inscritoEn(nombre)) {
          algunInscrito = true;
          break;
        }
      if (algunInscrito)
        callback(
          `No se puede eliminar "${nombre}" (inscrita por un Puntuacion)`
        );
      // Eliminar la Jurado
      else {
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
  }**/
  /**addPuntuacion({
    dtPuntuacion,
    callback,
  }: {
    dtPuntuacion: iPuntuacion;
    callback: (error: string | boolean) => void;
  }): void {
    let existe = this.Puntuacions.find((e) => e.cedula === dtPuntuacion.cedula);
    if (existe)
      callback(`El Puntuacion con cedula ${dtPuntuacion.cedula} ya existe.`);
    let Puntuacion = new Cl_mPuntuacion(dtPuntuacion);
    if (!Puntuacion.PuntuacionOk) callback(Puntuacion.PuntuacionOk);
    this.Puntuacions.push(Puntuacion);
    callback(false);
  }
  deletePuntuacion({
    cedula,
    callback,
  }: {
    cedula: number;
    callback: (error: string | boolean) => void;
  }): void {
    let indice = this.Puntuacions.findIndex((e) => e.cedula === cedula);
    if (indice === -1)
      callback(`El Puntuacion con cedula ${cedula} no existe.`);
    if (this.Puntuacions[indice].cntJurados > 0)
      callback(`No se puede eliminar "${cedula}" (inscrito en Jurados)`);
    this.Puntuacions.splice(indice, 1);
    callback(false);
  }**/
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
            callback: ({ Puntuacions, error }: iResultPuntuacions) => {
              if (error) callback(`Error cargando Puntuacions: ${error}`);
              else {
                this.llenarJurados(objects ?? []);
                //this.llenarPuntuacion(Puntuacions ?? []);
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
/**  llenarPuntuacion(Puntuacion: iPuntuacion[]): void {
    this.Puntuacion = [];
    Puntuacion.forEach((Puntuacion: iPuntuacion) =>
      this.Puntuacion.push(new Cl_mPuntuacion(Puntuacion))
    );
  }*/
}
