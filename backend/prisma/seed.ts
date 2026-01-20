import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Rozpoczynam seeding bazy danych...');

 
  const magickaTemplar = await prisma.build.create({
    data: {
      title: 'Magicka Templar Beam',
      class: 'Templar',
      role: 'DPS',
      items: {
        create: [
          { name: 'Deadly Strike', slot: 'Chest', trait: 'Divines' },
          { name: 'Order\'s Wrath', slot: 'Legs', trait: 'Divines' },
          { name: 'Velothi Ur-Mage', slot: 'Necklace', trait: 'Bloodthirsty' },
        ],
      },
    },
  });

  const staminaDK = await prisma.build.create({
    data: {
      title: 'Stamina Dragonknight',
      class: 'Dragonknight',
      role: 'Tank',
      items: {
        create: [
          { name: 'Turning Tide', slot: 'Chest', trait: 'Reinforced' },
          { name: 'Nazaray', slot: 'Head', trait: 'Infused' },
        ],
      },
    },
  });

  console.log({ magickaTemplar, staminaDK });
  console.log('Seeding zakończony sukcesem!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });