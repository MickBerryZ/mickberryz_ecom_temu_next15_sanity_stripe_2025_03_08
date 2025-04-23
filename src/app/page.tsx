import { getCurrentSession } from "@/actions/auth";
import { getAllProducts } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

const Home = async () => {
  const { user } = await getCurrentSession();

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home;
