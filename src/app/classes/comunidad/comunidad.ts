export class Comunidad {

    public nombre: string;
    public descripcion: string;
    public comunidadLogo: string | null;
    public created_at: Date | null;

    constructor(nombre: string, descripcion: string, comunidadLogo: string | null, created_at: Date | null) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.comunidadLogo = comunidadLogo;
        this.created_at = created_at;
    }
}
