import { Card, Text } from "@shopify/polaris";

const PreviewMarkup = ({ formData }) => {
  const sampleData = {
    storeName: formData.brand_name || "[Store Name]",
    customerName: "John Doe",
    welcomeDiscount: "10%",
    productName: "Cool Gadget",
    price: "$19.99",
    orderId: "ORD12345",
    trackingLink: "https://example.com/track/ORD12345",
    date: "March 15, 2025",
    productImage: "https://via.placeholder.com/100",
  };

  const renderTemplateContent = () => {
    let content = formData.body;
    Object.entries(sampleData).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\[${key}\\]`, "g"), value);
    });
    // Style links as buttons
    content = content.replace(
      /\[Link to (Cart|Tracking|Products)\]/g,
      `<a href="#" style="background-color: ${
        formData.color || "#007bff"
      }; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; display: inline-block;">Go to $1</a>`
    );
    return content;
  };

  const getTemplateStyle = () => ({
    backgroundColor: formData.color || "#ffffff",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    color: "#333333",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  });

  return (
    <Card sectioned title="Template Preview">
      <div style={getTemplateStyle()}>
        {formData.logo_url && /^https?:\/\//.test(formData.logo_url) ? (
          <img
            src={formData.logo_url}
            alt="Brand Logo"
            style={{ maxHeight: "50px", marginBottom: "20px", display: "block" }}
          />
        ) : (
          <Text as="p" variant="bodySm" color="subdued">
            No valid logo URL provided
          </Text>
        )}
        <Text variant="headingLg" as="h1" style={{ marginBottom: "20px", color: "#333333" }}>
          {formData.subject}
        </Text>
        <div
          style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}
          dangerouslySetInnerHTML={{ __html: renderTemplateContent() }}
        />
        <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <Text as="p" style={{ fontSize: "14px", color: "#666666" }}>
            Best regards,
            <br />
            {formData.brand_name || "[Store Name]"} Team
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default PreviewMarkup;