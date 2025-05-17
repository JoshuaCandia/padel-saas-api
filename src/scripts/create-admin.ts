import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();

  const email = 'joshuacandia99@gmail.com';
  const passwordPlain = '94140462321456';
  const phone = '1141739482'; // un teléfono ficticio para admin
  const name = 'Joshua';
  const surname = 'Candia';

  // Verificar si el admin ya existe
  const adminExists = await prisma.user.findUnique({ where: { email } });
  if (adminExists) {
    console.log('Admin user already exists.');
    await prisma.$disconnect();
    return;
  }

  // Encriptar contraseña
  const hashedPassword = await bcrypt.hash(passwordPlain, 10);

  // Crear admin
  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      phone,
      name,
      surname,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created successfully!');
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
