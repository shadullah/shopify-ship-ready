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
import ReadyDatePicker from "../shared/readyDatePicker";
import ReadyColorPicker from "../shared/readyColorPicker";
import { Form, useSubmit, useLoaderData } from "@remix-run/react";

export const ContentForm = ({ isEditing = false }) => {
  const submit = useSubmit();
  const loaderData = useLoaderData();

  // Define field definitions for the form
  const fieldDefinitions = [
    { name: "Subject", key: "subject", type: "single_line_text_field" },
    { name: "Body", key: "body", type: "multi_line_text_field" },
    { name: "Logo URL", key: "logo_url", type: "url" },
    { name: "Status", key: "status", type: "single_line_text_field" },
    { name: "Schedule At", key: "schedule_at", type: "date_time" },
    { name: "Theme Color", key: "color", type: "color_picker" },
  ];

  // Initialize state based on field definitions
  const initialState = {};
  fieldDefinitions.forEach((field) => (initialState[field.key] = ""));
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (isEditing && loaderData) {
      setFormData({
        subject: loaderData.subject || "",
        body: loaderData.body || "",
        logo_url: loaderData.logo_url || "",
        status: loaderData.status || "draft",
        schedule_at: loaderData.schedule_at || Date.now(),
        color: loaderData.color || "#000000",
      });
    }
  }, [isEditing, loaderData]);

  const handleChange = (key) => (value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      ...formData,
      created_at: isEditing ? loaderData.created_at : new Date().toISOString(),
      [isEditing ? "updateCampaign" : "createCampaign"]: true,
    };

    if (isEditing) {
      data.id = loaderData.id; // Include the id for editing
    }

    await submit(data, { method: "POST", encType: "application/json" });
  };

  return (
    <PageLayout
      showBackButton
      title={isEditing ? "Edit Campaign" : "New Campaign"}
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
                  {fieldDefinitions.map((field) => {
                    switch (field.type) {
                      case "single_line_text_field":
                        return (
                          <TextField
                            key={field.key}
                            name={field.key}
                            label={field.name}
                            value={formData[field.key]}
                            onChange={handleChange(field.key)}
                          />
                        );
                      case "multi_line_text_field":
                        return (
                          <TextField
                            key={field.key}
                            name={field.key}
                            label={field.name}
                            value={formData[field.key]}
                            onChange={handleChange(field.key)}
                            multiline={true}
                          />
                        );
                      case "url":
                        return (
                          <TextField
                            key={field.key}
                            name={field.key}
                            label={field.name}
                            value={formData[field.key]}
                            onChange={handleChange(field.key)}
                            placeholder="https://example.com/logo.png"
                          />
                        );
                      case "date_time":
                        return (
                          <ReadyDatePicker
                            key={field.key}
                            date={formData[field.key]}
                            setDate={handleChange(field.key)}
                            label={field.name}
                          />
                        );
                      case "color_picker":
                        return (
                          <ReadyColorPicker
                            key={field.key}
                            color={formData[field.key]}
                            setColor={handleChange(field.key)}
                          />
                        );
                      default:
                        return null;
                    }
                  })}
                </FormLayout>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Form>
    </PageLayout>
  );
};

export default ContentForm;