import { Layout, Button, Card, EmptyState } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { PageTitleBar } from "../shared/pageTitleBar";
import PageLayout from "../shared/pageLayout";
import ReadyTable from "../shared/readyTable";

export default function Contents() {
    const { contentsObject } = useLoaderData();

    const headings = [
        { title: 'Title' },
        { title: 'Status' },
        { title: 'Created At' },
        { title: 'Actions' },
      ];

      console.log('contentsObject -----> ', contentsObject);

    return (
        <PageLayout 
            showBackButton 
            title="Contents" 
            subtitle="Manage your content: Example of how you can use Shipready metaobjects"
            primaryAction={<Button variant="primary" url='/app/contents/new'>New content</Button>}>
            <PageTitleBar title="Discounts" />
  
            {contentsObject?.nodes?.length < 1 ? (
            <Card>
                <EmptyState
                heading="Manage your contents"
                action={{content: 'Add content', url: '/app/contents/new'}}
                secondaryAction={{
                    content: 'Learn more',
                    url: 'https://help.shopify.com',
                }}
                image="https://cdn.shopify.com/s/files/1/0579/8749/8059/files/create-content.svg?v=1723585472"
                >
                <p>
                    Create and manage your contents here. You can add, edit, and delete
                    contents.
                </p>
                </EmptyState>
            </Card>
            ) : (
            <ReadyTable
                data={contentsObject}
                resourceName={{ singular: 'Content', plural: 'Contents', handle: 'contents' }}
                selectable={false}
                headings={headings}
                pagination={true}
                actions={true}
            />
            )}
        </PageLayout>
  );
};
