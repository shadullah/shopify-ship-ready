import { Card, Text, BlockStack, Box } from "@shopify/polaris";
import { useState } from "react";

export default function PreviewMarkup({ upsellProducts }) {
  const [mainProduct, setMainProduct] = useState({
    price: 25, // Default price for demonstration
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card>
      <Text variant="headingSm"> Upsell Preview </Text>
      <br />
      <BlockStack gap="200">
        {upsellProducts.map((product, index) => (
          <Box
            style={{
              border: "1px solid #e5e5e5",
              marginBottom: "10px",
              padding: "10px",
            }}
            key={index}
          >
            <Text variant="bodyMd" fontWeight="bold">
              {product.id || "Selected Product"}
            </Text>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Text variant="bodySm">Discount Type: {product.discountType}</Text>
                <br />
                <Text variant="bodySm">Discount Value: {product.discount}</Text>
              </div>
              <div>
                {product.discount > 0 ? (
                  <>
                    <Text variant="bodyMd" fontWeight="bold" color="success">
                      {formatPrice(
                        product.discountType === "percentage"
                          ? mainProduct.price -
                            (mainProduct.price * product.discount) / 100
                          : mainProduct.price - product.discount
                      )}
                    </Text>
                    <br />
                    <s style={{ color: "#999" }}>{formatPrice(mainProduct.price)}</s>
                  </>
                ) : (
                  <Text variant="bodyMd" fontWeight="bold">
                    {formatPrice(mainProduct.price)}
                  </Text>
                )}
              </div>
            </div>
          </Box>
        ))}
      </BlockStack>
    </Card>
  );
}
