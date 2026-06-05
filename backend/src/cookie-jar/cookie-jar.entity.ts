import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Cookie } from '../cookies/cookie.entity';

@Entity('cookie_jars')
export class CookieJar {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => Cookie, (cookie) => cookie.cookieJar)
  cookies!: Cookie[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}