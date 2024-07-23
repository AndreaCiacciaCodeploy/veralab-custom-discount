// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";
// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */
/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};


const SPAIN_DISCOUNT_PERCENTAGE = "10.0";
const ITALY_DISCOUNT_PERCENTAGE = "20.0";

// The configured entrypoint for the 'purchase.product-discount.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {

  let discountPercentage = "0.0";
  // You can use STDERR for debug logs in your function
  console.error("input", JSON.stringify(input, null, 2));
  if(input.localization){
    console.log("country", JSON.stringify(input.localization));
  }

  if(input.localization.market.handle === 'spain') {
    console.log('apply discount for spain');
    discountPercentage = SPAIN_DISCOUNT_PERCENTAGE;
  }
  if(input.localization.market.handle === 'it') {
    console.log('apply discount for italy');
    discountPercentage = ITALY_DISCOUNT_PERCENTAGE;
  }


  const targets = input.cart.lines
    // Only include cart lines with a quantity of two or more
    .filter(line => line.quantity >= 1)
    .map(line => {
      return /** @type {Target} */ ({

        // Use the cart line ID to create a discount target
        cartLine: {
          id: line.id
        }
      });
    });

  console.log("targets", JSON.stringify(targets, null, 2));

  if (!targets.length) {
    // You can use STDERR for debug logs in your function
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    discounts: [
      {
        // Apply the discount to the collected targets
        targets,
        // Define a percentage-based discount
        value: {
          percentage: {
            value: discountPercentage
          }
        }
      }
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First

  };
};
