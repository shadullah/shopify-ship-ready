import { Layout, Button, Card, EmptyState } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { PageTitleBar } from "../shared/pageTitleBar";
import PageLayout from "../shared/pageLayout";
import ReadyTable from "../shared/readyTable";

export default function EmailMarketingIndex() {
    const { emailTemplates, campaigns } = useLoaderData();

    const headings = [
        { title: 'Subject' },
        { title: 'Status' },
        { title: 'Created At' },
        { title: 'Actions' },
    ];

    return (
        <PageLayout
            showBackButton
            title="Email Marketing"
            subtitle="Manage your email templates and campaigns"
            primaryAction={<Button variant="primary" url="/app/email-marketing/new">New Template</Button>}
        >
            <PageTitleBar title="Email Templates" />

            {emailTemplates?.length < 1 ? (
                <Card>
                    <EmptyState
                        heading="Manage your email templates"
                        action={{ content: 'Add Template', url: '/app/email-marketing/new' }}
                        secondaryAction={{
                            content: 'Learn more',
                            url: 'https://help.shopify.com',
                        }}
                        image="https://cdn.shopify.com/s/files/1/0579/8749/8059/files/create-content.svg?v=1723585472"
                    >
                        <p>
                            Create and manage your email templates here. You can add, edit, and delete
                            templates.
                        </p>
                    </EmptyState>
                </Card>
            ) : (
                <ReadyTable
                    data={emailTemplates}
                    resourceName={{ singular: 'Template', plural: 'Templates', handle: 'templates' }}
                    selectable={false}
                    headings={headings}
                    pagination={true}
                    actions={true}
                />
            )}
        </PageLayout>
    );
}