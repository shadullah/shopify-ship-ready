// import { 
//   Card,
//   TextField,
//   BlockStack,
//   FormLayout,
//   Button,
//   Text,
//   Layout,
//   InlineStack,
//   Select,
//   Checkbox,
//   Badge,
//   AppProvider as PolarisAppProvider
// } from "@shopify/polaris";
// import { useCallback, useState, useEffect } from "react";
// import { AppProvider as DiscountsProvider } from '@shopify/discount-app-components';
// import PageLayout from "../shared/pageLayout";
// import ProductSelectionCard from "../shared/ProductSelectionCard";
// import ColorPickerInput from "../shared/ColorPickerInput";
// import { DeleteIcon, PlusIcon } from '@shopify/polaris-icons';
// import {
//   DiscountClass,
//   DiscountMethod,
//   SummaryCard,
//   CombinationCard
// } from "@shopify/discount-app-components";
// import enPolarisTranslations from '@shopify/polaris/locales/en.json';
// import "@shopify/polaris/build/esm/styles.css";
// import "@shopify/discount-app-components/build/esm/styles.css";
// import PreviewMarkup from "./previewMarkup";
// import { Form, useSubmit, useLoaderData } from "@remix-run/react";

// export const UpsellForm = ({ isEditing = false }) => {
//   const submit = useSubmit();
//   const loaderData = useLoaderData();

//   const [title, setTitle] = useState('');
//   const [mainProduct, setMainProduct] = useState(null); // Main product for upselling
//   const [upsellProducts, setUpsellProducts] = useState([]); // Products to upsell
//   const [discountType, setDiscountType] = useState('percentage'); // Discount type for upsell
//   const [discountValue, setDiscountValue] = useState(0); // Discount value for upsell
//   const [status, setStatus] = useState('draft');

//   useEffect(() => {
//     if (isEditing && loaderData) {
//       setTitle(loaderData.title || '');
//       setMainProduct(loaderData.mainProduct || null);
//       setUpsellProducts(loaderData.upsellProducts || []);
//       setDiscountType(loaderData.discountType || 'percentage');
//       setDiscountValue(loaderData.discountValue || 0);
//       setStatus(loaderData.isActive ? 'active' : 'draft');
//     }
//   }, [isEditing, loaderData]);

//   const handleAddUpsellProduct = useCallback(() => {
//     setUpsellProducts([...upsellProducts, { id: '', discount: 0 }]);
//   }, [upsellProducts]);

//   const handleRemoveUpsellProduct = useCallback((index) => {
//     setUpsellProducts(upsellProducts.filter((_, i) => i !== index));
//   }, [upsellProducts]);

//   const handleSetUpsellProduct = useCallback((index, value, key) => {
//     const newUpsellProducts = [...upsellProducts];
//     newUpsellProducts[index][key] = value;
//     setUpsellProducts(newUpsellProducts);
//   }, [upsellProducts]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const data = {
//       title,
//       mainProduct,
//       upsellProducts,
//       discountType,
//       discountValue,
//       isActive: status === "active",
//       createdAt: isEditing ? loaderData.createdAt : new Date().toISOString(),
//       [isEditing ? 'updateUpsell' : 'saveUpsell']: true
//     };

//     if (isEditing) {
//       data.id = loaderData.id; // Include the upsell ID when updating
//     }

//     await submit(data, { method: 'POST', encType: "application/json" });
//   };

//   return (
//     <PolarisAppProvider i18n={enPolarisTranslations}>
//       <DiscountsProvider locale="en-US" ianaTimezone="America/Los_Angeles">
//         <PageLayout showBackButton title={isEditing ? "Edit upsell" : "New upsell"} titleMetadata={status === "draft" ? <Badge tone="info"> Draft </Badge> : <Badge tone="success"> Active </Badge>}>
//           <Form
//             method="POST"
//             data-save-bar
//             data-discard-confirmation
//             onSubmit={handleSubmit}
//             onReset={() => {}}
//           >
//             <Layout>
//               <Layout.Section>
//                 <BlockStack gap="500">
//                   <Card sectioned>
//                     <FormLayout>
//                       <Text variant="headingSm">Basic settings</Text>
//                       <TextField 
//                         name="title" 
//                         label="Title" 
//                         value={title} 
//                         onChange={setTitle} 
//                         helpText="For your own internal reference. Only you can see it." 
//                       />
//                     </FormLayout>
//                   </Card>

