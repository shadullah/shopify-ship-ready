import Queue from "bull";
import { sendEmail } from "./emailService";

const emailQueue = new Queue("emailQueue");

emailQueue.process(async (job) => {
    const { emailTemplateId } = job.data;
    // Fetch the email template and send the email
    const emailTemplate = await getEmailTemplateById(emailTemplateId);
    await sendEmail(emailTemplate);
});

export const queueScheduledEmail = (emailTemplateId, schedule) => {
    const delay = new Date(schedule).getTime() - Date.now();
    return emailQueue.add({ emailTemplateId }, { delay });
};