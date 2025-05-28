import SalesCampaignBanner from "@/components/layout/SalesCampaignBanner";
import { getProductById } from "@/sanity/lib/client";
import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product.price) {
    return <div>Product not found</div>;
  }
  const originalPrice = product.price * 5;
  return (
    <div className="bg-gray-50">
      <SalesCampaignBanner />

      {/* Breadcrump Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto py-3 px-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>

      {/* Product Sale Banner */}
      {/* Guarantee Items */}
      {/* Product Details */}
      <div>{JSON.stringify(product)}</div>
    </div>
  );
};

export default ProductPage;
