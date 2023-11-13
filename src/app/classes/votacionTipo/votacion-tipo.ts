export class VotacionTipo {

    public id: number
    public nombre: string;
    public habilitado: boolean;

    constructor(id: number, nombre: string, habilitado: boolean) {
        this.id = id;
        this.nombre = nombre;
        this.habilitado = habilitado;
    }
}
