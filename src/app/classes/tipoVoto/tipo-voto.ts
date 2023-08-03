import { Resultados } from "src/app/enums/resultados/resultados";

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

    public changeVote(option: string) {
        switch (option as keyof typeof Resultados) {
            case 'Yes': {
                this.nombre = 'si';
                this.computaQuorum = true;
                this.computaResultado = true;
                this.computaAfirmativo = true;
                this.computaNegativo = false;
            }; break;
            case 'No': {
                this.nombre = 'no';
                this.computaQuorum = true;
                this.computaResultado = true;
                this.computaAfirmativo = false;
                this.computaNegativo = true;
            }; break;
            case 'Abstention': {
                this.nombre = 'abstencion (con la mayoria)';
                this.computaQuorum = true;
                this.computaResultado = false;
                this.computaAfirmativo = false;
                this.computaNegativo = false;
            }; break;
            case 'NoQuorum': {
                this.nombre = 'no doy quorum';
                this.computaQuorum = false;
                this.computaResultado = false;
                this.computaAfirmativo = false;
                this.computaNegativo = false;
            }; break;
        }
    }

    public getResult(): string {
        let result: string = '';
        switch (this.nombre) {
            case 'si': result = 'yes'; break;
            case 'no': result = 'no' ; break;
            case 'no doy quorum': result = 'noquorum'; break;
            case 'abstencion (con la mayoria)': result = 'abstention'; break;
        }

        return result;
    }
}
