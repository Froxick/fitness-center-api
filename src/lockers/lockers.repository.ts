import { Injectable } from '@nestjs/common';
import { Locker } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LockersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<
    (Locker & {
      client: { id: string; surname: string; name: string } | null;
    })[]
  > {
    return await this.prisma.locker.findMany({
      orderBy: { number: 'asc' },
      include: {
        client: {
          select: { id: true, surname: true, name: true },
        },
      },
    });
  }

  async findById(id: string): Promise<Locker | null> {
    return await this.prisma.locker.findUnique({
      where: { id },
    });
  }

  async assignToClient(lockerId: string, clientId: string): Promise<Locker> {
    return await this.prisma.locker.update({
      where: { id: lockerId },
      data: {
        client: { connect: { id: clientId } },
      },
    });
  }

  async isOccupied(lockerId: string): Promise<boolean> {
    return this.prisma.client
      .findFirst({ where: { lockerId } })
      .then((c) => c !== null);
  }
}
