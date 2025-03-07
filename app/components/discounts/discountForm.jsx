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
  AppProvider as PolarisAppProvider,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import { AppProvider as DiscountsProvider } from "@shopify/discount-app-components";
import PageLayout from "../shared/pageLayout";
import ProductSelectionCard from "../shared/ProductSelectionCard";
import ColorPickerInput from "../shared/ColorPickerInput";
import { DeleteIcon, PlusIcon } from "@shopify/polaris-icons";
import {
  DiscountClass,
  DiscountMethod,
  SummaryCard,
  CombinationCard,
} from "@shopify/discount-app-components";
import enPolarisTranslations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import "@shopify/discount-app-components/build/esm/styles.css";
import PreviewMarkup from "./previewMarkup";
import { Form, useSubmit, useLoaderData } from "@remix-run/react";

export const DiscountForm = ({ isEditing = false }) => {
  const submit = useSubmit();
  const loaderData = useLoaderData();

  const [formErrors, setFormErrors] = useState({});
  const [title, setTitle] = useState("");
  const [products, setProducts] = useState([]); // Available main products pool
  const [upsellProducts, setUpsellProducts] = useState([]); // Available upsell products pool
  const [status, setStatus] = useState("draft");
  const [combinesWith, setCombinesWith] = useState({
    orderDiscounts: false,
    productDiscounts: false,
    shippingDiscounts: false,
  });
  const [upsellOffers, setUpsellOffers] = useState([
    {
      title: "Buy X, Get Y at a Discount",
      mainProduct: null,
      upsellProduct: null,
      discount: 10,
      discount_type: "percentage",
      discount_message: "Limited-time deal! Get 10% off this add-on.",
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
      setTitle(loaderData.title || "");
      setProducts(loaderData.products || []);
      setUpsellProducts(loaderData.upsellProducts || []);
      setUpsellOffers(loaderData.upsellOffers || []);
      setCombinesWith(loaderData.combinesWith || {});
      setStatus(loaderData.isActive ? "active" : "draft");
    }
  }, [isEditing, loaderData]);

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    upsellOffers.forEach((offer, index) => {
      if (!offer.title)
        errors[`offer_${index}_title`] = "Offer title is required";
      if (!offer.mainProduct)
        errors[`offer_${index}_main`] = "Main product is required";
      if (!offer.upsellProduct)
        errors[`offer_${index}_upsell`] = "Upsell product is required";
      if (!offer.discount || offer.discount <= 0)
        errors[`offer_${index}_discount`] = "Valid discount is required";
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUpsellOffer = useCallback(() => {
    setUpsellOffers([
      ...upsellOffers,
      {
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
      },
    ]);
  }, [upsellOffers]);

  const handleRemoveUpsellOffer = useCallback(
    (index) => {
      setUpsellOffers(upsellOffers.filter((_, i) => i !== index));
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        Object.keys(newErrors).forEach((key) => {
          if (key.startsWith(`offer_${index}_`)) delete newErrors[key];
        });
        return newErrors;
      });
    },
    [upsellOffers],
  );

  const handleSetUpsellOffer = useCallback(
    (index, value, key) => {
      const newUpsellOffers = [...upsellOffers];
      newUpsellOffers[index][key] = value;
      setUpsellOffers(newUpsellOffers);
      setFormErrors((prev) => ({ ...prev, [`offer_${index}_${key}`]: null }));
    },
    [upsellOffers],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const data = {
      title,
      products,
      upsellProducts,
      upsellOffers,
      isActive: status === "active",
      combinesWith,
      createdAt: isEditing ? loaderData.createdAt : new Date().toISOString(),
      [isEditing ? "updateDiscount" : "saveDiscount"]: true,
    };

    if (isEditing) {
      data.id = loaderData.id;
      data.discountId = loaderData.discountId;
    }

    await submit(data, { method: "POST", encType: "application/json" });
  };

  const handleReset = () => {
    if (isEditing && loaderData) {
      setTitle(loaderData.title || "");
      setProducts(loaderData.products || []);
      setUpsellProducts(loaderData.upsellProducts || []);
      setUpsellOffers(loaderData.upsellOffers || []);
      setCombinesWith(loaderData.combinesWith || {});
      setStatus(loaderData.isActive ? "active" : "draft");
    } else {
      setTitle("");
      setProducts([]);
      setUpsellProducts([]);
      setUpsellOffers([
        {
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
        },
      ]);
      setCombinesWith({
        orderDiscounts: false,
        productDiscounts: false,
        shippingDiscounts: false,
      });
      setStatus("draft");
    }
    setFormErrors({});
  };

  return (
    <PolarisAppProvider i18n={enPolarisTranslations}>
      <DiscountsProvider locale="en-US" ianaTimezone="America/Los_Angeles">
        <PageLayout
          showBackButton
          title={isEditing ? "Edit discount" : "New discount"}
          titleMetadata={
            status === "draft" ? (
              <Badge tone="info"> Draft </Badge>
            ) : (
              <Badge tone="success"> Active </Badge>
            )
          }
        >
          <Form
            method="POST"
            onSubmit={handleSubmit}
            onReset={handleReset}
            data-save-bar // Enables Shopify's save bar
            data-discard-confirmation // Enables discard confirmation
          >
            <Layout>
              <Layout.Section>
                <BlockStack gap="500">
                  <Card>
                    <FormLayout>
                      <Text variant="headingSm">Basic Settings</Text>
                      <TextField
                        name="title"
                        label="Title"
                        value={title}
                        onChange={setTitle}
                        error={formErrors.title}
                        helpText="For your own internal reference. Only you can see it."
                      />
                    </FormLayout>
                  </Card>

                  <Card>
                    <BlockStack gap="400">
                      <Text variant="headingMd">Upsell Offers Configuration</Text>
                      {upsellOffers.map((item, i) => (
                        <Card key={i} padding="400">
                          <BlockStack gap="300">
                            <InlineStack align="space-between">
                              <Text variant="headingSm">Offer {i + 1}</Text>
                              <Button
                                icon={DeleteIcon}
                                tone="critical"
                                onClick={() => handleRemoveUpsellOffer(i)}
                                accessibilityLabel="Remove offer"
                              />
                            </InlineStack>

                            <TextField
                              name="offer title"
                              label="Offer Title"
                              value={item.title}
                              onChange={(value) =>
                                handleSetUpsellOffer(i, value, "title")
                              }
                              error={formErrors[`offer_${i}_title`]}
                            />

                            <BlockStack gap="200">
                              <ProductSelectionCard
                                title="Main Product"
                                products={products}
                                selected={item.mainProduct}
                                setProducts={(selected) => {
                                  handleSetUpsellOffer(i, selected, "mainProduct");
                                  if (selected && !products.some(p => p.id === selected.id)) {
                                    setProducts(prev => [...prev, selected]);
                                  }
                                }}
                                multiple={false}
                                error={formErrors[`offer_${i}_main`]}
                              />
                              <ProductSelectionCard
                                title="Upsell Product"
                                products={upsellProducts}
                                selected={item.upsellProduct}
                                setProducts={(selected) => {
                                  handleSetUpsellOffer(i, selected, "upsellProduct");
                                  if (selected && !upsellProducts.some(p => p.id === selected.id)) {
                                    setUpsellProducts(prev => [...prev, selected]);
                                  }
                                }}
                                multiple={false}
                                error={formErrors[`offer_${i}_upsell`]}
                              />
                            </BlockStack>

                            <FormLayout.Group condensed>
                              <Select
                                label="Discount Type"
                                options={[
                                  { label: "Percentage", value: "percentage" },
                                  { label: "Fixed amount", value: "fixed" },
                                ]}
                                value={item.discount_type}
                                onChange={(value) =>
                                  handleSetUpsellOffer(i, value, "discount_type")
                                }
                              />
                              <TextField
                                name = "discount amount"
                                label="Discount Amount"
                                type="number"
                                value={item.discount}
                                suffix={item.discount_type === "percentage" ? "%" : ""}
                                prefix={item.discount_type === "fixed" ? "$" : ""}
                                onChange={(value) =>
                                  handleSetUpsellOffer(i, value, "discount")
                                }
                                error={formErrors[`offer_${i}_discount`]}
                              />
                            </FormLayout.Group>

                            <TextField
                              label="Discount Message"
                              type="text"
                              value={item.discount_message}
                              onChange={(value) =>
                                handleSetUpsellOffer(i, value, "discount_message")
                              }
                              multiline={2}
                            />
                            <TextField
                              label="Subtitle (Optional)"
                              type="text"
                              value={item.subtitle}
                              onChange={(value) =>
                                handleSetUpsellOffer(i, value, "subtitle")
                              }
                            />
                            <FormLayout.Group condensed>
                              <TextField
                                label="Label (Optional)"
                                value={item.label}
                                onChange={(value) =>
                                  handleSetUpsellOffer(i, value, "label")
                                }
                              />
                              <TextField
                                label="Badge (Optional)"
                                value={item.badge}
                                onChange={(value) =>
                                  handleSetUpsellOffer(i, value, "badge")
                                }
                              />
                            </FormLayout.Group>

                            <Checkbox
                              label="Pre-select this offer"
                              checked={item.selected}
                              onChange={() =>
                                handleSetUpsellOffer(i, !item.selected, "selected")
                              }
                            />

                            <Text variant="headingSm">Styling</Text>
                            <FormLayout.Group condensed>
                              <ColorPickerInput
                                label="Label Background"
                                inputColor={item.label_bg}
                                onChange={(value) =>
                                  handleSetUpsellOffer(i, value, "label_bg")
                                }
                              />
                              <ColorPickerInput
                                label="Label Text"
                                inputColor={item.label_color}
                                onChange={(value) =>
                                  handleSetUpsellOffer(i, value, "label_color")
                                }
                              />
                            </FormLayout.Group>
                            <FormLayout.Group condensed>
                              <ColorPickerInput
                                label="Badge Background"
                                inputColor={item.badge_bg}
                                onChange={(value) =>
                                  handleSetUpsellOffer(i, value, "badge_bg")
                                }
                              />
                              <ColorPickerInput
                                label="Badge Text"
                                inputColor={item.badge_color}
                                onChange={(value) =>
                                  handleSetUpsellOffer(i, value, "badge_color")
                                }
                              />
                            </FormLayout.Group>
                          </BlockStack>
                        </Card>
                      ))}
                      <Button
                        icon={PlusIcon}
                        variant="primary"
                        onClick={handleAddUpsellOffer}
                        fullWidth
                      >
                        Add New Offer
                      </Button>
                    </BlockStack>
                  </Card>

                  <BlockStack gap="400">
                    <Text variant="headingMd">Product Pools</Text>
                    <ProductSelectionCard
                      title="Available Main Products"
                      products={products}
                      selected={products}
                      setProducts={setProducts}
                      multiple={true}
                      helpText="These products are available to select as main products in offers"
                    />
                    <ProductSelectionCard
                      title="Available Upsell Products"
                      products={upsellProducts}
                      selected={upsellProducts}
                      setProducts={setUpsellProducts}
                      multiple={true}
                      helpText="These products are available to select as upsell products in offers"
                    />
                    <CombinationCard
                      combinableDiscountTypes={{
                        value: combinesWith,
                        onChange: setCombinesWith,
                      }}
                      discountClass={DiscountClass.Product}
                      discountDescriptor={title}
                    />
                  </BlockStack>
                </BlockStack>
              </Layout.Section>

              <Layout.Section variant="oneThird">
                <BlockStack gap="400">
                  <Card>
                    <Select
                      label="Status"
                      options={[
                        { label: "Draft", value: "draft" },
                        { label: "Active", value: "active" },
                      ]}
                      value={status}
                      onChange={setStatus}
                    />
                  </Card>
                  <SummaryCard
                    header={{
                      discountMethod: DiscountMethod.Automatic,
                      appDiscountType: "Upsell Offers",
                      discountDescriptor: title,
                      isEditing: isEditing,
                    }}
                    additionalDetails={[
                      `Total offers: ${upsellOffers.length}`,
                      `Main products pool: ${products.length}`,
                      `Upsell products pool: ${upsellProducts.length}`,
                    ]}
                    combinations={{ combinesWith }}
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