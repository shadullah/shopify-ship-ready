import { json } from "@remix-run/node";
import prisma from "../config/db";

export const loader = async () => {
  return json({
    availableModels: Object.keys(prisma).filter(key => !key.startsWith('$') && !key.startsWith('_')),
    emailCampaignExists: 'emailCampaign' in prisma,
    scheduledEmailExists: 'scheduledEmail' in prisma
  });
};