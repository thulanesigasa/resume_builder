import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | rbptech",
  description: "Read our privacy policy to understand how we secure your personal data, raw CV details, and generated documents in Supabase.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-deep">
          Privacy <span className="text-brand-indigo glow-text-brand">Policy</span>
        </h1>
        <p className="text-brand-navy/70 text-sm">Last updated: June 2026</p>
      </div>

      <div className="prose prose-sm prose-slate max-w-none text-brand-navy/80 space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">1. Introduction & Scope</h2>
          <p>
            Welcome to rbptech ("Company", "we", "our", "us"). We respect your privacy and are deeply committed to protecting your personal data and ensuring transparency regarding how we handle your information. This comprehensive Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our application, or engage with our services (collectively, the "Services"). It applies to all users across the globe.
          </p>
          <p>
            Please read this privacy notice carefully as it will help you understand what we do with the information that we collect. By accessing or using our Services, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy. If there are any terms in this privacy notice that you do not agree with, please discontinue use of our Services immediately.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products, participate in activities on the Services, or otherwise contact us. The personal information that we collect depends on the context of your interactions with us and the Services.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Identity Data:</strong> Includes first name, last name, username, and title.</li>
            <li><strong>Contact Data:</strong> Includes email address, physical address, and telephone numbers.</li>
            <li><strong>Professional Data:</strong> Includes your raw resume data, employment history, educational background, professional certificates, technical skills, target job descriptions, parsed PDFs, and generated cover letters.</li>
            <li><strong>Financial Data:</strong> Includes payment card details. All payment data is collected and processed securely by Stripe. We do not store your full credit card numbers or banking details on our servers.</li>
            <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data:</strong> Includes information about how you use our website and services, such as ATS scoring metrics, compilation history, interaction logs, frequency of use, and feature preferences.</li>
            <li><strong>Marketing and Communications Data:</strong> Includes your preferences in receiving marketing from us and your communication preferences.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">3. How We Process Your Information</h2>
          <p>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with the law. We may also process your information for other purposes with your consent. Specifically, we process your information for the following reasons:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>To facilitate account creation and authentication:</strong> We process your information so you can create and log in to your account securely via our authentication providers (e.g., Supabase).</li>
            <li><strong>To deliver and facilitate delivery of services:</strong> We process your Professional Data to generate ATS-optimized resumes and cover letters. This requires sending specific contextual data to our AI sub-processors (e.g., OpenAI).</li>
            <li><strong>To process payments and manage orders:</strong> We use your Financial and Contact Data to process transactions securely via our payment gateway and manage billing, accounting, and subscription lifecycles.</li>
            <li><strong>To respond to user inquiries and offer support:</strong> We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.</li>
            <li><strong>To send administrative information:</strong> We may process your information to send you details about our products and services, changes to our terms and policies, and other similar essential information.</li>
            <li><strong>To protect our Services:</strong> We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.</li>
            <li><strong>To evaluate and improve our Services:</strong> We may process your information when we believe it is necessary to identify usage trends, determine the effectiveness of our promotional campaigns, and to evaluate and improve our Services, products, marketing, and your experience.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">4. Legal Bases for Processing (GDPR & UK GDPR)</h2>
          <p>If you are located in the European Union (EU) or the United Kingdom (UK), this section applies to you. The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Consent:</strong> We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time.</li>
            <li><strong>Performance of a Contract:</strong> We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you, including providing our Services or at your request prior to entering into a contract with you.</li>
            <li><strong>Legitimate Interests:</strong> We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests, provided those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for diagnosing technical issues or improving our platform.</li>
            <li><strong>Legal Obligations:</strong> We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">5. Data Sharing and Sub-Processors</h2>
          <p>We only share information with the following categories of third parties to facilitate our Services. We have entered into data processing agreements with these vendors to ensure they protect your personal data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Cloud Computing Services:</strong> We use Supabase to securely store your user profiles, generated documents, and authentication data in encrypted PostgreSQL databases and S3-compatible storage buckets.</li>
            <li><strong>AI and Machine Learning Processors:</strong> We utilize OpenAI's API to perform the semantic matching, structuring, and tailoring of your resume data. <em>Crucially, data sent to OpenAI via their API is strictly governed by their enterprise data privacy agreements. Your personal data is NOT used to train their global foundational models.</em></li>
            <li><strong>Payment Processors:</strong> We use Stripe to handle all financial transactions securely. Stripe adheres to strict PCI-DSS standards.</li>
            <li><strong>Analytics Providers:</strong> We may use analytics services (such as Google Analytics or Vercel Web Analytics) to monitor and analyze the use of our Service, helping us understand user behavior and optimize performance.</li>
            <li><strong>Legal and Regulatory Authorities:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">6. Data Retention and Deletion</h2>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). 
          </p>
          <p>
            You retain the absolute right to delete your data at any time. When you select "Delete Account" or "Delete Document" within the rbptech dashboard, we hard-delete the corresponding data rows from our Supabase databases and permanently remove associated files from our storage buckets. No residual copies are kept beyond standard rolling encrypted database backups, which are automatically destroyed after a maximum period of 30 days. Once deleted, your professional data cannot be recovered.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">7. International Data Transfers</h2>
          <p>
            We are globally distributed, and our servers may be located in various jurisdictions including the United States and Europe. If you are accessing our Services from outside these regions, please be aware that your information may be transferred to, stored, and processed by us in our facilities and by those third parties with whom we may share your personal information.
          </p>
          <p>
            If you are a resident in the European Economic Area (EEA) or United Kingdom (UK), then these countries may not necessarily have data protection laws or other similar laws as comprehensive as those in your country. However, we will take all necessary measures to protect your personal information in accordance with this privacy notice and applicable law, including implementing the European Commission's Standard Contractual Clauses for transfers of personal information between our group companies and with our third-party providers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">8. Security of Your Information</h2>
          <p>
            We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. For example, all data transmission is encrypted using Transport Layer Security (TLS/SSL) technology, and our databases utilize row-level security (RLS) to strictly isolate user data. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">9. Policy Regarding Children</h2>
          <p>
            We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">10. Do-Not-Track Features</h2>
          <p>
            Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">11. Privacy Rights for California Residents (CCPA/CPRA)</h2>
          <p>
            If you are a resident of California, you are granted specific rights regarding access to your personal information under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA).
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right to Know:</strong> You have the right to request that we disclose the categories and specific pieces of personal information we have collected about you.</li>
            <li><strong>Right to Delete:</strong> You have the right to request the deletion of your personal information, subject to certain exceptions.</li>
            <li><strong>Right to Correct:</strong> You have the right to request the correction of inaccurate personal information we hold about you.</li>
            <li><strong>Right to Opt-Out:</strong> We do not sell your personal information. However, if we ever engage in the "sharing" of personal information for cross-context behavioral advertising, you have the right to opt-out.</li>
            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA rights.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">12. Cookies and Tracking Technologies</h2>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information, remember your authentication session, and analyze platform traffic. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice. Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">13. State-Specific Privacy Rights (VCDPA, CPA, CTDPA, UCPA, Nevada)</h2>
          <p>
            In addition to California, residents of specific US states have specific rights regarding their personal data under their respective comprehensive state privacy laws. This includes the Virginia Consumer Data Protection Act (VCDPA), the Colorado Privacy Act (CPA), the Connecticut Data Privacy Act (CTDPA), and the Utah Consumer Privacy Act (UCPA).
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right to Access:</strong> You have the right to confirm whether we are processing your personal data and to access such personal data.</li>
            <li><strong>Right to Correction:</strong> You have the right to correct inaccuracies in your personal data, taking into account the nature of the personal data and the purposes of processing.</li>
            <li><strong>Right to Deletion:</strong> You have the right to delete personal data provided by or obtained about you.</li>
            <li><strong>Right to Data Portability:</strong> You have the right to obtain a copy of your personal data that you previously provided to us in a portable and, to the extent technically feasible, readily usable format.</li>
            <li><strong>Right to Opt-Out:</strong> You have the right to opt-out of the processing of personal data for purposes of targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects concerning you.</li>
          </ul>
          <p>
            <strong>Nevada Residents:</strong> Nevada law (NRS 603A.340) requires each business to establish a designated request address where Nevada consumers may submit requests directing the business not to sell certain kinds of personal information that the business has collected or will collect about the consumer. A sale under Nevada law is the exchange of personal information for monetary consideration by the business to a third party for the third party to license or sell the personal information to other third parties. We do not currently sell personal data as defined under Nevada law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">14. Exercising Data Subject Rights</h2>
          <p>
            To exercise any of your privacy rights described above, please submit a verifiable consumer request to us by contacting our Data Protection Officer using the contact information below. Only you, or a person registered with the appropriate state authority that you authorize to act on your behalf, may make a verifiable consumer request related to your personal information.
          </p>
          <p>
            We cannot respond to your request or provide you with personal information if we cannot verify your identity or authority to make the request and confirm the personal information relates to you. Making a verifiable consumer request does not require you to create an account with us. We will only use personal information provided in a verifiable consumer request to verify the requestor's identity or authority to make the request. We aim to respond to verifiable consumer requests within 45 days of receipt. If we require more time (up to an additional 45 days), we will inform you of the reason and extension period in writing.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">15. Automated Decision-Making and AI Profiling</h2>
          <p>
            Our core services utilize artificial intelligence and machine learning algorithms to evaluate your input data (resume and job description) to generate highly tailored output (cover letters, optimized resumes). While this involves automated processing of your Professional Data, we do NOT engage in "Automated Decision-Making" or "Profiling" that produces legal or similarly significant effects concerning you (such as automatically approving or denying credit, housing, or employment). Our AI acts solely as an drafting assistant under your direct control. You are responsible for reviewing and authorizing all AI-generated content before using it for employment applications.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">16. Information Collected from Other Sources</h2>
          <p>
            We may obtain information about you from other sources, such as public databases, joint marketing partners, social media platforms (such as LinkedIn, if you choose to integrate or authenticate via those platforms in the future), as well as from other third parties. Examples of the information we receive from other sources include social media profile information; marketing leads and search results and links, including paid listings (such as sponsored links).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">17. Aggregated and De-Identified Data</h2>
          <p>
            We may aggregate or de-identify the information described above. Aggregated or de-identified data is not subject to this Privacy Policy. We may use such aggregated or de-identified data for any purpose, including for research and marketing purposes, and may also share such data with any third parties, including advertisers, promotional partners, and sponsors.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">18. Business Transfers and M&A Activity</h2>
          <p>
            We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company. If we are involved in a merger, acquisition, or sale of all or a portion of our assets, you will be notified via email and/or a prominent notice on our website of any change in ownership or uses of your personal information, as well as any choices you may have regarding your personal information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">19. Security Breach Notification</h2>
          <p>
            In the event that any information under our control is compromised as a result of a breach of security, we will take reasonable steps to investigate the situation and, where appropriate, notify those individuals whose information may have been compromised and take other steps, in accordance with any applicable laws and regulations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">20. Third-Party Payment Processing Data</h2>
          <p>
            When you purchase a subscription or credits, your payment is processed directly by our third-party payment processor, Stripe. We do not collect, process, or store your full credit card numbers, expiration dates, or CVV codes. Stripe’s use of your personal information is governed by their independent privacy policy. We only receive secure payment tokens and basic billing data (such as your zip code and the last four digits of your card) to fulfill your orders and manage subscriptions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">21. Telemetry and Crash Reporting</h2>
          <p>
            To ensure the stability and reliability of our platform, we utilize automated telemetry and crash reporting services (such as Sentry or Datadog). If the application crashes or encounters an error, these services automatically collect diagnostic data, which may include your IP address, browser type, device type, operating system version, the specific sequence of actions leading to the crash, and non-sensitive application state data. This data is strictly used for debugging and improving the stability of our Services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">22. Internal Research and Development</h2>
          <p>
            We may use your personal data, specifically your usage patterns and feature adoption rates, for our internal research and development purposes. This helps us understand which features are most valuable to our users and guides our future product roadmap. This processing is based on our legitimate interest in improving and innovating our product offerings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">23. Vendor Management and Auditing</h2>
          <p>
            We enforce strict data processing agreements with all our third-party vendors and sub-processors. These agreements mandate that our vendors implement robust security measures and process your personal data solely according to our documented instructions. We reserve the right to audit our vendors' security compliance to ensure your data remains protected throughout the entire supply chain.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">24. Biometric Data Disclaimer</h2>
          <p>
            We do not collect, process, or store any biometric data (such as fingerprints, facial recognition scans, or voiceprints) under any circumstances. If any future feature requires biometric verification, we will obtain your explicit, written, opt-in consent prior to any collection, in strict compliance with the Illinois Biometric Information Privacy Act (BIPA) and other applicable biometric privacy laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">25. Updates to this Policy</h2>
          <p>
            We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-brand-deep">26. Contact Information</h2>
          <p>
            If you have questions or comments about this notice, you may email our Data Protection Officer (DPO) at kairosounds.01@gmail.com or by post to:
          </p>
          <p className="text-brand-navy/60 italic border-l-4 border-brand-indigo pl-4 mt-2 py-2">
            <strong>rbptech Legal Department</strong><br/>
            Johannesburg, Gauteng<br/>
            South Africa
          </p>
        </section>
      </div>
    </div>
  );
}
