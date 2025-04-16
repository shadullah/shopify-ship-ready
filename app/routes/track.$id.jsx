import { json } from "@remix-run/node";
import prisma from "../config/db";

export async function loader({ params }) {
  const { id } = params;
  
  try {
    const campaignId = id.split("-")[1];
    
    // Update open stats
    await prisma.emailCampaign.update({
      where: { id: campaignId },
      data: {
        openRate: { increment: 1 },
      },
    });
    
    // Return transparent pixel
    return new Response(
      Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"),
      {
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Tracking error:", error);
    return json({ error: "Tracking failed" }, { status: 500 });
  }
}