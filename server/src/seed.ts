import { prisma } from "./db";

async function main() {
  // games
  const gameNames = ["Game 1", "Game 2", "Game 3", "Game 4"];
  for (const name of gameNames) {
    await prisma.game.upsert({ where: { name }, update: {}, create: { name } });
  }
  // 8 demo users
  const users = [
    {
      email: "nicklas@example.com",
      firstName: "Nicklas",
      lastName: "Svensson",
    },
    { email: "sabrina@example.com", firstName: "Sabrina", lastName: "Taylor" },
    { email: "tim@example.com", firstName: "Tim", lastName: "Nilsson" },
    { email: "jacky@example.com", firstName: "Jacky", lastName: "Chang" },
    { email: "maya@example.com", firstName: "Maya", lastName: "Karlsson" },
    { email: "lars@example.com", firstName: "Lars", lastName: "Johansson" },
    {
      email: "patience@example.com",
      firstName: "Patience",
      lastName: "Adebayo",
    },
    { email: "kunikan@example.com", firstName: "Kunikan", lastName: "Lee" },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }
  console.log("Seeded games and users.");
}

main().finally(async () => prisma.$disconnect());
