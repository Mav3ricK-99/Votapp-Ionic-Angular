import { Resultados } from "src/app/enums/resultados/resultados";
import { Comunidad } from "../comunidad/comunidad";
import { TipoVoto } from "../tipoVoto/tipo-voto";
import { VotacionDecision } from "../votacionDecision/votacion-decision";
import { VotacionIntegrantes } from "../votacionIntegrantes/votacion-integrantes";

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

    public votacionIntegrantes: VotacionIntegrantes[];

    constructor(id: number, aceptacionRequerida: number, detalle: string, proximaVotacion: Date | null, quorumRequerido: number, repetir: boolean, requiereAceptacion: boolean, vencimiento: Date, votacionPunto: string, comunidad: Comunidad, votacionDecision: VotacionDecision) {
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
        return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(this.vencimiento.getFullYear(), this.vencimiento.getMonth(), this.vencimiento.getDate())) / (1000 * 60 * 60 * 24));
    }

    public myVoteState(): string {
        let myVote: TipoVoto | boolean = this.getMyVote();
        if (myVote instanceof TipoVoto) {
            return myVote.getResult();
        }
        return 'pending';
    }

    public changeMyVote(option: string) {
        let myVote = this.getMyVote();
        if (myVote instanceof TipoVoto) {
            myVote.changeVote(option)
        }
    }

    public getMyVote(): TipoVoto | boolean {
        if (this.votacionIntegrantes != null) {
            let myVote = this.votacionIntegrantes.filter((votacionIntegrante) => {
                return votacionIntegrante.miVoto == true;
            })
            return myVote[0].tipoVoto ? myVote[0].tipoVoto : false; //Solamente puede votar una vez?
        }

        return false;
    }

    public getQuorumPercentageVotes(): number {
        if (this.votacionIntegrantes != null) {
            let totalMembers = this.totalMembers();
            let quorumVotes = this.votacionIntegrantes.filter((votacionIntegrante) => {
                if (votacionIntegrante.tipoVoto?.getResult() == 'noquorum') {
                    return false;
                } else {
                    return true;
                }
            })
            return (quorumVotes.length * 100) / totalMembers;
        }

        return 0;
    }

    public totalMembers(): number {
        return this.votacionIntegrantes.length;
    }

    public totalVoters(): number {
        let afirmativeNegativeVotes = this.votacionIntegrantes.filter((votacionIntegrate: VotacionIntegrantes) => {
            if (votacionIntegrate.tipoVoto && (votacionIntegrate.tipoVoto.computaAfirmativo || votacionIntegrate.tipoVoto.computaNegativo)) {
                return true;
            } else {
                return false;
            }
        });
        return afirmativeNegativeVotes.length;
    }

    public votersPercentage(): number {
        return Math.floor((this.totalVoters() * 100) / this.totalMembers());
    }

    public set _votacionIntegrantes(v: VotacionIntegrantes[]) {
        this.votacionIntegrantes = v;
    }
}
