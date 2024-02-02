import { MostDemandingProduct, TopReleases } from "./_components";

export default function Home() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <MostDemandingProduct />
      <TopReleases />
    </section>
  );
}
