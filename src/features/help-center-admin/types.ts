export type ArticleStatus = 'Published' | 'Draft' | 'Archived';

export interface HelpArticle {
  id: string | number;
  title: string;
  slug: string;
  category: string;
  excerpt?: string;
  status: string;
  updated: string;
  content: string;
  is_published: boolean;
}

export interface HelpArticleFormData {
  category: string;
  title: string;
  excerpt?: string;
  content: string;
  is_published: boolean;
}

export interface HelpArticleFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface HelpArticleResponse {
  status: boolean;
  message: string;
  data: HelpArticle[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface SingleArticleResponse {
  status: boolean;
  message: string;
  data: HelpArticle;
}
