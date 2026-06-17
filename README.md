# Fitness Center REST API — Часть 2

Расширение REST API фитнес-центра: подключение PostgreSQL через Prisma ORM, новые сущности (шкафчики, дополнительные услуги), автоматическое заполнение БД при первом запуске.

## Ветка для второй части

```bash
git checkout part-2
```

---

## 1. Выбор технологий

| Технология | Версия | Назначение |
|---|---|---|
| Node.js | 20+ | Среда выполнения |
| TypeScript | 5+ | Язык разработки |
| NestJS | 10+ | Фреймворк для REST API |
| PostgreSQL | 15+ | Реляционная база данных |
| Prisma ORM | 7+ | Работа с БД, миграции, типизация |
| @prisma/adapter-pg | 7+ | Адаптер подключения к PostgreSQL |
| class-validator | 0.14+ | Валидация входных данных |
| class-transformer | 0.5+ | Преобразование типов |

**Почему PostgreSQL** — надёжная реляционная СУБД, хорошо подходит для связанных сущностей.

**Почему Prisma** — типобезопасные запросы генерируются из схемы, встроенные миграции, удобный `include` для связанных данных вместо ручных JOIN.

**Почему трёхслойная архитектура** — замена репозиториев с in-memory Map на Prisma не потребовала изменений в контроллерах и сервисах. Только файлы `*.repository.ts`.

---

## 2. Шаги по реализации

### 2.1. Установка зависимостей

```bash
npm install prisma @prisma/client @prisma/adapter-pg
npm install dotenv
npx prisma init
```

### 2.2. Настройка подключения

Создать файл `.env` в корне проекта:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/fitness_center"
```

Конфигурация Prisma в `prisma.config.ts`:

```ts
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL },
});
```

### 2.3. Схема базы данных (`prisma/schema.prisma`)

Сущности и связи:

- `Trainer` → `Client`: один ко многим (у тренера много клиентов)
- `Client` → `Locker`: один к одному (у клиента максимум один шкафчик)
- `Client` ↔ `Service`: многие ко многим через `ClientService`

### 2.4. Миграция и генерация клиента

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 2.5. PrismaService

Глобальный модуль `PrismaModule` оборачивает `PrismaClient` и управляет жизненным циклом соединения через `OnModuleInit` / `OnModuleDestroy`.

### 2.6. Seed — автозаполнение БД

Скрипт `prisma/seed.ts` заполняет БД начальными данными при первом запуске:
- **20 шкафчиков** (номера 1–20) — создаются только если таблица пустая
- **5 услуг** (Солярий, Бассейн, Сауна, Криосауна, Кроссфит) — через `upsert`, безопасно при повторном запуске

### 2.7. Замена репозиториев

Репозитории `TrainersRepository` и `ClientsRepository` переписаны с `Map` на методы Prisma (`findMany`, `findUnique`, `create`, `update`). Контроллеры и сервисы не изменялись.

### 2.8 Новые модули - Locker,Additional-services

Добавлены новые module,controller,service,repository для новых сущностей 

### 2.9. Структура проекта

```
src/
├── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── trainers/
│   ├── dto/
│   ├── trainers.controller.ts
│   ├── trainers.service.ts
│   ├── trainers.repository.ts
│   └── trainers.module.ts
├── clients/
│   ├── dto/
│   ├── clients.controller.ts
│   ├── clients.service.ts
│   ├── clients.repository.ts
│   └── clients.module.ts
├── lockers/
│   ├── lockers.controller.ts
│   ├── lockers.service.ts
│   ├── lockers.repository.ts
│   └── lockers.module.ts
├── additional-services/
│   ├── additional-services.controller.ts
│   ├── additional-services.service.ts
│   ├── additional-services.repository.ts
│   └── additional-services.module.ts
└── main.ts
```

---

## 3. Инструкция по запуску

### Требования
- Node.js 20+
- PostgreSQL 15+

### Шаги

**1. Клонировать репозиторий и перейти в ветку**
```bash
git clone <url>
cd fitness-center-api
git checkout part-2
```

**2. Установить зависимости**
```bash
npm install
```

**3. Создать `.env` файл**
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/fitness_center"
```

