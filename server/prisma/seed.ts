// import { PrismaClient } from "@prisma/client";
// import fs from "fs";
// import path from "path";
// const prisma = new PrismaClient();

// async function deleteAllData(orderedFileNames: string[]) {
//   const modelNames = orderedFileNames.map((fileName) => {
//     const modelName = path.basename(fileName, path.extname(fileName));
//     // return modelName.charAt(0).toUpperCase() + modelName.slice(1);
//     return modelName.charAt(0).toLowerCase() + modelName.slice(1);
//   });

//   for (const modelName of modelNames) {
//     const model: any = prisma[modelName as keyof typeof prisma];
//     if (model) {
//       await model.deleteMany({});
//       console.log(`Cleared data from ${modelName}`);
//     } else {
//       console.error(
//         `Model ${modelName} not found. Please ensure the model name is correctly specified.`,
//       );
//     }
//   }
// }

// async function main() {
//   const dataDirectory = path.join(__dirname, "seedData");

//   const orderedFileNames = [
//     "products.json",
//     "expenseSummary.json",
//     "sales.json",
//     "salesSummary.json",
//     "purchases.json",
//     "purchaseSummary.json",
//     "users.json",
//     "expenses.json",
//     "expenseByCategory.json",
//   ];

//   await deleteAllData(orderedFileNames);

//   for (const fileName of orderedFileNames) {
//     const filePath = path.join(dataDirectory, fileName);
//     const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
//     // const modelName = path.basename(fileName, path.extname(fileName));
//     const rawName = path.basename(fileName, path.extname(fileName));
//     const modelName = rawName.charAt(0).toLowerCase() + rawName.slice(1);

//     const model: any = prisma[modelName as keyof typeof prisma];

//     if (!model) {
//       console.error(`No Prisma model matches the file name: ${fileName}`);
//       continue;
//     }

//     for (const data of jsonData) {
//       await model.create({
//         data,
//       });
//     }

//     console.log(`Seeded ${modelName} with data from ${fileName}`);
//   }
// }

// main()
//   .catch((e) => {
//     console.error(e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


import { PrismaClient } from "../generated/prisma";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Explicit mapping between json files and prisma models
const modelMap: Record<string, any> = {
  "products.json": prisma.products,
  "expenseSummary.json": prisma.expenseSummary,
  "sales.json": prisma.sales,
  "salesSummary.json": prisma.salesSummary,
  "purchases.json": prisma.purchases,
  "purchaseSummary.json": prisma.purchaseSummary,
  "users.json": prisma.users,
  "expenses.json": prisma.expenses,
  "expenseByCategory.json": prisma.expenseByCategory,
};

async function deleteAllData() {
  for (const fileName of Object.keys(modelMap)) {
    const model = modelMap[fileName];

    if (model) {
      await model.deleteMany({});
      console.log(`Cleared data from ${fileName}`);
    } else {
      console.log(`Model missing for ${fileName}`);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  await deleteAllData();

  for (const fileName of Object.keys(modelMap)) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    );

    const model = modelMap[fileName];

    if (!model) {
      console.error(`No model for ${fileName}`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({
        data,
      });
    }

    console.log(`Seeded ${fileName}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });