import { TipoVoto } from "../tipoVoto/tipo-voto";

export class VotacionIntegrantes {

    public miVoto: boolean;
    public porcentaje: number;
    public tipoVoto: TipoVoto | null;

    constructor(miVoto: boolean, porcentaje: number, tipoVoto: TipoVoto | null) {
        this.miVoto = miVoto;
        this.porcentaje = porcentaje;
        this.tipoVoto = tipoVoto;
    }
}
