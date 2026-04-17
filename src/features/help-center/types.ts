export interface HelpCenterQA {
  question: string
  answer: string[]
}

export interface HelpCenterArticle {
  slug: string
  title: string
  subtitle: string
  category: string
  categorySlug: string
  qas: HelpCenterQA[]
}

export interface HelpCenterCategory {
  slug: string
  name: string
  articles: HelpCenterArticle[]
}
