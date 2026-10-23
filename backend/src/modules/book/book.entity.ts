import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Author } from "../author/author.entity.js";
import { Genre } from "../genre/genre.entity.js";
import { Saga } from "../saga/saga.entity.js";
import { Shelf } from "../shelf/shelf.entity.js";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn({ type: "int" }) //ID
  id: number;

  @Column({ type: "varchar", length: 255 }) //Título del libro
  titulo: string;

  @Column({ type: "int", name: "anio_publicacion" }) //Año de publicación
  anioPublicacion: number;


  //Cada relación tiene su columna FK expuesta (autorId, etc.)
  //sirve para filtrar y para guardar por id.

  @Column({ type: "int", name: "autor_id" }) //FK del autor
  autorId: number;

  @ManyToOne(() => Author, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "autor_id" })
  autor: Relation<Author>;

  @Column({ type: "int", name: "genero_id" }) //FK del género
  generoId: number;

  @ManyToOne(() => Genre, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "genero_id" })
  genero: Relation<Genre>;

  @Column({ type: "int", name: "estante_id" }) //FK del estante
  estanteId: number;

  @ManyToOne(() => Shelf, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "estante_id" })
  estante: Relation<Shelf>;

  @Column({ type: "int", name: "saga_id", nullable: true }) //FK de la saga (opcional)
  sagaId: number | null;

  @ManyToOne(() => Saga, { nullable: true, onDelete: "RESTRICT" })
  @JoinColumn({ name: "saga_id" })
  saga: Relation<Saga> | null;
}