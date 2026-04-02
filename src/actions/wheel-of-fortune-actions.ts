"use server";

import { Product } from "@/sanity.types";
// import { createClient } from "next-sanity";
import { client } from "@/sanity/lib/client";

const getWeightedWinningIndex = (products: Product[]) => {
  const rand = Math.random() * 100;

  // 1. Roll the dice to see what they theoretically won
  if (rand <= 1) {
    return 0; // 1% chance - Grand Prize (Most Expensive)
  } else if (rand <= 4) {
    return 1; // 3% chance (Total 4%) - 2nd Prize
  } else if (rand <= 10) {
    return 2; // 6% chance (Total 10%) - 3rd Prize
  } else if (rand <= 20) {
    return 3; // 10% chance (Total 20%) - 4th Prize
  } else if (rand <= 40) {
    return 4; // 20% chance (Total 40%) - 5th Prize
  } else if (rand <= 65) {
    return 5; // 25% chance (Total 65%) - 6th Prize
  } else {
    return 6; // 35% chance (Total 100%) - 7th Prize (Cheapest)
  }
};

export const getWheelOfFortuneConfiguration = async () => {
  try {
    const query = `*[_type == "product"][0...7]`;
    let randomProducts: Product[] = await client.fetch(query);

    // Safety check: if we don't have enough products, just return safely
    if (!randomProducts || randomProducts.length === 0) {
      return { randomProducts: [], winningIndex: 0 };
    }

    // 2. Sort by price descending (Highest price = index 0)
    randomProducts = randomProducts.sort(
      (a, b) => (b.price || 0) - (a.price || 0),
    );

    // 3. Calculate the winning index based on our math
    const winningIndex = getWeightedWinningIndex(randomProducts);

    // 4. Return the configuration to the frontend
    return {
      randomProducts,
      winningIndex,
    };
  } catch (error) {
    console.error("Error fetching wheel configuration:", error);
    // Fallback in case of an error
    return {
      randomProducts: [],
      winningIndex: 0,
    };
  }
};

//   const client = createClient({
//     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
//     apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
//     useCdn: true,
//   });
//   const randomProducts = await client.fetch<Product[]>(
//     `*[_type == "product"][0..6]`,
//   );

//   const today = new Date();
//   const day = today.getDate();
//   const mouth = today.getMonth() + 1; // Months are zero-based
//   const year = today.getFullYear();

//   const winningIndex = (day * 31 + mouth * 12 + year) % randomProducts.length;

//   return {
//     randomProducts,
//     winningIndex,
//   };
// };
