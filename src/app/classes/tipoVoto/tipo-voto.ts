export class TipoVoto {

    public nombre: string;
    public computaQuorum: boolean;
    public computaResultado: boolean;
    public computaAfirmativo: boolean;
    public computaNegativo: boolean;
    public habilitado: boolean;

    constructor(nombre: string, computaQuorum: boolean, computaResultado: boolean, computaAfirmativo: boolean, computaNegativo: boolean, habilitado: boolean) {
        this.nombre = nombre;
        this.computaQuorum = computaQuorum;
        this.computaResultado = computaResultado;
        this.computaAfirmativo = computaAfirmativo;
        this.computaNegativo = computaNegativo;
        this.habilitado = habilitado;
    }

    static getVoteType(option: string) : TipoVoto {
        let vote: TipoVoto;
        switch (option) {
            case 'si': {
                vote = new TipoVoto('si', true, true, true, false, true);
            }; break;
            case 'no': {
                vote = new TipoVoto('no', true, true, false, true, true);
            }; break;
            case 'abstencion (con la mayoria)': {
                vote = new TipoVoto('abstencion (con la mayoria)', true, false, false, false, true);
            }; break;
            case 'no doy quorum': {
                vote = new TipoVoto('no doy quorum', false, false, false, false, true);
            }; break;
            default: {
                vote = new TipoVoto('no doy quorum', false, false, false, false, true);
            }
        }

        return vote;
    }

    public changeVote(option: string) {
        switch (option) {
            case 'si': {
                this.nombre = 'si';
                this.computaQuorum = true;
                this.computaResultado = true;
                this.computaAfirmativo = true;
                this.computaNegativo = false;
            }; break;
            case 'no': {
                this.nombre = 'no';
                this.computaQuorum = true;
                this.computaResultado = true;
                this.computaAfirmativo = false;
                this.computaNegativo = true;
            }; break;
            case 'abstencion (con la mayoria)': {
                this.nombre = 'abstencion (con la mayoria)';
                this.computaQuorum = true;
                this.computaResultado = false;
                this.computaAfirmativo = false;
                this.computaNegativo = false;
            }; break;
            case 'no doy quorum': {
                this.nombre = 'no doy quorum';
                this.computaQuorum = false;
                this.computaResultado = false;
                this.computaAfirmativo = false;
                this.computaNegativo = false;
            }; break;
        }
    }

    public getResult(): string {
        return this.nombre;
    }

    public getPrettyResult(): string {
        let result: string = '';
        switch (this.nombre) {
            case 'si': result = 'si'; break;
            case 'no': result = 'no'; break;
            case 'no doy quorum': result = 'noquorum'; break;
            case 'abstencion (con la mayoria)': result = 'abstencion'; break;
        }

        return result;
    }

    /* public getResultDecision(): Decisiones | null {
        let result: Decisiones | null = null;
        switch (this.nombre) {
            case 'si': result = Decisiones.si; break;
            case 'no': result = Decisiones.no ; break;
            case 'no doy quorum': result = Decisiones.noQuorum; break;
            case 'abstencion (con la mayoria)': result = Decisiones.abstencion; break;
        }

        return result;
    } */
}
