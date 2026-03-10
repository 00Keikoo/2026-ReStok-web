const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hashed = await bcrypt.hash('admin123', 10)
  await prisma.user.update({
    where: { email: 'admin@gmail.com' },
    data: { password: hashed }
  })
  console.log('Password berhasil direset ke: admin123')
}

main()
  .finally(() => prisma.$disconnect())
