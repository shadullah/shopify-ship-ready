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
  Checkbox,
  AppProvider as PolarisAppProvider,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import PageLayout from "../shared/pageLayout";
import ReadyProductSelector from "../shared/readyProductSelector";
import ReadyColorPicker from "../shared/readyColorPicker";
import ReadyDatePicker from "../shared/readyDatePicker";

import { Form, useSubmit, useLoaderData } from "@remix-run/react";

export const ContentForm = ({ isEditing = false }) => {
  const submit = useSubmit();
  const loaderData = useLoaderData();

  const [title, setTitle] = useState("");
  const [products, setProducts] = useState([]);
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#000000");
  const [status, setStatus] = useState("draft");
  const [publishAt, setPublishAt] = useState(Date.now());

  useEffect(() => {
    if (isEditing && loaderData) {
      setTitle(loaderData.title || "");
      setProducts(loaderData.products_json || []);
      setDescription(loaderData.description || "");
      setColor(loaderData.color || "#000000");
      setStatus(loaderData.status || "draft");
      setPublishAt(loaderData.publish_at || "");
    }
  }, [isEditing, loaderData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('editing content ----> ', isEditing);
    const data = {
      title,
      description,
      products,
      color,
      status,
      publish_at: publishAt,
      created_at: isEditing ? loaderData.created_at : new Date().toISOString(),
      [isEditing ? "updateObject" : "createObject"]: true,
    };

    if (isEditing) {
      data.id = loaderData.id; // Include the id for editing
    }

    await submit(data, { method: "POST", encType: "application/json" });
  };

  return (
    <PageLayout
      showBackButton
      title={isEditing ? "Edit Content" : "New Content"}
    >
      <Form
        method="POST"
        data-save-bar
        data-discard-confirmation
        onSubmit={handleSubmit}
        onReset={() => {}}
      >
        <Layout>
          <Layout.Section>
            <BlockStack gap="500">
              <Card sectioned>
                <FormLayout>
                  <TextField
                    name="title"
                    label="Title"
                    value={title}
                    onChange={setTitle}
                  />

                  <TextField
                    name="description"
                    label="Description"
                    value={description}
                    onChange={setDescription}
                    multiline={7}
                  />

                  <ReadyProductSelector
                    title="Select Content Products"
                    subtitle="Choose the products that will be part of this campaign"
                    products={products}
                    setProducts={setProducts}
                    multiple={true}
                  />
                </FormLayout>
              </Card>
            </BlockStack>
          </Layout.Section>

          {/* Sidebar */}
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="500">
                <Select
                  label="Status"
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" },
                  ]}
                  onChange={setStatus}
                  value={status}
                />
                <ReadyDatePicker
                  date={publishAt}
                  setDate={setPublishAt}
                  label="Publish at"
                />
                <ReadyColorPicker color={color} setColor={setColor} />
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </Form>
    </PageLayout>
  );
};

export default ContentForm;
