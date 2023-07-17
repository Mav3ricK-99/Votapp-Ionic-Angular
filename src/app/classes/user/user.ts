export class User {
    private id: number;
    private name: string;
    private surname: string;
    private email: string;
    private country: string;
    private yearOfBirth: number;
    private createdAt: Date = new Date();

    constructor(id: number, name: string, surname: string, email: string, country: string, yearOfBirth: number) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.country = country;
        this.yearOfBirth = yearOfBirth;
    }

    public get getName(): string {
        return this.name;
    }

    public get getEmail(): string {
        return this.email;
    }

    public get getSurname(): string {
        return this.surname;
    }

    public get getResidenceCountry(): string {
        return this.country;
    }

    public get getYearOfBirth(): number {
        return this.yearOfBirth;
    }

}
