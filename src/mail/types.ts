export type EmailDetail = {
  label: string;

  value: string;
};

export type EmailButton = {
  label: string;

  url: string;
};

export type BaseEmailInput = {
  subject: string;

  preheader?: string;

  title: string;

  message: string;

  htmlSection?: string;

  details?: EmailDetail[];

  button?: EmailButton;

  footerMessage?: string;
};

export type SendMailInput = {
  to: string;

  subject: string;

  html: string;

  text?: string;
};

export type SendMailResult = {
  id: string;
};