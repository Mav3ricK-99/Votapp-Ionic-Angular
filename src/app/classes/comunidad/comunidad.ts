import { ComunidadIntegrantes } from "../comunidadIntegrantes/comunidad-integrantes";
import { VotacionTipo } from "../votacionTipo/votacion-tipo";

export class Comunidad {

    public id: number;
    public nombre: string;
    public descripcion: string;
    public comunidadLogo: string | null;
    public created_at: Date | null;
    public votacionTipo: VotacionTipo;
    public comunidadIntegrantes: ComunidadIntegrantes[];

    constructor(id: number, nombre: string, descripcion: string, comunidadLogo: string | null, votacionTipo: VotacionTipo, created_at: Date | null) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.comunidadLogo = comunidadLogo;
        this.votacionTipo = votacionTipo;
        this.created_at = created_at;
        this.comunidadIntegrantes = [];
    }
}
