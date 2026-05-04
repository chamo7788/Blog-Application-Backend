const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Find or Create Default Admin User
  let admin = await prisma.user.findUnique({
    where: { email: 'admin@blog.com' }
  });

  if (!admin) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    admin = await prisma.user.create({
      data: {
        email: 'admin@blog.com',
        password: hashedPassword,
        name: 'Blog Admin',
        role: 'ADMIN'
      }
    });
    console.log('- Created default admin user: admin@blog.com');
  } else {
    console.log('- Admin user already exists');
  }

  // 2. Define Categories and Post Content
  const seedingData = [
    {
      name: 'Technology',
      post: {
        title: 'The Future of AI: Beyond the Hype',
        content: 'Artificial Intelligence is no longer just a buzzword. From generative models to autonomous systems, AI is reshaping how we work and live. In this post, we explore the ethical implications and the transformative potential of the next generation of AI technologies.'
      }
    },
    {
      name: 'Lifestyle',
      post: {
        title: 'Mastering the Art of Minimalism',
        content: 'Minimalism isn\'t just about owning fewer things; it\'s about making room for what truly matters. We dive into practical tips for decluttering your physical space and your mind to live a more intentional and fulfilling life.'
      }
    },
    {
      name: 'Travel',
      post: {
        title: 'Hidden Gems of the Mediterranean',
        content: 'Escape the crowds and discover the untouched beauty of the Mediterranean coast. From secret coves in Albania to the quiet villages of Crete, we share our top picks for an authentic coastal getaway.'
      }
    },
    {
      name: 'Food',
      post: {
        title: 'The Secret to the Perfect Sourdough',
        content: 'Baking sourdough is a labor of love. We break down the science of fermentation and share a step-by-step guide to achieving that perfect airy crumb and golden, crackly crust right in your home kitchen.'
      }
    },
    {
      name: 'Design',
      post: {
        title: 'Modernism Reimagined',
        content: 'How do classic design principles adapt to a digital-first world? We examine the intersection of mid-century modern aesthetics and contemporary UX/UI trends, showing how timeless design continues to evolve.'
      }
    },
    {
      name: 'Health',
      post: {
        title: 'The Science of Sleep and Productivity',
        content: 'Sleep is the ultimate performance enhancer. Understand the circadian rhythm and learn how optimizing your sleep environment can lead to better cognitive function, emotional stability, and overall physical health.'
      }
    }
  ];

  // 3. Seed Categories and Posts
  for (const item of seedingData) {
    try {
      // Upsert Category
      const category = await prisma.category.upsert({
        where: { name: item.name },
        update: {},
        create: { name: item.name },
      });
      console.log(`- Verified category: ${item.name}`);

      // Create Post if it doesn't exist for this category
      const existingPost = await prisma.post.findFirst({
        where: { 
          categoryId: category.id,
          title: item.post.title
        }
      });

      if (!existingPost) {
        await prisma.post.create({
          data: {
            title: item.post.title,
            content: item.post.content,
            published: true,
            authorId: admin.id,
            categoryId: category.id
          }
        });
        console.log(`  - Created seeded post for ${item.name}: "${item.post.title}"`);
      } else {
        console.log(`  - Seeded post already exists for ${item.name}`);
      }
    } catch (e) {
      console.error(`- Failed to seed ${item.name}:`, e.message);
    }
  }

  console.log('Done.');
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
