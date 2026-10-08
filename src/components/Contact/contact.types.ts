export interface ContactMethod {
  title: string;

  value: string;

  href?: string;
}

export interface SocialLink {
  name: string;

  href: string;
}

export interface ContactFormData {
  fullName: string;

  email: string;

  subject: string;

  message: string;
}