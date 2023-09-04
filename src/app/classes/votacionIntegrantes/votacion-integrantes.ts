import { TipoVoto } from "../tipoVoto/tipo-voto";
import { User } from "../user/user";

export class VotacionIntegrantes {

    public miVoto: boolean;
    public porcentaje: number;
    public tipoVoto: TipoVoto | null;
    public user: User;

    constructor(miVoto: boolean, porcentaje: number, tipoVoto: TipoVoto | null, user: User) {
        this.miVoto = miVoto;
        this.porcentaje = porcentaje;
        this.tipoVoto = tipoVoto;
        this.user = user;
    }
}
