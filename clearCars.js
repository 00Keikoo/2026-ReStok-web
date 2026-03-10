const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.carMedia.deleteMany()
  await prisma.car.deleteMany()
  console.log('✅ Semua data mobil berhasil dihapus!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
