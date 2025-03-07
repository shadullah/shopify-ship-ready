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
import PreviewMarkup from "./previewMarkup";

const defaultTemplates = {
  welcome: {
    subject: "Welcome to [Store Name]! Start Your Journey with Us",
    body: `Hi [Customer Name],\nWelcome to [Store Name]! We're thrilled to have you join our community of savvy shoppers and store owners. You're officially part of something great!\n\nHere's how to get started:\n• Explore our best-selling products and add them to your cart.\n• Enjoy [X%] off your first order with code WELCOME.\n• Stay tuned for exclusive updates, VIP offers, and expert tips.\n\nNeed help? Our customer support team is here to ensure your experience is smooth and enjoyable.\n\nEnjoy the ride!\n\nBest regards,\n[Store Name] Team`,
  },
  abandoned_cart: {
    subject: "Oops! You Left Something Behind – Let's Complete Your Order",
    body: `Hi [Customer Name],\nIt looks like you were just about to grab some amazing items from our store, but your cart is still waiting for you!\n\nYour Cart:\n[Product Image]\n[Product Name] – [Price]\n\nWe've saved your cart, and you can check out anytime with a special discount just for you.\nComplete your purchase now and enjoy [X%] off with the code SAVE.\n\n[Link to Cart]\n\nIf you have any questions, don't hesitate to reach out. We're here to help!\n\nBest regards,\n[Store Name] Team`,
  },
  purchase_confirmation: {
    subject: "Thank You for Your Order! We're Preparing It Just for You",
    body: `Hi [Customer Name],\nThank you for your purchase from [Store Name]! We're excited to get your order ready and deliver it right to your doorstep.\n\nOrder Summary:\n[Product Name] – [Price]\n[Product Name] – [Price]\n\nEstimated Delivery Date: [Date]\nOrder Number: [Order ID]\n\nYou can track your order here: [Link to Tracking]\n\nThank you for choosing us for your shopping experience. We'll notify you as soon as it ships!\n\nBest regards,\n[Store Name] Team`,
  },
  product_recommendation: {
    subject: "We Thought You Might Like These!",
    body: `Hi [Customer Name],\nBased on your recent purchase of [Product Name], we’ve handpicked some items we think you’ll love. Check out these exclusive recommendations just for you!\n\nYou Might Also Like:\n[Product Name] – [Price]\n[Product Name] – [Price]\n\nAs a thank you for being a valued customer, use the code THANKYOU to enjoy [X%] off your next order.\n\n[Link to Products]\n\nWe hope you love these as much as we do!\n\nBest regards,\n[Store Name] Team`,
  },
};

export const ContentForm = ({ isEditing = false }) => {
  const submit = useSubmit();
  const loaderData = useLoaderData() || {};
  const fieldDefinitions = [
    { name: "Subject", key: "subject", type: "single_line_text_field" },
    {
      name: "Template Type",
      key: "template_type",
      type: "select",
      options: [
        { label: "Welcome Email", value: "welcome" },
        { label: "Abandoned Cart", value: "abandoned_cart" },
        { label: "Purchase Confirmation", value: "purchase_confirmation" },
        { label: "Product Recommendation", value: "product_recommendation" },
        { label: "Re-engagement", value: "re_engagement" },
        { label: "Flash Sale", value: "flash_sale" },
        { label: "Back in Stock", value: "back_in_stock" },
        { label: "Order Status", value: "order_status" },
        { label: "Bundle Offer", value: "bundle_offer" },
      ],
    },
    { name: "Body", key: "body", type: "multi_line_text_field" },
    { name: "Brand Name", key: "brand_name", type: "single_line_text_field" },
    { name: "Logo URL", key: "logo_url", type: "url" },
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
    { name: "Theme Color", key: "color", type: "color_picker" },
    { name: "Enable Preview", key: "enable_preview", type: "checkbox" },
  ];

  const initialState = {};
  fieldDefinitions.forEach((field) => (initialState[field.key] = ""));
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isEditing && loaderData) {
      setFormData({
        subject: loaderData.subject || "",
        template_type: loaderData.template_type || "welcome",
        body: loaderData.body || "",
        brand_name: loaderData.brand_name || "",
        logo_url: loaderData.logo_url || "",
        status: loaderData.status || "draft",
        schedule_at: loaderData.schedule_at || Date.now(),
        color: loaderData.color || "#000000",
        enable_preview: loaderData.enable_preview || false,
      });
      setShowPreview(loaderData.enable_preview || false);
    }
  }, [isEditing, loaderData]);

  const handleChange = (key) => (value) => {
    if (key === "schedule_at" && new Date(value) < new Date()) {
      alert("Schedule date must be in the future!");
      return;
    }
    setFormData((prev) => {
      const newData = { ...prev, [key]: value };
      if (key === "template_type" && defaultTemplates[value]) {
        newData.subject = defaultTemplates[value].subject;
        newData.body = defaultTemplates[value].body;
      }
      return newData;
    });
    if (key === "enable_preview") {
      setShowPreview(value);
    }
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
        [isEditing ? "updateCampaign" : "createCampaign"]: true
      };
      if (isEditing) {
        dataToSubmit.id = loaderData.id || null;
      }
      formDataToSubmit.append("formData", JSON.stringify(dataToSubmit));
      await submit(formDataToSubmit, { method: "POST", encType: "multipart/form-data" });
    } catch (error) {
      console.error("Form submission error:", error);
      alert("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const renderField = (field) => {
    switch (field.type) {
      case "single_line_text_field":
        return (
          <TextField
            key={field.key}
            name={field.key}
            label={field.name}
            value={formData[field.key]}
            onChange={handleChange(field.key)}
            required={field.key === "subject"}
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
            required={field.key === "body"}
          />
        );
      case "select":
        return (
          <Select
            key={field.key}
            label={field.name}
            options={field.options}
            value={formData[field.key]}
            onChange={handleChange(field.key)}
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
      case "checkbox":
        return (
          <Checkbox
            key={field.key}
            label={field.name}
            checked={formData[field.key]}
            onChange={handleChange(field.key)}
          />
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
        onReset={() => setFormData(initialState)}
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
                <Button onClick={() => setFormData(initialState)}>Reset</Button>
              </InlineStack>
            </BlockStack>
          </Layout.Section>
          <Layout.Section oneHalf>
            {showPreview && <PreviewMarkup formData={formData} />}
          </Layout.Section>
        </Layout>
      </Form>
    </PageLayout>
  );
};

export default ContentForm;