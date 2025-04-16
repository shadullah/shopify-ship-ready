import { json, redirect } from "@remix-run/react";
import { ContentForm } from "../components/contents/contentForm"; // Reuse the updated ContentForm
import { authenticateExtra } from "../config/shopify";
import { EmailCampaignModel } from "../models/emailCampaign.model"; // Define a model for email campaigns
import { EmailCampaign } from "../entities/emailCampaign"; // Define an entity for email campaigns

export const loader = async ({ request }) => {
  const { admin } = await authenticateExtra(request);
  return json({}); // Return an empty JSON object for now
};

export const action = async ({ request }) => {
  const { admin, metaobject } = await authenticateExtra(request);
  let formData = await request.formData();

  if (formData.createCampaign || formData.updateCampaign) {
    try {
      const newCampaign = await saveEmailCampaign(admin, formData, metaobject);
      if (newCampaign.status && !newCampaign.status.success) {
        return json(
          {
            status: {
              success: false,
              message: newCampaign.status.message,
            },
          },
          { status: 400 }
        );
      }

      // Redirect to the edit page after creation or update
      return redirect(`/app/campaigns/edit/${newCampaign.id.split("/").pop()}`);
    } catch (error) {
      return json(
        {
          status: {
            success: false,
            message: `Error saving campaign: ${error.message}`,
          },
        },
        { status: 400 }
      );
    }
  }

  return json({});
};

export default function NewCampaignPage() {
  return <ContentForm isEditing={false} />;
}

// Helper function to save or update an email campaign
async function saveEmailCampaign(admin, formData, metaobject) {
  const campaign = new EmailCampaign(admin);

  // Format the campaign data
  const formattedCampaignValues = {
    subject: formData.subject,
    body: formData.body,
    logo_url: formData.logo_url,
    status: formData.status,
    schedule_at: new Date(formData.schedule_at),
    color: formData.color,
    products: formData.products.flatMap((group) =>
      group.variants.map((variant) => variant.id)
    ),
  };

  try {
    // Create or update the campaign in Shopify
    const result = await campaign.create({
      title: formData.name,
      functionId: process.env.SHOPIFY_EMAIL_CAMPAIGN_ID,
      startsAt: new Date(),
      endsAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      metafields: [
        {
          namespace: "$app:function-configuration",
          key: "email_campaign",
          type: "json",
          value: JSON.stringify(formattedCampaignValues),
        },
      ],
    });

    const newData = {
      name: formData.name,
      subject: formData.subject,
      body: formData.body,
      logo_url: formData.logo_url,
      status: formData.status,
      schedule_at: formData.schedule_at,
      color: formData.color,
      products_reference: JSON.stringify(
        formData.products.flatMap((group) =>
          group.variants.map((variant) => variant.id)
        )
      ),
      products: JSON.stringify(formData.products),
      createdAt: new Date().toISOString(),
    };

    // Ensure the metaobject definition exists
    try {
      await metaobject.getDefinition({ type: EmailCampaignModel.type });
    } catch (error) {
      if (error.message.includes("No definition found")) {
        await metaobject.define(EmailCampaignModel);
      } else {
        throw error;
      }
    }

    // Create or update the metaobject
    const createdCampaign = await metaobject.create(EmailCampaignModel, newData);

    return createdCampaign;
  } catch (error) {
    console.error("Error saving email campaign:", error);
    return {
      status: {
        success: false,
        message: error.message, // This will now contain the correct error message
      },
    };
  }
}