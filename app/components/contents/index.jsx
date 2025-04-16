import { Layout, Button, Card, EmptyState, BlockStack, Text, InlineStack, Select } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { PageTitleBar } from "../shared/pageTitleBar";
import PageLayout from "../shared/pageLayout";
import ReadyTable from "../shared/readyTable";
import { useState } from "react";

export async function loader({ request }) {
   try {
    const emailCampaigns = await prisma.emailCampaign.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        scheduledEmails: true,
      },
    });

    return json({ emailCampaigns });
  } catch (error) {
    console.error("Loader error:", error);
    return json({ emailCampaigns: [] }, { status: 500 });
  }
}

export default function Contents() {
  const { emailCampaigns } = useLoaderData();
  const [timeRange, setTimeRange] = useState("30");

  const headings = [
    { title: "Subject" },
    { title: "Date" },
    { title: "Status" },
    { title: "Open rate" },
    { title: "Click rate" },
    { title: "Sales" },
  ];

  // Ensure emailCampaigns is always an array
  const campaigns = Array.isArray(emailCampaigns) ? emailCampaigns : [];
  
  // Now you can safely use filter
  const recentDrafts = campaigns.filter(campaign => campaign.status === "draft");

  // const recentDrafts = emailCampaigns?.nodes?.filter(campaign => campaign.status === "draft") || [];
  
  // Calculate statistics
  // const stats = {
  //   totalEmails: emailCampaigns?.nodes?.length || 0,
  //   openRate: "0.0%",
  //   clickRate: "0.0%",
  //   salesAttributed: "$0.00"
  // };

  // Update the stats calculation
const stats = {
  totalEmails: emailCampaigns?.length || 0,
  openRate: emailCampaigns?.length > 0 
    ? `${(emailCampaigns.reduce((sum, c) => sum + (c.openRate || 0), 0) / emailCampaigns.length).toFixed(1)}%`
    : "0.0%",
  clickRate: emailCampaigns?.length > 0
    ? `${(emailCampaigns.reduce((sum, c) => sum + (c.clickRate || 0), 0) / emailCampaigns.length).toFixed(1)}%`
    : "0.0%",
  salesAttributed: emailCampaigns?.length > 0
    ? `$${emailCampaigns.reduce((sum, c) => sum + (c.sales || 0), 0).toFixed(2)}`
    : "$0.00"
};

  return (
    <PageLayout
      showBackButton
      title="Email Campaigns"
      subtitle="Manage and monitor your email campaigns"
      primaryAction={
        <Button variant="primary" url="/app/campaigns/new">
          Create email
        </Button>
      }
    >
      <BlockStack gap="500">
        {/* Recent drafts section */}
        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd">Recent drafts</Text>
            {recentDrafts.length > 0 ? (
              <div style={{ display: "flex", gap: "16px" }}>
                {recentDrafts.slice(0, 3).map((draft) => (
                  <Card key={draft.id}>
                    <img
                      alt="Draft preview"
                      width="200"
                      height="150"
                      style={{ objectFit: "cover" }}
                      src={draft.previewImage || "https://cdn.shopify.com/shopifycloud/email_app/bundles/assets/CreateEmailIllustration-DpVbf57W.svg"}
                    />
                    <Text as="p">{draft.subject || "New email"}</Text>
                    <Text as="p" color="subdued">{new Date(draft.updatedAt).toLocaleTimeString()}</Text>
                  </Card>
                ))}
              </div>
            ) : null}
          </BlockStack>
        </Card>

        {/* Statistics section */}
        <Card>
          <InlineStack gap="500" align="space-between">
            <Select
              label="Time range"
              options={[
                {label: "30 days", value: "30"},
                {label: "90 days", value: "90"},
                {label: "12 months", value: "365"}
              ]}
              value={timeRange}
              onChange={setTimeRange}
            />
            <InlineStack gap="500">
              <BlockStack>
                <Text>Total emails sent</Text>
                <Text variant="headingLg">{stats.totalEmails}</Text>
              </BlockStack>
              <BlockStack>
                <Text>Open rate</Text>
                <Text variant="headingLg">{stats.openRate}</Text>
              </BlockStack>
              <BlockStack>
                <Text>Click rate</Text>
                <Text variant="headingLg">{stats.clickRate}</Text>
              </BlockStack>
              <BlockStack>
                <Text>Sales attributed</Text>
                <Text variant="headingLg">{stats.salesAttributed}</Text>
              </BlockStack>
            </InlineStack>
          </InlineStack>
        </Card>

        {/* Campaigns table */}
        {emailCampaigns?.nodes?.length < 1 ? (
          <Card>
            <EmptyState
              heading="Get started with email campaigns"
              action={{ content: "Create campaign", url: "/app/campaigns/new" }}
              secondaryAction={{
                content: "Learn more",
                url: "https://help.shopify.com",
              }}
              image="https://cdn.shopify.com/shopifycloud/email_app/bundles/assets/CreateEmailIllustration-DpVbf57W.svg"
            >
              <p>
                Create and manage email campaigns to engage your customers with
                personalized messages.
              </p>
            </EmptyState>
          </Card>
        ) : (
          <Card>
            <ReadyTable
              data={emailCampaigns}
              resourceName={{ singular: "Campaign", plural: "Campaigns", handle: "campaigns" }}
              selectable={false}
              headings={headings}
              pagination={true}
              actions={true}
            />
          </Card>
        )}
      </BlockStack>
    </PageLayout>
  );
}