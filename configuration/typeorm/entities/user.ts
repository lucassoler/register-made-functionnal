import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm"

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "text", unique: true})
    email: string

    @Column("text")
    password: string
}