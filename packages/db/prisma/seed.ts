import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminClerkId = process.env.SEED_ADMIN_CLERK_USER_ID;

  if (adminClerkId) {
    await prisma.profile.upsert({
      where: { clerkUserId: adminClerkId },
      update: { role: Role.ADMIN },
      create: { clerkUserId: adminClerkId, role: Role.ADMIN },
    });
  }

  await prisma.template.upsert({
    where: { id: "starter-template" },
    update: {
      name: "Starter Modern",
      thumbnailUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      previewUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      isActive: true,
    },
    create: {
      id: "starter-template",
      name: "Starter Modern",
      thumbnailUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      previewUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      templateHtml:
        "<main><h1>{{profile.name}}</h1><p>{{profile.email}}</p>{{#each sections}}<section><h2>{{title}}</h2>{{#each items}}<article><h3>{{title}}</h3>{{#each bullets}}<p>{{this}}</p>{{/each}}</article>{{/each}}</section>{{/each}}</main>",
      isActive: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