**4. Создать базу данных в PostgreSQL**
```sql
CREATE DATABASE fitness_center;
```

**5. Применить миграции**
```bash
npx prisma migrate deploy
```

**6. Сгенерировать Prisma Client**
```bash
npx prisma generate
```

**7. Заполнить БД начальными данными**
```bash
npm run prisma:seed
```

**8. Запустить сервер**
```bash
npm run start:dev
```

Сервер запустится на `http://localhost:3000`

---

## 4. REST API — все эндпоинты

### Тренеры (`/api/trainers`)

| Метод | Путь | Описание | Статус |
|---|---|---|---|
| POST | /api/trainers | Создать тренера | 201 |
| GET | /api/trainers | Список всех тренеров | 200 |
| GET | /api/trainers/:id/detail | Тренер + список его клиентов  | 200 |
| PUT | /api/trainers/:id | Обновить данные тренера | 200 |
| PATCH | /api/trainers/:id/status | Изменить статус тренера | 200 |

### Клиенты (`/api/clients`)

| Метод | Путь | Описание | Статус |
|---|---|---|---|
| POST | /api/clients | Создать клиента | 201 |
| GET | /api/clients | Список всех клиентов | 200 |
| GET | /api/clients/:id | Краткая информация о клиенте | 200 |
| GET | /api/clients/:id/detail | Клиент + тренер + шкафчик + услуги | 200 |
| PUT | /api/clients/:id | Обновить данные клиента | 200 |
| PATCH | /api/clients/:id/status | Активировать / деактивировать | 200 |
| POST | /api/clients/:clientId/trainer/:trainerId | Назначить тренера | 200 |
| POST | /api/clients/:clientId/locker/:lockerId | Назначить шкафчик | 200 |
| POST | /api/clients/:clientId/additionalServices/:serviceId | Добавить услугу | 200 |

### Шкафчики (`/api/lockers`)

| Метод | Путь | Описание | Статус |
|---|---|---|---|
| GET | /api/lockers | Список всех шкафчиков со статусом | 200 |

### Дополнительные услуги (`/api/additionalServices`)

| Метод | Путь | Описание | Статус |
|---|---|---|---|
| GET | /api/additionalServices | Список всех услуг с ценами | 200 |
| GET | /api/additionalServices/:id | Услуга + список подписанных клиентов | 200 |

### Бизнес-правила (ошибки)

| Ситуация | Статус |
|---|---|
| Ресурс не найден | 404 |
| Невалидные данные в теле запроса | 400 |
| Шкафчик уже занят другим клиентом | 409 |
| У клиента уже есть этот шкафчик | 409 |
| Клиент уже подписан на эту услугу | 409 |

---

## 5. Демонстрация результата

### Список шкафчиков со статусом (GET /api/lockers)
![Список шкафчиков](./docs/screenshots/get-lockers.png)

### Список услуг (GET /api/additionalServices)
![Список услуг](./docs/screenshots/get-services.png)

### Услуга с клиентами (GET /api/additionalServices/POOL)
![Услуга с клиентами](./docs/screenshots/get-service-detail.png)

### Назначение шкафчика клиенту (POST /api/clients/:clientId/locker/:lockerId)
![Назначение шкафчика](./docs/screenshots/assign-locker.png)

### 409 — шкафчик уже занят
![Конфликт шкафчика](./docs/screenshots/locker-conflict.png)

### Добавление услуги клиенту (POST /api/clients/:clientId/additionalServices/SAUNA)
![Добавление услуги](./docs/screenshots/assign-service.png)

### 409 — услуга уже добавлена
![Конфликт услуги](./docs/screenshots/service-conflict.png)

### Детальная информация о клиенте — тренер + шкафчик + услуги (GET /api/clients/:id/detail)
![Детальная информация о клиенте](./docs/screenshots/get-client-detail-full.png)

