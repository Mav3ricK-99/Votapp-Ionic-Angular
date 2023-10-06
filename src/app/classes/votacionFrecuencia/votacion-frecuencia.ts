export class VotacionFrecuencia {

    public id: number;
    public nombre: string;
    public dias: number;
    public habilitado: boolean;

    constructor(id: number, nombre: string, dias: number, habilitado: boolean) {
        this.id = id;
        this.nombre = nombre;
        this.dias = dias;
        this.habilitado = habilitado;
    }
}
