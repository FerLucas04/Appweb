import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("authors")
export class Author {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 150 })
  nombre: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  nacionalidad: string | null;
}