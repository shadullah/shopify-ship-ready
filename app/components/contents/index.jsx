import { Layout, Button, Card, EmptyState } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { PageTitleBar } from "../shared/pageTitleBar";
import PageLayout from "../shared/pageLayout";
import ReadyTable from "../shared/readyTable";

export default function Contents() {
  const { emailCampaigns } = useLoaderData(); // Provide a fallback empty array
  const headings = [
    { title: "Campaign Name" },
    { title: "Status" },
    { title: "Scheduled At" },
    { title: "Actions" },
  ];

  return (
    <PageLayout
      showBackButton
      title="Email Campaigns"
      subtitle="Manage and monitor your email campaigns"
      primaryAction={
        <Button variant="primary" url="/app/campaigns/new">
          New Campaign
        </Button>
      }
    >
      <PageTitleBar title="Email Campaigns" />

      {emailCampaigns.nodes.length < 1 ? (
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
        <ReadyTable
          data={emailCampaigns} // Ensure this is an array
          resourceName={{ singular: "Campaign", plural: "Campaigns", handle: "campaigns" }}
          selectable={false}
          headings={headings}
          pagination={true}
          actions={true}
        />
      )}
    </PageLayout>
  );
}