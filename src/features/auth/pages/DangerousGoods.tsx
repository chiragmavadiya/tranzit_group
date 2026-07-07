import { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  Mail,
  Briefcase,
  Clock,
  ChevronUp,
  FileText,
  Search,
  BookOpen,
  Database,
  HelpCircle,
  ExternalLink,
  FileCheck,
  Info,
  AlertTriangle,
  ClipboardCheck,
  History,
  Scale,
  UserCheck,
  XCircle,
  Package,
  Tag,
  AlertOctagon,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import brandLogo from "@/assets/Tranzit_Logo.svg";
import brandLogoDark from "@/assets/Tranzit_Logo_dark.svg";
import { useTheme } from "@/app/providers/theme-provider";

// Class definitions helper for section 3
const classesData = [
  {
    classNum: "Class 1",
    title: "Explosives",
    examples: "Fireworks, ammunition, detonators, explosive devices",
    bgClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  },
  {
    classNum: "Class 2",
    title: "Gases",
    examples: "Compressed gas, liquefied gas, dissolved gas (flammable and non-flammable)",
    bgClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    classNum: "Class 3",
    title: "Flammable Liquids",
    examples: "Petrol, paint, solvents, alcohol (flash point < 61°C)",
    bgClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  {
    classNum: "Class 4",
    title: "Flammable Solids",
    examples: "Phosphorus, metal powders, spontaneously combustible materials",
    bgClass: "bg-amber-600/10 text-amber-700 dark:text-amber-400 border-amber-600/30",
  },
  {
    classNum: "Class 5",
    title: "Oxidising Agents & Organic Peroxides",
    examples: "Chlorine, hydrogen peroxide, pool chlorine",
    bgClass: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  },
  {
    classNum: "Class 6",
    title: "Toxic & Infectious Substances",
    examples: "Pesticides, biological agents, poisons",
    bgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    classNum: "Class 7",
    title: "Radioactive Materials",
    examples: "Medical isotopes, industrial radioactive sources",
    bgClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    classNum: "Class 8",
    title: "Corrosives",
    examples: "Sulfuric acid, caustic soda, battery acid",
    bgClass: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/30",
  },
  {
    classNum: "Class 9",
    title: "Miscellaneous Hazardous Goods",
    examples: "Lithium batteries, dry ice, environmentally hazardous substances",
    bgClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  }
];

export default function DangerousGoods() {
  const { theme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");
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
        "introduction",
        "definitions",
        "classifications",
        "shipper-responsibilities",
        "prohibited-goods",
        "accepted-goods",
        "documentation",
        "packaging",
        "labeling",
        "quantity-limits",
        "handling-storage",
        "incident-reporting",
        "training",
        "compliance-audits",
        "liability-insurance",
        "penalties",
        "amendment",
        "contact"
      ];

      let current = "introduction";
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
    document.title = "Dangerous Goods Policy | Tranzit Group";
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Structured content for sections to support searching and rendering
  const sections = useMemo(() => [
    {
      id: "introduction",
      num: "01",
      title: "1. Introduction & Scope",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      searchText: "This Dangerous Goods Policy outlines Tranzit Group's requirements for the safe handling, packaging, documentation, and carriage of dangerous goods. All shippers, consignees, and third parties involved in consignments containing dangerous goods must comply with this policy and all applicable Australian and international regulations, including: Australian Dangerous Goods Code (ADGC) International Air Transport Association (IATA) Dangerous Goods Regulations International Maritime Dangerous Goods Code (IMDG) Road Transport Rules applicable to the states of carriage All relevant federal and state legislation",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            This Dangerous Goods Policy outlines Tranzit Group's requirements for the safe handling, packaging, documentation, and carriage of dangerous goods. All shippers, consignees, and third parties involved in consignments containing dangerous goods must comply with this policy and all applicable Australian and international regulations, including:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 text-[14px] mt-4">
            {[
              "Australian Dangerous Goods Code (ADGC)",
              "International Air Transport Association (IATA) Dangerous Goods Regulations",
              "International Maritime Dangerous Goods Code (IMDG)",
              "Road Transport Rules applicable to the states of carriage",
              "All relevant federal and state legislation"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "definitions",
      num: "02",
      title: "2. Definitions",
      icon: <FileText className="w-5 h-5 text-primary" />,
      searchText: "Dangerous Goods: Any substance or article which is capable of posing a risk to health, safety, property or the environment and which is classified as dangerous according to the test criteria laid down in the regulations. Shipper: The person or entity consigning dangerous goods for transport. Consignee: The person or entity to whom the dangerous goods are being sent. Hazardous Materials: Synonymous with dangerous goods in this policy.",
      content: (
        <div className="space-y-4">
          {[
            {
              term: "Dangerous Goods",
              definition: "Any substance or article which is capable of posing a risk to health, safety, property or the environment and which is classified as dangerous according to the test criteria laid down in the regulations."
            },
            {
              term: "Shipper",
              definition: "The person or entity consigning dangerous goods for transport."
            },
            {
              term: "Consignee",
              definition: "The person or entity to whom the dangerous goods are being sent."
            },
            {
              term: "Hazardous Materials",
              definition: "Synonymous with dangerous goods in this policy."
            }
          ].map((item, index) => (
            <div key={index} className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/40">
              <span className="text-xs font-bold text-primary uppercase tracking-wide block mb-1">
                {item.term}
              </span>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      )
    },
    {
      id: "classifications",
      num: "03",
      title: "3. Dangerous Goods Classifications",
      icon: <Tag className="w-5 h-5 text-primary" />,
      searchText: "Dangerous goods are classified into nine (9) classes based on their primary hazard. The classification determines packaging, labeling, documentation, and handling requirements: Class 1: Explosives Fireworks, ammunition, detonators, explosive devices Class 2: Gases Compressed gas, liquefied gas, dissolved gas (flammable and non-flammable) Class 3: Flammable Liquids Petrol, paint, solvents, alcohol (flash point < 61°C) Class 4: Flammable Solids Phosphorus, metal powders, spontaneously combustible materials Class 5: Oxidising Agents & Organic Peroxides Chlorine, hydrogen peroxide, pool chlorine Class 6: Toxic & Infectious Substances Pesticides, biological agents, poisons Class 7: Radioactive Materials Medical isotopes, industrial radioactive sources Class 8: Corrosives Sulfuric acid, caustic soda, battery acid Class 9: Miscellaneous Hazardous Goods Lithium batteries, dry ice, environmentally hazardous substances",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px] mb-4">
            Dangerous goods are classified into nine (9) classes based on their primary hazard. The classification determines packaging, labeling, documentation, and handling requirements:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classesData.map((cls, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex flex-col justify-between hover:shadow-md transition-all duration-300 ${cls.bgClass}`}
              >
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest opacity-80 block mb-1">
                    {cls.classNum}
                  </span>
                  <h4 className="text-base font-bold mb-2 text-slate-900 dark:text-white">
                    {cls.title}
                  </h4>
                </div>
                <p className="text-xs opacity-90 mt-2 font-medium leading-relaxed">
                  {cls.examples}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "shipper-responsibilities",
      num: "04",
      title: "4. Shipper Responsibilities",
      icon: <UserCheck className="w-5 h-5 text-primary" />,
      searchText: "Shippers are responsible for: Correct Classification: Accurately classify dangerous goods according to the ADGC and applicable regulations Proper Packaging: Package goods in UN-approved packaging suitable for the hazard class and intended mode of transport Correct Labeling & Marking: Affix all required danger labels, placards, and markings on all four sides of packages Accurate Documentation: Complete and accurate Dangerous Goods Declaration forms with all required information Quantity Declarations: Declare the correct quantity and net weight/volume of dangerous goods Emergency Information: Provide 24/7 emergency contact information and emergency response procedures Compliance: Ensure all materials comply with current regulations before offering for transport",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px] mb-2">
            Shippers are responsible for:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Correct Classification", desc: "Accurately classify dangerous goods according to the ADGC and applicable regulations." },
              { title: "Proper Packaging", desc: "Package goods in UN-approved packaging suitable for the hazard class and intended mode of transport." },
              { title: "Correct Labeling & Marking", desc: "Affix all required danger labels, placards, and markings on all four sides of packages." },
              { title: "Accurate Documentation", desc: "Complete and accurate Dangerous Goods Declaration forms with all required information." },
              { title: "Quantity Declarations", desc: "Declare the correct quantity and net weight/volume of dangerous goods." },
              { title: "Emergency Information", desc: "Provide 24/7 emergency contact information and emergency response procedures." },
              { title: "Compliance", desc: "Ensure all materials comply with current regulations before offering for transport." }
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/40 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </span>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-1">{item.title}</h5>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "prohibited-goods",
      num: "05",
      title: "5. Prohibited Dangerous Goods",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      searchText: "The following items are STRICTLY PROHIBITED and will not be accepted for carriage under any circumstances: Class 1 (Explosives) — all divisions and subdivisions Radioactive materials (Class 7) except as specifically approved by Tranzit Group Highly toxic substances (Class 6, Division 6.1, Packing Group I) Biological hazards and infectious substances Weapons of any kind Stolen goods Illegal drugs and narcotics Counterfeit or fraudulent goods Articles damaged or leaking Goods not properly classified or documented Lithium batteries (except under specific IATA/IMDG approvals)",
      content: (
        <div className="space-y-4">
          <div className="bg-red-500/5 border-l-4 border-red-500 p-4 rounded-r-xl mb-4">
            <p className="text-sm text-red-700 dark:text-red-400 font-bold uppercase tracking-wide">
              Strictly Prohibited
            </p>
            <p className="text-xs text-red-600 dark:text-red-400/90 mt-1">
              The following items will not be accepted for carriage under any circumstances. Attempting to ship these may result in immediate suspension and law enforcement notification.
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 text-[14px]">
            {[
              "Class 1 (Explosives) — all divisions and subdivisions",
              "Radioactive materials (Class 7) except as specifically approved",
              "Highly toxic substances (Class 6, Division 6.1, Packing Group I)",
              "Biological hazards and infectious substances",
              "Weapons of any kind",
              "Stolen goods",
              "Illegal drugs and narcotics",
              "Counterfeit or fraudulent goods",
              "Articles damaged or leaking",
              "Goods not properly classified or documented",
              "Lithium batteries (except under specific IATA/IMDG approvals)"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-red-600/90 dark:text-red-400/90 font-medium">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "accepted-goods",
      num: "06",
      title: "6. Accepted Dangerous Goods (Conditional)",
      icon: <ClipboardCheck className="w-5 h-5 text-primary" />,
      searchText: "The following may be accepted subject to strict compliance with this policy and applicable regulations: Class 2 Gases (limited quantities, non-flammable only) Class 3 Flammable Liquids (limited quantities, Packing Group II & III only) Class 4 Flammable Solids (limited quantities) Class 5 Oxidising Agents (limited quantities) Class 8 Corrosives (limited quantities, Packing Group II & III only) Class 9 Miscellaneous (e.g., dry ice for perishable goods, certain batteries) Note: 'Limited quantities' refers to quantities specified in the ADGC for transport in quantities that fall below threshold reportable quantities.",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The following may be accepted subject to strict compliance with this policy and applicable regulations:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 text-[14px]">
            {[
              "Class 2 Gases (limited quantities, non-flammable only)",
              "Class 3 Flammable Liquids (limited quantities, Packing Group II & III only)",
              "Class 4 Flammable Solids (limited quantities)",
              "Class 5 Oxidising Agents (limited quantities)",
              "Class 8 Corrosives (limited quantities, Packing Group II & III only)",
              "Class 9 Miscellaneous (e.g., dry ice for perishable, approved batteries)"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/40 text-xs text-slate-500 dark:text-zinc-400">
            <strong className="text-slate-700 dark:text-zinc-300">Note:</strong> "Limited quantities" refers to quantities specified in the ADGC for transport in quantities that fall below threshold reportable quantities.
          </div>
        </div>
      )
    },
    {
      id: "documentation",
      num: "07",
      title: "7. Required Documentation",
      icon: <FileCheck className="w-5 h-5 text-primary" />,
      searchText: "All shipments containing dangerous goods must include: Dangerous Goods Declaration (DGD): Completed and signed by the shipper or authorized representative Safety Data Sheet (SDS): Current SDS for each substance (within 2 years of data) Shipper's Certificate of Compliance: Signed certification that goods are correctly classified and packaged Emergency Contact Information: Phone number of person with authority and knowledge of the goods Packing Certificate (if applicable): For goods packed into combination packages Limited Quantity Declaration (if applicable): When goods are transported in limited quantities All documentation must be provided BEFORE the goods are tendered for carriage.",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px] mb-2">
            All shipments containing dangerous goods must include the following documentation provided <strong className="text-slate-900 dark:text-white">BEFORE</strong> the goods are tendered for carriage:
          </p>
          <div className="space-y-3">
            {[
              { title: "Dangerous Goods Declaration (DGD)", desc: "Completed and signed by the shipper or authorized representative." },
              { title: "Safety Data Sheet (SDS)", desc: "Current SDS for each substance (within 2 years of data)." },
              { title: "Shipper's Certificate of Compliance", desc: "Signed certification that goods are correctly classified and packaged." },
              { title: "Emergency Contact Information", desc: "Phone number of person with authority and knowledge of the goods." },
              { title: "Packing Certificate (if applicable)", desc: "For goods packed into combination packages." },
              { title: "Limited Quantity Declaration (if applicable)", desc: "When goods are transported in limited quantities." }
            ].map((doc, idx) => (
              <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800/30">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-zinc-200">{doc.title}</h5>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "packaging",
      num: "08",
      title: "8. Packaging Requirements",
      icon: <Package className="w-5 h-5 text-primary" />,
      searchText: "Dangerous goods must be packaged in: UN-Certified Packaging: All outer and inner packaging must be UN-approved (UN1, UN3A, UN4G, etc.) Condition: New or reconditioned packaging only; used or damaged packaging is not acceptable Segregation: Incompatible goods must be segregated during packing Filling Level: Packages must not be overfilled; adequate headspace required Securing: Inner containers must be cushioned and secured to prevent movement",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Dangerous goods must be packaged according to the following strict safety protocols:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {[
              { title: "UN-Certified Packaging", desc: "All outer and inner packaging must be UN-approved (UN1, UN3A, UN4G, etc.)." },
              { title: "Condition", desc: "New or reconditioned packaging only; used or damaged packaging is not acceptable." },
              { title: "Segregation", desc: "Incompatible goods must be segregated during packing to prevent reaction." },
              { title: "Filling Level", desc: "Packages must not be overfilled; adequate headspace is required for thermal expansion." },
              { title: "Securing", desc: "Inner containers must be cushioned and secured within the outer packaging to prevent movement." }
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/40">
                <h5 className="text-sm font-bold text-slate-850 dark:text-zinc-200 flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {item.title}
                </h5>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "labeling",
      num: "09",
      title: "9. Labeling & Marking Requirements",
      icon: <Tag className="w-5 h-5 text-primary" />,
      searchText: "All packages containing dangerous goods must display: Class Labels: Diamond-shaped danger labels on all four sides (top not required for certain items) UN Number: 'UN' followed by four-digit UN classification number Proper Shipping Name: The correct technical name as per ADGC Emergency Information: Emergency phone number in clearly legible format Orientation Labels (if applicable): 'This Way Up' or 'Handle with Care' markings Shipper's Name & Address: On the package",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px] mb-2">
            All packages containing dangerous goods must display highly visible, standardized markings:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Class Labels", detail: "Diamond-shaped danger labels on all four sides." },
              { label: "UN Number", detail: "'UN' followed by four-digit UN classification number." },
              { label: "Proper Shipping Name", detail: "The correct technical name as per the ADGC." },
              { label: "Emergency Info", detail: "Emergency phone number in clearly legible format." },
              { label: "Orientation Labels", detail: "'This Way Up' or 'Handle with Care' markings (if applicable)." },
              { label: "Shipper Info", detail: "Shipper's name and address must be clearly marked on the package." }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/40 text-center">
                <span className="text-xs font-bold text-primary uppercase block mb-1">{item.label}</span>
                <p className="text-xs text-slate-550 dark:text-zinc-450 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "quantity-limits",
      num: "10",
      title: "10. Quantity Limits",
      icon: <Scale className="w-5 h-5 text-primary" />,
      searchText: "Tranzit Group observes the following quantity limits per consignment: Hazard Class Maximum Quantity per Consignment Notes Class 2 (Gases) Up to 120L (total) Non-flammable only; cylinders must be secured Class 3 (Flammable Liquids) Up to 10L (limited quantity) Packing Group II & III only Class 4 (Flammable Solids) Up to 10kg Subject to approval Class 5 (Oxidising Agents) Up to 10kg or 10L Depends on specific substance Class 8 (Corrosives) Up to 10L (limited quantity) Packing Group II & III only Class 9 (Misc. Hazardous) Varies by substance Dry ice, batteries require special approval",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px] mb-4">
            Tranzit Group observes the following strict quantity limits per consignment:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-zinc-800/60">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200/60 dark:border-zinc-800/60">
                  <th className="p-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-450">Hazard Class</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-450">Maximum Quantity per Consignment</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-450">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/40 text-xs font-medium text-slate-600 dark:text-zinc-350">
                {[
                  { class: "Class 2 (Gases)", qty: "Up to 120L (total)", notes: "Non-flammable only; cylinders must be secured" },
                  { class: "Class 3 (Flammable Liquids)", qty: "Up to 10L (limited quantity)", notes: "Packing Group II & III only" },
                  { class: "Class 4 (Flammable Solids)", qty: "Up to 10kg", notes: "Subject to approval" },
                  { class: "Class 5 (Oxidising Agents)", qty: "Up to 10kg or 10L", notes: "Depends on specific substance" },
                  { class: "Class 8 (Corrosives)", qty: "Up to 10L (limited quantity)", notes: "Packing Group II & III only" },
                  { class: "Class 9 (Misc. Hazardous)", qty: "Varies by substance", notes: "Dry ice, batteries require special approval" }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{row.class}</td>
                    <td className="p-4 text-primary font-semibold">{row.qty}</td>
                    <td className="p-4 text-slate-500 dark:text-zinc-400">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: "handling-storage",
      num: "11",
      title: "11. Handling & Storage Requirements",
      icon: <Database className="w-5 h-5 text-primary" />,
      searchText: "Dangerous goods in Tranzit Group's care must be: Stored in designated dangerous goods storage areas Kept away from incompatible materials Protected from heat, direct sunlight, and moisture (unless otherwise required) Kept in well-ventilated areas Segregated from food and feed items Handled only by trained personnel Transported in vehicles with appropriate safety equipment",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px] mb-2">
            Dangerous goods in Tranzit Group's care must be:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 text-[14px]">
            {[
              "Stored in designated dangerous goods storage areas",
              "Kept away from incompatible materials",
              "Protected from heat, direct sunlight, and moisture",
              "Stored and handled in well-ventilated areas",
              "Segregated from food, medicines, and animal feed items",
              "Handled exclusively by certified and trained personnel",
              "Transported in vehicles equipped with safety and spill response kits"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "incident-reporting",
      num: "12",
      title: "12. Dangerous Goods Incident Reporting",
      icon: <AlertOctagon className="w-5 h-5 text-primary" />,
      searchText: "If any of the following occur, the shipper, consignee, or Tranzit Group representative must immediately contact emergency services and report to Tranzit Group: Leaking, spillage, or rupture of dangerous goods Damage to packaging or labels Fire or explosion involving dangerous goods Exposure of personnel or public to dangerous goods Any accident or incident involving a vehicle carrying dangerous goods Emergency Contact: [Insert 24/7 Emergency Number]",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px] mb-4">
            If any of the following occur, the shipper, consignee, or Tranzit Group representative must immediately contact emergency services and report to Tranzit Group:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              "Leaking, spillage, or rupture of dangerous goods",
              "Damage to packaging or labels",
              "Fire or explosion involving dangerous goods",
              "Exposure of personnel or public to dangerous goods",
              "Any accident or incident involving a vehicle carrying dangerous goods"
            ].map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center text-xs font-semibold text-slate-600 dark:text-zinc-400 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800/40 text-sm font-bold text-slate-800 dark:text-zinc-200">
            Emergency Contact: [Insert 24/7 Emergency Number]
          </div>
        </div>
      )
    },
    {
      id: "training",
      num: "13",
      title: "13. Personnel Training",
      icon: <GraduationCap className="w-5 h-5 text-primary" />,
      searchText: "Tranzit Group ensures that: All personnel involved in handling dangerous goods receive appropriate training Training is documented and kept current (refresher every 2 years) Training covers classification, packaging, labeling, and emergency response Personnel can identify dangerous goods and determine if they are acceptable",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px] mb-2">
            Tranzit Group ensures strict training requirements for safety and regulatory compliance:
          </p>
          <div className="space-y-3">
            {[
              "All personnel involved in handling dangerous goods receive appropriate training.",
              "Training is fully documented and kept current, requiring a refresher every two (2) years.",
              "Training covers classification, packaging, labeling, emergency response, and handling protocols.",
              "Personnel must be certified to identify dangerous goods and determine if they are acceptable for carriage."
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800/30">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  ✓
                </span>
                <p className="text-xs text-slate-550 dark:text-zinc-400 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "compliance-audits",
      num: "14",
      title: "14. Compliance & Audits",
      icon: <ShieldCheck className="w-5 h-5 text-primary" />,
      searchText: "Tranzit Group: Maintains a register of all dangerous goods consignments Conducts regular audits of dangerous goods procedures Reviews incidents and near-misses to prevent recurrence Reports accidents and incidents to relevant authorities Maintains all required documentation for audit purposes",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px] mb-2">
            To maintain safety standards and satisfy state and federal laws, Tranzit Group:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 text-[14px]">
            {[
              "Maintains a detailed register of all dangerous goods consignments.",
              "Conducts regular independent audits of dangerous goods procedures and storage sites.",
              "Thoroughly reviews all incidents and near-misses to prevent recurrence.",
              "Reports accidents and significant incidents to relevant regulatory authorities.",
              "Maintains all required legal documentation for audit and compliance checks."
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-slate-500 dark:text-zinc-400">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      id: "liability-insurance",
      num: "15",
      title: "15. Liability & Insurance",
      icon: <Scale className="w-5 h-5 text-primary" />,
      searchText: "Shippers are responsible for: Obtaining appropriate insurance for dangerous goods carriage Liability for any damage, loss, or injury caused by dangerous goods Compliance with all applicable insurance requirements Tranzit Group shall not be liable for any loss, damage, or injury arising from: Misclassification or misrepresentation of goods as dangerous goods Failure of shipper to provide accurate documentation Improper packaging or labeling by shipper Non-compliance with this policy or applicable regulations",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-bold text-slate-800 dark:text-zinc-200 mb-3 border-b pb-1">Shipper Insurance & Liability</h5>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                <li className="flex gap-2"><span className="text-primary font-bold">•</span> Obtaining appropriate insurance for dangerous goods carriage.</li>
                <li className="flex gap-2"><span className="text-primary font-bold">•</span> Full liability for any damage, loss, or injury caused by dangerous goods.</li>
                <li className="flex gap-2"><span className="text-primary font-bold">•</span> Compliance with all applicable insurance carrier requirements.</li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-bold text-red-700 dark:text-red-400 mb-3 border-b pb-1">Tranzit Group Exclusions</h5>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> Misclassification or misrepresentation of goods.</li>
                <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> Failure of shipper to provide accurate, complete documentation.</li>
                <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> Improper packaging or labeling by the shipper.</li>
                <li className="flex gap-2"><span className="text-red-500 font-bold">•</span> General non-compliance with this policy or regulations.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "penalties",
      num: "16",
      title: "16. Penalties & Consequences",
      icon: <AlertOctagon className="w-5 h-5 text-primary" />,
      searchText: "Non-compliance with this policy may result in: Immediate suspension or termination of shipping privileges Confiscation and proper disposal of dangerous goods at shipper's expense Imposition of service charges to cover remedial action Legal action and recovery of costs Reporting to relevant authorities (Police, EPA, SafeWork NSW, etc.) Criminal penalties as prescribed by applicable regulations",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px] mb-2">
            Non-compliance with this policy violates transport laws and safety standards. Violations may result in:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 text-[14px]">
            {[
              "Immediate suspension or termination of shipping privileges",
              "Confiscation and proper disposal of dangerous goods at shipper's expense",
              "Imposition of service charges to cover remedial action",
              "Legal action and recovery of costs",
              "Reporting to relevant authorities (Police, EPA, SafeWork NSW, etc.)",
              "Criminal penalties as prescribed by applicable regulations"
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2.5 text-red-650 dark:text-red-400 font-semibold p-2 bg-red-500/5 rounded-xl border border-red-500/10">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  !
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "amendment",
      num: "17",
      title: "17. Policy Review & Amendment",
      icon: <History className="w-5 h-5 text-primary" />,
      searchText: "This policy is reviewed annually and amended as required to reflect changes in regulations or operational practices. Shippers are responsible for maintaining awareness of current policy requirements.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          This policy is reviewed annually and amended as required to reflect changes in regulations or operational practices. Shippers are responsible for maintaining awareness of current policy requirements.
        </p>
      )
    },
    {
      id: "contact",
      num: "18",
      title: "18. Contact & Further Information",
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      searchText: "Dangerous Goods Coordinator: admin@tranzitgroup.com.au Compliance Team: info@tranzitgroup.com.au Additional information is available from: Australian Dangerous Goods Code (www.transport.gov.au) IATA Dangerous Goods Regulations (www.iata.org) Work Health and Safety Regulator (www.safeworkaustralia.gov.au) Tranzit Group ABN: 12 690 967 198 Address: 12B Bass Ct Keysborough, VIC 3173 Australia Email: info@tranzitgroup.com.au",
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            For questions regarding the carriage of dangerous goods or clarification on this policy, please contact:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/40 flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500 block">Dangerous Goods Coordinator</span>
                <a href="mailto:admin@tranzitgroup.com.au" className="text-sm font-bold text-primary hover:underline">admin@tranzitgroup.com.au</a>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/40 flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500 block">Compliance Team</span>
                <a href="mailto:info@tranzitgroup.com.au" className="text-sm font-bold text-primary hover:underline">info@tranzitgroup.com.au</a>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block mb-2">Additional Resources</span>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "Australian Dangerous Goods Code", url: "https://www.transport.gov.au" },
                { name: "IATA Dangerous Goods Regulations", url: "https://www.iata.org" },
                { name: "Work Health and Safety Regulator", url: "https://www.safeworkaustralia.gov.au" }
              ].map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 text-xs font-semibold text-slate-600 dark:text-zinc-400 rounded-lg transition-all"
                >
                  {res.name}
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          <hr className="border-slate-100 dark:border-zinc-800/60 my-4" />

          {/* Styled Contact Grid Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800/40 flex flex-col items-center text-center hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-sm">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-zinc-500 mb-1">
                Business Details
              </span>
              <span className="font-bold text-slate-800 dark:text-zinc-200">Tranzit Group</span>
              <span className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">ABN: 12 690 967 198</span>
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
                Support Email
              </span>
              <a
                href="mailto:info@tranzitgroup.com.au"
                className="font-bold text-primary hover:underline underline-offset-4 transition-colors"
              >
                info@tranzitgroup.com.au
              </a>
              <span className="text-sm text-slate-500 dark:text-zinc-400 mt-1 font-medium">Response within 24h</span>
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
            <span>Updated: June 23, 2026</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">

          {/* Left Column: Sidebar Table of Contents */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 self-start bg-white/50 dark:bg-zinc-900/35 p-6 rounded-2xl border border-slate-200/45 dark:border-zinc-800/45 backdrop-blur-sm shadow-xs">
            <nav className="space-y-1.5 pl-1 py-1">
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

          {/* Right Column: Main Document */}
          <main className="lg:col-span-9 space-y-6">

            {/* Top Intro Section Card */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/60 rounded-3xl p-6 sm:p-10 shadow-xs relative overflow-hidden transition-colors duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-3xl mt-0 mb-1 sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                    Dangerous Goods Policy
                  </h1>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                This policy outlines the strict requirements for the safe handling, packaging, documentation, and carriage of dangerous goods in compliance with Australian and international regulations.
              </p>

              {/* Modern Interactive Search Bar */}
              <div className="mt-8 relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search policy sections, keywords, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
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

            {/* Dangerous Goods Warnings Alert Card */}
            <div className="bg-red-500/5 border-l-4 border-red-500 p-5 rounded-r-2xl shadow-3xs flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5 animate-pulse" />
              <div>
                <h4 className="text-sm font-bold text-red-700 dark:text-red-400 uppercase tracking-wide">
                  ⚠️ IMPORTANT NOTICE
                </h4>
                <p className="text-sm text-red-650 dark:text-red-300 mt-1 leading-relaxed font-semibold">
                  The carriage of dangerous goods is strictly regulated. Failure to comply with this policy and applicable regulations may result in legal penalties, service suspension, and liability for damages.
                </p>
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
                      <h2 className="text-lg font-bold my-0 text-slate-900 dark:text-white group-hover:text-primary transition-colors">
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
                    We couldn't find any policy terms matching "{searchQuery}". Please try another search term or browse the categories.
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
