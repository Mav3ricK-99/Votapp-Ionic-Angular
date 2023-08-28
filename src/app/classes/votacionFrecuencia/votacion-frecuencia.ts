export class VotacionFrecuencia {

    public nombre: string;
    public dias: number;
    public habilitado: boolean;

    constructor(nombre: string, dias: number, habilitado: boolean) {
        this.nombre = nombre;
        this.dias = dias;
        this.habilitado = habilitado;
    }
}
