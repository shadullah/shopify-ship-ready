// import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import { UpsellForm } from "../components/upsell/upsellForm";
// import { authenticateExtra } from "../config/shopify";
// import { UpsellModel } from "../models/upsell.model";
// import { Upsell } from "../entities/upsell";

// export const loader = async ({ params, request }) => {
//   const { metaobject } = await authenticateExtra(request);
//   const upsellId = `gid://shopify/Metaobject/${params.id}`;

//   try {
//     const upsellData = await metaobject.find(UpsellModel, upsellId);
    
//     // Parse JSON strings back into objects
//     const parsedData = {
//       ...upsellData,
//       mainProduct: JSON.parse(upsellData.mainProduct),
//       upsellProducts: JSON.parse(upsellData.upsellProducts),
//       discountType: upsellData.discountType || "percentage",
//       discountValue: parseFloat(upsellData.discountValue) || 0,
//       isActive: upsellData.isActive === "true",
//     };

//     return json(parsedData);
//   } catch (error) {
//     console.error("Error loading upsell data:", error);
//     return json({ error: "Failed to load upsell data" }, { status: 500 });
//   }
// };

// export const action = async ({ request }) => {
//   const { admin, metaobject } = await authenticateExtra(request);
//   let formData = await request.json();

//   if (formData.updateUpsell) {
//     try {
//       const updatedUpsell = await updateUpsell(admin, formData, metaobject);
//       if (updatedUpsell.status && !updatedUpsell.status.success) {
//         return json({
//           status: {
//             success: false,
//             message: updatedUpsell.status.message,
//           },
//         }, { status: 400 });
//       }
//       return json({
//         status: {
//           success: true,
//           message: "Upsell updated successfully",
//         },
//       });
//     } catch (error) {
//       console.error("Error updating upsell:", error);
//       return json({ error: "Failed to update upsell" }, { status: 500 });
//     }
//   }

//   return json({});
// };

// export default function EditUpsellPage() {
//   const loaderData = useLoaderData();

//   if (loaderData.error) {
//     return <div>Error: {loaderData.error}</div>;
//   }

//   return <UpsellForm isEditing={true} />;
// }

// // Helper function
// async function updateUpsell(admin, formData, metaobject) {
//   const upsell = new Upsell(admin);

//   try {
//     const result = await upsell.updateAutomatic({
//       id: formData.upsellId,
//       title: formData.title,
//       functionId: process.env.SHOPIFY_UPSELL_FUNCTION_ID,
//       startsAt: new Date(),
//       endsAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
//       metafields: [
//         {
//           namespace: "$app:function-configuration",
//           key: "upsell_configuration",
//           type: "json",
//           value: JSON.stringify({
//             title: formData.title,
//             mainProduct: formData.mainProduct,
//             upsellProducts: formData.upsellProducts,
//             discountType: formData.discountType,
//             discountValue: formData.discountValue,
//           }),
//         },
//       ],
//     });

//     console.log("Updated upsell:", formData);

//     const newData = {
//       title: formData.title,
//       upsellId: formData.upsellId,
//       mainProduct: JSON.stringify(formData.mainProduct),
//       upsellProducts: JSON.stringify(formData.upsellProducts),
//       discountType: formData.discountType,
//       discountValue: formData.discountValue.toString(),
//       isActive: formData.isActive ? "true" : "false",
//       createdAt: new Date().toISOString(),
//     };

//     const updatedUpsell = await metaobject.update(UpsellModel, formData.id, newData);
//     return updatedUpsell;
//   } catch (error) {
//     console.error("Error saving upsell:", error);
//     return {
//       status: {
//         success: false,
//         message: error.message,
//       },
//     };
//   }
// }
