import { Resultados } from "src/app/enums/resultados/resultados";
import { Comunidad } from "../comunidad/comunidad";
import { TipoVoto } from "../tipoVoto/tipo-voto";
import { VotacionDecision } from "../votacionDecision/votacion-decision";
import { VotacionIntegrantes } from "../votacionIntegrantes/votacion-integrantes";
import { VotacionTipo } from "../votacionTipo/votacion-tipo";
import { VotacionFrecuencia } from "../votacionFrecuencia/votacion-frecuencia";
import { User } from "../user/user";

export class Votacion {

    public id: number;
    public aceptacionRequerida: number;
    public detalle: string;
    public proximaVotacion: Date | null;
    public quorumRequerido: number;
    public repetir: boolean;
    public requiereAceptacion: boolean;
    public vencimiento: Date;
    public votacionPunto: string;

    public comunidad: Comunidad;
    public votacionDecision: VotacionDecision;
    public votacionTipo: VotacionTipo;
    public votacionFrecuencia: VotacionFrecuencia | null;

    public votacionIntegrantes: VotacionIntegrantes[];

    constructor(id: number, aceptacionRequerida: number, detalle: string, proximaVotacion: Date | null, quorumRequerido: number, repetir: boolean, requiereAceptacion: boolean, vencimiento: Date, votacionPunto: string, comunidad: Comunidad, votacionDecision: VotacionDecision, votacionTipo: VotacionTipo, votacionFrecuencia: VotacionFrecuencia | null) {
        this.id = id;
        this.aceptacionRequerida = aceptacionRequerida;
        this.detalle = detalle;
        this.proximaVotacion = proximaVotacion;
        this.quorumRequerido = quorumRequerido;
        this.repetir = repetir;
        this.requiereAceptacion = requiereAceptacion;
        this.vencimiento = vencimiento;
        this.votacionPunto = votacionPunto;
        this.comunidad = comunidad;
        this.votacionDecision = votacionDecision;
        this.votacionTipo = votacionTipo;
        this.votacionFrecuencia = votacionFrecuencia;
        this.votacionIntegrantes = [];
    }

    public estaFinalizada(): boolean {
        let fechaHoy = new Date();
        return fechaHoy > this.vencimiento;
    }

    public diasRestantes() {
        let fechaHoy = new Date();
        if (fechaHoy > this.vencimiento) {
            return 0;
        }
        return Math.floor((Date.UTC(this.vencimiento.getFullYear(), this.vencimiento.getMonth(), this.vencimiento.getDate()) - Date.UTC(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate())) / (1000 * 60 * 60 * 24));
    }

    public estadoVotoParticipantePretty(usuario: User): string {
        let miVoto: TipoVoto | boolean = this.votoParticipante(usuario);
        if (miVoto instanceof TipoVoto) {
            return miVoto.getPrettyResult();
        }
        return 'pendiente';
    }

    public estadoVotoParticipante(usuario: User): string {
        let miVoto: TipoVoto | boolean = this.votoParticipante(usuario);
        if (miVoto instanceof TipoVoto) {
            return miVoto.getResult();
        }
        return 'pendiente';
    }

    public cambiarVotoParticipante(usuario: User, tipoVoto: TipoVoto) {
        this.votacionIntegranteParticipante(usuario).tipoVoto = tipoVoto;
    }

    public votacionIntegranteParticipante(usuario: User): VotacionIntegrantes {
        let votacionIntegrantes = this.votacionIntegrantes.filter((votacionIntegrante) => {
            return votacionIntegrante.user.email == usuario.email ? true : false;
        });
        return votacionIntegrantes[0];
    }

    public votoParticipante(usuario: User): TipoVoto | boolean {
        let votacionIntegrante: VotacionIntegrantes = this.votacionIntegranteParticipante(usuario);
        if (votacionIntegrante.tipoVoto != null) {
            return votacionIntegrante.tipoVoto;
        } else {
            return false;
        }
    }

    /* Porcentaje de votos con quorum segun el porcentaje que tiene el participante
     * 
     * @returns porcentaje de Votos que cuentan como que tienen Quorum
     * */
    public porcentajeVotosQuorum(): number {
        let totalPorcentajeQuorum = 0;
        this.votacionIntegrantes.forEach((votacionIntegrante) => {
            if (votacionIntegrante.tipoVoto?.computaQuorum) {
                totalPorcentajeQuorum += votacionIntegrante.porcentaje;
            }
        });
        return Math.trunc(totalPorcentajeQuorum);
    }

