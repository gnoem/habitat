import path from "path";
import { promises as fs } from "fs";
import getConfig from "next/config";

import handlebars from "handlebars";
import sgMail from "@sendgrid/mail";

const { serverRuntimeConfig } = getConfig();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getPath = (pathToFile) => path.join(serverRuntimeConfig.PROJECT_ROOT, pathToFile);

const readHTMLFile = (pathToFile) => {
  return fs.readFile(pathToFile, { encoding: 'utf-8' }, (err, html) => {
    if (err) throw err;
    return html;
  });
}

export const sendPasswordResetEmail = async ({ to, subject, resetLink }) => {
  const html = await readHTMLFile(getPath('./public/email/passwordReset.html'));
  const template = handlebars.compile(html);
  const replacements = {
    email: to,
    resetLink
  }
  const htmlToSend = template(replacements);
  await sgMail.send({
    from: `habitat <contact@ngw.dev>`,
    to,
    subject,
    plaintext: 'hi \n this is habitat', // todo better plaintext option
    html: htmlToSend
  });
  return `Sent password recovery email to ${to}`;
}