import Navbar from '@/components/landing/Navbar';
import Pricing from '@/components/landing/Pricing';

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <div className="pt-20">
        <Pricing />
      </div>
    </main>
  );
}
