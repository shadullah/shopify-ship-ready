import { json, redirect } from "@remix-run/react";
import { ContentForm } from "../components/contents/contentForm";
import { authenticateExtra } from "../config/shopify";
import { ContentModel } from "../models/content.model";

export const loader = async ({ request }) => {
  const { admin } = await authenticateExtra(request);
  return json({});
};

export const action = async ({ request }) => {
  const { metaobject } = await authenticateExtra(request);
  let formData = await request.json();
  if (formData.createObject) {
    try {
      const newContent = await saveObject(formData, metaobject);
      return redirect(`/app/contents/edit/${newContent.id.split("/").pop()}`);
    } catch (error) {
      return json(
        {
          status: {
            success: false,
            message: `Error saving contents: ${error.message}`,
          },
        },
        { status: 400 },
      );
    }
  }

  return json({});
};

export default function NewDiscountPage() {
  return <ContentForm />;
}

// Helper function
async function saveObject(formData, metaobject) {
  // Create a new object structure to save in metaobject
  const objectStructure = {
    title: formData.title,
    description: formData.description,
    products_reference: JSON.stringify(
      formData.products.flatMap((g) => g.variants.map((v) => v.id)),
    ),
    products_json: JSON.stringify(formData.products),
    status: formData?.status || "draft",
    color: formData.color,
    publish_at: formData.publish_at,
    created_at: new Date().toISOString(),
  };

  try {
    // Check if the MetaObject definition already exists
    let contentDefinition;
    try {
        contentDefinition = await metaobject.getDefinition({
        type: ContentModel.type,
      });
    } catch (error) {
      // If the definition doesn't exist, create it
      if (error.message.includes("No definition found")) {
        await metaobject.define(ContentModel);
      } else {
        throw error; // Re-throw if it's a different error
      }
    }

    const createdObject = await metaobject.create(
      ContentModel,
      objectStructure, // <--- The object structure to save
    );
    return createdObject;
  } catch (e) {
    console.error("Error saving data:", e);
    return json(
      {
        status: {
          success: false,
          message: `Error saving data: ${e.message}`,
        },
      },
      { status: 400 },
    );
  }
}
