import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book, Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async createBook(data: Prisma.BookCreateInput): Promise<Book | null> {
    try {
      return await this.prisma.book.create({ data });
    } catch (error) {
      throw new BadRequestException('invalid input');
    }
  }

  async getBooks(): Promise<Book[]> {
    try {
      return await this.prisma.book.findMany();
    } catch (error) {
      throw new BadRequestException('Failed to retrieve books');
    }
  }

  async getBookById(id: number): Promise<Book | null> {
    try {
      const book = await this.prisma.book.findUnique({ where: { id } });
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      return book;
    } catch (error) {
      throw new BadRequestException('Failed to retrieve book');
    }
  }

  async updateBook(id: number, data: Prisma.BookUpdateInput): Promise<Book> {
    try {
      const book = await this.prisma.book.update({ where: { id }, data });
      return book;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      throw new BadRequestException('Failed to update book');
    }
  }

  async deleteBook(id: number): Promise<Book> {
    try {
      const book = await this.prisma.book.delete({ where: { id } });
      return book;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Book with id ${id} not found`);
      }
      throw new BadRequestException('Failed to delete book');
    }
  }
}
