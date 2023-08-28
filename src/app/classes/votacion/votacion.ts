import { Resultados } from "src/app/enums/resultados/resultados";
import { Comunidad } from "../comunidad/comunidad";
import { TipoVoto } from "../tipoVoto/tipo-voto";
import { VotacionDecision } from "../votacionDecision/votacion-decision";
import { VotacionIntegrantes } from "../votacionIntegrantes/votacion-integrantes";
import { Decisiones } from "src/app/interfaces/decisiones/decisiones";
import { VotacionTipo } from "../votacionTipo/votacion-tipo";
import { VotacionFrecuencia } from "../votacionFrecuencia/votacion-frecuencia";

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
    }

    public isEnded(): boolean {
        let currentDate = new Date();
        return currentDate > this.vencimiento;
    }

    public remainingDays() {
        let currentDate = new Date();
        if (currentDate > this.vencimiento) {
            return 0;
        }
        return Math.floor((Date.UTC(this.vencimiento.getFullYear(), this.vencimiento.getMonth(), this.vencimiento.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
    }

    public myVoteStatePretty(): string {
        let myVote: TipoVoto | boolean = this.getMyVote();
        if (myVote instanceof TipoVoto) {
            return myVote.getPrettyResult();
        }
        return 'pendiente';
    }

    public myVoteState(): string {
        let myVote: TipoVoto | boolean = this.getMyVote();
        if (myVote instanceof TipoVoto) {
            return myVote.getResult();
        }
        return 'pendiente';
    }

    public changeMyVote(option: string) {
        let myVote = this.getMyVote();
        if (myVote instanceof TipoVoto) {
            myVote.changeVote(option)
        } else if (myVote == false) {
            let voteType: TipoVoto = TipoVoto.getVoteType(option);
            this.getMyVotacionIntegrante().tipoVoto = voteType;
        }
    }

    public getMyVotacionIntegrante(): VotacionIntegrantes {
        let myVote = this.votacionIntegrantes.filter((votacionIntegrante) => {
            return votacionIntegrante.miVoto == true;
        })
        return myVote[0];
    }


    public getMyVote(): TipoVoto | boolean {
        if (this.votacionIntegrantes != null) {
            let myVote = this.votacionIntegrantes.filter((votacionIntegrante) => {
                return votacionIntegrante.miVoto == true;
            })
            return myVote[0].tipoVoto ? myVote[0].tipoVoto : false;
        }

        return false;
    }

    public getQuorumPercentageVotes(): number {
        if (this.votacionIntegrantes != null) {
            let quorumVotes = this.votacionIntegrantes.filter((votacionIntegrante) => {
                if (votacionIntegrante.tipoVoto?.computaQuorum) {
                    return true;
                } else {
                    return false;
                }
            })
            return (quorumVotes.length * 100) / this.totalMembers();
        }

        return 0;
    }

    public totalMembers(): number {
        return this.votacionIntegrantes.length;
    }

    public totalVoters(): number {
        let validVotes = this.votacionIntegrantes.filter((votacionIntegrate: VotacionIntegrantes) => {
            if (votacionIntegrate.tipoVoto && votacionIntegrate.tipoVoto.computaQuorum == true) {
                return true;
            } else {
                return false;
            }
        });
        return validVotes.length;
    }

    public totalValidForResultVoters(): number {
        let validVotes = this.votacionIntegrantes.filter((votacionIntegrate: VotacionIntegrantes) => {
            if (votacionIntegrate.tipoVoto && votacionIntegrate.tipoVoto.computaQuorum) {
                return true;
            } else {
                return false;
            }
        });
        return validVotes.length;
    }

    public getTotalVotesByType(type: string) {
        if (this.votacionIntegrantes != null) {
            let totalVotes = 0;
            this.votacionIntegrantes.forEach((votacionIntegrante) => {
                switch (type) {
                    case 'abstencion': {
                        if (votacionIntegrante.tipoVoto?.getPrettyResult() == 'abstencion') {
                            totalVotes++;
                        }
                    } break;
                    case 'si': {
                        if (votacionIntegrante.tipoVoto?.getPrettyResult() == 'si') {
                            totalVotes++;
                        }
                    } break;
                    case 'no': {
                        if (votacionIntegrante.tipoVoto?.getPrettyResult() == 'no') {
                            totalVotes++;
                        }
                    } break;
                    case 'noquorum': {
                        if (votacionIntegrante.tipoVoto?.getPrettyResult() == 'noquorum') {
                            totalVotes++;
                        }
                    } break;
                    default: {
                        if (!votacionIntegrante.tipoVoto) {
                            totalVotes++;
                        }
                    }
                }
            })
            return totalVotes;
        }
        return 0;
    }

    public getVotesPercentageByType(type: string) {
        return (this.getTotalVotesByType(type) * 100 ) / this.totalMembers();
    }

    public getVotesByType(type: string): VotacionIntegrantes[] {
        if (this.votacionIntegrantes != null) {
            let votes = this.votacionIntegrantes.filter((votacionIntegrante) => {
                if (votacionIntegrante.tipoVoto?.getResult() == type) {
                    return true;
                }
                return false;
            })
            return votes;
        }
        return [];
    }

    public votersPercentage(): number {
        return Math.floor((this.totalVoters() * 100) / this.totalMembers());
    }

    public finalResult(): any {
        if (this.isEnded() && this.votacionIntegrantes != null) {
            let afirmativeVotesPerc = 0;
            let negativeVotesPerc = 0;
            let validVotes = this.votacionIntegrantes.filter((votacionIntegrante) => {
                if (votacionIntegrante.tipoVoto?.getResult() == 'noquorum') {
                    return false;
                } else {
                    //Aca fallaria si el porcentaje no esta repartido en partes iguales por el total
                    votacionIntegrante.porcentaje = (this.totalMembers() / this.totalValidForResultVoters());
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
