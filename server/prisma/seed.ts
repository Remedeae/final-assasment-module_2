import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create games
  const games = await prisma.game.createMany({
    data: [
      { name: "Watch the Kitten" },
      { name: "Kitten Watch" },
      { name: "Forest Meditation" },
      { name: "The Staring Contest" },
    ],
  });

  console.log("✅ Games created");

  const allGames = await prisma.game.findMany();

  // Create users and sessions
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        profilePic: faker.image.avatarGitHub(),
      },
    });

    const numSessions = faker.number.int({ min: 4, max: 12 });
    const sessions = Array.from({ length: numSessions }).map(() => ({
      userId: user.id,
      gameId: faker.helpers.arrayElement(allGames).id,
      timePlayed: faker.number.int({ min: 5, max: 180 }), // minutes
      createdAt: faker.date.recent({ days: 30 }),
    }));

    await prisma.session.createMany({ data: sessions });
    console.log(
      `🧑‍💻 User ${user.firstName} created with ${numSessions} sessions`
    );
  }

  console.log("🌼 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
