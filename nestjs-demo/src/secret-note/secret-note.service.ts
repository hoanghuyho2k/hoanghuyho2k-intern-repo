import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecretNote } from './secret-note.entity';

@Injectable()
export class SecretNoteService {
  constructor(
    @InjectRepository(SecretNote)
    private readonly secretNoteRepository: Repository<SecretNote>,
  ) {}

  create(note: string) {
    const secretNote = this.secretNoteRepository.create({ note });
    return this.secretNoteRepository.save(secretNote);
  }

  findAll() {
    return this.secretNoteRepository.find();
  }

  findOne(id: number) {
    return this.secretNoteRepository.findOneBy({ id });
  }
}