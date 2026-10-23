import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//Estantes
@Entity("shelves")
export class Shelf {

  //ID
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;
   
  //Código del estante
  // Ej: "Estante A-1"
  @Column({ type: "varchar", length: 100, unique: true })
  codigo: string;

  //Descripción
  @Column({ type: "varchar", length: 255, nullable: true })
  descripcion: string | null;
}