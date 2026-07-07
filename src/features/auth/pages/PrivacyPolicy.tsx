import { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  Mail,
  Briefcase,
  Clock,
  ChevronUp,
  Search,
  BookOpen,
  Database,
  Compass,
  Shield,
  RefreshCw,
  HelpCircle,
  Cookie,
  ExternalLink,
  Users,
  FileCheck,
  Info
} from "lucide-react";
import brandLogo from "@/assets/Tranzit_Logo.svg";
import brandLogoDark from "@/assets/Tranzit_Logo_dark.svg";
import { useTheme } from "@/app/providers/theme-provider";

export default function PrivacyPolicy() {
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
        "introduction", "collection-use", "use-data", "security-data",
        "changes-policy", "contact-us", "cookies", "third-party",
        "children-privacy", "compliance-laws", "contact"
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
    document.title = "Privacy Policy | Tranzit Group";
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
      title: "1. Introduction",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      searchText: "Tranzit Group we us our or Company operates the portal. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our portal and the choices you have associated with that data.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          Tranzit Group ("we", "us", "our" or "Company") operates the portal. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our portal and the choices you have associated with that data.
        </p>
      )
    },
    {
      id: "collection-use",
      num: "02",
      title: "2. Information Collection and Use",
      icon: <Database className="w-5 h-5 text-primary" />,
      searchText: "We collect several different types of information for various purposes to provide and improve our Service to you. Types of Data Collected Personal Data: While using our portal, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include, but is not limited to: Email address First name and last name Phone number Address, State, Province, ZIP/Postal code, City Cookies and Usage Data Usage Data: We may also collect information on how the portal is accessed and used. This may include information such as your computer's Internet Protocol address, browser type, browser version, the pages you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>

          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">2.1 Types of Data Collected</h4>

            <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/40">
              <span className="text-xs font-bold text-primary uppercase tracking-wide block mb-2">Personal Data</span>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mb-3">
                While using our portal, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold pl-1 text-slate-500 dark:text-zinc-400">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Email address</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> First name and last name</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Phone number</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Address, State, ZIP, City</li>
                <li className="flex items-center gap-2 sm:col-span-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" /> Cookies and Usage Data</li>
              </ul>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-950 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/40">
              <span className="text-xs font-bold text-primary uppercase tracking-wide block mb-2">Usage Data</span>
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                We may also collect information on how the portal is accessed and used ("Usage Data"). This may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "use-data",
      num: "03",
      title: "3. Use of Data",
      icon: <Compass className="w-5 h-5 text-primary" />,
      searchText: "Tranzit Group uses the collected data for various purposes: To provide and maintain our portal To notify you about changes to our portal To allow you to participate in interactive features of our portal when you choose to do so To provide customer care and support To gather analysis or valuable information so that we can improve our portal To monitor the usage of our portal To detect, prevent and address technical issues",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Tranzit Group uses the collected data for various purposes:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 text-[14px]">
            {[
              "To provide and maintain our portal",
              "To notify you about changes to our portal",
              "To support interactive features when chosen",
              "To provide customer care and support",
              "To analyze information to improve the portal",
              "To monitor the usage of our portal",
              "To detect, prevent, and address technical issues"
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
      id: "security-data",
      num: "04",
      title: "4. Security of Data",
      icon: <Shield className="w-5 h-5 text-primary" />,
      searchText: "The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
        </p>
      )
    },
    {
      id: "changes-policy",
      num: "05",
      title: "5. Changes to This Privacy Policy",
      icon: <RefreshCw className="w-5 h-5 text-primary" />,
      searchText: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the Last Updated date at the top of this Privacy Policy.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
        </p>
      )
    },
    {
      id: "contact-us",
      num: "06",
      title: "6. Contact Us",
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      searchText: "If you have any questions about this Privacy Policy, please contact us at the address provided below.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          If you have any questions about this Privacy Policy, please contact us at the address provided below.
        </p>
      )
    },
    {
      id: "cookies",
      num: "07",
      title: "7. Cookies",
      icon: <Cookie className="w-5 h-5 text-primary" />,
      searchText: "Our portal uses cookies to enhance user experience. A cookie is a file containing an identifier a string of letters and numbers that is sent by a web server to a web browser and is stored by the browser. The identifier is then sent back to the server each time the browser requests a page from the server. Cookies may be either persistent cookies or session cookies. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our portal.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          Our portal uses cookies to enhance user experience. A cookie is a file containing an identifier (a string of letters and numbers) that is sent by a web server to a web browser and is stored by the browser. The identifier is then sent back to the server each time the browser requests a page from the server. Cookies may be either "persistent" cookies or "session" cookies.
          <br /><br />
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our portal.
        </p>
      )
    },
    {
      id: "third-party",
      num: "08",
      title: "8. Third-Party Links",
      icon: <ExternalLink className="w-5 h-5 text-primary" />,
      searchText: "Our portal may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          Our portal may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
        </p>
      )
    },
    {
      id: "children-privacy",
      num: "09",
      title: "9. Children's Privacy",
      icon: <Users className="w-5 h-5 text-primary" />,
      searchText: "Our portal does not address anyone under the age of 18 Children. We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us immediately.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          Our portal does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us immediately.
        </p>
      )
    },
    {
      id: "compliance-laws",
      num: "10",
      title: "10. Compliance with Laws",
      icon: <FileCheck className="w-5 h-5 text-primary" />,
      searchText: "Tranzit Group complies with all applicable privacy laws and regulations, including the Privacy Act 1988 Cth and the Australian Privacy Principles.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          Tranzit Group complies with all applicable privacy laws and regulations, including the Privacy Act 1988 (Cth) and the Australian Privacy Principles.
        </p>
      )
    },
    {
      id: "contact",
      num: "11",
      title: "11. Contact Information",
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      searchText: "Tranzit Group ABN: 12 690 967 198 Address: 12B Bass Ct Keysborough, VIC 3173 Australia Email: info@tranzitgroup.com.au",
      content: (
        <div className="space-y-6">
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

  const indexSections = useMemo(() => [
    { id: "introduction", title: "1. Introduction", num: "01" },
    { id: "collection-use", title: "2. Collection and Use", num: "02" },
    { id: "use-data", title: "3. Use of Data", num: "03" },
    { id: "security-data", title: "4. Security", num: "04" },
    { id: "changes-policy", title: "5. Changes", num: "05" },
    { id: "contact-us", title: "6. Contact Us", num: "06" },
    { id: "cookies", title: "7. Cookies", num: "07" },
    { id: "third-party", title: "8. Third-Party Links", num: "08" },
    { id: "children-privacy", title: "9. Children", num: "09" },
    { id: "compliance-laws", title: "10. Compliance", num: "10" },
    { id: "contact", title: "11. Contact Information", num: "11" }
  ], []);

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
            <span>Updated: June 2026</span>
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
              {indexSections.map((section) => {
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

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                <div>
                  <h1 className="text-3xl mt-0 mb-1 sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                    Privacy Policy
                  </h1>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                Your privacy is of utmost importance to us. This Privacy Policy details the types of personal data we collect, how we use it, and your rights regarding your personal information.
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
                    We couldn't find any terms matching "{searchQuery}". Please try another search term or browse the categories.
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
