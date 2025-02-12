// import { authenticateExtra } from "../config/shopify.js";
// import { json } from "@remix-run/node";
// import Upsell from "../components/upsell/index.jsx";
// import { VolumeDiscountModel } from "../models/volumeDiscount.model.js";
// import { Discount } from "../entities/discount.js";

// export const loader = async ({ request }) => {
//   const { metaobject } = await authenticateExtra(request);

//   const url = new URL(request.url);
//   const cursor = url.searchParams.get('cursor');
//   const limit = 3; // You can adjust this or make it dynamic
//   const volumeDiscounts = await metaobject.list(VolumeDiscountModel, limit, cursor);
  
//   return json({
//     volumeDiscounts
//   });  

// };

// export async function action({ request }) {
//   const { admin, metaobject } = await authenticateExtra(request);
//   let formData = await request.json();
//   const discount = new Discount(admin);

//   if(formData.deleteObject){
//     await discount.deleteAutomatic(formData.discountId);
//     await metaobject.delete(formData.objectId);
//   }

//   return ({
//     status: {
//       success: true,
//       message: "Discount deleted successfully",
//     }
//   });

// }

// export default function UpsellPage() {
//   return <Upsell />;
// }