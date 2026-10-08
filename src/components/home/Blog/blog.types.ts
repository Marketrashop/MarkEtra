export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string;
  slug: string;
  featured?: boolean;
};