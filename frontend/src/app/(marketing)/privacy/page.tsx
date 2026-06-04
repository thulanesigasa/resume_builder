"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-deep">
          Privacy <span className="text-brand-indigo glow-text-brand">Policy</span>
        </h1>
        <p className="text-brand-navy/70 text-sm">Last updated: October 2023</p>
      </div>

      <div className="prose prose-sm prose-slate max-w-none text-brand-navy/80 space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">1. Introduction & Scope</h2>
          <p>
            Welcome to rbptech ("Company", "we", "our", "us"). We respect your privacy and are deeply committed to protecting your personal data. This comprehensive Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our application, or engage with our services (collectively, the "Services").
          </p>
          <p>
            Please read this privacy notice carefully as it will help you understand what we do with the information that we collect. If there are any terms in this privacy notice that you do not agree with, please discontinue use of our Services immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products, or otherwise contact us.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Identity Data:</strong> Includes first name, last name, username, and title.</li>
            <li><strong>Contact Data:</strong> Includes email address and billing address.</li>
            <li><strong>Professional Data:</strong> Includes your resume data, employment history, educational background, skills, target job descriptions, and generated cover letters.</li>
            <li><strong>Financial Data:</strong> Includes payment card details. All payment data is collected and processed securely by Stripe. We do not store your full credit card numbers on our servers.</li>
            <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data:</strong> Includes information about how you use our website and services, such as ATS scoring metrics, compilation history, and interaction logs.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">3. How We Process Your Information</h2>
          <p>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>To facilitate account creation and authentication:</strong> We process your information so you can create and log in to your account securely via Supabase.</li>
            <li><strong>To deliver and facilitate delivery of services:</strong> We process your Professional Data to generate ATS-optimized resumes and cover letters. This requires sending specific data to our AI sub-processors (e.g., OpenAI).</li>
            <li><strong>To process payments:</strong> We use your Financial Data to process transactions securely via our payment gateway.</li>
            <li><strong>To respond to user inquiries/offer support:</strong> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.</li>
            <li><strong>To send administrative information:</strong> We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">4. Legal Bases for Processing (GDPR & UK GDPR)</h2>
          <p>If you are located in the EU or UK, this section applies to you. We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Consent:</strong> We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose.</li>
            <li><strong>Performance of a Contract:</strong> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you, including providing our Services.</li>
            <li><strong>Legitimate Interests:</strong> We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests, provided those interests do not outweigh your interests and fundamental rights.</li>
            <li><strong>Legal Obligations:</strong> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">5. Data Sharing and Sub-Processors</h2>
          <p>We only share information with the following categories of third parties to facilitate our Services:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Cloud Computing Services:</strong> We use Supabase to securely store your user profiles, generated documents, and authentication data.</li>
            <li><strong>AI and Machine Learning Processors:</strong> We utilize OpenAI's API to perform the semantic matching and tailoring of your resume data. <em>Crucially, data sent to OpenAI via their API is strictly governed by their enterprise data privacy agreements and is NOT used to train their global foundational models.</em></li>
            <li><strong>Payment Processors:</strong> We use Stripe to handle all financial transactions securely.</li>
            <li><strong>Analytics Providers:</strong> We may use analytics services to monitor and analyze the use of our Service.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">6. Data Retention and Deletion</h2>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
          </p>
          <p>
            You retain the right to delete your data at any time. When you select "Delete Account" or "Delete Document" within the rbptech dashboard, we hard-delete the corresponding data from our Supabase databases and storage buckets. No residual copies are kept beyond standard rolling database backups which are destroyed after 30 days.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">7. Your Privacy Rights (CCPA, GDPR)</h2>
          <p>Depending on where you are located geographically, you may have specific privacy rights regarding your personal information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>The right to request access and obtain a copy of your personal information.</li>
            <li>The right to request rectification or erasure of your personal information.</li>
            <li>The right to restrict the processing of your personal information.</li>
            <li>The right to data portability (receiving your data in a structured, machine-readable format).</li>
          </ul>
          <p>To exercise these rights, please contact us at the email provided below. We will consider and act upon any request in accordance with applicable data protection laws.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">8. Cookies and Tracking Technologies</h2>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">9. Contact Information</h2>
          <p>
            If you have questions or comments about this notice, you may email our Data Protection Officer (DPO) at support@rbptech.com or by post to:
          </p>
          <p className="text-brand-navy/60 italic">
            rbptech Legal Department<br/>
            [Company Address Placeholder]<br/>
            [City, State, Zip]
          </p>
        </section>
      </div>
    </div>
  );
}
