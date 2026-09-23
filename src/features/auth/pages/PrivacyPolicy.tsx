import { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  Mail,
  Briefcase,
  Clock,
  ChevronUp,
  Search,
  Database,
  Compass,
  RefreshCw,
  HelpCircle,
  Cookie,
  ExternalLink,
  Users,
  Info,
  Lock,
  ClipboardCheck,
  ShieldAlert,
  AlertTriangle
} from "lucide-react";
import brandLogo from "@/assets/Tranzit_Logo.svg";
import brandLogoDark from "@/assets/Tranzit_Logo_dark.svg";
import { useTheme } from "@/app/providers/theme-provider";

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("what-is-personal-info");
  const [searchQuery, setSearchQuery] = useState("");

  const logoSrc = theme === "dark" ? brandLogoDark : brandLogo;

  // Handle scroll effects (progress bar and back to top button)
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      setShowScrollTop(window.scrollY > 300);

      // Detect active section in viewport
      const sectionIds = [
        "what-is-personal-info", "info-we-collect", "how-we-collect",
        "senders-recipients", "how-we-use", "who-we-disclose",
        "overseas-disclosure", "marketing", "cookies-analytics",
        "how-we-protect", "retention", "access-correction",
        "data-breaches", "third-party-services", "complaints",
        "changes-policy", "contact-us"
      ];

      let current = "what-is-personal-info";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    document.title = "Privacy Policy | Tranzit Group";
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Structured content for sections to support searching and rendering
  const sections = useMemo(() => [
    {
      id: "what-is-personal-info",
      num: "01",
      title: "1. What Is Personal Information",
      icon: <Info className="w-5 h-5 text-primary" />,
      searchText: "What Is Personal Information personal information identified individual reasonably identifiable true recorded material form",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            &quot;Personal information&quot; means information or an opinion about an identified individual, or an individual who is reasonably identifiable, whether the information is true or not and whether it is recorded in material form or not.
          </p>
        </div>
      )
    },
    {
      id: "info-we-collect",
      num: "02",
      title: "2. Personal Information We Collect",
      icon: <Database className="w-5 h-5 text-primary" />,
      searchText: "Personal Information We Collect account shipment payment billing integration tracking delivery communications technical usage name business ABN email telephone address username consignment card details wallet transactions ecommerce Shopify WooCommerce API credentials scan proof delivery photos support logs cookies",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The personal information we collect depends on how you interact with the Platform. It may include:
          </p>
          <div className="space-y-3 pt-2">
            {[
              {
                label: "Account information",
                desc: "name, business name, ABN, email address, telephone number, business address, username and account preferences."
              },
              {
                label: "Shipment information",
                desc: "sender and recipient names, collection and delivery addresses, contact telephone numbers, email addresses, delivery instructions, descriptions and values of goods, and related consignment details."
              },
              {
                label: "Payment and billing information",
                desc: "billing address, bank account details for direct debit, payment card details (processed and stored by our third-party payment providers — we do not store full card numbers on our own systems), wallet transactions, invoices and credit account information."
              },
              {
                label: "Integration data",
                desc: "order, product, customer and fulfilment information received from ecommerce platforms and other systems you connect to the Platform (for example Shopify or WooCommerce stores), and API credentials associated with those connections."
              },
              {
                label: "Tracking and delivery data",
                desc: "consignment status, scan events, proof-of-delivery information, delivery photographs and signatures provided by Carriers."
              },
              {
                label: "Communications",
                desc: "records of your correspondence with us, including support requests, emails, phone calls and messages sent through the Platform."
              },
              {
                label: "Technical and usage data",
                desc: "IP address, device and browser information, pages visited, actions taken on the Platform, log data, and information collected through cookies and similar technologies."
              }
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-850/40">
                <span className="text-xs font-bold text-primary uppercase tracking-wide block mb-1">{item.label}</span>
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "how-we-collect",
      num: "03",
      title: "3. How We Collect Personal Information",
      icon: <ClipboardCheck className="w-5 h-5 text-primary" />,
      searchText: "How We Collect Personal Information directly ecommerce store marketplace accounting software Carriers tracking proof delivery payment providers credit reporting identity verification cookies log files",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We collect personal information:
          </p>
          <ul className="space-y-2.5 pl-1 text-[14px]">
            {[
              "directly from you, when you create an account, request a quotation, book a shipment, contact support or otherwise use the Services;",
              "from systems you connect to the Platform, such as your ecommerce store, marketplace or accounting software;",
              "from Carriers and their systems, such as tracking events and proof-of-delivery records;",
              "from payment providers, credit reporting and identity-verification services where relevant to your account; and",
              "automatically, through cookies, log files and similar technologies when you use our website or Platform."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-slate-655 dark:text-zinc-300 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "senders-recipients",
      num: "04",
      title: "4. Personal Information About Senders and Recipients",
      icon: <Users className="w-5 h-5 text-primary" />,
      searchText: "Personal Information About Senders and Recipients parcel recipient sender transport goods names addresses contact authorized booking shipping document collection delivery Carrier tracking notification claim enquiry",
      content: (
        <div className="space-y-3.5">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Because the Platform is used to arrange the transport of goods, our customers routinely provide us with personal information about other individuals — in particular, the names, addresses and contact details of senders and parcel recipients.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where you provide us with personal information about another individual, you must ensure that you are authorised to do so, and that the individual has been made aware (where practicable) that their information will be used to arrange collection and delivery of a shipment and handled in accordance with this Privacy Policy.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We use sender and recipient information only for the purpose of providing the Services — principally to arrange bookings, generate shipping documentation, enable collection and delivery by Carriers, provide tracking and notifications, and manage claims and enquiries.
          </p>
        </div>
      )
    },
    {
      id: "how-we-use",
      num: "05",
      title: "5. How We Use Personal Information",
      icon: <Compass className="w-5 h-5 text-primary" />,
      searchText: "How We Use Personal Information provide operate administer Platform Services obtain quotations process freight booking Carrier generate shipping label consignment document tracking update delivery notification payment wallet transaction invoice adjustment credit account support enquiry claim integration ecommerce third party security fraud misuse compliance legal regulatory marketing",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We collect, hold and use personal information to:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 text-[14px]">
            {[
              "provide, operate and administer the Platform and Services;",
              "obtain quotations and process freight bookings with Carriers;",
              "generate shipping labels and consignment documentation;",
              "provide tracking updates and delivery notifications;",
              "process payments, wallet transactions, invoices and adjustments;",
              "assess and administer credit accounts where applicable;",
              "provide customer support and respond to enquiries;",
              "manage freight claims with Carriers;",
              "operate integrations with ecommerce and other third-party platforms;",
              "maintain the security of the Platform and prevent fraud and misuse;",
              "comply with our legal and regulatory obligations;",
              "improve and develop the Platform and Services; and",
              "with your consent or as permitted by law, send marketing communications about our Services."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {index + 1}
                </span>
                <span className="text-slate-655 dark:text-zinc-300 leading-normal">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "who-we-disclose",
      num: "06",
      title: "6. Who We Disclose Personal Information To",
      icon: <ExternalLink className="w-5 h-5 text-primary" />,
      searchText: "Who We Disclose Personal Information To Carriers agent contractor payment processor bank financial institution ecommerce Shopify WooCommerce integration hosting data storage communication analytics support IT provider credit reporting professional adviser lawyer accountant insurer purchaser assets government agency regulator law enforcement court sell",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We may disclose personal information to:
          </p>
          <ul className="space-y-2.5 pl-1 text-[14px]">
            {[
              "Carriers and their agents and contractors, to enable collection, transport, delivery and claims handling for your shipments;",
              "payment processors, banks and financial institutions, to process payments and manage billing;",
              "ecommerce and software platforms you have connected to your account (such as Shopify or WooCommerce), to operate the relevant integration;",
              "our service providers, including hosting, data storage, communications, analytics, customer-support and IT providers, who assist us in operating the Platform;",
              "credit reporting bodies and identity-verification providers, where relevant to credit accounts;",
              "our professional advisers, including lawyers, accountants and insurers, where reasonably required;",
              "a purchaser or prospective purchaser of our business or assets, subject to appropriate confidentiality protections; and",
              "government agencies, regulators, law enforcement and courts, where required or authorised by law."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span className="text-slate-655 dark:text-zinc-300 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <div className="bg-emerald-500/5 border-l-4 border-emerald-500 p-4 rounded-r-xl mt-4">
            <p className="my-0 text-sm font-bold text-emerald-800 dark:text-emerald-400">
              We do not sell personal information.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "overseas-disclosure",
      num: "07",
      title: "7. Overseas Disclosure",
      icon: <MapPin className="w-5 h-5 text-primary" />,
      searchText: "Overseas Disclosure service provider cloud hosting email analytics server outside Australia United States jurisdiction shipment overseas destination Carriers authority transport clear APPs Privacy Act",
      content: (
        <div className="space-y-3.5">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Some of our service providers — for example, cloud hosting, email and analytics providers — may store or process information on servers located outside Australia, including in the United States and other jurisdictions in which those providers operate. In addition, where a shipment is sent to or from an overseas destination, shipment details will be disclosed to the Carriers and authorities involved in transporting and clearing that shipment.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where we disclose personal information overseas, we take reasonable steps to ensure the recipient handles the information in a manner consistent with the APPs, or the disclosure is otherwise permitted under the Privacy Act.
          </p>
        </div>
      )
    },
    {
      id: "marketing",
      num: "08",
      title: "8. Marketing Communications",
      icon: <Mail className="w-5 h-5 text-primary" />,
      searchText: "Marketing Communications send marketing consent Spam Act unsubscribe link opt out operational account booking tracking billing security",
      content: (
        <div className="space-y-3.5">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We may send you marketing communications about our Services where you have consented or where otherwise permitted by law, including under the Spam Act 2003 (Cth).
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You can opt out of marketing communications at any time by using the unsubscribe link in the communication or by contacting us using the details below. Opting out of marketing does not affect operational communications relating to your account, bookings, tracking, billing or security, which we will continue to send while you use the Services.
          </p>
        </div>
      )
    },
    {
      id: "cookies-analytics",
      num: "09",
      title: "9. Cookies and Analytics",
      icon: <Cookie className="w-5 h-5 text-primary" />,
      searchText: "Cookies and Analytics cookies keep signed in remember preferences security analytics advertising Google Analytics browser settings functionality",
      content: (
        <div className="space-y-3.5">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Our website and Platform use cookies and similar technologies to keep you signed in, remember preferences, maintain security and understand how the Platform is used. We may use analytics and advertising services (such as Google Analytics and advertising platforms) that collect usage information through their own cookies in accordance with their own privacy policies.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You can control or delete cookies through your browser settings. Disabling cookies may affect the functionality of parts of the Platform.
          </p>
        </div>
      )
    },
    {
      id: "how-we-protect",
      num: "10",
      title: "10. How We Hold and Protect Personal Information",
      icon: <Lock className="w-5 h-5 text-primary" />,
      searchText: "How We Hold and Protect Personal Information electronic system protect misuse interference loss unauthorized access modification disclosure encryption data transit credentials API keys security",
      content: (
        <div className="space-y-3.5">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Personal information is held in electronic systems operated by us and our service providers. We take reasonable steps to protect personal information from misuse, interference, loss, and unauthorised access, modification or disclosure. These steps include access controls, authentication requirements, encryption of data in transit, network and application security measures, and staff confidentiality obligations.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You are responsible for maintaining the security of your own account credentials, API keys and connected systems, and for notifying us promptly if you suspect unauthorised access to your account. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </div>
      )
    },
    {
      id: "retention",
      num: "11",
      title: "11. Retention of Personal Information",
      icon: <Clock className="w-5 h-5 text-primary" />,
      searchText: "Retention of Personal Information retain reasonably required business transaction records claims disputes taxation corporate record keeping destroy de-identify Privacy Act",
      content: (
        <div className="space-y-3.5">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We retain personal information for as long as it is reasonably required for the purposes described in this Privacy Policy, including to provide the Services, maintain business and transaction records, manage claims and disputes, and comply with legal obligations such as taxation and corporate record-keeping requirements.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            When personal information is no longer required, we take reasonable steps to destroy it or de-identify it in accordance with the Privacy Act.
          </p>
        </div>
      )
    },
    {
      id: "access-correction",
      num: "12",
      title: "12. Access and Correction",
      icon: <ClipboardCheck className="w-5 h-5 text-primary" />,
      searchText: "Access and Correction request access correct inaccurate out of date incomplete irrelevant misleading verify identity refuse view update",
      content: (
        <div className="space-y-3.5">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You may request access to the personal information we hold about you, and ask us to correct information that is inaccurate, out of date, incomplete, irrelevant or misleading, by contacting us using the details below.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We will respond to access and correction requests within a reasonable period. We may need to verify your identity before providing access. In some circumstances we may refuse access where permitted by law — if we do, we will tell you why and how you may complain about the refusal. Account holders can also view and update much of their information directly within the Platform.
          </p>
        </div>
      )
    },
    {
      id: "data-breaches",
      num: "13",
      title: "13. Data Breaches",
      icon: <ShieldAlert className="w-5 h-5 text-primary" />,
      searchText: "Data Breaches identify assess respond data breaches serious harm notify affected individuals Office of the Australian Information Commissioner Notifiable Data Breaches scheme Privacy Act",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We maintain processes for identifying, assessing and responding to suspected data breaches. If a data breach occurs that is likely to result in serious harm to affected individuals, we will notify affected individuals and the Office of the Australian Information Commissioner in accordance with the Notifiable Data Breaches scheme under the Privacy Act.
          </p>
        </div>
      )
    },
    {
      id: "third-party-services",
      num: "14",
      title: "14. Third-Party Websites and Services",
      icon: <ExternalLink className="w-5 h-5 text-primary" />,
      searchText: "Third-Party Websites and Services links integrate third-party websites Carrier ecommerce payment provider privacy practices review policy",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The Platform may contain links to, or integrate with, third-party websites and services, including Carrier websites, ecommerce platforms and payment providers. Those third parties operate under their own privacy policies, and we are not responsible for their privacy practices. We encourage you to review the privacy policy of any third-party service you use in connection with the Platform.
          </p>
        </div>
      )
    },
    {
      id: "complaints",
      num: "15",
      title: "15. Privacy Complaints",
      icon: <AlertTriangle className="w-5 h-5 text-primary" />,
      searchText: "Privacy Complaints breached Privacy Act APPs concern handled complaint investigate response Office of the Australian Information Commissioner OAIC www.oaic.gov.au",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            If you believe we have breached the Privacy Act or the APPs, or you have a concern about how we have handled your personal information, please contact us using the details below with reasonable details of your complaint.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We will acknowledge your complaint, investigate it, and respond within a reasonable period (generally within 30 days). If you are not satisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC) at <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold transition-all">www.oaic.gov.au</a> or by calling <span className="font-bold text-slate-800 dark:text-zinc-200">1300 363 992</span>.
          </p>
        </div>
      )
    },
    {
      id: "changes-policy",
      num: "16",
      title: "16. Changes to This Privacy Policy",
      icon: <RefreshCw className="w-5 h-5 text-primary" />,
      searchText: "Changes to This Privacy Policy update reflect Services operations legal requirements published website Last Updated date materially affect",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We may update this Privacy Policy from time to time to reflect changes to our Services, business operations or legal requirements. The current version will be published on our website, and the &quot;Last Updated&quot; date above indicates when it was most recently revised. Where a change materially affects how we handle personal information, we will take reasonable steps to bring it to your attention.
          </p>
        </div>
      )
    },
    {
      id: "contact-us",
      num: "17",
      title: "17. Contact Us",
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      searchText: "Contact Us Questions requests complaints privacy directed Tranzit Group ABN 12 690 967 198 website tranzitgroup.com.au email info@tranzitgroup.com.au",
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Questions, requests or complaints about privacy can be directed to:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/40 flex flex-col items-center text-center hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500 mb-1">
                Business Details
              </span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">Tranzit Group</span>
              <span className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium font-mono">ABN: 12 690 967 198</span>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/40 flex flex-col items-center text-center hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500 mb-1">
                Website
              </span>
              <a
                href="https://tranzitgroup.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary hover:underline underline-offset-4 transition-colors"
              >
                tranzitgroup.com.au
              </a>
              <span className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">Official Portal</span>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/40 flex flex-col items-center text-center hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500 mb-1">
                Privacy Email
              </span>
              <a
                href="mailto:info@tranzitgroup.com.au"
                className="font-bold text-primary hover:underline underline-offset-4 transition-colors"
              >
                info@tranzitgroup.com.au
              </a>
              <span className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">Response within 24-48h</span>
            </div>
          </div>
        </div>
      )
    }
  ], []);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(query) ||
        sec.searchText.toLowerCase().includes(query)
    );
  }, [searchQuery, sections]);

  return (
    <div className="min-h-screen bg-slate-55 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 selection:bg-primary/20 transition-colors duration-300 relative overflow-x-clip">

      {/* Decorative Top-Right Soft Mesh Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] left-[-100px] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/40 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logoSrc} alt="Tranzit Group Logo" className="h-14 w-auto" />
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 bg-slate-100/50 dark:bg-zinc-800/30 px-3.5 py-2 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Updated: 17 August 2026</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">

          {/* Left Column: Sidebar Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 self-start bg-white/50 dark:bg-zinc-900/35 p-6 rounded-2xl border border-slate-200/45 dark:border-zinc-800/45 backdrop-blur-sm shadow-xs">
            <nav className="space-y-1.5 pl-1 py-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-850 scrollbar-track-transparent">
              <span className="block text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500 mb-4 pl-1">
                Document Index
              </span>
              {sections.map((section) => {
                const isSectionVisible = filteredSections.some((s) => s.id === section.id);
                return (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className={`flex items-center gap-2 text-[13px] py-2 px-3 rounded-lg transition-all duration-200 hover:text-primary ${activeSection === section.id
                      ? "text-primary font-bold bg-primary/5 border-l-2 border-primary pl-2.5 shadow-2xs"
                      : "text-slate-500 dark:text-zinc-400 border-l-2 border-transparent font-medium hover:bg-slate-50/50 dark:hover:bg-zinc-900/50"
                      } ${!isSectionVisible ? "opacity-30 line-through" : ""}`}
                  >
                    <span className="text-[10px] font-bold opacity-60">{section.num}</span>
                    <span>{section.title.split(". ")[1]}</span>
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Right Column: Main Terms Document */}
          <main className="lg:col-span-9 space-y-6">

            {/* Top Intro Section Card */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
                <div>
                  <h1 className="mt-0 mb-1 text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                    Privacy Policy
                  </h1>
                </div>
              </div>
              <p className="text-sm text-slate-655 dark:text-zinc-350 leading-relaxed max-w-2xl">
                Tranzit Group ABN 12 690 967 198 (&quot;Tranzit Group&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;) provides a technology and freight-management platform that enables customers to compare freight services, obtain quotations, book shipments, generate shipping labels, track consignments and manage related shipping functionality (the &quot;Platform&quot; and &quot;Services&quot;).
              </p>
              <p className="text-sm text-slate-655 dark:text-zinc-350 leading-relaxed max-w-2xl mt-3">
                This Privacy Policy explains how we collect, hold, use and disclose personal information, and how you can access and correct that information or make a privacy complaint. We are committed to handling personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (&quot;APPs&quot;).
              </p>
              <p className="text-sm text-slate-655 dark:text-zinc-350 leading-relaxed max-w-2xl mt-3 font-semibold">
                By using our website, Platform or Services, or by providing personal information to us, you consent to the collection, use and disclosure of personal information as described in this Privacy Policy. This Privacy Policy should be read together with our Terms and Conditions.
              </p>

              {/* Modern Interactive Search Bar */}
              <div className="mt-8 relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search policy sections, keywords, terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* List of Section Cards */}
            <div className="space-y-6">
              {filteredSections.length > 0 ? (
                filteredSections.map((sec) => (
                  <section
                    key={sec.id}
                    id={sec.id}
                    className={`scroll-mt-28 bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-2.5xl p-6 sm:p-8 shadow-2xs hover:shadow-xs hover:border-primary/25 dark:hover:border-primary/20 transition-all duration-300 group relative ${activeSection === sec.id ? "ring-2 ring-primary/10 border-primary/20 dark:border-primary/10" : ""
                      }`}
                  >
                    {/* Glowing Accent for Active Section */}
                    {activeSection === sec.id && (
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-primary rounded-t-2.5xl" />
                    )}

                    {/* Section Card Header */}
                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-zinc-800/65 pb-4 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-primary/8 dark:bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-3xs">
                        {sec.icon}
                      </div>
                      <h2 className="text-lg my-0 font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {sec.title}
                      </h2>
                      <span className="ml-auto text-2xl font-black text-slate-100 dark:text-zinc-800/60 pointer-events-none select-none">
                        {sec.num}
                      </span>
                    </div>

                    {/* Section Card Content */}
                    <div className="text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
                      {sec.content}
                    </div>
                  </section>
                ))
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl p-12 text-center shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-zinc-500">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Matching Sections Found</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                    We couldn't find any terms matching &quot;{searchQuery}&quot;. Please try another search term or browse the categories.
                  </p>
                </div>
              )}
            </div>

            {/* Document Footer */}
            <div className="mt-16 pt-8 border-t border-slate-100 dark:border-zinc-800/80 text-center text-xs text-slate-400 dark:text-zinc-500">
              <p>&copy; {new Date().getFullYear()} Tranzit Group. All Rights Reserved.</p>
            </div>

          </main>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-primary/20 transition-all duration-300 z-40 active:scale-95 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
