// import { json, redirect } from "@remix-run/node";
// import { UpsellForm } from "../components/upsell/upsellForm";
// import { authenticateExtra } from "../config/shopify";
// import { VolumeDiscountModel } from "../models/volumeDiscount.model";
// import { Discount } from "../entities/discount";

// export const loader = async ({ request }) => {
//   await authenticateExtra(request);
//   return json({});
// };

// export const action = async ({ request }) => {
//   const { admin, metaobject } = await authenticateExtra(request);
//   let formData = await request.json();

//   if (formData.saveUpsell) {
//     try {
//       const newUpsell = await saveUpsell(admin, formData, metaobject);
//       if (newUpsell.status && !newUpsell.status.success) {
//         return json(
//           {
//             status: {
//               success: false,
//               message: newUpsell.status.message,
//             },
//           },
//           { status: 400 }
//         );
//       }
//       return redirect(`/app/upsells/edit/${newUpsell.id.split("/").pop()}`);
//     } catch (error) {
//       return json(
//         {
//           status: {
//             success: false,
//             message: `Error saving upsell: ${error.message}`,
//           },
//         },
//         { status: 400 }
//       );
//     }
//   }
//   return json({});
// };

// export default function NewUpsellPage() {
//   return <UpsellForm />;
// }

// // Helper function
// async function saveUpsell(admin, formData, metaobject) {
//   const discount = new Discount(admin);
//   const formattedUpsellValues = formData.upsellValues.map((upsell) => ({
//     upsell_message: upsell.upsell_message,
//     upsell_type: upsell.upsell_type,
//     quantity: upsell.quantity,
//     discount: upsell.discount,
//   }));

//   try {
//     const result = await discount.createAutomatic({
//       title: formData.title,
//       functionId: process.env.SHOPIFY_UPSELL_ID,
//       startsAt: new Date(),
//       endsAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
//       combinesWith: formData.combinesWith,
//       metafields: [
//         {
//           namespace: "$app:function-configuration",
//           key: "upsell_discount",
//           type: "json",
//           value: JSON.stringify({
//             title: formData.title,
//             upsellValues: formattedUpsellValues,
//             variants: formData.products.flatMap((g) => g.variants.map((v) => v.id)),
//           }),
//         },
//       ],
//     });

//     const newData = {
//       title: formData.title,
//       discountId: result.discountId,
//       products_reference: JSON.stringify(formData.products.flatMap((g) => g.variants.map((v) => v.id))),
//       products: JSON.stringify(formData.products),
//       upsellValues: JSON.stringify(formData.upsellValues),
//       isActive: formData.isActive ? "true" : "false",
//       combinesWith: JSON.stringify(formData.combinesWith),
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       await metaobject.getDefinition({ type: VolumeDiscountModel.type });
//     } catch (error) {
//       if (error.message.includes("No definition found")) {
//         await metaobject.define(VolumeDiscountModel);
//       } else {
//         throw error;
//       }
//     }

//     const createdUpsell = await metaobject.create(VolumeDiscountModel, newData);
//     return createdUpsell;
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