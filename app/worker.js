// import { startEmailWorker } from "./services/emailService";
// import shopify from "./config/shopify";

// export async function startWorkers() {
//   try {
//     // Get a session for the worker
//     const session = await shopify.config.sessionStorage.findSessionsByShop("your-shop-domain.myshopify.com");
//     if (!session) {
//       console.error("No session found for worker");
//       return;
//     }

//     const admin = new shopify.api.clients.Graphql({
//       session: session[0],
//     });

//     // Start email campaign worker
//     await startEmailWorker(admin, session[0]);
//     console.log("Email worker started successfully");
//   } catch (error) {
//     console.error("Error starting workers:", error);
//   }
// }

// // Start workers when this file is imported
// startWorkers();

import { EmailService } from "./services/emailService";
import prisma from "./config/db";
import shopify, { sessionStorage } from "./config/shopify";

export async function startWorkers() {
  try {
    const session = await sessionStorage.findSessionsByShop(process.env.SHOPIFY_STORE_DOMAIN);
    
    if (!session || session.length === 0) {
      console.error("No session found for worker");
      return;
    }

    const admin = await shopify.admin.graphql.client({
      session: session[0]
    });

    const emailService = new EmailService(admin, session[0]);

    // Process scheduled campaigns every minute
    setInterval(async () => {
      try {
        const now = new Date();
        const scheduledEmails = await prisma.scheduledEmail.findMany({
          where: {
            status: "scheduled",
            scheduledAt: { lte: now },
          },
          include: { campaign: true },
        });

        for (const scheduled of scheduledEmails) {
          try {
            await emailService.sendCampaign(scheduled.campaign);
            
            await prisma.scheduledEmail.update({
              where: { id: scheduled.id },
              data: {
                status: "sent",
                sentAt: new Date(),
              },
            });
          } catch (error) {
            console.error(`Error processing scheduled email ${scheduled.id}:`, error);
            
            await prisma.scheduledEmail.update({
              where: { id: scheduled.id },
              data: {
                status: "failed",
                error: error.message,
              },
            });
          }
        }
      } catch (error) {
        console.error("Error in email worker:", error);
      }
    }, 60000); // Run every minute
  } catch (error) {
    console.error("Error starting workers:", error);
  }
}

// Start the worker
startWorkers();