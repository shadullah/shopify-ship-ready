import { BlockStack, Text, InlineStack, Button, Box, Card } from "@shopify/polaris";

const PreviewMarkup = ({ formData }) => {
  const {
    subject,
    body,
    logo,
    brand_name,
    background_color: backgroundColor,
    text_color: textColor,
    font_family: fontFamily,
    font_size: fontSize,
    button_color: buttonColor,
    button_text: buttonText,
    alignment,
    padding,
    banner_background_color: bannerBackgroundColor,
    product_card_background_color: productCardBackgroundColor,
    products,
    image_alignment: imageAlignment, // New field
    image_size: imageSize, // New field
  } = formData;

  // Define image sizes
  const imageSizes = {
    small: "100px",
    medium: "200px",
    large: "300px",
  };

  // Replace placeholders in the body with actual content
  const renderedBody = body
    .replace(/\[Product Image\]/g, '<img src="https://via.placeholder.com/150" alt="Product Image" style="max-width: 150px; display: block; margin: 10px auto; border-radius: 4px;" />')
    .replace(/\[Product Name\]/g, products.length > 0 ? products[0]?.title || "Product Name" : "Product Name")
    .replace(/\[Price\]/g, products.length > 0 ? products[0]?.price || "$0.00" : "$0.00")
    .replace(/\[Link to Cart\]/g, `<a href="#" style="color: ${textColor}; text-decoration: none; font-weight: bold; padding: 8px 16px; background-color: ${buttonColor}; color: #ffffff; border-radius: 4px; display: inline-block;">${buttonText}</a>`)
    .replace(/\[Link to Products\]/g, `<a href="#" style="color: ${textColor}; text-decoration: none; font-weight: bold; padding: 8px 16px; background-color: ${buttonColor}; color: #ffffff; border-radius: 4px; display: inline-block;">${buttonText}</a>`);

  return (
    <Card padding="400">
      <Box
        background={backgroundColor}
        padding={padding || "400"}
        borderWidth="1"
        borderColor="border-subdued"
        borderRadius="200"
        style={{
          maxWidth: "100%",
          margin: "0 auto",
          fontFamily,
          fontSize,
          color: textColor,
          textAlign: alignment,
          overflow: "auto",
          maxHeight: "70vh",
        }}
      >
        <BlockStack gap="400">
          {/* Banner Image with Custom Background, Alignment, and Size */}
          {logo && (
            <Box background={bannerBackgroundColor} padding="200" borderRadius="200">
              <img
                src={logo}
                alt="Banner"
                style={{
                  maxWidth: "100%",
                  maxHeight: imageSizes[imageSize] || imageSizes.medium, // Apply selected size
                  objectFit: "contain",
                  display: "block",
                  margin: imageAlignment === "center" ? "0 auto" : imageAlignment === "right" ? "0 0 0 auto" : "0", // Apply alignment
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}

          {/* Brand Name */}
          {brand_name && (
            <Text variant="headingLg" alignment={alignment}>
              {brand_name}
            </Text>
          )}

          {/* Subject */}
          <Text variant="headingMd" alignment={alignment}>
            {subject || "Email Subject"}
          </Text>

          {/* Body */}
          <div
            style={{
              fontFamily,
              fontSize,
              color: textColor,
              textAlign: alignment,
              lineHeight: "1.6",
              margin: "16px 0",
              wordWrap: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: renderedBody }}
          />

          {/* Products */}
          {products.length > 0 && (
            <BlockStack gap="300">
              <Text variant="headingSm" alignment={alignment}>
                Featured Products
              </Text>
              <BlockStack gap="200">
                {products.map((product) => (
                  <Box
                    key={product.id}
                    background={productCardBackgroundColor}
                    padding="300"
                    borderWidth="1"
                    borderColor="border-subdued"
                    borderRadius="200"
                  >
                    <InlineStack gap="400" blockAlign="center" wrap={false}>
                      <img
                        src={product.image || "https://via.placeholder.com/100"}
                        alt={product.title}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                      <BlockStack gap="100">
                        <Text fontWeight="bold">{product.title}</Text>
                        <Text>{product.price || "$0.00"}</Text>
                        <Button
                          url="#"
                          style={{
                            backgroundColor: buttonColor,
                            color: "#ffffff",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "4px",
                          }}
                        >
                          {buttonText}
                        </Button>
                      </BlockStack>
                    </InlineStack>
                  </Box>
                ))}
              </BlockStack>
            </BlockStack>
          )}
        </BlockStack>
      </Box>
    </Card>
  );
};

export default PreviewMarkup;