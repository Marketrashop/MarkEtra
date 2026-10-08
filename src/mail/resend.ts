import { Resend } from "resend";

import { MAIL_CONFIG } from "./config";

export const resend = new Resend(MAIL_CONFIG.resendApiKey);
