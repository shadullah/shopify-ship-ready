import {
  Card,
  Text,
  BlockStack,
  Button,
  Layout,
  Page,
  Badge,
  Link,
  DropZone,
  Thumbnail,
  Banner,
} from "@shopify/polaris";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";

const templates = [
  { id: 1, name: "New product", image: "https://via.placeholder.com/300x200?text=New+Product" },
  { id: 2, name: "Shop local", image: "https://via.placeholder.com/300x200?text=Shop+Local" },
  { id: 3, name: "New collection", image: "https://via.placeholder.com/300x200?text=New+Collection" },
  { id: 4, name: "Get ready for something new", image: "https://via.placeholder.com/300x200?text=Get+Ready" },
  { id: 5, name: "Product teaser", image: "https://via.placeholder.com/300x200?text=Product+Teaser" },
  { id: 6, name: "Blank", image: "https://via.placeholder.com/300x200?text=Blank" },
  { id: 7, name: "New arrivals", image: "https://via.placeholder.com/300x200?text=New+Arrivals" },
];

export const TemplateGallery = () => {
  const loaderData = useLoaderData();
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const handleSelectTemplate = (templateId) => {
    navigate(`/app/contents/new?template=${templateId}`);
  };

  const handleDropZoneDrop = (_dropFiles, acceptedFiles, _rejectedFiles) => {
    setError("");
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("File size must be less than 5MB");
        return;
      }
      setFile(file);
      const url = window.URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const validImageTypes = [
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/svg+xml",
  ];

  return (
    <Page 
      title="Templates" 
      subtitle="1-12 of 73 templates" 
      fullWidth
      primaryAction={
        <Button url="/app/contents/branding-guide" primary>
          Customize Branding
        </Button>
      }
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card sectioned>
              <BlockStack gap="400">
                {error && (
                  <Banner status="critical">
                    {error}
                  </Banner>
                )}
                <Text variant="headingMd" as="h2">Upload Logo</Text>
                <DropZone
                  accept={validImageTypes}
                  type="image"
                  onDrop={handleDropZoneDrop}
                  allowMultiple={false}
                >
                  {previewUrl ? (
                    <div style={{ padding: "1rem" }}>
                      <Thumbnail
                        source={previewUrl}
                        alt="Logo preview"
                        size="large"
                      />
                    </div>
                  ) : (
                    <DropZone.FileUpload />
                  )}
                </DropZone>
              </BlockStack>
            </Card>
            <Card sectioned>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {templates.map((template) => (
                  <Card key={template.id} sectioned>
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={template.image}
                        alt={template.name}
                        style={{ width: "100%", maxWidth: "300px", height: "auto" }}
                      />
                      <Text variant="headingSm" as="h3">
                        {template.name}
                      </Text>
                      <Badge>New</Badge>
                      <Button onClick={() => handleSelectTemplate(template.id)} primary>
                        Select
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default TemplateGallery;