export const EmailTemplateTierModel = {
    name: "EmailTemplateTier",
    type: "$app:email_template_tier",
    access: {
        admin: "MERCHANT_READ_WRITE",
        storefront: "PUBLIC_READ",
    },
    fieldDefinitions: [
        {
            name: "Name",
            key: "name",
            type: "single_line_text_field",
        },
        {
            name: "Description",
            key: "description",
            type: "multi_line_text_field",
        },
        {
            name: "Price Range",
            key: "price_range",
            type: "single_line_text_field",
        },
        {
            name: "Templates",
            key: "templates",
            type: "list.metaobject_reference",
            validations: {
                metaobject_type: ["$app:email_template"]
            }
        },
    ],
};

export async function getEmailTemplateTiers(metaobject) {
    try {
        const tiers = await metaobject.list({
            type: "$app:email_template_tier",
        });
        return tiers;
    } catch (error) {
        console.error("Error fetching email template tiers:", error);
        throw error;
    }
}

export async function getEmailTemplateTierById(metaobject, tierId) {
    try {
        const tier = await metaobject.get(tierId);
        return tier;
    } catch (error) {
        console.error("Error fetching email template tier:", error);
        throw error;
    }
}

export async function createEmailTemplateTier(metaobject, tierData) {
    try {
        const tier = await metaobject.create({
            type: "$app:email_template_tier",
            fields: {
                name: tierData.name,
                description: tierData.description,
                price_range: tierData.price_range,
                templates: tierData.templates || [],
            },
        });
        return tier;
    } catch (error) {
        console.error("Error creating email template tier:", error);
        throw error;
    }
}

export async function updateEmailTemplateTier(metaobject, tierData) {
    try {
        const tier = await metaobject.update({
            id: tierData.id,
            fields: {
                name: tierData.name,
                description: tierData.description,
                price_range: tierData.price_range,
                templates: tierData.templates,
            },
        });
        return tier;
    } catch (error) {
        console.error("Error updating email template tier:", error);
        throw error;
    }
}