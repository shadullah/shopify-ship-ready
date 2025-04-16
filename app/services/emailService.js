import { GraphqlQueryError } from "@shopify/shopify-api";
import prisma from "../config/db";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class EmailService {
  constructor(admin, session) {
    this.admin = admin;
    this.session = session;
  }

  async getCustomerEmails(recipientType, customerSegment = null) {
    let query;
    
    switch (recipientType) {
      case "all_customers":
        query = `#graphql
          query {
            customers(first: 250) {
              edges {
                node {
                  email
                  acceptsMarketing
                }
              }
            }
          }`;
        break;
      
      case "segment":
        let segmentFilter = "";
        switch (customerSegment) {
          case "recent":
            segmentFilter = "created_at:>=2025-01-01"; // Adjust date as needed
            break;
          case "high_value":
            segmentFilter = "total_spent:>=100"; // Adjust amount as needed
            break;
          case "abandoned_cart":
            // This would require additional abandoned cart tracking
            break;
        }
        
        query = `#graphql
          query {
            customers(first: 250, query: "${segmentFilter}") {
              edges {
                node {
                  email
                  acceptsMarketing
                }
              }
            }
          }`;
        break;
    }

    if (!query) return [];

    try {
      const response = await this.admin.graphql(query);
      const { data: { customers: { edges } } } = await response.json();
      
      return edges
        .filter(({ node }) => node.acceptsMarketing)
        .map(({ node }) => node.email);
    } catch (error) {
      console.error("Error fetching customer emails:", error);
      throw error;
    }
  }

  async scheduleCampaign(campaignId, scheduleAt) {
    try {
      // Validate the schedule time
      const scheduleTime = new Date(scheduleAt);
      if (scheduleTime < new Date()) {
        throw new Error("Schedule time must be in the future");
      }

      // Check if campaign exists
      const campaign = await prisma.emailCampaign.findUnique({
        where: { id: campaignId }
      });

      if (!campaign) {
        throw new Error("Campaign not found");
      }

      // Create or update scheduled email
      const scheduledEmail = await prisma.scheduledEmail.upsert({
        where: {
          campaignId_scheduledAt: {
            campaignId,
            scheduledAt: scheduleTime
          }
        },
        update: {
          status: "scheduled",
          error: null // Clear any previous errors
        },
        create: {
          campaignId,
          status: "scheduled",
          scheduledAt: scheduleTime
        }
      });

      // Update campaign status
      await prisma.emailCampaign.update({
        where: { id: campaignId },
        data: {
          status: "scheduled",
          scheduleAt: scheduleTime
        }
      });

      return scheduledEmail;
    } catch (error) {
      console.error("Error scheduling campaign:", error);
      throw error;
    }
  }

  async processScheduledCampaigns() {
    const now = new Date();
    
    try {
      // Find all campaigns that are scheduled to be sent
      const scheduledCampaigns = await prisma.scheduledEmail.findMany({
        where: {
          status: "scheduled",
          scheduledAt: {
            lte: now
          }
        },
        include: {
          campaign: true // Include the campaign details
        }
      });

      console.log(`Processing ${scheduledCampaigns.length} scheduled campaigns`);

      for (const scheduled of scheduledCampaigns) {
        try {
          const { campaign } = scheduled;
          
          if (!campaign) {
            throw new Error("Campaign not found");
          }

          // Send the campaign
          const result = await this.sendCampaign(campaign);

          // Update scheduled email status
          await prisma.scheduledEmail.update({
            where: { id: scheduled.id },
            data: {
              status: "sent",
              sentAt: new Date(),
              error: null
            }
          });

          // Update campaign status and stats
          await prisma.emailCampaign.update({
            where: { id: campaign.id },
            data: {
              status: "sent",
              lastSentAt: new Date(),
              sendCount: {
                increment: result.recipientCount
              }
            }
          });

        } catch (error) {
          console.error(`Error processing campaign ${scheduled.campaignId}:`, error);
          
          // Update scheduled email with error
          await prisma.scheduledEmail.update({
            where: { id: scheduled.id },
            data: {
              status: "failed",
              error: error.message
            }
          });

          // Update campaign status
          await prisma.emailCampaign.update({
            where: { id: scheduled.campaignId },
            data: {
              status: "failed"
            }
          });
        }
      }
    } catch (error) {
      console.error("Error processing scheduled campaigns:", error);
      throw error;
    }
  }

  async sendCampaign(campaign) {
    try {
      let recipientEmails = [];
      
      if (campaign.recipientType === "custom") {
        try {
          recipientEmails = JSON.parse(campaign.customRecipients || "[]");
        } catch (e) {
          console.error("Error parsing custom recipients:", e);
          recipientEmails = [];
        }
      } else {
        recipientEmails = await this.getCustomerEmails(
          campaign.recipientType,
          campaign.customerSegment
        );
      }

      if (recipientEmails.length === 0) {
        throw new Error("No valid recipients found for campaign");
      }

      // Split recipients into batches
      const batchSize = parseInt(process.env.EMAIL_BATCH_SIZE) || 100;
      const batches = [];
      for (let i = 0; i < recipientEmails.length; i += batchSize) {
        batches.push(recipientEmails.slice(i, i + batchSize));
      }

      let totalSent = 0;
      let errors = [];

      // Send emails in batches
      for (const batch of batches) {
        try {
          const messages = batch.map(email => ({
            to: email,
            from: {
              email: process.env.SENDGRID_FROM_EMAIL,
              name: process.env.SENDGRID_FROM_NAME || "Your Store"
            },
            subject: campaign.subject,
            html: campaign.body,
            trackingSettings: {
              clickTracking: { enable: true },
              openTracking: { enable: true }
            }
          }));

          await sgMail.send(messages);
          totalSent += batch.length;
          
          // Add a small delay between batches to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("Error sending batch:", error);
          errors.push(error.message);
        }
      }

      if (totalSent === 0) {
        throw new Error(`Failed to send any emails. Errors: ${errors.join(", ")}`);
      }

      return {
        success: true,
        recipientCount: totalSent,
        errors: errors.length > 0 ? errors : null
      };
    } catch (error) {
      console.error("Error sending campaign:", error);
      throw error;
    }
  }
}

// Create a function to start the email worker
export async function startEmailWorker(admin, session) {
  const emailService = new EmailService(admin, session);
  
  // Process scheduled campaigns every minute
  setInterval(async () => {
    try {
      await emailService.processScheduledCampaigns();
    } catch (error) {
      console.error("Error in email worker:", error);
    }
  }, 60000); // 60 seconds
}