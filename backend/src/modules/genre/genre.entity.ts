import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("genres")
export class Genre {

  //ID
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  //Nombre del género
  @Column({ type: "varchar", length: 100, unique: true })
  nombre: string;
}