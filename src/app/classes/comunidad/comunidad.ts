import { ComunidadIntegrantes } from "../comunidadIntegrantes/comunidad-integrantes";
import { User } from "../user/user";
import { Votacion } from "../votacion/votacion";
import { VotacionTipo } from "../votacionTipo/votacion-tipo";

export class Comunidad {

    public id: number;
    public nombre: string;
    public descripcion: string;
    public created_at: Date | null;
    public votacionTipo: VotacionTipo;
    public comunidadIntegrantes: ComunidadIntegrantes[];

    public votaciones: Votacion[];

    public logo: string | null;

    constructor(id: number, nombre: string, descripcion: string, votacionTipo: VotacionTipo, comunidadIntegrantes: ComunidadIntegrantes[], created_at: Date | null) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.votacionTipo = votacionTipo;
        this.created_at = created_at;
        this.comunidadIntegrantes = comunidadIntegrantes;
        this.votaciones = [];
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

    public votacionesAbiertas() {
        return this.votaciones.filter((votacion: Votacion) => {
            return !votacion.estaFinalizada() ? votacion : null;
        });
    }

    public votacionesCerradas() {
        return this.votaciones.filter((votacion: Votacion) => {
            return votacion.estaFinalizada() ? votacion : null;
        });
    }
}
