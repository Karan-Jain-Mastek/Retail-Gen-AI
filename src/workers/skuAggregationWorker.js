/* eslint-disable no-restricted-globals, no-undef */

// Web Worker environment uses 'self' to refer to the global context
const globalContext = self;

// Placeholder for processing SKU data for 1st tab (Total Transaction Units per SKU)
const processSkuDataTab1 = (skuData, chunkSize = 100) => {
  let chunkedResult = [];
  let index = 0;

  const processChunk = () => {
    const chunk = skuData.slice(index, index + chunkSize);
    const aggregatedChunk = chunk.reduce((acc, item) => {
      const sku = item.inventory_sku_id;
      if (!acc[sku]) {
        acc[sku] = { transaction_units: 0 };
      }
      acc[sku].transaction_units += item.inventory_transaction_units || 0;
      return acc;
    }, {});

    chunkedResult = [
      ...chunkedResult,
      ...Object.entries(aggregatedChunk).map(([sku, data]) => ({
        sku,
        transaction_units: data.transaction_units,
      })),
    ];

    index += chunkSize;

    if (index < skuData.length) {
      // Continue processing the next chunk in idle time
      globalContext.postMessage({ status: 'progress', data: chunkedResult });
      setTimeout(processChunk, 0); // Use setTimeout with 0 delay to yield control and stay responsive
    } else {
      globalContext.postMessage({ status: 'completed', data: chunkedResult });
    }
  };

  processChunk(); // Start processing from the first chunk
};

// Listen for messages from the main thread (React component)
globalContext.onmessage = (event) => {
  const { skuData } = event.data;

  // Process the data for the first tab
  processSkuDataTab1(skuData); 
};
