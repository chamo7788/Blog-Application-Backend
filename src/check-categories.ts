import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();
  console.log('Current categories:', categories);

  if (categories.length === 0) {
    console.log('No categories found. Seeding initial categories...');
    const initialCategories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Design', 'Health'];
    for (const name of initialCategories) {
      await prisma.category.create({ data: { name } });
    }
    const updatedCategories = await prisma.category.findMany();
    console.log('Seeded categories:', updatedCategories);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
