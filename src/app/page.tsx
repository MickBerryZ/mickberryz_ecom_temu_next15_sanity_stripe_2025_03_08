import { getCurrentSession } from "@/actions/auth";
import SalesCampaignBanner from "@/components/layout/SalesCampaignBanner";
import WheelOfFortune from "@/components/layout/WheelOfFortune";
import ProductGrid from "@/components/product/ProductGrid";
import { getAllProducts } from "@/sanity/lib/client";

const Home = async () => {
  const { user } = await getCurrentSession();

  const products = await getAllProducts();

  return (
    <div>
      <SalesCampaignBanner />
      <WheelOfFortune />

      <section className="container mx-auto py-8">
        <ProductGrid products={products} />
      </section>
    </div>
  );
};

export default Home;
