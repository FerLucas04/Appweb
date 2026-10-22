import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn({ type: "int" })
  id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255, name: "password_hash" })
  passwordHash: string;

  @Column({ type: "varchar", length: 150 })
  nombre: string;

  @CreateDateColumn({ type: "timestamp", name: "creado_en" })
  creadoEn: Date;
}   