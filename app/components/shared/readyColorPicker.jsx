import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  ColorPicker,
  InlineStack,
  Popover,
  Text,
  TextField,
  BlockStack,
  hexToRgb,
  hsbToRgb,
  rgbToHex,
  rgbToHsb,
  Icon,
} from "@shopify/polaris";
import { ColorIcon } from "@shopify/polaris-icons";

const ReadyColorPicker = ({ 
  color, 
  setColor, 
  label = "Select color",
  helpText
}) => {
  const [popoverActive, setPopoverActive] = useState(false);
  const [internalColor, setInternalColor] = useState(() => {
    const rgb = hexToRgb(color || "#FFFFFF");
    return rgb ? rgbToHsb(rgb) : { hue: 0, saturation: 0, brightness: 1 };
  });

  const togglePopoverActive = useCallback(() => {
    setPopoverActive((active) => !active);
  }, []);

  const handleColorChange = useCallback((newColor) => {
    console.log('newColor', newColor);
    setInternalColor(newColor);
    const hexColor = rgbToHex(hsbToRgb(newColor));
    setColor(hexColor);
  }, [setColor]);

  const handleTextFieldChange = useCallback((value) => {
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      const rgb = hexToRgb(value);
      if (rgb) {
        setInternalColor(rgbToHsb(rgb));
        setColor(value);
      }
    }
  }, [setColor]);

  const currentHexColor = useMemo(() => rgbToHex(hsbToRgb(internalColor)), [internalColor]);

  const activator = (
    <InlineStack align="start" gap="200" wrap={false}>
      <div
        onClick={togglePopoverActive}
        style={{
          width: "40px",
          height: "40px",
          minWidth: "40px",
          borderRadius: "20%",
          background: currentHexColor,
          cursor: "pointer",
          border: "1px solid #bbb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {currentHexColor === "#FFFFFF" && <Icon source={ColorIcon} tone="subdued" />}
      </div>
      <Box>
        <Text as="p" variant="bodyMd">
          {label}
        </Text>
        <Text variant="bodySm" tone="subdued" fontWeight="regular">
          {currentHexColor}
        </Text>
      </Box>
    </InlineStack>
  );

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
    >
      <BlockStack>
        <Box padding="200">
          <ColorPicker onChange={handleColorChange} color={internalColor} />
        </Box>
        <Box padding="200" paddingBlockStart="0">
          <TextField
            value={currentHexColor}
            onChange={handleTextFieldChange}
            autoComplete="off"
            helpText={helpText}
          />
        </Box>
      </BlockStack>
    </Popover>
  );
};

export default ReadyColorPicker;