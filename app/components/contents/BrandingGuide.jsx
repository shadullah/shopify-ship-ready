import {
  Card,
  TextField,
  BlockStack,
  FormLayout,
  Button,
  Text,
  Layout,
  InlineStack,
  Select,
} from "@shopify/polaris";
import { useState } from "react";
import { Form, useSubmit, useLoaderData } from "@remix-run/react";

export const BrandingGuide = () => {
  const submit = useSubmit();
  const loaderData = useLoaderData() || {}; // Fallback for initial load
  const [brandingData, setBrandingData] = useState({
    logo_url: loaderData.logo_url || "",
    store_name: loaderData.store_name || "",
    typography: loaderData.typography || "Helvetica Neue",
  });

  const handleChange = (key) => (value) => {
    setBrandingData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(brandingData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    await submit(formData, { method: "POST" });
  };

  return (
    <PageLayout showBackButton title="Template Branding">
      <Form method="POST" onSubmit={handleSubmit}>
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              <Card sectioned>
                <Text as="p" variant="bodyMd">
                  Speed up email creation by setting the look and feel of templates. You can always
                  customize individual emails and custom templates.
                </Text>
              </Card>
              <Card sectioned>
                <FormLayout>
                  <TextField
                    label="Logo"
                    value={brandingData.logo_url}
                    onChange={handleChange("logo_url")}
                    placeholder="https://example.com/logo.png"
                  />
                  <TextField
                    label="Store name"
                    value={brandingData.store_name}
                    onChange={handleChange("store_name")}
                    helpText="Appears in email headers without a logo added"
                  />
                  <Select
                    label="Typography"
                    options={[
                      { label: "Helvetica Neue", value: "Helvetica Neue" },
                      { label: "Arial", value: "Arial" },
                      { label: "Times New Roman", value: "Times New Roman" },
                    ]}
                    value={brandingData.typography}
                    onChange={handleChange("typography")}
                    helpText="Web safe font"
                  />
                </FormLayout>
              </Card>
              <InlineStack gap="300">
                <Button submit primary>
                  Save Branding
                </Button>
                <Button onClick={() => setBrandingData(initialState)}>Reset</Button>
              </InlineStack>
            </BlockStack>
          </Layout.Section>
          <Layout.Section>
            <Card sectioned title="Example email">
              <div style={{ textAlign: "center", padding: "20px" }}>
                {brandingData.logo_url && (
                  <img
                    src={brandingData.logo_url}
                    alt="Brand Logo"
                    style={{ maxHeight: "50px", marginBottom: "20px" }}
                  />
                )}
                {!brandingData.logo_url && brandingData.store_name && (
                  <Text variant="headingLg" as="h1">
                    {brandingData.store_name}
                  </Text>
                )}
                <Text as="p">
                  Meet our best sellers this month
                  <br />
                  We’re excited to share a few of our top picks for the season. Check out these
                  days—you won’t want to miss out!
                </Text>
                <Button primary>See what’s in store</Button>
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      </Form>
    </PageLayout>
  );
};

export default BrandingGuide;