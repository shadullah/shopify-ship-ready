import { Page, Card, Button, Layout, BlockStack } from "@shopify/polaris"; // Import BlockStack
import { useLoaderData, useNavigate } from "@remix-run/react";

export default function EmailMarketingPage() {
    const { emailTemplates, campaigns } = useLoaderData();
    const navigate = useNavigate();

    return (
        <Page title="Email Marketing">
            <Layout>
                <Layout.Section>
                    <Card title="Email Templates">
                        <BlockStack gap="500"> {/* Replace Stack with BlockStack and use gap */}
                            {emailTemplates.map((template) => (
                                <Button
                                    key={template.id}
                                    onClick={() => navigate(`/app/email-marketing/edit/${template.id.split("/").pop()}`)}
                                >
                                    {template.subject}
                                </Button>
                            ))}
                            <Button primary onClick={() => navigate("/app/email-marketing/new")}>
                                Create New Template
                            </Button>
                        </BlockStack>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card title="Campaigns">
                        <BlockStack gap="500"> {/* Replace Stack with BlockStack and use gap */}
                            {campaigns.map((campaign) => (
                                <div key={campaign.id}>{campaign.name}</div>
                            ))}
                        </BlockStack>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}