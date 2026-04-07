import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretNoteController } from './secret-note.controller';
import { SecretNote } from './secret-note.entity';
import { SecretNoteService } from './secret-note.service';

@Module({
  imports: [TypeOrmModule.forFeature([SecretNote])],
  controllers: [SecretNoteController],
  providers: [SecretNoteService],
})
export class SecretNoteModule {}