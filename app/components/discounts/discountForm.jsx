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
  Badge,
  AppProvider as PolarisAppProvider
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import { AppProvider as DiscountsProvider } from '@shopify/discount-app-components';
import PageLayout from "../shared/pageLayout";
import ProductSelectionCard from "../shared/ProductSelectionCard";
import ColorPickerInput from "../shared/ColorPickerInput";
import { DeleteIcon, PlusIcon } from '@shopify/polaris-icons';
import {
  DiscountClass,
  DiscountMethod,
  SummaryCard,
  CombinationCard
} from "@shopify/discount-app-components";
import enPolarisTranslations from '@shopify/polaris/locales/en.json';
import "@shopify/polaris/build/esm/styles.css";
import "@shopify/discount-app-components/build/esm/styles.css";
import PreviewMarkup from "./previewMarkup";
import { Form, useSubmit, useLoaderData } from "@remix-run/react";

export const DiscountForm = ({ isEditing = false }) => {
  const submit = useSubmit();
  const loaderData = useLoaderData();

  const [title, setTitle] = useState('');
  const [products, setProducts] = useState([]);
  const [upsellProducts, setUpsellProducts] = useState([]); // New state for upsell products
  const [combinesWith, setCombinesWith] = useState({
    orderDiscounts: false,
    productDiscounts: false,
    shippingDiscounts: false
  });
  const [status, setStatus] = useState('draft');
  const [upsellOffers, setUpsellOffers] = useState([
    {
      title: "Buy X, Get Y at a Discount",
      mainProduct: null, // Main product for upsell
      upsellProduct: null, // Upsell product
      discount: 10, // Discount for upsell product
      discount_type: "percentage",
      discount_message: "You save 10% on the upsell product",
      subtitle: "Special offer",
      label: "Recommended",
      badge: "Hot Deal",
      selected: true,
      label_bg: "#48cae4",
      label_color: "#000000",
      badge_bg: "#0096c7",
      badge_color: "#ffffff",
    },
  ]);

  useEffect(() => {
    if (isEditing && loaderData) {
      setTitle(loaderData.title || '');
      setProducts(loaderData.products || []);
      setUpsellProducts(loaderData.upsellProducts || []); // Load upsell products
      setCombinesWith(loaderData.combinesWith || []);
      setUpsellOffers(loaderData.upsellOffers || []);
      setStatus(loaderData.isActive ? 'active' : 'draft');
    }
  }, [isEditing, loaderData]);

  const handleAddUpsellOffer = useCallback(() => {
    setUpsellOffers([...upsellOffers, {
      title: "",
      mainProduct: null,
      upsellProduct: null,
      discount: 0,
      discount_type: "percentage",
      discount_message: "",
      subtitle: "",
      label: "",
      badge: "",
      selected: false,
      label_bg: "#f7f7f7",
      label_color: "#000000",
      badge_bg: "#f55276",
      badge_color: "#ffffff",
    }]);
  }, [upsellOffers]);

  const handleRemoveUpsellOffer = useCallback((index) => {
    setUpsellOffers(upsellOffers.filter((_, i) => i !== index));
  }, [upsellOffers]);

  const handleSetUpsellOffer = useCallback((index, value, key) => {
    const newUpsellOffers = [...upsellOffers];
    newUpsellOffers[index][key] = value;
    setUpsellOffers(newUpsellOffers);
  }, [upsellOffers]);

  const handleSelectOffer = useCallback((index) => {
    const newUpsellOffers = [...upsellOffers];
    newUpsellOffers[index].selected = !newUpsellOffers[index].selected;
    setUpsellOffers(newUpsellOffers);
  }, [upsellOffers]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      title,
      products,
      upsellProducts, // Include upsell products
      upsellOffers,
      isActive: status === "active",
      combinesWith,
      createdAt: isEditing ? loaderData.createdAt : new Date().toISOString(),
      [isEditing ? 'updateDiscount' : 'saveDiscount']: true
    };

    if (isEditing) {
      data.id = loaderData.id; // Include the discount ID when updating
      data.discountId = loaderData.discountId;
    }

    await submit(data, { method: 'POST', encType: "application/json" });
  };

  return (
    <PolarisAppProvider i18n={enPolarisTranslations}>
      <DiscountsProvider locale="en-US" ianaTimezone="America/Los_Angeles">
        <PageLayout showBackButton title={isEditing ? "Edit discount" : "New discount"} titleMetadata={status === "draft" ? <Badge tone="info"> Draft </Badge> : <Badge tone="success"> Active </Badge>}>
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
                      <Text variant="headingSm">Basic settings</Text>
                      <TextField 
                        name="title" 
                        label="Title" 
                        value={title} 
                        onChange={setTitle} 
                        helpText="For your own internal reference. Only you can see it." 
                      />
                    </FormLayout>
                  </Card>

                  <Card>
                    <BlockStack gap="300">
                      <InlineStack align="space-between">
                        <Text variant="headingSm">Upsell Settings</Text> {/* Updated text */}
                      </InlineStack>
                      <BlockStack gap="400">
                        {upsellOffers?.map((item, i) => (
                          <Card roundedAbove="xs" key={i}>
                            <BlockStack gap="200">
                              <InlineStack align="space-between">
                                <Text variant="bodyMd" fontWeight="bold">Upsell Offer {i + 1}</Text> {/* Updated text */}
                                <Button
                                  icon={DeleteIcon}
                                  tone="critical"
                                  onClick={() => handleRemoveUpsellOffer(i)}
                                  accessibilityLabel="Remove offer"
                                />
                              </InlineStack>

                              <BlockStack gap="200">
                                <FormLayout.Group condensed>
                                  <TextField 
                                    label="Title"
                                    type="text"
                                    value={item.title}
                                    onChange={(value) => handleSetUpsellOffer(i, value, "title")}
                                  />
                                  <ProductSelectionCard
                                    title="Main Product"
                                    products={products}
                                    setProducts={(selectedProducts) => handleSetUpsellOffer(i, selectedProducts[0], "mainProduct")}
                                    multiple={false}
                                  />
                                  <ProductSelectionCard
                                    title="Upsell Product"
                                    products={upsellProducts}
                                    setProducts={(selectedProducts) => handleSetUpsellOffer(i, selectedProducts[0], "upsellProduct")}
                                    multiple={false}
                                  />
                                </FormLayout.Group>

                                <FormLayout.Group condensed>
                                  <Select
                                    label="Discount type"
                                    options={[
                                      { label: "Percentage", value: "percentage" },
                                      { label: "Fixed amount", value: "fixed" }
                                    ]}
                                    value={item.discount_type}
                                    onChange={(value) => handleSetUpsellOffer(i, value, "discount_type")}
                                  />
                                  <TextField
                                    label="Discount"
                                    type="number"
                                    value={item.discount}
                                    suffix={item.discount_type === "percentage" ? "%" : ""}
                                    prefix={item.discount_type === "fixed" ? "$" : ""}
                                    onChange={(value) => handleSetUpsellOffer(i, value, "discount")}
                                  />
                                </FormLayout.Group>

                                <TextField
                                  label="Discount message"
                                  helpText="Discount message displayed to customers in cart and checkout"
                                  type="text"
                                  value={item.discount_message}
                                  onChange={(value) => handleSetUpsellOffer(i, value, "discount_message")}
                                />
                                <TextField
                                  label="Subtitle"
                                  helpText="Optional"
                                  type="text"
                                  value={item.subtitle}
                                  onChange={(value) => handleSetUpsellOffer(i, value, "subtitle")}
                                />

                                <FormLayout.Group condensed>
                                  <TextField
                                    label="Label"
                                    helpText="Optional"
                                    type="text"
                                    value={item.label}
                                    onChange={(value) => handleSetUpsellOffer(i, value, "label")}
                                  />
                                  <TextField
                                    label="Badge"
                                    type="text"
                                    helpText="Optional"
                                    value={item.badge}
                                    onChange={(value) => handleSetUpsellOffer(i, value, "badge")}
                                  />
                                </FormLayout.Group>
                                  
                                <Checkbox
                                  label="Pre-selected"
                                  checked={item.selected}
                                  onChange={() => handleSelectOffer(i)}
                                />

                                <Text variant="bodyMd" fontWeight="bold">Styles</Text>

                                <FormLayout.Group condensed>
                                  <ColorPickerInput
                                    label="Label background"
                                    inputColor={item.label_bg}
                                    onChange={(value) => handleSetUpsellOffer(i, value, "label_bg")}
                                  />
                                  <ColorPickerInput
                                    label="Label text"
                                    inputColor={item.label_color}
                                    onChange={(value) => handleSetUpsellOffer(i, value, "label_color")}
                                  />
                                </FormLayout.Group>

                                <FormLayout.Group condensed>
                                  <ColorPickerInput
                                    label="Badge background"
                                    inputColor={item.badge_bg}
                                    onChange={(value) => handleSetUpsellOffer(i, value, "badge_bg")}
                                  />
                                  <ColorPickerInput
                                    label="Badge text"
                                    inputColor={item.badge_color}
                                    onChange={(value) => handleSetUpsellOffer(i, value, "badge_color")}
                                  />
                                </FormLayout.Group>
                              </BlockStack>
                            </BlockStack>
                          </Card>
                        ))}
                      </BlockStack>
                    </BlockStack>
                    <br />
                    <InlineStack align="end">
                      <Button
                        icon={PlusIcon}
                        variant="primary"
                        onClick={handleAddUpsellOffer}
                        accessibilityLabel="Add more offer">
                          Add more offer
                      </Button>
                    </InlineStack>
                  </Card>

                  <div>
                    <CombinationCard
                      combinableDiscountTypes={{
                        value: combinesWith,
                        onChange: setCombinesWith,
                      }}
                      discountClass={DiscountClass.Product}
                      discountDescriptor={title}
                    />
                    <ProductSelectionCard
                      title="Main Products"
                      products={products}
                      setProducts={setProducts}
                      multiple={true}
                    />
                    <ProductSelectionCard
                      title="Upsell Products"
                      products={upsellProducts}
                      setProducts={setUpsellProducts}
                      multiple={true}
                    />
                  </div>
                </BlockStack>
              </Layout.Section>
              
              {/* Sidebar */}
              <Layout.Section variant="oneThird">
                <BlockStack gap="500">
                  <Card>
                      <Select
                        label="Status"
                        options={[
                          { label: "Draft", value: "draft" },
                          { label: "Active", value: "active" }
                        ]}
                        value={status}
                        onChange={setStatus}
                      />
                  </Card>
                  <SummaryCard
                    header={{
                      discountMethod: DiscountMethod.Automatic,
                      appDiscountType: "Upsell offers", // Updated text
                      discountDescriptor: title,
                      isEditing: isEditing,
                      discountStatus: null
                    }}
                    additionalDetails={[`Selected main products: ${products.length}`, `Selected upsell products: ${upsellProducts.length}`]}
                    combinations={{
                      combinesWith
                    }} 
                  />
                  <PreviewMarkup upsellOffers={upsellOffers} />
                </BlockStack>
              </Layout.Section>
            </Layout>
          </Form>
        </PageLayout>
      </DiscountsProvider>
    </PolarisAppProvider>
  );
};

export default DiscountForm;