//                   <Card>
//                     <BlockStack gap="300">
//                       <InlineStack align="space-between">
//                         <Text variant="headingSm">Upsell Configuration</Text>
//                       </InlineStack>
//                       <BlockStack gap="400">
//                         <ProductSelectionCard
//                           title="Main Product"
//                           products={mainProduct ? [mainProduct] : []}
//                           setProducts={(products) => setMainProduct(products[0] || null)}
//                           multiple={false}
//                         />

//                         <Text variant="headingSm">Upsell Products</Text>
//                         {upsellProducts?.map((item, i) => (
//                           <Card roundedAbove="xs" key={i}>
//                             <BlockStack gap="200">
//                               <InlineStack align="space-between">
//                                 <Text variant="bodyMd" fontWeight="bold">Upsell Product {i + 1}</Text>
//                                 <Button
//                                   icon={DeleteIcon}
//                                   tone="critical"
//                                   onClick={() => handleRemoveUpsellProduct(i)}
//                                   accessibilityLabel="Remove upsell product"
//                                 />
//                               </InlineStack>

//                               <BlockStack gap="200">
//                                 <ProductSelectionCard
//                                   title="Select Upsell Product"
//                                   products={item.id ? [{ id: item.id }] : []}
//                                   setProducts={(products) => handleSetUpsellProduct(i, products[0]?.id || '', 'id')}
//                                   multiple={false}
//                                 />

//                                 <FormLayout.Group condensed>
//                                   <Select
//                                     label="Discount type"
//                                     options={[
//                                       { label: "Percentage", value: "percentage" },
//                                       { label: "Fixed amount", value: "fixed" }
//                                     ]}
//                                     value={item.discountType || discountType}
//                                     onChange={(value) => handleSetUpsellProduct(i, value, 'discountType')}
//                                   />
//                                   <TextField
//                                     label="Discount value"
//                                     type="number"
//                                     value={item.discount || discountValue}
//                                     suffix={item.discountType === "percentage" ? "%" : ""}
//                                     prefix={item.discountType === "fixed" ? "$" : ""}
//                                     onChange={(value) => handleSetUpsellProduct(i, value, 'discount')}
//                                   />
//                                 </FormLayout.Group>
//                               </BlockStack>
//                             </BlockStack>
//                           </Card>
//                         ))}
//                       </BlockStack>
//                     </BlockStack>
//                     <br />
//                     <InlineStack align="end">
//                       <Button
//                         icon={PlusIcon}
//                         variant="primary"
//                         onClick={handleAddUpsellProduct}
//                         accessibilityLabel="Add upsell product">
//                           Add upsell product
//                       </Button>
//                     </InlineStack>
//                   </Card>
//                 </BlockStack>
//               </Layout.Section>
              
//               {/* Sidebar */}
//               <Layout.Section variant="oneThird">
//                 <BlockStack gap="500">
//                   <Card>
//                       <Select
//                         label="Status"
//                         options={[
//                           { label: "Draft", value: "draft" },
//                           { label: "Active", value: "active" }
//                         ]}
//                         value={status}
//                         onChange={setStatus}
//                       />
//                   </Card>
//                   <SummaryCard
//                     header={{
//                       discountMethod: DiscountMethod.Automatic,
//                       appDiscountType: "Upsell",
//                       discountDescriptor: title,
//                       isEditing: isEditing,
//                       discountStatus: null
//                     }}
//                     additionalDetails={[`Main product: ${mainProduct?.title || 'Not selected'}`, `Upsell products: ${upsellProducts.length}`]}
//                   />
//                   <PreviewMarkup upsellProducts={upsellProducts} />
//                 </BlockStack>
//               </Layout.Section>
//             </Layout>
//           </Form>
//         </PageLayout>
//       </DiscountsProvider>
//     </PolarisAppProvider>
//   );
// };

// export default UpsellForm;