    public totalMiembros(): number {
        return this.votacionIntegrantes.length ?? 0;
    }

    public totalVotosQuorum(): number {
        let votosValidos = this.votacionIntegrantes.filter((votacionIntegrate: VotacionIntegrantes) => {
            if (votacionIntegrate.tipoVoto && votacionIntegrate.tipoVoto.computaQuorum == true) {
                return true;
            } else {
                return false;
            }
        });
        return votosValidos.length;
    }

    public totalVotos(): number {
        let votos = this.votacionIntegrantes.filter((votacionIntegrate: VotacionIntegrantes) => {
            if (votacionIntegrate.tipoVoto) {
                return true;
            } else {
                return false;
            }
        });
        return votos.length;
    }

    public votantesTotalesPorTipoVoto(tipoVoto: TipoVoto) {
        let votosTotales = 0;
        this.votacionIntegrantes.forEach((votacionIntegrante) => {
            if (votacionIntegrante.tipoVoto?.nombre == tipoVoto.nombre) {
                votosTotales++;
            }

            if (votacionIntegrante.tipoVoto == null && tipoVoto.nombre == 'pendiente') {
                votosTotales++;
            }
        })

        return votosTotales;
    }

    public porcentajeTotalPorTipoVoto(estado: string): number {
        let porcentaje: number = 0;
        this.votacionIntegrantes.forEach((votacionIntegrante) => {
            if (votacionIntegrante.tipoVoto?.nombre == estado) {
                porcentaje += votacionIntegrante.porcentaje;
            }

            if (votacionIntegrante.tipoVoto == null && estado == 'pendiente') {
                porcentaje += votacionIntegrante.porcentaje;
            }
        })

        return porcentaje;
    }

    public obtenerVotosPorTipoVoto(tipoVoto: TipoVoto | null): VotacionIntegrantes[] {
        let votes: VotacionIntegrantes[] = [];

        votes = this.votacionIntegrantes.filter((votacionIntegrante) => {
            if (tipoVoto instanceof TipoVoto && votacionIntegrante.tipoVoto?.nombre == tipoVoto.nombre) {
                return votacionIntegrante;
            } else if (!(tipoVoto instanceof TipoVoto) && votacionIntegrante.tipoVoto == null) {
                return votacionIntegrante;
            }
            return false;
        });
        return votes;
    }

    public porcentajeVotosValidos(): number {
        return Math.floor((this.totalVotosQuorum() * 100) / this.totalMiembros());
    }

    public porcentajeVotosEmitidosPorPorcentaje(): number {
        let porcentajeVotosEmitidosPorPorcentaje: number = 0;
        this.votacionIntegrantes.forEach((votacionIntegrante: VotacionIntegrantes) => {
            if (votacionIntegrante.tipoVoto instanceof TipoVoto) {
                porcentajeVotosEmitidosPorPorcentaje += votacionIntegrante.porcentaje;
            }
        });
        return Math.trunc(porcentajeVotosEmitidosPorPorcentaje);
    }

    public resultadoFinal(): any {
        if (this.estaFinalizada()) {
            let porcVotosAfirmativos = 0;
            let porcVotosNegativos = 0;
            let votosValidos = this.votacionIntegrantes.filter((votacionIntegrante) => {
                if (votacionIntegrante.tipoVoto == null || votacionIntegrante.tipoVoto?.getResult() == 'noquorum') {
                    return false;
                } else {
                    return true;
                }
            });
            let porcVotosValidos = (votosValidos.length * 100) / this.totalMiembros();
            if (porcVotosValidos < this.quorumRequerido) {
                return Resultados.NoHayQuorum;
            }

            votosValidos.forEach((votacionIntegrante) => {
                if (votacionIntegrante.tipoVoto) {
                    let vote = votacionIntegrante.tipoVoto;
                    if (vote.computaAfirmativo)
                        porcVotosAfirmativos += votacionIntegrante.porcentaje;

                    if (vote.computaNegativo)
                        porcVotosNegativos += votacionIntegrante.porcentaje;
                }
            });
            if (porcVotosAfirmativos > porcVotosNegativos) {
                return Resultados.Afirmativo;
            } else if (porcVotosAfirmativos < porcVotosNegativos) {
                return Resultados.Negativo;
            }
            return Resultados.Empate;
        }
        return Resultados.Empate;
    }

    public set _votacionIntegrantes(v: VotacionIntegrantes[]) {
        this.votacionIntegrantes = v;
    }
}
