// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* //for date manipulations
const minutes = (n: number) => n * 60 * 1000;
function addMinutes(d: Date, m: number) {
  return new Date(d.getTime() + minutes(m));
}
function daysAgo(n: number) {
  const d = new Date();
  d.setHours(9, 0, 0, 0); // start days at 09:00 for readability
  d.setDate(d.getDate() - n);
  return d;
}
function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  // 1) Clean tables (order matters because of FKs)
  await prisma.gameSession.deleteMany();
  await prisma.game.deleteMany();
  await prisma.user.deleteMany();

  // 2) Create 10 users
  await prisma.user.createMany({
    data: [
      {
        email: "user1@example.com",
        firstName: "Sanna-Maya",
        lastName: "Blomdahl",
        profilePic: null,
      },
      {
        email: "user2@example.com",
        firstName: "Pesh",
        lastName: "May",
        profilePic: null,
      },
      {
        email: "user3@example.com",
        firstName: "Michiel",
        lastName: "Gragt",
        profilePic: null,
      },
      {
        email: "user4@example.com",
        firstName: "Diana",
        lastName: "Davis",
        profilePic: null,
      },
      {
        email: "user5@example.com",
        firstName: "Ethan",
        lastName: "Edwards",
        profilePic: null,
      },
      {
        email: "user6@example.com",
        firstName: "Fiona",
        lastName: "Foster",
        profilePic: null,
      },
      {
        email: "user7@example.com",
        firstName: "George",
        lastName: "Garcia",
        profilePic: null,
      },
      {
        email: "user8@example.com",
        firstName: "Hannah",
        lastName: "Hughes",
        profilePic: null,
      },
      {
        email: "user9@example.com",
        firstName: "Ian",
        lastName: "Iverson",
        profilePic: null,
      },
      {
        email: "user10@example.com",
        firstName: "Julia",
        lastName: "Johnson",
        profilePic: null,
      },
    ],
  });

  // 3) Create 4 games
  await prisma.game.createMany({
    data: [
      { name: "Game 1" },
      { name: "Game 2" },
      { name: "Game 3" },
      { name: "Game 4" },
    ],
  });

  // 4) Fetch created records (we need their ids)
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
  const games = await prisma.game.findMany({ orderBy: { createdAt: "asc" } });

  // 5) Build some simple sessions:
  //    - For each user, create 2 finished sessions on different recent days
  //    - One extra "active" session (no endedAt/durationSec) for the first user
  const sessions: {
    userId: number;
    gameId: string;
    startedAt: Date;
    endedAt?: Date;
    durationSec?: number;
    createdAt: Date;
  }[] = [];

  users.forEach((u, i) => {
    // finished session 1 (2–5 days ago, 15–40 min)
    {
      const game = pick(games);
      const startedAt = daysAgo(5 - (i % 4)); // spread across past few days
      const endedAt = addMinutes(startedAt, 20 + (i % 21)); // ~20–40 min
      const durationSec = Math.floor(
        (endedAt.getTime() - startedAt.getTime()) / 1000
      );
      sessions.push({
        userId: u.id,
        gameId: game.id,
        startedAt,
        endedAt,
        durationSec,
        createdAt: new Date(startedAt),
      });
    }

    // finished session 2 (0–2 days ago, 10–30 min)
    {
      const game = pick(games);
      const startedAt = daysAgo(i % 3); // today, 1, or 2 days ago
      const endedAt = addMinutes(startedAt, 10 + (i % 21)); // ~10–30 min
      const durationSec = Math.floor(
        (endedAt.getTime() - startedAt.getTime()) / 1000
      );
      sessions.push({
        userId: u.id,
        gameId: game.id,
        startedAt,
        endedAt,
        durationSec,
        createdAt: new Date(startedAt),
      });
    }
  });

  // one active session (no endedAt/durationSec) for demo purposes
  if (users.length > 0) {
    const startedAt = daysAgo(0); // today at ~09:00
    sessions.push({
      userId: users[0].id,
      gameId: pick(games).id,
      startedAt,
      createdAt: new Date(startedAt),
    });
  }

  // 6) Insert sessions
  await prisma.gameSession.createMany({ data: sessions });

  console.log(`Seed complete:
  - Users:   ${users.length}
  - Games:   ${games.length}
  - Sessions:${sessions.length}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
 */

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        email: "user1@example.com",
        firstName: "Sanna-Maya",
        lastName: "Blomdahl",
        profilePic: null,
      },
      {
        email: "user2@example.com",
        firstName: "Pesh",
        lastName: "May",
        profilePic: null,
      },
      {
        email: "user3@example.com",
        firstName: "Michiel",
        lastName: "Gragt",
        profilePic: null,
      },
      {
        email: "user4@example.com",
        firstName: "Diana",
        lastName: "Davis",
        profilePic: null,
      },
      {
        email: "user5@example.com",
        firstName: "Ethan",
        lastName: "Edwards",
        profilePic: null,
      },
      {
        email: "user6@example.com",
        firstName: "Fiona",
        lastName: "Foster",
        profilePic: null,
      },
      {
        email: "user7@example.com",
        firstName: "George",
        lastName: "Garcia",
        profilePic: null,
      },
      {
        email: "user8@example.com",
        firstName: "Hannah",
        lastName: "Hughes",
        profilePic: null,
      },
      {
        email: "user9@example.com",
        firstName: "Ian",
        lastName: "Iverson",
        profilePic: null,
      },
      {
        email: "user10@example.com",
        firstName: "Julia",
        lastName: "Johnson",
        profilePic: null,
      },
    ],
  });
  await prisma.game.createMany({
    data: [
      { name: "Kitten Watch" },
      { name: "Watch the Kitten" },
      { name: "Forest Meditation" },
      { name: "The Staring Contest" },
    ],
  });
}

seed().then(() => prisma.$disconnect);
