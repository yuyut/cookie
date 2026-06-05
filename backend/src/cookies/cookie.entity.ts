import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CookieJar } from '../cookie-jar/cookie-jar.entity';

@Entity('cookies')
export class Cookie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  flavor!: string;

  @Column()
  quantity!: number;

  @Column()
  cookieJarId!: number;

  @ManyToOne(() => CookieJar, (jar) => jar.cookies)
  @JoinColumn({ name: 'cookieJarId' })
  cookieJar!: CookieJar;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}