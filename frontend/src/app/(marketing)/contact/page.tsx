import { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Support | rbptech",
  description: "Get in touch with our team for questions about billing, enterprise ATS compatibility, or technical support.",
};

export default function ContactPage() {
  return <ContactForm />;
}
