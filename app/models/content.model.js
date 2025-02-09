// Content Model is an example of how you can use 
// ShipReady metaobjects to create custom data types.

export const ContentModel = {
    name: "Content",
    type: "$app:content",
    access: {
        admin: "MERCHANT_READ_WRITE",
        storefront: "PUBLIC_READ",
    },
    fieldDefinitions: [
        {
            name: "Title",
            key: "title",
            type: "single_line_text_field",
        },
        {
            name: "Content Description",
            key: "description",
            type: "multi_line_text_field",
        },
        {
            name: "Products reference",
            key: "products_reference",
            type: "list.variant_reference"
        },
        {
            name: "Products json",
            key: "products_json",
            type: "json"
        },
        {
            name: "Color",
            key: "color",
            type: "color"
        },
        {
            name: "Status",
            key: "status",
            type: "single_line_text_field"
        },
        {
            name: "Created at",
            key: "created_at",
            type: "date_time"
        },
        {
            name: "Publish at",
            key: "publish_at",
            type: "date"
        }

    ],
};

// List of data types : https://shopify.dev/docs/apps/build/custom-data/metafields/list-of-data-types#supported-types
