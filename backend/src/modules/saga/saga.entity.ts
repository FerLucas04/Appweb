import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sagas")
export class Saga {

  //ID
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  //Nombre de la saga
  @Column({ type: "varchar", length: 150 })
  nombre: string;
}