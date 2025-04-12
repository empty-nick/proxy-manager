import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Proxy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isActive: boolean;

  @Column()
  ip: string;

  @Column()
  port: number;

  @Column({ nullable: true })
  password: string;

  @Column()
  protocol: string;

  @Index()
  @Column({ nullable: true })
  region: string;

  @Index()
  @Column()
  isSecure: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  source: string;

  @Column({ nullable: true, type: 'jsonb' })
  additional: Record<string, any>;
}
