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
        let myVote: TipoVoto | boolean = this.votoParticipante(usuario);
        if (myVote instanceof TipoVoto) {
            return myVote.getPrettyResult();
        }
        return 'pendiente';
    }

    public estadoVotoParticipante(usuario: User): string {
        let myVote: TipoVoto | boolean = this.votoParticipante(usuario);
        if (myVote instanceof TipoVoto) {
            return myVote.getResult();
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

    public porcentajeVotosQuorum(): number {
        let totalPorcentajeQuorum = 0;
        this.votacionIntegrantes.forEach((votacionIntegrante) => {
            if (votacionIntegrante.tipoVoto?.computaQuorum) {
                totalPorcentajeQuorum += votacionIntegrante.porcentaje;
            }
        });
        return totalPorcentajeQuorum;
    }

    public totalMiembros(): number {
        return this.votacionIntegrantes.length ?? 0;
    }

    public totalVotosQuorum(): number {
        let validVotes = this.votacionIntegrantes.filter((votacionIntegrate: VotacionIntegrantes) => {
            if (votacionIntegrate.tipoVoto && votacionIntegrate.tipoVoto.computaQuorum == true) {
                return true;
            } else {
                return false;
            }
        });
        return validVotes.length;
    }

    public votantesTotalesPorTipoVoto(tipoVoto: TipoVoto) {
        let votosTotales = 0;
        this.votacionIntegrantes.forEach((votacionIntegrante) => {
            if (votacionIntegrante.tipoVoto?.nombre == tipoVoto.nombre) {
                votosTotales++;
            }
        })

        return votosTotales;
    }

    public porcentajeVotosPorEstadoVoto(estado: string) {
        let tipoVoto: TipoVoto = new TipoVoto(estado, false, false, false, false, false);
        return (this.votantesTotalesPorTipoVoto(tipoVoto) * 100) / this.totalMiembros();
    }

    public porcentajeVotosPorTipoVoto(tipoVoto: TipoVoto) {
        return (this.votantesTotalesPorTipoVoto(tipoVoto) * 100) / this.totalMiembros();
    }

    public obtenerVotosPorTipoVoto(tipoVoto: TipoVoto | null): VotacionIntegrantes[] {
        let votes: VotacionIntegrantes[] = [];
        
        votes = this.votacionIntegrantes.filter((votacionIntegrante) => {
            if (tipoVoto instanceof TipoVoto && votacionIntegrante.tipoVoto?.nombre.includes(tipoVoto.nombre)) {
                return votacionIntegrante;
            } else if(!(tipoVoto instanceof TipoVoto) && votacionIntegrante.tipoVoto == null) {
                return votacionIntegrante;
            }
            return false;
        });
        return votes;
    }

    public porcentajeVotosValidos(): number {
        return Math.floor((this.totalVotosQuorum() * 100) / this.totalMiembros());
    }

    public resultadoFinal(): any {
        if (this.estaFinalizada() && this.votacionIntegrantes != null) {
            let afirmativeVotesPerc = 0;
            let negativeVotesPerc = 0;
            let validVotes = this.votacionIntegrantes.filter((votacionIntegrante) => {
                if (votacionIntegrante.tipoVoto?.getResult() == 'noquorum') {
                    return false;
                } else {
                    //Aca fallaria si el porcentaje no esta repartido en partes iguales por el total
                    votacionIntegrante.porcentaje = (this.totalMiembros() / this.totalVotosQuorum());
                    return true;
                }
            });
            validVotes.forEach((votacionIntegrante) => {
                if (votacionIntegrante.tipoVoto) {
                    let vote = votacionIntegrante.tipoVoto;
                    if (vote.computaAfirmativo)
                        afirmativeVotesPerc += votacionIntegrante.porcentaje;

                    if (vote.computaNegativo)
                        negativeVotesPerc += votacionIntegrante.porcentaje;
                }
            });
            if (afirmativeVotesPerc > negativeVotesPerc) {
                return Resultados.Afirmative;
            } else {
                return Resultados.Negative;
            }
        }
        return Resultados.Tie;
    }

    public set _votacionIntegrantes(v: VotacionIntegrantes[]) {
        this.votacionIntegrantes = v;
    }
}