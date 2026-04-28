export type ArticleStatus = 'Published' | 'Draft' | 'Archived';

export interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription?: string;
  status: ArticleStatus;
  updatedAt: string;
  content: string;
}
