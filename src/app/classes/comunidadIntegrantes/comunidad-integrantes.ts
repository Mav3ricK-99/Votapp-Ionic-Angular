import { User } from "../user/user";

export class ComunidadIntegrantes {

    constructor(public id: number,
        public votar: boolean,
        public user: User,
        public crearVotacion: boolean,
        public porcentaje: number,
        public requiereAceptacion: boolean,
        public fEnvioInvitacion: Date,
        public fDecision: Date,
        public aceptacion: boolean,
        public habilitado: boolean,
        public created_at: Date) { }

    public puedeCrearVotacion(user: User) {
        if ((this.user.email == user.email) && this.crearVotacion) {
            return true;
        }
        return false;
    }
}
