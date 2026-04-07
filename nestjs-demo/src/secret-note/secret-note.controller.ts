import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateSecretNoteDto } from './create-secret-note.dto';
import { SecretNoteService } from './secret-note.service';

@Controller('secret-notes')
export class SecretNoteController {
  constructor(private readonly secretNoteService: SecretNoteService) {}

  @Post()
  create(@Body() body: CreateSecretNoteDto) {
    return this.secretNoteService.create(body.note);
  }

  @Get()
  findAll() {
    return this.secretNoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.secretNoteService.findOne(id);
  }
}