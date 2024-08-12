import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book as BookModel } from '@prisma/client';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async createBook(
    @Body() body: { title: string; author: string; publishedDate: Date },
  ): Promise<BookModel> {
    return this.booksService.createBook(body);
  }

  @Get()
  async getBooks(): Promise<BookModel[]> {
    return this.booksService.getBooks();
  }

  @Get(':id')
  async getBookById(@Param('id') id: number): Promise<BookModel | null> {
    return this.booksService.getBookById(+id);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: number,
    @Body() body: { title?: string; author?: string; publishedDate?: Date },
  ): Promise<BookModel> {
    return this.booksService.updateBook(+id, body);
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: number): Promise<BookModel> {
    return this.booksService.deleteBook(+id);
  }
}
