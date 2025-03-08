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
  DropZone,
  Badge,
  Modal,
  AppProvider as PolarisAppProvider,
} from "@shopify/polaris";

import { useCallback, useState, useEffect } from "react";
import PageLayout from "../shared/pageLayout";
import ReadyDatePicker from "../shared/readyDatePicker";
import ReadyColorPicker from "../shared/readyColorPicker";
import ProductSelectionCard from "../shared/ProductSelectionCard";
import { Form, useSubmit, useLoaderData } from "@remix-run/react";
import PreviewMarkup from "./previewMarkup";
import { templatePlans } from "../../data/emailTemplates";

export const ContentForm = ({ isEditing = false }) => {
  const submit = useSubmit();
  const loaderData = useLoaderData() || {};
  const [formData, setFormData] = useState({
    subject: "",
    template_type: "custom",
    body: "",
    brand_name: "",
    logo: null,
    status: "draft",
    schedule_at: null,
    background_color: "#ffffff", // New field for background color
    text_color: "#000000", // New field for font color
    font_family: "Arial",
    font_size: "16px",
    button_color: "#007bff",
    button_text: "Shop Now",
    alignment: "left",
    padding: "20px",
    banner_background_color: "#f5f5f5", // New field for banner background
    product_card_background_color: "#ffffff", // New field for product card background
    products: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const storeProducts = loaderData.products || [];

  useEffect(() => {
    if (isEditing && loaderData) {
      setFormData({
        subject: loaderData.subject || "",
        template_type: loaderData.template_type || "custom",
        body: loaderData.body || "",
        brand_name: loaderData.brand_name || loaderData.store_name || "",
        logo: loaderData.logo || null,
        status: loaderData.status || "draft",
        schedule_at: loaderData.schedule_at || null,
        background_color: loaderData.background_color || "#ffffff",
        text_color: loaderData.text_color || "#000000",
        font_family: loaderData.font_family || "Arial",
        font_size: loaderData.font_size || "16px",
        button_color: loaderData.button_color || "#007bff",
        button_text: loaderData.button_text || "Shop Now",
        alignment: loaderData.alignment || "left",
        padding: loaderData.padding || "20px",
        banner_background_color: loaderData.banner_background_color || "#f5f5f5",
        product_card_background_color: loaderData.product_card_background_color || "#ffffff",
        products: loaderData.products || [],
      });
      if (loaderData.logo && typeof loaderData.logo === "string") {
        setFiles([{ name: "logo.jpg", url: loaderData.logo }]);
      }
    }
  }, [isEditing, loaderData]);

  const handleChange = (key) => (value) => {
    if (key === "schedule_at" && new Date(value) < new Date()) {
      alert("Schedule date must be in the future!");
      return;
    }
    setFormData((prev) => {
      const newData = { ...prev, [key]: value };
      const plan = loaderData.plan || "basic";
      if (key === "template_type" && templatePlans[plan][value]) {
        newData.subject = templatePlans[plan][value].subject;
        newData.body = templatePlans[plan][value].body;
      } else if (key === "template_type" && value === "custom") {
        newData.subject = "";
        newData.body = "";
      }
      return newData;
    });
  };

  const handleDropZoneDrop = useCallback((dropFiles, acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      console.warn("Rejected files:", rejectedFiles);
      alert("Please upload a valid image file (e.g., .jpg, .png).");
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result }));
        setFiles([{ name: file.name, url: reader.result }]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
    setFiles([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.subject || !formData.body) {
      alert("Subject and Body are required!");
      return;
    }
    setIsSubmitting(true);
    try {
      const formDataToSubmit = new FormData();
      const dataToSubmit = {
        ...formData,
        schedule_at: formData.schedule_at ? new Date(formData.schedule_at).toISOString() : null,
        created_at: isEditing ? loaderData.created_at || new Date().toISOString() : new Date().toISOString(),
        [isEditing ? "updateCampaign" : "createCampaign"]: true,
      };
      if (isEditing) {
        dataToSubmit.id = loaderData.id || null;
      }
      formDataToSubmit.append("formData", JSON.stringify(dataToSubmit));
      if (formData.logo && typeof formData.logo !== "string") {
        formDataToSubmit.append("logo", formData.logo);
      }
      await submit(formDataToSubmit, { method: "POST", encType: "multipart/form-data" });
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldDefinitions = [
    { name: "Banner Image", key: "logo", type: "drop_zone" },
    { name: "Subject", key: "subject", type: "single_line_text_field" },
    {
      name: "Template Type",
      key: "template_type",
      type: "select",
      options: () => {
        const plan = loaderData.plan || "basic";
        const templates = templatePlans[plan] || templatePlans.basic;
        return [
          { label: "Custom Template", value: "custom" },
          ...Object.keys(templates).map((key) => ({
            label: templates[key].subject,
            value: key,
          })),
        ];
      },
    },
    { name: "Body", key: "body", type: "multi_line_text_field_large" },
    { name: "Brand Name", key: "brand_name", type: "single_line_text_field" },
    {
      name: "Status",
      key: "status",
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Active", value: "active" },
        { label: "Archived", value: "archived" },
      ],
    },
    { name: "Schedule At", key: "schedule_at", type: "date_time" },
    { name: "Background Color", key: "background_color", type: "color_picker" },
    { name: "Text Color", key: "text_color", type: "color_picker" },
    {
      name: "Font Family",
      key: "font_family",
      type: "select",
      options: [
        { label: "Arial", value: "Arial" },
        { label: "Helvetica", value: "Helvetica" },
        { label: "Times New Roman", value: "Times New Roman" },
      ],
    },
    {
      name: "Font Size",
      key: "font_size",
      type: "select",
      options: [
        { label: "12px", value: "12px" },
        { label: "14px", value: "14px" },
        { label: "16px", value: "16px" },
        { label: "18px", value: "18px" },
        { label: "20px", value: "20px" },
      ],
    },
    { name: "Button Color", key: "button_color", type: "color_picker" },
    {
      name: "Button Text",
      key: "button_text",
      type: "single_line_text_field",
      helpText: "e.g., 'Shop Now', 'Buy Now', etc.",
    },
    {
      name: "Content Alignment",
      key: "alignment",
      type: "select",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    { name: "Padding", key: "padding", type: "single_line_text_field", helpText: "e.g., 20px or 2rem" },
    { name: "Banner Background Color", key: "banner_background_color", type: "color_picker" },
    { name: "Product Card Background Color", key: "product_card_background_color", type: "color_picker" },
    { name: "Add Products", key: "add_products", type: "product_selector" },
  ];

  const renderField = (field) => {
    const fieldProps = typeof field.options === "function" ? { options: field.options() } : {};
    switch (field.type) {
      case "single_line_text_field":
        return (
          <TextField
            key={field.key}
            name={field.key}
            label={field.name}
            value={formData[field.key]}
            onChange={handleChange(field.key)}
            helpText={field.helpText}
          />
        );
      case "multi_line_text_field_large":
        return (
          <TextField
            key={field.key}
            name={field.key}
            label={field.name}
            value={formData[field.key]}
            onChange={handleChange(field.key)}
            multiline={true}
            autoComplete="off"
            required={field.key === "body"}
            helpText="Use [Product Image], [Product Name], [Price], etc. for placeholders. Add [Link to Cart], [Link to Products], etc. for buttons."
          />
        );
      case "select":
        return (
          <Select
            key={field.key}
            label={field.name}
            options={fieldProps.options || field.options}
            value={formData[field.key]}
            onChange={handleChange(field.key)}
          />
        );
      case "drop_zone":
        return (
          <div key={field.key}>
            <Text as="p" fontWeight="bold">{field.name}</Text>
            <DropZone
              label="Upload or drop your banner image here"
              accept="image/*"
              type="image"
              onDrop={handleDropZoneDrop}
            >
              {files.length === 0 ? (
                <DropZone.FileUpload actionTitle="Add Image" />
              ) : (
                <Text alignment="center">Image Added</Text>
              )}
            </DropZone>
            {formData.logo && typeof formData.logo === "string" && (
              <BlockStack gap="300" style={{ marginTop: "20px" }}>
                <img
                  src={formData.logo}
                  alt="Selected Banner"
                  style={{ maxHeight: "150px", objectFit: "contain" }}
                />
                <Button onClick={handleRemoveImage} destructive>
                  Remove Image
                </Button>
              </BlockStack>
            )}
          </div>
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
            label={field.name}
          />
        );
      case "product_selector":
        return (
          <div key={field.key}>
            <Text as="p" fontWeight="bold">{field.name}</Text>
            <ProductSelectionCard
              title="Select Products for Email"
              products={storeProducts}
              selected={formData.products}
              setProducts={(selected) => setFormData((prev) => ({ ...prev, products: selected }))}
              multiple={true}
              helpText="These products will be included in the email template."
            />
            {formData.products.length > 0 && (
              <BlockStack gap="200" style={{ marginTop: "10px" }}>
                <Text variant="headingSm">Selected Products:</Text>
                {formData.products.map((product) => (
                  <InlineStack key={product.id} gap="200" blockAlign="center">
                    <Text>{product.title || `Product ID: ${product.id}`}</Text>
                  </InlineStack>
                ))}
              </BlockStack>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout showBackButton title={isEditing ? "Edit Template" : "New Template"}>
      <Form
        method="POST"
        data-save-bar
        data-discard-confirmation
        onSubmit={handleSubmit}
        onReset={() => setFormData({ ...formData, template_type: "custom", subject: "", body: "" })}
      >
        <Layout>
          <Layout.Section oneHalf>
            <BlockStack gap="500">
              <Card sectioned>
                <FormLayout>{fieldDefinitions.map(renderField)}</FormLayout>
              </Card>
              <InlineStack gap="300">
                <Button submit primary disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : isEditing ? "Update" : "Create"}
                </Button>
                <Button onClick={() => setFormData({ ...formData, template_type: "custom", subject: "", body: "" })}>
                  Reset
                </Button>
              </InlineStack>
            </BlockStack>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500" align="center" justification="center" style={{ minHeight: "100%" }}>
              <Card sectioned>
                <Button primary onClick={() => setPreviewModalOpen(true)}>
                  Show Preview
                </Button>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Form>

      <Modal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title="Email Preview"
        size="large" // Changed to 'large' for wider modal
        primaryAction={{
          content: "Close",
          onAction: () => setPreviewModalOpen(false),
        }}
      >
        <Modal.Section>
          <PreviewMarkup formData={formData} />
        </Modal.Section>
      </Modal>
    </PageLayout>
  );
};

export default ContentForm;