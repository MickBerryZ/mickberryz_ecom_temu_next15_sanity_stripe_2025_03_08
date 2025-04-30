import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";

type ProductItemProps = {
  product: Product;
};
const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden relative">
      <div className="absolute top-2 right-2 z-10">
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce ">
          HOT!
        </span>
      </div>

      <div className="relative h-48 w-full">
        {product.image && (
          <Image
            src={urlFor(product.image).width(256).url()}
            alt={product.title || "Product Image"}
            fill
            className="object-contain p-2"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
};

export default ProductItem;
