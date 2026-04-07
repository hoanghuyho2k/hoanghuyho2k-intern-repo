
# Using typeorm-encrypted for Data Encryption

## Install packages

```bash
npm install typeorm-encrypted
```

## Add encryption key to .env

```bash
ENCRYPTION_KEY=...
```

## Update env validation in app.module.ts

Add validation to Joi schema:

```bash
ENCRYPTION_KEY: Joi.string().required(),
```

## Create the entity

src/secret-note/secret-note.entity.ts

```typescript
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
```

## Create DTO

src/secret-note/create-secret-note.dto.ts

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSecretNoteDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}
```

## Create services

src/secret-note/secret-note.service.ts

```typescript
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
```

## Create controller

src/secret-note/secret-note.controller.ts

```typescript
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
```

## Create module

src/secret-note/secret-note.module.ts

```typescript
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
```

## Register module in app.module.ts

```typescript
import { SecretNoteModule } from './secret-note/secret-note.module';
```

## Start the app

```bash
npm run start:dev
```

## Test creating a secret note

```bash
curl -X POST http://localhost:3000/secret-notes \
-H "Content-Type: application/json" \
-d '{"note":"My private data"}'
```

Output:

```bash
{"id":1,"note":"My private data"}%
```

## Check raw database value

```bash
docker exec -it focusbear-postgres psql -U postgres -d focusbear_dev
```

```bash
SELECT * FROM secret_note;
```

Output:

```bash
psql (17.9 (Debian 17.9-1.pgdg13+1))
Type "help" for help.

focusbear_dev=# SELECT * FROM secret_note;
 id |                     note                     
----+----------------------------------------------
  1 | 3YI7qwR+QVm5I9sb4gbxaauK+QU0VSrMxYpVjDlQOqA=
(1 row)

focusbear_dev=# 
```

## Reflection

Why does Focus Bear double encrypt sensitive data instead of relying on database encryption alone?

Database encryption at rest protects the storage layer, while field-level encryption protects selected values inside the database itself. Using both gives stronger defense in depth, especially for highly sensitive data. This is an inference from how `typeorm-encrypted` encrypts individual fields before they are persisted.

How does `typeorm-encrypted` integrate with TypeORM entities?

`typeorm-encrypted` integrates through TypeORM entity columns, most commonly by using an `EncryptionTransformer` in the `@Column()` definition so values are encrypted on write and decrypted on read.

What are the best practices for securely managing encryption keys?

Encryption keys should be stored outside source code, such as in environment variables or secret managers, rotated carefully, and restricted so only the application or trusted infrastructure can access them. This is consistent with secure configuration practices and is especially important because the key is required to decrypt protected data.

What are the trade-offs between encrypting at the database level vs. the application level?

Database-level encryption protects stored database files and infrastructure, while application-level encryption protects specific fields more directly. Application-level encryption gives finer-grained protection but adds complexity for key management, indexing, and querying encrypted columns. The fine-grained field behavior is exactly what `typeorm-encrypted` is designed for.
