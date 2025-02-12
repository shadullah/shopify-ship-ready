import { Button, EmptyState, Card } from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { PageTitleBar } from "../shared/pageTitleBar";
import PageLayout from "../shared/pageLayout";
import ShipReadyTable from "../shared/shipReadyTable";

export default function Upsell() {
  const { volumeDiscounts } = useLoaderData();

  const headings = [
    { title: 'Title' },
    { title: 'isActive' },
    { title: 'Created At' },
    { title: 'Actions' },
  ];


  return (
    <PageLayout showBackButton title="Upsells" primaryAction={<Button variant="primary" url='/app/upsell/new'>New upsell</Button>}>
      <PageTitleBar title="Upsells" />

      {volumeDiscounts.nodes.length < 1 ? (
        <Card>
          <EmptyState
            heading="Manage your upsells"
            action={{content: 'Add upsell', url: '/app/upsell/new'}}
            secondaryAction={{
              content: 'Learn more',
              url: 'https://help.shopify.com',
            }}
            image="https://cdn.shopify.com/b/shopify-guidance-dashboard-public/m66z0a57ues1gygrane8proz6gqn.svgz"
          >
            <p>
              Create upsells for your products and collections.
            </p>
          </EmptyState>
        </Card>
      ) : (
        <ShipReadyTable
          data={volumeDiscounts}
          resourceName={{ singular: 'Upsell discount', plural: 'Upsell discounts', handle: 'discounts' }}
          selectable={false}
          headings={headings}
          pagination={true}
          actions={true}
        />
      )}
    </PageLayout>
  );
}