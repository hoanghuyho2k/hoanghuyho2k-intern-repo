import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';

@Entity()
export class SecretNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    transformer: new EncryptionTransformer({
      key: process.env.ENCRYPTION_KEY!,
      algorithm: 'aes-256-cbc',
      ivLength: 16,
    }),
  })
  note: string;
}