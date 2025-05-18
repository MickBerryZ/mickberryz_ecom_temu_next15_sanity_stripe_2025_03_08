import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";
import { sanityFetch } from "@/sanity/lib/live";
import { Product, ProductCategory } from "@/sanity.types";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export const getAllProducts = async () => {
  const query = `*[_type == "product"]`;
  const products = await sanityFetch({ query: query });
  return products.data as Product[];
};

export const getAllCategories = async () => {
  const query = `*[_type == "productCategory"]`;
  // const query = `*[_type == "ProductCategory"]`;
  const categories = await sanityFetch({ query: query });
  return categories.data as ProductCategory[];
};
