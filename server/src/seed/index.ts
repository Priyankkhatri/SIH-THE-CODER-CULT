import { seedDatabase } from './data';
import prisma from '../config/database';

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected to database\n');
    await seedDatabase();
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
