import { startEmailWorker } from "./services/emailService";
import shopify from "./config/shopify";

export async function startWorkers() {
  try {
    // Get a session for the worker
    const session = await shopify.config.sessionStorage.findSessionsByShop("your-shop-domain.myshopify.com");
    if (!session) {
      console.error("No session found for worker");
      return;
    }

    const admin = new shopify.api.clients.Graphql({
      session: session[0],
    });

    // Start email campaign worker
    await startEmailWorker(admin, session[0]);
    console.log("Email worker started successfully");
  } catch (error) {
    console.error("Error starting workers:", error);
  }
}

// Start workers when this file is imported
startWorkers();