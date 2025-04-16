import { useCallback, useState } from "react";
import { Toast } from "@shopify/polaris";

export const useToast = () => {
  const [active, setActive] = useState(false);
  const [toastProps, setToastProps] = useState({});

  const showToast = useCallback((props) => {
    setToastProps(props);
    setActive(true);
  }, []);

  const hideToast = useCallback(() => setActive(false), []);

  const toastMarkup = active ? (
    <Toast {...toastProps} onDismiss={hideToast} />
  ) : null;

  return { showToast, toastMarkup };
};