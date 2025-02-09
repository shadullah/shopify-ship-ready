import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ContentForm } from "../components/contents/contentForm";
import { authenticateExtra } from "../config/shopify";
import { ContentModel } from "../models/content.model";

export const loader = async ({ params, request }) => {
  const { metaobject } = await authenticateExtra(request);
  const contentId = `gid://shopify/Metaobject/${params.id}`;
  try {
    const contentData = await metaobject.find(ContentModel, contentId);

    // Parse JSON strings back into objects
    const parsedData = {
      ...contentData,
      products_json: JSON.parse(contentData.products_json),
      products_reference: JSON.parse(contentData.products_reference),
    };

    return json(parsedData);
  } catch (error) {
    console.error("Error loading content data:", error);
    return json({ error: "Failed to load content data" }, { status: 500 });
  }
};

export const action = async ({ request }) => {
  const { metaobject } = await authenticateExtra(request);
  let formData = await request.json();

  if (formData.updateObject) {
    try {
      await updateContent(formData, metaobject);
      return json({
        status: {
          success: true,
          message: "Content updated successfully",
        },
      });
    } catch (error) {
      console.error("Error updating content:", error);
      return json({ error: "Failed to update content" }, { status: 500 });
    }
  }

  return json({});
};

export default function EditContent() {
  const loaderData = useLoaderData();

  if (loaderData.error) {
    return <div>Error: {loaderData.error}</div>;
  }

  return <ContentForm isEditing={true} />;
}

// Helper function
async function updateContent(formData, metaobject) {
  const newData = {
    title: formData.title,
    description: formData.description,
    products_reference: JSON.stringify(
      formData.products.flatMap((g) => g.variants.map((v) => v.id)),
    ),
    products_json: JSON.stringify(formData.products),
    status: formData.status || "draft",
    color: formData.color,
    publish_at: formData.publish_at,
    created_at: formData.created_at,
  };

  const updatedData = await metaobject.update(ContentModel, formData.id, newData);
}
