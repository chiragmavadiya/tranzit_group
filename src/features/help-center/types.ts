export interface HelpCenterArticle {
    id?: number
    title: string
    slug: string
    category: string
    updated: string
    short_description?: string
    content?: string
}

export interface HelpCenterCategory {
    category: string
    articles: HelpCenterArticle[]
}