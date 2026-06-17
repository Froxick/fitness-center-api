import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const lockerCount = await prisma.locker.count();

  if (lockerCount === 0) {
    console.log('Создаём шкафчики 1–20...');
    await prisma.locker.createMany({
      data: Array.from({ length: 20 }, (_, i) => ({ number: i + 1 })),
    });
    console.log('Шкафчики созданы');
  } else {
    console.log(`Шкафчики уже существуют (${lockerCount} шт.), пропускаем`);
  }

  const services = [
    { id: 'SOLARIUM', name: 'Солярий', price: 400 },
    { id: 'POOL', name: 'Бассейн', price: 200 },
    { id: 'SAUNA', name: 'Сауна', price: 0 },
    { id: 'CRYOSAUNA', name: 'Криосауна', price: 1000 },
    { id: 'CROSSFIT', name: 'Кроссфит', price: 500 },
  ];

  console.log('Создаём / обновляем услуги...');
  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: { name: service.name, price: service.price },
      create: service,
    });
  }
  console.log('Услуги созданы');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
