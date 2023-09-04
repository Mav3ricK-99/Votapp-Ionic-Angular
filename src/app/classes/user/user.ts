export class User {
    public id: number;
    public name: string;
    public surname: string;
    public email: string;
    public country: string;
    public yearOfBirth: number;
    public createdAt: Date = new Date();

    constructor(id: number, name: string, surname: string, email: string, country: string, yearOfBirth: number) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.country = country;
        this.yearOfBirth = yearOfBirth;
    }
}
