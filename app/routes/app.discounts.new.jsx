import { json, redirect } from "@remix-run/react";
import { DiscountForm } from "../components/discounts/discountForm";
import { authenticateExtra } from "../config/shopify";
import { VolumeDiscountModel } from "../models/volumeDiscount.model";
import { Discount } from "../entities/discount";

export const loader = async ({ request }) => {
  const { admin } = await authenticateExtra(request);
  return json({});
};

export const action = async ({ request }) => {
  const { admin, metaobject } = await authenticateExtra(request);
  let formData = await request.json();
  if (formData.saveDiscount) {
    try {
      const newDiscount = await saveDiscount(admin, formData, metaobject);
      if(newDiscount.status && !newDiscount.status.success) {
        return json({
          status: {
            success: false,
            message: newDiscount.status.message,
          }
        }, { status : 400 });
      }
      return redirect(`/app/discounts/edit/${newDiscount.id.split("/").pop()}`);
    } catch (error) {
      return json({
        status: {
          success: false,
          message: `Error saving discount: ${error.message }`,
        }
      }, { status: 400 });
    }
  }

  return json({});
};

export default function NewDiscountPage() {
  return <DiscountForm />;
}

// Helper function
async function saveDiscount(admin, formData, metaobject) {
  const discount = new Discount(admin);

  const formattedDiscountValues = formData.discountValues.map(discount => ({
    discount_message: discount.discount_message,
    discount_type: discount.discount_type,
    quantity: discount.quantity,
    discount: discount.discount
  }));
  
  try {
    const result = await discount.createAutomatic({
      title: formData.title,
      functionId: process.env.SHOPIFY_VOLUME_DISCOUNT_ID,
      startsAt: new Date(),
      endsAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      combinesWith: formData.combinesWith,
      metafields: [
        {
          namespace: "$app:function-configuration",
          key: "volume_discount",
          type: "json",
          value: JSON.stringify({
            title: formData.title,
            discountValues: formattedDiscountValues,
            variants: formData.products.flatMap(g => (g.variants.map(v => v.id)))
          })
        }
      ]
    });

    const newData = {
      title: formData.title,
      discountId: result.discountId,
      products_reference: JSON.stringify(formData.products.flatMap(g => (g.variants.map(v => v.id)))),
      products: JSON.stringify(formData.products),
      discountValues: JSON.stringify(formData.discountValues), 
      isActive: formData.isActive ? 'true' : 'false',
      combinesWith: JSON.stringify(formData.combinesWith),
      createdAt: new Date().toISOString(),
    };
  
    try {
      await metaobject.getDefinition({ type: VolumeDiscountModel.type });
    } catch (error) {
      if (error.message.includes("No definition found")) {
        await metaobject.define(VolumeDiscountModel);
      } else {
        throw error;
      }
    }

    const createdDiscount = await metaobject.create(VolumeDiscountModel, newData);
    return createdDiscount;

  } catch (error) {
    console.error("Error saving discount:", error);
    return {
      status: {
        success: false,
        message: error.message, // This will now contain the correct error message
      }
    };
  }
}