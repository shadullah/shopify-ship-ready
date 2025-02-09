import {
  Card,
  TextField,
  BlockStack,
  FormLayout,
  Button,
  Layout,
  Select,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import PageLayout from "../shared/pageLayout";
import { Form, useSubmit, useLoaderData } from "@remix-run/react";

export const EmailTemplateForm = ({ isEditing = false }) => {
  const submit = useSubmit();
  const loaderData = useLoaderData();

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [status, setStatus] = useState("draft");

  useEffect(() => {
      if (isEditing && loaderData) {
          setSubject(loaderData.subject || "");
          setBody(loaderData.body || "");
          setLogoUrl(loaderData.logo_url || "");
          setStatus(loaderData.status || "draft");
      }
  }, [isEditing, loaderData]);

  const handleSubmit = async (event) => {
      event.preventDefault();
      const data = {
          subject,
          body,
          logo_url: logoUrl,
          status,
          [isEditing ? "updateTemplate" : "createTemplate"]: true,
      };

      if (isEditing) {
          data.id = loaderData.id; // Include the id for editing
      }

      await submit(data, { method: "POST", encType: "application/json" });
  };

  return (
      <PageLayout
          showBackButton
          title={isEditing ? "Edit Email Template" : "New Email Template"}
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
                                      name="subject"
                                      label="Subject"
                                      value={subject}
                                      onChange={setSubject}
                                  />

                                  <TextField
                                      name="body"
                                      label="Body"
                                      value={body}
                                      onChange={setBody}
                                      multiline={7}
                                  />

                                  <TextField
                                      name="logo_url"
                                      label="Logo URL"
                                      value={logoUrl}
                                      onChange={setLogoUrl}
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
                          </BlockStack>
                      </Card>
                  </Layout.Section>
              </Layout>
          </Form>
      </PageLayout>
  );
};

export default EmailTemplateForm;