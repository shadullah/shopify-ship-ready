import { Card, Text, BlockStack, Box } from "@shopify/polaris";
import { useState } from "react";

const PreviewMarkup = ({ upsellOffers }) => {
  // Demo product price
  const [product] = useState({
    price: 25,
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card title="Upsell Preview" sectioned>
      <BlockStack gap="400">
        {upsellOffers && upsellOffers.length > 0 ? (
          upsellOffers.map((offer, index) => (
            <Box
              key={index}
              style={{
                border: "1px solid #e5e5e5",
                marginBottom: "10px",
                padding: "10px",
              }}
            >
              <label htmlFor={`upsell_offer_${index}`}>
                {offer.label && offer.badge && (
                  <div
                    style={{
                      backgroundColor: offer.label_bg,
                      color: offer.label_color,
                      padding: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    <span>{offer.label}</span>
                    <span
                      style={{
                        backgroundColor: offer.badge_bg,
                        padding: "2px 15px",
                        borderRadius: "20px",
                        fontWeight: "500",
                        color: offer.badge_color,
                      }}
                    >
                      {offer.badge}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "10px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="radio"
                    id={`upsell_offer_${index}`}
                    name="upsell-offer"
                    value={offer.title}
                  />
                  <div style={{ width: "100%" }}>
                    <div style={{ fontWeight: "bold" }}>{offer.title || "Untitled Offer"}</div>
                    <div>{offer.discount_message}</div>
                  </div>
                  <div style={{ justifySelf: "end", textAlign: "right" }}>
                    {offer.discount > 0 ? (
                      <>
                        <span>
                          {formatPrice(
                            offer.discount_type === "percentage"
                              ? product.price - (product.price * offer.discount) / 100
                              : product.price - offer.discount
                          )}
                        </span>
                        <s style={{ marginLeft: "5px" }}>
                          {formatPrice(product.price)}
                        </s>
                      </>
                    ) : (
                      <span>{formatPrice(product.price)}</span>
                    )}
                  </div>
                </div>
              </label>
            </Box>
          ))
        ) : (
          <Text>No upsell offers available.</Text>
        )}
      </BlockStack>
    </Card>
  );
};

export default PreviewMarkup;