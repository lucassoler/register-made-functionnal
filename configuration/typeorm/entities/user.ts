import {Column, Entity, Index, PrimaryGeneratedColumn} from "typeorm"

@Entity("user")
@Index(`email_unique_index`, ['email'], { unique: true })
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ type: "text"})
    email: string

    @Column("text")
    password: string
}