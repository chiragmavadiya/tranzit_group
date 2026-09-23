import { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  Mail,
  Briefcase,
  Clock,
  ChevronUp,
  Search,
  BookOpen,
  Key,
  ShieldAlert,
  AlertTriangle,
  ClipboardCheck,
  ExternalLink,
  Scale,
  XCircle,
  HelpCircle,
  Info,
  DollarSign,
  Truck,
  Box,
  FileText,
  Shield,
  CreditCard,
  Wallet,
  Percent,
  Link,
  Lock,
  Code,
  Activity,
  UserPlus,
  ArrowRightLeft,
  Phone,
  CheckCircle,
  FileEdit,
  Bell,
  Gavel,
  RefreshCw
} from "lucide-react";
import brandLogo from "@/assets/Tranzit_Logo.svg";
import brandLogoDark from "@/assets/Tranzit_Logo_dark.svg";
import { useTheme } from "@/app/providers/theme-provider";

export default function TermsAndConditions() {
  const { theme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("definitions");
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
        "definitions",
        "tranzit-group-role",
        "account-registration",
        "business-use",
        "freight-quotations",
        "rate-availability",
        "customer-shipment-information",
        "weight-and-dimensions",
        "reweighing-and-remeasurement",
        "additional-carrier-charges",
        "bookings",
        "labels-and-shipping-documentation",
        "collection-and-pickup",
        "transit-times-and-delivery-estimates",
        "authority-to-leave-and-safe-drop",
        "packaging",
        "prohibited-goods",
        "dangerous-goods",
        "loss-or-damage",
        "freight-claims",
        "transit-cover",
        "carrier-liability",
        "fees-and-payment",
        "gst",
        "credit-accounts",
        "wallet-or-prepaid-balance",
        "payment-processing-fees",
        "invoice-disputes",
        "overdue-accounts",
        "cancellations-and-refunds",
        "third-party-platforms-and-integrations",
        "platform-availability",
        "australian-consumer-law",
        "limitation-of-liability",
        "customer-indemnity",
        "intellectual-property",
        "customer-data",
        "privacy",
        "security",
        "api-usage",
        "prohibited-platform-activities",
        "suspension",
        "termination",
        "force-majeure",
        "changes-to-the-platform",
        "changes-to-these-terms",
        "communications-and-notices",
        "disputes",
        "assignment",
        "severability",
        "waiver",
        "entire-agreement",
        "governing-law",
        "contact-information",
        "acceptance"
      ];

      let current = "definitions";
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
    document.title = "Terms & Conditions | Tranzit Group";
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Structured content for sections to support searching and rendering
  const sections = useMemo(() => [
    {
      id: "definitions",
      num: "01",
      title: "1. Definitions",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      searchText: "Definitions Account registered to access the Platform. Additional Charges additional freight charge, fee, surcharge, adjustment, penalty or cost imposed in connection with a Shipment. Business Day Saturday, Sunday or public holiday in Victoria, Australia. Carrier independent third-party transport, courier, postal, freight or logistics provider. Carrier Terms conditions of carriage, service terms, policies. Customer, you or your person or business. Goods items. GST A New Tax System (Goods and Services Tax) Act 1999 (Cth). Platform Tranzit Group website, customer portal, software applications, APIs, integrations. Services freight-management. Shipment or Consignment transport.",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            For these Terms:
          </p>
          <div className="grid gap-4">
            {[
              { term: "Account", desc: "means an account registered to access the Platform." },
              { term: "Additional Charges", desc: "means any additional freight charge, fee, surcharge, adjustment, penalty or cost imposed in connection with a Shipment." },
              { term: "Business Day", desc: "means a day other than a Saturday, Sunday or public holiday in Victoria, Australia." },
              { term: "Carrier", desc: "means an independent third-party transport, courier, postal, freight or logistics provider whose services may be available through the Platform." },
              { term: "Carrier Terms", desc: "means the conditions of carriage, service terms, policies, restrictions and other conditions imposed by a Carrier." },
              { term: "Customer, you or your", desc: "means the person or business accessing or using the Platform or Services." },
              { term: "Goods", desc: "means items contained in or forming part of a Shipment." },
              { term: "GST", desc: "has the meaning given in the A New Tax System (Goods and Services Tax) Act 1999 (Cth)." },
              { term: "Platform", desc: "means the Tranzit Group website, customer portal, software applications, APIs, integrations and related technology." },
              { term: "Services", desc: "means the technology, freight-management, quotation, booking, label generation, tracking, billing, integration and other services provided by Tranzit Group." },
              { term: "Shipment or Consignment", desc: "means Goods submitted or proposed to be submitted for transport through a Carrier using the Platform." }
            ].map((def, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-[14px]">
                <strong className="text-slate-900 dark:text-white sm:w-48 shrink-0">{def.term}</strong>
                <span className="text-slate-600 dark:text-zinc-300">{def.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "tranzit-group-role",
      num: "02",
      title: "2. Tranzit Group's Role",
      icon: <Truck className="w-5 h-5 text-primary" />,
      searchText: "Tranzit Group's Role technology and freight-management platform. Unless expressly agreed otherwise in writing, transportation of Goods is performed by independent third-party Carriers. A Carrier may impose its own Carrier Terms on a Shipment. Where there is an inconsistency between these Terms and mandatory terms imposed by a Carrier, the Carrier Terms may apply.",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group provides a technology and freight-management platform that enables Customers to access freight services, compare available delivery services, obtain quotations, make freight bookings, generate shipping documentation, manage consignments and access related shipping functionality.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Unless expressly agreed otherwise in writing, transportation of Goods is performed by independent third-party Carriers.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            A Carrier may impose its own Carrier Terms on a Shipment. By selecting and booking a Carrier service, you acknowledge and agree that the Shipment may also be subject to the applicable Carrier Terms.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where there is an inconsistency between these Terms and mandatory terms imposed by a Carrier in relation to the physical transportation of Goods, the applicable Carrier Terms may apply to that transportation service to the extent required.
          </p>
        </div>
      )
    },
    {
      id: "account-registration",
      num: "03",
      title: "3. Account Registration",
      icon: <UserPlus className="w-5 h-5 text-primary" />,
      searchText: "Account Registration create an Account accurate and complete information keep confidentiality prevent unauthorised use notify Tranzit Group responsible for activity",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You may be required to create an Account to access certain Services. You must:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "provide accurate and complete information;",
              "keep your Account information current;",
              "maintain the confidentiality of your username, password and security credentials;",
              "prevent unauthorised use of your Account; and",
              "notify Tranzit Group promptly if you become aware of unauthorised Account access."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You are responsible for activity undertaken through your Account by persons whom you have authorised to access it. You must not allow an unauthorised third party to use your Account.
          </p>
        </div>
      )
    },
    {
      id: "business-use",
      num: "04",
      title: "4. Business Use",
      icon: <Briefcase className="w-5 h-5 text-primary" />,
      searchText: "Business Use design for businesses. limited, non-exclusive, non-transferable and revocable right. You must not copy reverse engineer resell interfere scrape use for unlawful purposes.",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The Platform is designed primarily for businesses and organisations requiring freight, courier and logistics-management services.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Subject to these Terms, Tranzit Group grants you a limited, non-exclusive, non-transferable and revocable right to access and use the Platform for legitimate business purposes. You must not:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "copy or reproduce the Platform except as permitted by law;",
              "reverse engineer or attempt to derive source code from the Platform except where such restriction is prohibited by law;",
              "resell access to the Platform without our written approval;",
              "interfere with the operation or security of the Platform;",
              "access another Customer's Account without permission;",
              "scrape or systematically extract data from the Platform without approval; or",
              "use the Platform for unlawful, fraudulent or abusive purposes."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-550 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "freight-quotations",
      num: "05",
      title: "5. Freight Quotations",
      icon: <FileText className="w-5 h-5 text-primary" />,
      searchText: "Freight Quotations collection delivery suburb postcode package weight dimensions service fuel surcharges information adjustment guarantee",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Freight rates displayed through the Platform are calculated using information available at the time of the quotation. This may include:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "collection location;",
              "delivery location;",
              "suburb and postcode;",
              "package quantity;",
              "actual weight;",
              "dimensions;",
              "cubic or volumetric weight;",
              "service type;",
              "Goods classification;",
              "delivery requirements;",
              "Carrier pricing;",
              "fuel levies;",
              "applicable surcharges; and",
              "other information supplied by you."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Unless expressly stated otherwise, a freight quotation is based on the information provided by the Customer and may be subject to adjustment. A quotation does not guarantee that a Carrier will accept a Shipment.
          </p>
        </div>
      )
    },
    {
      id: "rate-availability",
      num: "06",
      title: "6. Rate Availability",
      icon: <Clock className="w-5 h-5 text-primary" />,
      searchText: "Rate Availability pricing fuel levy surcharges errors taxes circumstances outside control price displayed agreed",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Freight rates may change as a result of:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "Carrier pricing changes;",
              "fuel levy changes;",
              "service availability;",
              "destination classification changes;",
              "remote or regional area classifications;",
              "changes to Carrier surcharges;",
              "pricing errors;",
              "changes in taxes or government charges; or",
              "other circumstances outside Tranzit Group's reasonable control."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The applicable price will generally be the price displayed or agreed when the Shipment is booked, subject to adjustments permitted under these Terms.
          </p>
        </div>
      )
    },
    {
      id: "customer-shipment-information",
      num: "07",
      title: "7. Customer Shipment Information",
      icon: <Info className="w-5 h-5 text-primary" />,
      searchText: "Customer Shipment Information sender recipient address postcode contact packages dimensions weight description value dangerous goods instructions accurate",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You are responsible for providing accurate information for each Shipment. This includes, where applicable:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "sender name and address;",
              "collection address;",
              "recipient name and address;",
              "correct suburb and postcode combination;",
              "contact telephone numbers;",
              "email addresses;",
              "number of packages;",
              "package dimensions;",
              "actual weight;",
              "description of Goods;",
              "value of Goods;",
              "packaging type;",
              "dangerous goods information;",
              "delivery instructions; and",
              "any other information required by Tranzit Group or the Carrier."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group is not responsible for additional costs or delays resulting from inaccurate, incomplete or misleading information supplied by the Customer, except to the extent caused by Tranzit Group.
          </p>
        </div>
      )
    },
    {
      id: "weight-and-dimensions",
      num: "08",
      title: "8. Weight and Dimensions",
      icon: <Scale className="w-5 h-5 text-primary" />,
      searchText: "Weight and Dimensions declare accurately cubic volumetric dimensional weight physical formulas measurement methods",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You must accurately declare the weight and dimensions of every package.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where a Carrier calculates charges based on cubic, volumetric or dimensional weight, the chargeable weight may be greater than the physical weight of the Shipment. Carrier-specific formulas and measurement methods may apply.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You are responsible for ensuring that declared measurements are accurate before submitting the Shipment.
          </p>
        </div>
      )
    },
    {
      id: "reweighing-and-remeasurement",
      num: "09",
      title: "9. Reweighing and Remeasurement",
      icon: <RefreshCw className="w-5 h-5 text-primary" />,
      searchText: "Reweighing and Remeasurement weigh measure scan inspect adjust freight charge pass on invoice recover support information",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Carriers may weigh, measure, scan or otherwise inspect Shipments after collection.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            If a Carrier determines that the actual weight, dimensions, cubic weight, classification, quantity, packaging or other characteristics differ from the information supplied when the Shipment was booked, the Carrier may adjust the freight charge.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where such an adjustment occurs, Tranzit Group may pass the adjustment and any reasonably incurred associated Carrier charges on to the Customer. The Customer authorises Tranzit Group to invoice or otherwise recover these legitimate adjustments.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where reasonably requested, Tranzit Group will provide available supporting information relating to an adjustment.
          </p>
        </div>
      )
    },
    {
      id: "additional-carrier-charges",
      num: "10",
      title: "10. Additional Carrier Charges",
      icon: <DollarSign className="w-5 h-5 text-primary" />,
      searchText: "Additional Carrier Charges fuel remote residential overweight oversize manual handling tailgate waiting redelivery futile address correction return storage signature dangerous goods after-hours incorrect declaration",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            A Shipment may incur Additional Charges that were not known when the original booking was made. These may include, where applicable:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "fuel surcharges;",
              "remote area charges;",
              "residential delivery charges;",
              "overweight charges;",
              "oversize charges;",
              "manual handling charges;",
              "tailgate charges;",
              "waiting time;",
              "redelivery fees;",
              "futile pickup charges;",
              "address correction fees;",
              "return-to-sender charges;",
              "storage charges;",
              "additional handling fees;",
              "signature services;",
              "dangerous goods charges;",
              "after-hours services;",
              "incorrect declaration charges; or",
              "other legitimate Carrier charges applicable to the Shipment."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You agree that Tranzit Group may recover such charges from you where they relate to your Shipment.
          </p>
        </div>
      )
    },
    {
      id: "bookings",
      num: "11",
      title: "11. Bookings",
      icon: <ClipboardCheck className="w-5 h-5 text-primary" />,
      searchText: "Bookings request booking reject cancel locations incorrect limits prohibited suspended unpaid decline refund",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Submitting a booking request through the Platform does not necessarily guarantee acceptance by the selected Carrier. A booking may be rejected or cancelled where, for example:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "the Carrier does not service the location;",
              "incorrect information has been supplied;",
              "the Goods exceed Carrier limits;",
              "the Goods are prohibited;",
              "the service is unavailable;",
              "the Customer's Account is suspended;",
              "applicable charges have not been paid; or",
              "the Carrier otherwise declines the Shipment."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where a Carrier rejects a booking before transportation commences, Tranzit Group will deal with amounts already paid in accordance with the applicable circumstances, these Terms and any rights available under law.
          </p>
        </div>
      )
    },
    {
      id: "labels-and-shipping-documentation",
      num: "12",
      title: "12. Labels and Shipping Documentation",
      icon: <FileText className="w-5 h-5 text-primary" />,
      searchText: "Labels and Shipping Documentation alter reuse duplicate barcodes tracking numbers fraudulent attach documentation",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Shipping labels and other documentation generated through the Platform must only be used for the Shipment for which they were generated. You must not:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "alter Carrier labels in a misleading manner;",
              "reuse labels;",
              "duplicate labels for multiple Shipments;",
              "change barcodes or tracking numbers;",
              "use another Customer's label; or",
              "use shipping documentation fraudulently."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You are responsible for correctly attaching labels and required documentation to your Shipment.
          </p>
        </div>
      )
    },
    {
      id: "collection-and-pickup",
      num: "13",
      title: "13. Collection and Pickup",
      icon: <MapPin className="w-5 h-5 text-primary" />,
      searchText: "Collection and Pickup times estimates traffic weather vehicle availability capacity peak disruptions holiday packaging",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Collection times displayed or communicated through the Platform are estimates unless expressly confirmed as guaranteed. Carrier pickup schedules may be affected by:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "traffic;",
              "weather;",
              "vehicle availability;",
              "network capacity;",
              "peak periods;",
              "operational disruptions;",
              "public holidays; and",
              "events outside reasonable control."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You must ensure that Goods are appropriately packaged, labelled, accessible and ready for collection at the nominated location.
          </p>
        </div>
      )
    },
    {
      id: "transit-times-and-delivery-estimates",
      num: "14",
      title: "14. Transit Times and Delivery Estimates",
      icon: <Clock className="w-5 h-5 text-primary" />,
      searchText: "Transit Times and Delivery Estimates estimated delivery date timeframe estimates delays carrier weather disaster closure congestion peak addresses strikes",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Any estimated delivery date, delivery timeframe or transit time displayed through the Platform is an estimate only unless expressly described as a guaranteed service.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group does not guarantee that a Shipment will be collected or delivered within an estimated timeframe where delays result from the Carrier or circumstances outside Tranzit Group's reasonable control.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Delivery may be affected by circumstances including severe weather, natural disasters, road closures, network congestion, peak trading periods, incorrect addresses, industrial action, government restrictions or other operational events.
          </p>
        </div>
      )
    },
    {
      id: "authority-to-leave-and-safe-drop",
      num: "15",
      title: "15. Authority to Leave and Safe Drop",
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      searchText: "Authority to Leave and Safe Drop ATL signature safe drop leave goods delivery claim",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Some Carrier services may allow delivery without obtaining a signature, including Authority to Leave (&quot;ATL&quot;), Safe Drop or similar services.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where you select, request or authorise such a service, you acknowledge that the Carrier may leave the Goods at the delivery location in accordance with the Carrier&apos;s applicable terms.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Any claim relating to Goods delivered under ATL or Safe Drop will be assessed in accordance with applicable law, these Terms and the relevant Carrier Terms.
          </p>
        </div>
      )
    },
    {
      id: "packaging",
      num: "16",
      title: "16. Packaging",
      icon: <Box className="w-5 h-5 text-primary" />,
      searchText: "Packaging packaging size nature weight Carrier requirements damage rejection fees delay freight claim",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You are responsible for ensuring Goods are appropriately packaged for the nature, size, weight and method of transportation involved. Packaging must comply with applicable Carrier requirements.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Failure to adequately package Goods may result in:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "damage;",
              "Carrier rejection;",
              "additional fees;",
              "delayed delivery; or",
              "rejection or reduction of a freight claim where permitted under applicable law and Carrier Terms."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "prohibited-goods",
      num: "17",
      title: "17. Prohibited Goods",
      icon: <XCircle className="w-5 h-5 text-primary" />,
      searchText: "Prohibited Goods prohibited law carrier illegal explosives firearms ammunition dangerous chemicals radioactive drugs cash jewellery metals animals perishables alcohol tobacco lithium batteries biological",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You must not use the Platform to arrange transport of Goods that are prohibited by law or by the selected Carrier. Depending on the Carrier and service, restricted or prohibited Goods may include:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "illegal goods;",
              "explosives;",
              "firearms or ammunition;",
              "certain dangerous goods;",
              "hazardous chemicals;",
              "radioactive substances;",
              "illegal drugs;",
              "certain controlled substances;",
              "cash or negotiable instruments;",
              "jewellery or precious metals;",
              "live animals;",
              "certain perishables;",
              "certain alcohol or tobacco products;",
              "lithium batteries;",
              "biological materials; or",
              "other Goods designated as prohibited or restricted by the Carrier."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Carrier restrictions vary. You are responsible for checking whether your Goods are accepted by the selected Carrier before making a booking.
          </p>
        </div>
      )
    },
    {
      id: "dangerous-goods",
      num: "18",
      title: "18. Dangerous Goods",
      icon: <AlertTriangle className="w-5 h-5 text-primary" />,
      searchText: "Dangerous Goods declare legal regulatory packaged labelled documentation losses penalties expenses failure",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You must not tender dangerous goods for transportation unless:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "the selected Carrier permits the Goods;",
              "you have accurately declared the Goods;",
              "all legal and regulatory requirements have been satisfied;",
              "the Goods have been appropriately packaged and labelled; and",
              "all documentation required by the Carrier or law has been completed."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You are responsible for reasonable losses, penalties, Carrier charges or expenses incurred by Tranzit Group as a direct result of your failure to correctly declare dangerous goods, except to the extent caused or contributed to by Tranzit Group.
          </p>
        </div>
      )
    },
    {
      id: "loss-or-damage",
      num: "19",
      title: "19. Loss or Damage",
      icon: <ShieldAlert className="w-5 h-5 text-primary" />,
      searchText: "Loss or Damage inherent risks lost damaged Carrier Terms transit cover statutory claim limits packaging exclusions evidence compensation limit",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Transportation of Goods involves inherent risks. If a Shipment is lost or damaged while in a Carrier's possession, any claim may be subject to:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "the relevant Carrier Terms;",
              "applicable transit cover;",
              "statutory rights;",
              "claim time limits;",
              "packaging requirements;",
              "exclusions;",
              "evidence requirements; and",
              "compensation limits."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group does not independently guarantee that a Carrier will approve a claim. Where appropriate, Tranzit Group may assist the Customer in submitting or administering a claim with the relevant Carrier.
          </p>
        </div>
      )
    },
    {
      id: "freight-claims",
      num: "20",
      title: "20. Freight Claims",
      icon: <FileText className="w-5 h-5 text-primary" />,
      searchText: "Freight Claims notify prompt tracking photographs proof damage value invoices packaging description",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Customers must notify Tranzit Group of loss or damage as soon as reasonably practicable after becoming aware of it. A claim may require:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "tracking information;",
              "photographs;",
              "proof of damage;",
              "proof of value;",
              "purchase invoices;",
              "sales invoices;",
              "proof of adequate packaging;",
              "a description of the Goods; and",
              "other documentation reasonably required by the Carrier."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Carrier claim deadlines may apply. You are responsible for providing requested information within sufficient time to allow the claim to be submitted within applicable Carrier deadlines.
          </p>
        </div>
      )
    },
    {
      id: "transit-cover",
      num: "21",
      title: "21. Transit Cover",
      icon: <Shield className="w-5 h-5 text-primary" />,
      searchText: "Transit Cover optional included terms limits exclusions eligibility Carrier goods value destination packaging service insured",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where optional or included transit cover is offered through the Platform, the specific terms, limits, exclusions and eligibility requirements applying to that cover will apply. The availability of transit cover may depend on:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "the selected Carrier;",
              "type of Goods;",
              "declared value;",
              "destination;",
              "packaging;",
              "Shipment service; and",
              "other eligibility conditions."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Unless expressly stated otherwise, purchasing freight through Tranzit Group does not mean that every Shipment is automatically insured against all risks.
          </p>
        </div>
      )
    },
    {
      id: "carrier-liability",
      num: "22",
      title: "22. Carrier Liability",
      icon: <Scale className="w-5 h-5 text-primary" />,
      searchText: "Carrier Liability transportation operations independent carriers act omission control limits",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group does not control the day-to-day transportation operations of independent Carriers.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            To the extent permitted by law, Tranzit Group is not responsible for an act or omission of a Carrier that is outside Tranzit Group's reasonable control.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Nothing in these Terms limits any liability which Tranzit Group is not legally permitted to limit or exclude.
          </p>
        </div>
      )
    },
    {
      id: "fees-and-payment",
      num: "23",
      title: "23. Fees and Payment",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      searchText: "Fees and Payment charges prepaid wallet debit credit approved invoice direct debit prices rates",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You must pay all applicable charges associated with your use of the Services. Depending on your Account arrangements, payment may be made through:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "prepaid funds;",
              "wallet balance;",
              "debit or credit card;",
              "an approved credit account;",
              "invoice;",
              "direct debit; or",
              "another payment method approved by Tranzit Group."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Applicable prices, rates, fees and payment terms may be displayed on the Platform or agreed separately with you.
          </p>
        </div>
      )
    },
    {
      id: "gst",
      num: "24",
      title: "24. GST",
      icon: <Percent className="w-5 h-5 text-primary" />,
      searchText: "GST exclusive payable taxable supply taxation invoices",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Unless otherwise expressly stated, prices displayed or quoted may be exclusive of GST.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where GST is payable, Tranzit Group may add GST to the relevant taxable supply in accordance with Australian taxation requirements. For clarity, Additional Charges, freight adjustments and surcharges are also subject to GST where applicable.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tax invoices will be issued where required.
          </p>
        </div>
      )
    },
    {
      id: "credit-accounts",
      num: "25",
      title: "25. Credit Accounts",
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      searchText: "Credit Accounts approval credit terms limit invoices paid due date review outstanding overdue",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group may, at its discretion and subject to separate approval, provide a Customer with credit terms. Where credit is provided:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "a credit limit may apply;",
              "invoices must be paid by their applicable due date;",
              "Tranzit Group may review the credit arrangement periodically;",
              "available credit may be reduced where invoices remain outstanding; and",
              "further bookings may be restricted where the Account exceeds its approved limit or has overdue amounts."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Any change to an existing credit arrangement will be handled reasonably having regard to the circumstances and any applicable agreement with the Customer.
          </p>
        </div>
      )
    },
    {
      id: "wallet-or-prepaid-balance",
      num: "26",
      title: "26. Wallet or Prepaid Balance",
      icon: <Wallet className="w-5 h-5 text-primary" />,
      searchText: "Wallet or Prepaid Balance wallet balance deductions bookings adjustments non-promotional credits refunds bank account",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where the Platform provides a prepaid wallet or account balance:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "amounts added may be used to pay eligible Tranzit Group charges;",
              "deductions may be made for authorised bookings and legitimate adjustments;",
              "the balance shown in the Platform may be updated when adjustments are processed;",
              "paid (non-promotional) wallet balances do not expire while your Account remains open;",
              "promotional or complimentary credits may be subject to separate conditions, including expiry; and",
              "refunds will be dealt with in accordance with applicable law and any agreed account conditions."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            If your Account is closed, any unused paid wallet balance will, on request and subject to verification and any amounts owing, be refunded in accordance with applicable law.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            A Platform wallet is a payment functionality for accessing Tranzit Group Services and is not represented as a bank account.
          </p>
        </div>
      )
    },
    {
      id: "payment-processing-fees",
      num: "27",
      title: "27. Payment Processing Fees",
      icon: <Percent className="w-5 h-5 text-primary" />,
      searchText: "Payment Processing Fees surcharge fee payment methods limit",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where legally permitted and clearly disclosed, Tranzit Group may apply a payment processing surcharge or fee to certain payment methods.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Any payment surcharge imposed by Tranzit Group will not exceed the amount permitted under applicable law.
          </p>
        </div>
      )
    },
    {
      id: "invoice-disputes",
      num: "28",
      title: "28. Invoice Disputes",
      icon: <AlertTriangle className="w-5 h-5 text-primary" />,
      searchText: "Invoice Disputes dispute invoice charge good faith 14 days basis resolve suspend",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            If you dispute an invoice or a charge in good faith, you must notify Tranzit Group within 14 days of the invoice date, providing reasonable details of the disputed amount and the basis of the dispute.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The parties will work together in good faith to resolve the dispute promptly. Any undisputed portion of an invoice remains payable by its due date.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group will not suspend an Account solely because a genuinely disputed amount is withheld while the dispute is being resolved in accordance with this clause.
          </p>
        </div>
      )
    },
    {
      id: "overdue-accounts",
      num: "29",
      title: "29. Overdue Accounts",
      icon: <Clock className="w-5 h-5 text-primary" />,
      searchText: "Overdue Accounts overdue restrict bookings suspend facilities suspend access debt recovery",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            If an undisputed invoice remains overdue, Tranzit Group may, after providing reasonable notice where appropriate:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "restrict new bookings;",
              "suspend credit facilities;",
              "suspend access to part or all of the Platform; or",
              "take reasonable steps to recover the overdue amount."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The Customer remains responsible for legitimate charges incurred before suspension. Tranzit Group may seek reasonable debt-recovery costs where permitted by law and where such costs have actually been incurred.
          </p>
        </div>
      )
    },
    {
      id: "cancellations-and-refunds",
      num: "30",
      title: "30. Cancellations and Refunds",
      icon: <XCircle className="w-5 h-5 text-primary" />,
      searchText: "Cancellations and Refunds cancel shipment collected pickup fee processed booking label Carrier terms 10 Business Days",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            A Customer may request cancellation of a Shipment. Whether a Shipment can be cancelled and whether a refund applies will depend on factors including:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "whether the Carrier has collected the Goods;",
              "whether a pickup fee has already been incurred;",
              "whether the Carrier has processed the booking;",
              "whether the label has been used;",
              "Carrier cancellation terms; and",
              "the particular service booked."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where no Carrier cost has been incurred and the service has not commenced, Tranzit Group will process eligible cancellations in accordance with the applicable booking conditions.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where a refund is approved, it will be processed to the original payment method or credited to your wallet balance (as applicable) within 10 Business Days of approval, unless otherwise agreed or required by law.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Nothing in this clause limits rights or remedies that cannot legally be excluded.
          </p>
        </div>
      )
    },
    {
      id: "third-party-platforms-and-integrations",
      num: "31",
      title: "31. Third-Party Platforms and Integrations",
      icon: <Link className="w-5 h-5 text-primary" />,
      searchText: "Third-Party Platforms and Integrations ecommerce marketplaces payment accounting carriers shopify woocommerce api changes compatibility discontinue",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The Platform may integrate with third-party services including ecommerce platforms, marketplaces, payment providers, accounting platforms, Carriers and other software providers. Such services may include platforms such as Shopify, WooCommerce or other supported systems.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Third-party services are controlled by their respective providers. Tranzit Group does not guarantee that a third-party service will remain available, unchanged or compatible with the Platform indefinitely.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where a third-party provider changes or discontinues its API, functionality, policies or services, Tranzit Group may need to modify, suspend or discontinue the affected integration. We will take reasonable steps to minimise disruption where practicable.
          </p>
        </div>
      )
    },
    {
      id: "platform-availability",
      num: "32",
      title: "32. Platform Availability",
      icon: <Activity className="w-5 h-5 text-primary" />,
      searchText: "Platform Availability reliable availability maintenance security updates software emergency outages network communication",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group aims to provide reliable Platform availability but cannot guarantee uninterrupted or error-free operation. Access may occasionally be interrupted for:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "maintenance;",
              "security updates;",
              "software updates;",
              "emergency maintenance;",
              "Carrier API outages;",
              "third-party outages;",
              "hosting or network failures; or",
              "events outside reasonable control."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where reasonably practicable, planned maintenance that materially affects the Services will be communicated in advance.
          </p>
        </div>
      )
    },
    {
      id: "australian-consumer-law",
      num: "33",
      title: "33. Australian Consumer Law",
      icon: <Scale className="w-5 h-5 text-primary" />,
      searchText: "Australian Consumer Law guarantee condition warranty right remedy Competition and Consumer Act 2010 statutory liability",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Nothing in these Terms excludes, restricts or modifies any guarantee, condition, warranty, right or remedy that cannot lawfully be excluded, restricted or modified under the Competition and Consumer Act 2010 (Cth), including the Australian Consumer Law, or other applicable legislation.
          </p>
          <p className="text-slate-600 dark:text-zinc-350 leading-relaxed text-[15px]">
            Where the law permits Tranzit Group to limit its liability for a failure to comply with a statutory guarantee, that liability will be limited only to the extent permitted by law.
          </p>
        </div>
      )
    },
    {
      id: "limitation-of-liability",
      num: "34",
      title: "34. Limitation of Liability",
      icon: <ShieldAlert className="w-5 h-5 text-primary" />,
      searchText: "Limitation of Liability indirect incidental special consequential profits business interruption opportunity fraud wilful misconduct negligence",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            To the maximum extent permitted by law, Tranzit Group will not be liable for indirect, incidental, special or consequential loss arising from use of the Platform or Services where such loss was not reasonably foreseeable. This may include loss of profits, business interruption or loss of business opportunity.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            However, nothing in these Terms excludes liability:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "that cannot legally be excluded;",
              "for fraud;",
              "for wilful misconduct; or",
              "to the extent a loss was caused by Tranzit Group's negligence where liability cannot lawfully be excluded or limited."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where permitted by law, Tranzit Group's liability in relation to the Services may be limited to the amount paid by the Customer for the particular service giving rise to the claim or another amount expressly agreed between the parties. This limitation does not apply where such a limitation would be unlawful or unfair in the circumstances.
          </p>
        </div>
      )
    },
    {
      id: "customer-indemnity",
      num: "35",
      title: "35. Customer Indemnity",
      icon: <Shield className="w-5 h-5 text-primary" />,
      searchText: "Customer Indemnity losses liabilities charges penalties claims expenses unlawful breach inaccurate shipment prohibited dangerous infringement fraudulent",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            To the extent permitted by law, you indemnify Tranzit Group against reasonable losses, liabilities, Carrier charges, penalties, claims and expenses directly arising from:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "your unlawful use of the Platform;",
              "your intentional or negligent breach of these Terms;",
              "inaccurate Shipment information supplied by you;",
              "prohibited Goods knowingly tendered by you;",
              "undeclared or incorrectly declared dangerous goods;",
              "infringement of a third party's rights by materials supplied by you; or",
              "fraudulent activity undertaken through your Account by you or a person you authorised."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Your liability under this clause will be reduced to the extent that Tranzit Group caused or contributed to the relevant loss.
          </p>
        </div>
      )
    },
    {
      id: "intellectual-property",
      num: "36",
      title: "36. Intellectual Property",
      icon: <Key className="w-5 h-5 text-primary" />,
      searchText: "Intellectual Property software interface designs logos branding databases documentation text graphics proprietary reproduce distribute modify exploit",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The Platform and its contents, including software, interface designs, logos, branding, databases, documentation, text, graphics and proprietary technology, are owned by or licensed to Tranzit Group.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Except as expressly permitted under these Terms or by law, you must not reproduce, distribute, modify, commercially exploit or create derivative works from Tranzit Group intellectual property without prior written permission.
          </p>
        </div>
      )
    },
    {
      id: "customer-data",
      num: "37",
      title: "37. Customer Data",
      icon: <FileText className="w-5 h-5 text-primary" />,
      searchText: "Customer Data ownership right use process transmit store shipments carriers integrations payments support security compliance",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You retain ownership of data and information that you or your authorised systems provide to Tranzit Group. You grant Tranzit Group a non-exclusive right to use, process, transmit and store that data to the extent reasonably necessary to:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "provide the Services;",
              "process Shipments;",
              "communicate with Carriers;",
              "provide integrations;",
              "process payments;",
              "provide support;",
              "maintain security;",
              "comply with legal obligations; and",
              "operate and improve the Platform."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group does not acquire ownership of your underlying business data merely because you use the Platform.
          </p>
        </div>
      )
    },
    {
      id: "privacy",
      num: "38",
      title: "38. Privacy",
      icon: <Lock className="w-5 h-5 text-primary" />,
      searchText: "Privacy collect process personal names business details addresses telephone email recipient order privacy policy privacy laws lawful authority",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group may collect and process personal information including names, business details, addresses, telephone numbers, email addresses, recipient information, order information and other information necessary to provide its Services.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Personal information will be handled in accordance with Tranzit Group's Privacy Policy, available on the Tranzit Group website, and applicable privacy laws.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You are responsible for ensuring that you have lawful authority to provide personal information relating to senders, recipients, customers, employees and other individuals to Tranzit Group.
          </p>
        </div>
      )
    },
    {
      id: "security",
      num: "39",
      title: "39. Security",
      icon: <Lock className="w-5 h-5 text-primary" />,
      searchText: "Security reasonable steps protect platform security measures account integrations passwords api compromised",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group will take reasonable steps to protect the security of the Platform and information under its control.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You must also maintain appropriate security measures for your Account, integrations, passwords, API credentials and connected services.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You must promptly notify Tranzit Group if you reasonably suspect that your Account, API credentials or integration credentials have been compromised.
          </p>
        </div>
      )
    },
    {
      id: "api-usage",
      num: "40",
      title: "40. API Usage",
      icon: <Code className="w-5 h-5 text-primary" />,
      searchText: "API Usage credentials confidential authorised limits overload bypass security documentation temporarily restrict",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where Tranzit Group provides API access, you must:
          </p>
          <ul className="space-y-2 pl-1 text-[14px]">
            {[
              "keep API credentials confidential;",
              "use the API only for authorised purposes;",
              "comply with applicable technical limits;",
              "not deliberately overload the API;",
              "not attempt to bypass security controls;",
              "not use the API to access another Customer's information; and",
              "comply with any separately provided API documentation or policies."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group may temporarily restrict API access where reasonably necessary to protect security, Platform stability or other Customers.
          </p>
        </div>
      )
    },
    {
      id: "prohibited-platform-activities",
      num: "41",
      title: "41. Prohibited Platform Activities",
      icon: <XCircle className="w-5 h-5 text-primary" />,
      searchText: "Prohibited Platform Activities unlawfully fraudulently impersonate malware unauthorised access security bookings labels payment fraud harass threaten infringe",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You must not use the Platform:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "unlawfully;",
              "fraudulently;",
              "to impersonate another person;",
              "to transmit malware;",
              "to gain unauthorised access to systems;",
              "to interfere with Platform security;",
              "to submit fraudulent freight bookings;",
              "to generate fraudulent shipping labels;",
              "to conduct payment fraud;",
              "to harass or threaten another person;",
              "to infringe intellectual property rights; or",
              "in a way reasonably likely to materially damage Tranzit Group's systems or services."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-red-500/80 dark:text-red-400/80">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "suspension",
      num: "42",
      title: "42. Suspension",
      icon: <AlertTriangle className="w-5 h-5 text-primary" />,
      searchText: "Suspension restrict access account breach overdue fraud risk misuse carrier prohibited dangerous chargebacks legal regulatory notify remedy",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group may suspend or restrict access to an Account where reasonably necessary because of:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "material or repeated breach of these Terms;",
              "overdue undisputed amounts;",
              "suspected fraud;",
              "a serious security risk;",
              "misuse of Carrier services;",
              "shipment of prohibited or dangerous Goods contrary to these Terms;",
              "fraudulent chargebacks;",
              "legal or regulatory requirements; or",
              "conduct presenting a material risk to Tranzit Group, a Carrier or another person."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where appropriate and reasonably practicable, Tranzit Group will notify the Customer of the reason for suspension and provide an opportunity to remedy the issue.
          </p>
        </div>
      )
    },
    {
      id: "termination",
      num: "43",
      title: "43. Termination",
      icon: <XCircle className="w-5 h-5 text-primary" />,
      searchText: "Termination cease using services contractual arrangements outstanding obligations payable bookings adjustments claims rights survive export",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Either party may cease using or providing the Services subject to any applicable contractual arrangements and outstanding obligations. Termination does not affect:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "amounts already payable;",
              "existing freight bookings;",
              "pending freight adjustments;",
              "claims relating to previous Shipments;",
              "accrued rights; or",
              "provisions intended to survive termination."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where feasible, Customers may request export of eligible Account information before Account closure.
          </p>
        </div>
      )
    },
    {
      id: "force-majeure",
      num: "44",
      title: "44. Force Majeure",
      icon: <AlertTriangle className="w-5 h-5 text-primary" />,
      searchText: "Force Majeure liable failure delay pay control disasters floods bushfires weather pandemics war disturbance strike government closure telecommunications outages carrier infrastructure disruption minimise",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Neither party will be liable for failure or delay in performing an obligation, other than an obligation to pay an amount already properly due, where the failure is caused by events outside that party's reasonable control. Such events may include:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "natural disasters;",
              "floods;",
              "bushfires;",
              "severe weather;",
              "pandemics;",
              "war;",
              "civil disturbance;",
              "industrial action;",
              "government restrictions;",
              "road closures;",
              "major telecommunications failures;",
              "widespread internet outages;",
              "Carrier network disruption; or",
              "major infrastructure failure."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The affected party must take reasonable steps to minimise the effect of the disruption.
          </p>
        </div>
      )
    },
    {
      id: "changes-to-the-platform",
      num: "45",
      title: "45. Changes to the Platform",
      icon: <RefreshCw className="w-5 h-5 text-primary" />,
      searchText: "Changes to the Platform update improve modify features carriers integrations functionality reduces notice",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group may update, improve or modify Platform functionality from time to time. This may include introducing, modifying or discontinuing particular features, Carriers or integrations.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where a change materially reduces functionality relied upon by Customers, Tranzit Group will endeavour to provide reasonable notice where practicable.
          </p>
        </div>
      )
    },
    {
      id: "changes-to-these-terms",
      num: "46",
      title: "46. Changes to These Terms",
      icon: <FileEdit className="w-5 h-5 text-primary" />,
      searchText: "Changes to These Terms update terms platform services carrier business operations legal regulatory notice email platform accept continued use",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group may update these Terms from time to time to reflect changes to:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "the Platform;",
              "Services;",
              "Carrier arrangements;",
              "business operations;",
              "legal requirements; or",
              "regulatory requirements."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The current Terms will be published on the Tranzit Group website or Platform. Where a change materially affects an existing Customer's rights or obligations, Tranzit Group will provide reasonable notice by email, through the Platform or another reasonable communication method.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Your continued use of the Platform or Services after updated Terms take effect (or after any notice period stated in the notice) constitutes acceptance of the updated Terms. If you do not agree to the updated Terms, you should stop using the Platform and contact Tranzit Group regarding your Account.
          </p>
        </div>
      )
    },
    {
      id: "communications-and-notices",
      num: "47",
      title: "47. Communications and Notices",
      icon: <Bell className="w-5 h-5 text-primary" />,
      searchText: "Communications and Notices operational communications account administration freight bookings tracking billing security carrier issues platform changes terms marketing opt-out",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You consent to receive operational communications relating to:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1 text-[14px]">
            {[
              "Account administration;",
              "freight bookings;",
              "tracking;",
              "billing;",
              "security;",
              "Carrier issues;",
              "Platform changes; and",
              "these Terms."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Marketing communications will be managed separately in accordance with applicable law and available opt-out mechanisms.
          </p>
        </div>
      )
    },
    {
      id: "disputes",
      num: "48",
      title: "48. Disputes",
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      searchText: "Disputes dispute arises resolve good faith details support resolution court relief",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            If a dispute arises relating to these Terms or the Services, the parties should first attempt to resolve the dispute in good faith. A Customer should provide Tranzit Group with reasonable details of the dispute and supporting information.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group will review the matter and attempt to reach a commercially reasonable resolution. Nothing in this clause prevents either party from seeking urgent court relief or exercising rights available under applicable law.
          </p>
        </div>
      )
    },
    {
      id: "assignment",
      num: "49",
      title: "49. Assignment",
      icon: <ArrowRightLeft className="w-5 h-5 text-primary" />,
      searchText: "Assignment assign transfer consent sale restructure business contractual rights",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You must not assign or transfer material rights or obligations under these Terms without Tranzit Group's consent, which will not be unreasonably withheld where the proposed transfer does not materially prejudice Tranzit Group.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group may assign its rights and obligations as part of a genuine sale, restructure or transfer of its business, provided doing so does not materially reduce the Customer's contractual rights.
          </p>
        </div>
      )
    },
    {
      id: "severability",
      num: "50",
      title: "50. Severability",
      icon: <XCircle className="w-5 h-5 text-primary" />,
      searchText: "Severability invalid unenforceable severed read down minimum",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          If any provision of these Terms is determined to be invalid or unenforceable, that provision will be severed or read down to the minimum extent necessary. The remaining provisions will continue in effect.
        </p>
      )
    },
    {
      id: "waiver",
      num: "51",
      title: "51. Waiver",
      icon: <Info className="w-5 h-5 text-primary" />,
      searchText: "Waiver enforce immediately waive provision",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          Failure by either party to immediately enforce a provision of these Terms does not constitute a waiver of that provision or any other right.
        </p>
      )
    },
    {
      id: "entire-agreement",
      num: "52",
      title: "52. Entire Agreement",
      icon: <FileText className="w-5 h-5 text-primary" />,
      searchText: "Entire Agreement agreement pricing credit service Carrier Terms Privacy Policy overrides override inconsistency",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            These Terms, together with any pricing agreement, credit agreement, service agreement, Carrier Terms, Privacy Policy or other terms expressly incorporated into them, constitute the agreement relating to your use of the relevant Services.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Where the parties have entered into a separately signed agreement that expressly overrides these Terms, the signed agreement will prevail to the extent of any inconsistency.
          </p>
        </div>
      )
    },
    {
      id: "governing-law",
      num: "53",
      title: "53. Governing Law",
      icon: <Gavel className="w-5 h-5 text-primary" />,
      searchText: "Governing Law Victoria Australia jurisdiction courts Victoria Commonwealth",
      content: (
        <div className="space-y-3">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            These Terms are governed by the laws of Victoria, Australia.
          </p>
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Subject to any rights that cannot lawfully be restricted, the parties submit to the non-exclusive jurisdiction of the courts of Victoria and applicable Commonwealth courts.
          </p>
        </div>
      )
    },
    {
      id: "contact-information",
      num: "54",
      title: "54. Contact Information",
      icon: <Phone className="w-5 h-5 text-primary" />,
      searchText: "Contact Information Tranzit Group ABN 12 690 967 198 tranzitgroup.com.au info@tranzitgroup.com.au Phone Registered Address Keysborough Bass Ct",
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Questions about these Terms or the Tranzit Group Services can be directed to:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/40 flex flex-col items-center text-center hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500 mb-1">
                Business Details
              </span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">Tranzit Group</span>
              <span className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">ABN: 12 690 967 198</span>
              <a
                href="https://tranzitgroup.com.au"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-1 inline-flex items-center gap-1 font-medium"
              >
                tranzitgroup.com.au
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/40 flex flex-col items-center text-center hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500 mb-1">
                Address
              </span>
              <span className="font-bold text-slate-800 dark:text-zinc-200 leading-snug">
                12B Bass Ct, Keysborough
              </span>
              <span className="text-sm text-slate-500 dark:text-zinc-400 font-medium">VIC 3173, Australia</span>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/40 flex flex-col items-center text-center hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500 mb-1">
                Contact Details
              </span>
              <a
                href="mailto:info@tranzitgroup.com.au"
                className="font-bold text-primary hover:underline underline-offset-4 transition-colors text-sm"
              >
                info@tranzitgroup.com.au
              </a>
              {/* <span className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">
                Phone: [Insert Phone Number]
              </span> */}
            </div>
          </div>
        </div>
      )
    },
    {
      id: "acceptance",
      num: "55",
      title: "55. Acceptance",
      icon: <CheckCircle className="w-5 h-5 text-primary" />,
      searchText: "Acceptance registering Account selecting I agree booking Shipment purchasing Services continuing to use bound",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            By registering an Account, selecting &quot;I agree&quot;, booking a Shipment, purchasing Services or continuing to use the Platform after being provided with these Terms, you acknowledge that you have read and understood these Terms and agree to be bound by them.
          </p>
          <div className="bg-emerald-500/5 border-l-4 border-emerald-500 p-4 rounded-r-xl mt-4">
            <p className="my-0 text-sm text-emerald-700 dark:text-emerald-400 font-medium">
              By using our Platform or Services, you confirm your acceptance of these Terms and Conditions.
            </p>
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
                    Terms & Conditions
                  </h1>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                These Terms and Conditions (&quot;Terms&quot;) govern access to and use of the Tranzit Group website, shipping platform, applications, integrations, APIs and related freight-management services. Tranzit Group ABN 12 690 967 198 is referred to in these Terms as &quot;Tranzit Group&quot;, &quot;we&quot;, &quot;us&quot; or &quot;our&quot;.
              </p>
              <p className="text-sm text-slate-550 dark:text-zinc-450 leading-relaxed max-w-2xl mt-3">
                By creating an account, accessing the Platform, obtaining a quotation, booking a shipment, purchasing a shipping service or otherwise using our Services, you agree to be bound by these Terms. If you are using the Platform on behalf of a company or other organisation, you represent that you have authority to bind that organisation to these Terms.
              </p>

              {/* Modern Interactive Search Bar */}
              <div className="mt-8 relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search legal sections, topics, keywords..."
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
