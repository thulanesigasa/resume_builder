import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | rbptech",
  description: "Review our shipping and digital delivery policy for rbptech's services.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-deep">
          Shipping & <span className="text-brand-indigo glow-text-brand">Delivery</span> Policy
        </h1>
        <p className="text-brand-navy/70 text-sm">Last updated: June 2026</p>
      </div>

      <div className="prose prose-sm prose-slate max-w-none text-brand-navy/80 space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">1. Digital Goods and Delivery</h2>
          <p>
            rbptech operates entirely as a digital Software-as-a-Service (SaaS) platform. We do not sell or ship any physical goods or merchandise. All products and services offered on our platform, including AI-generated resumes, cover letters, and document compilations, are digital in nature.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">2. Instant Access and Processing</h2>
          <p>
            Upon successful payment processing via our payment gateway (PayFast), the credits or services purchased are immediately applied to your account.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Digital Document Generation:</strong> Once you trigger a document generation or compilation, the resulting digital file (PDF or HTML) is immediately rendered and made available for download directly within your user dashboard.</li>
            <li><strong>Processing Time:</strong> Processing is typically instant, though AI generation may take up to 60 seconds depending on server load and document complexity.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">3. Shipping Fees</h2>
          <p>
            Because all our services are delivered digitally over the internet, there are absolutely <strong>no shipping fees, handling fees, or physical delivery charges</strong> associated with any purchase on rbptech.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">4. Access Issues</h2>
          <p>
            If you have successfully completed a payment but the digital credits or generated documents are not appearing in your dashboard, please ensure you are logged into the correct account. If the issue persists, please contact our support team immediately so we can manually provision your digital access.
          </p>
        </section>
      </div>
    </div>
  );
}
