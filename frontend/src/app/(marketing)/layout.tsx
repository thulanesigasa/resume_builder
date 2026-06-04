import MarketingHeader from "@/components/MarketingHeader";
import MarketingFooter from "@/components/MarketingFooter";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-brand-light">
      <MarketingHeader />
      <main className="flex-1 pt-24 pb-12">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
