import "dotenv/config";
import prisma from "../src/db/prisma.js";

const seedData = [
  {
    name: "Premium Sofa",
    categoryName: "Furniture",
    description: "Comfortable 3-seater gray sofa, perfect for living rooms.",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"],
    brand: "Ikea",
    color: "Gray",
    size: "3-Seater",
    quantityTotal: 5,
    durationUnit: "MONTHLY",
    price: 850,
  },
  {
    name: "Gaming Laptop",
    categoryName: "Electronics",
    description: "High-performance Intel i7, RTX 4060 laptop.",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"],
    brand: "Dell",
    color: "Black",
    size: "15.6 Inch",
    quantityTotal: 8,
    durationUnit: "DAILY",
    price: 500,
  },
  {
    name: "Smart TV",
    categoryName: "Electronics",
    description: "55-inch 4K UHD Smart TV with HDR10+.",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800"],
    brand: "Samsung",
    color: "Black",
    size: "55 Inch",
    quantityTotal: 6,
    durationUnit: "DAILY",
    price: 650,
  },
  {
    name: "Professional Camera",
    categoryName: "Electronics",
    description: "Full-frame mirrorless camera for 4K video recording.",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"],
    brand: "Sony",
    color: "Black",
    size: "Compact",
    quantityTotal: 4,
    durationUnit: "DAILY",
    price: 900,
  },
  {
    name: "MacBook Pro",
    categoryName: "Electronics",
    description: "Apple M3 Pro chip, 18GB RAM, 512GB SSD.",
    images: ["https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=800"],
    brand: "Apple",
    color: "Gray",
    size: "14 Inch",
    quantityTotal: 7,
    durationUnit: "DAILY",
    price: 750,
  },
  {
    name: "PlayStation 5",
    categoryName: "Gaming",
    description: "Next-gen console with DualSense wireless controller.",
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800"],
    brand: "Sony",
    color: "White",
    size: "Standard",
    quantityTotal: 10,
    durationUnit: "DAILY",
    price: 450,
  },
  {
    name: "King Size Bed",
    categoryName: "Furniture",
    description: "Wooden king-size bed frame with memory foam mattress.",
    images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800"],
    brand: "Ikea",
    color: "White",
    size: "King",
    quantityTotal: 3,
    durationUnit: "MONTHLY",
    price: 1200,
  },
  {
    name: "Studio Speakers",
    categoryName: "Audio",
    description: "High-fidelity Bluetooth wireless studio speakers.",
    images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800"],
    brand: "Sony",
    color: "Black",
    size: "Medium",
    quantityTotal: 12,
    durationUnit: "DAILY",
    price: 350,
  },
];

async function seed() {
  console.log("Seeding initial products into Neon PostgreSQL database...");

  // Default pricelist
  let defaultPricelist = await prisma.pricelist.findFirst({
    where: { isDefault: true },
  });
  if (!defaultPricelist) {
    defaultPricelist = await prisma.pricelist.create({
      data: { name: "Default Standard Pricelist", isDefault: true },
    });
  }

  for (const item of seedData) {
    // Category
    let category = await prisma.category.findFirst({
      where: { name: item.categoryName },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name: item.categoryName },
      });
    }

    // Product
    const sku = `${item.brand.toUpperCase()}_${item.name.toUpperCase().replace(/\s+/g, "_")}`;
    const product = await prisma.product.create({
      data: {
        name: item.name,
        description: item.description,
        categoryId: category.id,
        images: item.images,
        isRentable: true,
        variants: {
          create: {
            sku,
            brand: item.brand,
            color: item.color,
            size: item.size,
            quantityTotal: item.quantityTotal,
            quantityAvailable: item.quantityTotal,
          },
        },
      },
      include: { variants: true },
    });

    // Pricelist Rule
    await prisma.pricelistRule.create({
      data: {
        pricelistId: defaultPricelist.id,
        productId: product.id,
        variantId: product.variants[0]?.id || null,
        durationValue: 1,
        durationUnit: item.durationUnit,
        price: item.price,
      },
    });
  }

  console.log("Database successfully seeded with initial products!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
