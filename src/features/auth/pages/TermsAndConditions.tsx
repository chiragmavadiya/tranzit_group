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
  History,
  Scale,
  UserCheck,
  XCircle,
  HelpCircle,
  Info
} from "lucide-react";
import brandLogo from "@/assets/Tranzit_Logo.svg";
import brandLogoDark from "@/assets/Tranzit_Logo_dark.svg";
import { useTheme } from "@/app/providers/theme-provider";

export default function TermsAndConditions() {
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
        "introduction", "use-license", "disclaimer", "limitations",
        "accuracy", "links", "modifications", "governing-law",
        "user-accounts", "prohibited-activities", "contact"
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
    document.title = "Terms & Conditions | Tranzit Group";
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
      searchText: "Welcome to Tranzit Group's Portal. These Terms and Conditions govern your use of our website, applications, and services. By accessing and using this portal, you agree to be bound by these terms. If you do not agree with any part of these terms, you should not use our services.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          Welcome to Tranzit Group's Portal. These Terms and Conditions govern your use of our website, applications, and services. By accessing and using this portal, you agree to be bound by these terms. If you do not agree with any part of these terms, you should not use our services.
        </p>
      )
    },
    {
      id: "use-license",
      num: "02",
      title: "2. Use License",
      icon: <Key className="w-5 h-5 text-primary" />,
      searchText: "Permission is granted to temporarily download one copy of the materials information or software on Tranzit Group's portal for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: Modify or copy the materials Use the materials for any commercial purpose or for any public display Attempt to decompile or reverse engineer any software contained on Tranzit Group's portal Remove any copyright or other proprietary notations from the materials Transfer the materials to another person or mirror the materials on any other server Violate any applicable laws or regulations",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            Permission is granted to temporarily download one copy of the materials (information or software) on Tranzit Group's portal for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 text-[14px]">
            {[
              "Modify or copy the materials",
              "Use the materials for any commercial purpose or public display",
              "Decompile or reverse engineer any portal software",
              "Remove any copyright or proprietary notations",
              "Transfer the materials or 'mirror' them on another server",
              "Violate any applicable laws or regulations"
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
      id: "disclaimer",
      num: "03",
      title: "3. Disclaimer",
      icon: <ShieldAlert className="w-5 h-5 text-primary" />,
      searchText: "The materials on Tranzit Group's portal are provided on an 'as is' basis. Tranzit Group makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            The materials on Tranzit Group's portal are provided on an 'as is' basis. Tranzit Group makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation:
          </p>
          <div className="bg-amber-500/5 border-l-4 border-amber-500 p-4 rounded-r-xl">
            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
              Implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "limitations",
      num: "04",
      title: "4. Limitations",
      icon: <AlertTriangle className="w-5 h-5 text-primary" />,
      searchText: "In no event shall Tranzit Group or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Tranzit Group's portal, even if Tranzit Group or an authorized representative has been notified orally or in writing of the possibility of such damage.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          In no event shall Tranzit Group or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Tranzit Group's portal, even if Tranzit Group or an authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      )
    },
    {
      id: "accuracy",
      num: "05",
      title: "5. Accuracy of Materials",
      icon: <ClipboardCheck className="w-5 h-5 text-primary" />,
      searchText: "The materials appearing on Tranzit Group's portal could include technical, typographical, or photographic errors. Tranzit Group does not warrant that any of the materials on its portal are accurate, complete, or current. Tranzit Group may make changes to the materials contained on its portal at any time without notice.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          The materials appearing on Tranzit Group's portal could include technical, typographical, or photographic errors. Tranzit Group does not warrant that any of the materials on its portal are accurate, complete, or current. Tranzit Group may make changes to the materials contained on its portal at any time without notice.
        </p>
      )
    },
    {
      id: "links",
      num: "06",
      title: "6. Links",
      icon: <ExternalLink className="w-5 h-5 text-primary" />,
      searchText: "Tranzit Group has not reviewed all of the sites linked to its portal and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Tranzit Group of the site. Use of any such linked website is at the user's own risk.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          Tranzit Group has not reviewed all of the sites linked to its portal and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Tranzit Group of the site. Use of any such linked website is at the user's own risk.
        </p>
      )
    },
    {
      id: "modifications",
      num: "07",
      title: "7. Modifications",
      icon: <History className="w-5 h-5 text-primary" />,
      searchText: "Tranzit Group may revise these terms of service for its portal at any time without notice. By using this portal, you are agreeing to be bound by the then current version of these terms of service.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          Tranzit Group may revise these terms of service for its portal at any time without notice. By using this portal, you are agreeing to be bound by the then current version of these terms of service.
        </p>
      )
    },
    {
      id: "governing-law",
      num: "08",
      title: "8. Governing Law",
      icon: <Scale className="w-5 h-5 text-primary" />,
      searchText: "These terms and conditions are governed by and construed in accordance with the laws of Australia, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          These terms and conditions are governed by and construed in accordance with the laws of Australia, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
        </p>
      )
    },
    {
      id: "user-accounts",
      num: "09",
      title: "9. User Accounts",
      icon: <UserCheck className="w-5 h-5 text-primary" />,
      searchText: "If you create an account on our portal, you are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.",
      content: (
        <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
          If you create an account on our portal, you are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
        </p>
      )
    },
    {
      id: "prohibited-activities",
      num: "10",
      title: "10. Prohibited Activities",
      icon: <XCircle className="w-5 h-5 text-primary" />,
      searchText: "You agree not to engage in any of the following prohibited activities: Harassing or causing distress or inconvenience to any person Obscene or abusive language or behavior Disrupting the normal flow of dialogue within our portal Attempting to gain unauthorized access to our systems Uploading viruses or malicious code Spamming or sending unsolicited communications",
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1 text-[14px]">
            {[
              "Harassing or causing distress/inconvenience",
              "Obscene or abusive language or behavior",
              "Disrupting the normal flow of dialogue",
              "Attempting unauthorized access to systems",
              "Uploading viruses or malicious code",
              "Spamming or sending unsolicited communications"
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
      id: "contact",
      num: "11",
      title: "11. Contact Information",
      icon: <HelpCircle className="w-5 h-5 text-primary" />,
      searchText: "If you have any questions about these Terms and Conditions, please contact us at the address provided below. Tranzit Group ABN: 12 690 967 198 Address: 12B Bass Ct Keysborough, VIC 3173 Australia Email: info@tranzitgroup.com.au",
      content: (
        <div className="space-y-6">
          <p className="text-slate-600 dark:text-zinc-300 leading-relaxed text-[15px]">
            If you have any questions about these Terms and Conditions, please contact us at the address provided below.
          </p>

          {/* Styled Contact Grid Card */}
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
                Please read these terms and conditions carefully before using the Tranzit Group Portal. By accessing or using our services, you agree to comply with and be bound by these legal rules.
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
