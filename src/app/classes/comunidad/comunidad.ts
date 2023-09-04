import { ComunidadIntegrantes } from "../comunidadIntegrantes/comunidad-integrantes";
import { User } from "../user/user";
import { VotacionTipo } from "../votacionTipo/votacion-tipo";

export class Comunidad {

    public id: number;
    public nombre: string;
    public descripcion: string;
    public comunidadLogo: string | null;
    public created_at: Date | null;
    public votacionTipo: VotacionTipo;
    public comunidadIntegrantes: ComunidadIntegrantes[];

    constructor(id: number, nombre: string, descripcion: string, comunidadLogo: string | null, votacionTipo: VotacionTipo, comunidadIntegrantes: ComunidadIntegrantes[], created_at: Date | null) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.comunidadLogo = comunidadLogo;
        this.votacionTipo = votacionTipo;
        this.created_at = created_at;
        this.comunidadIntegrantes = comunidadIntegrantes;
    }

    /**
     * Funcion que retorna si un determinado usuario puede o no crear votacion en esta comunidad
     * @returns boolean
     */
    public usuarioPuedeCrearVotacion(user: User): boolean {
        var usuarioPuedeCrearVotacion: boolean = false;
        this.comunidadIntegrantes.forEach((comunidadIntegrante: ComunidadIntegrantes) => {
            if (comunidadIntegrante.puedeCrearVotacion(user)) {
                usuarioPuedeCrearVotacion = true;
            }
        });

        return usuarioPuedeCrearVotacion;
    }
}
