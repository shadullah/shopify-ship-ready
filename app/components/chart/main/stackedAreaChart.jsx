import { StackedAreaChart as Chart } from "@shopify/polaris-viz";
import { ChartBase } from "./chartBase";
import { Heading } from "./heading";
import EmptyState from "./emptyState";

export const StackedAreaChart = ({ title, subTitle, fluctuation, data }) => {
  return (
    <ChartBase>
      <Heading title={title} subTitle={subTitle} fluctuation={fluctuation} />
      {data?.length > 0 ? (
        <Chart
          showLegend={true}
          data={data}
          isAnimated={true}
          yAxisOptions={{
            labelFormatter: formatValueToCurrancy,
          }}
        />
      ) : (
        <EmptyState />
      )}
    </ChartBase>
  );
};

const formatValueToCurrancy = (value) => {
  if (typeof value !== "number" || isNaN(value)) {
    throw new Error("Input value must be a valid number.");
  }
  if (value >= 1000) {
    const formattedValue = (value / 1000).toFixed(0);
    return `${formattedValue}K`;
  } else if (value < 1) {
    return `${value}`;
  } else {
    return `${value}`;
  }
};
