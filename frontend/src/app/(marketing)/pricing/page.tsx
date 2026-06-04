import { Metadata } from "next";
import PricingTiers from "./PricingTiers";

export const metadata: Metadata = {
  title: "Simple Pay-As-You-Go Pricing | rbptech",
  description: "No subscriptions or lock-in. Pay only for what you generate. Check out our simple, transparent resume and cover letter tailoring credits.",
};

export default function PricingPage() {
  return <PricingTiers />;
}
