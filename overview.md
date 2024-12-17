Project Title: Grocery Store Website with QR Scanning and Cart Functionality Objective:
Develop a full-stack grocery store website that sells frozen food items, utilizing React for the frontend, NestJS for the backend, Mongoose for database interactions, and Chakra UI for styling. The application should include a QR scanning system, product categories, search functionality, and cart management with SMS order capabilities.
Requirements:

    Frontend Development:
        Use React to create the user interface.
        Integrate Chakra UI for responsive design and components.
        Implement a QR code scanning feature using a library like react-qr-reader.
        Create a sidebar menu to display product categories.
        Implement a search bar that filters products across all categories.
        Display products dynamically based on the selected category.
        Include an input box for users to specify the quantity of products.
        Provide an "Add to Cart" button next to each product.
        Develop a Cart component that lists selected items and includes an Order button.
    Backend Development:
        Use NestJS to create RESTful APIs.
        Connect to MongoDB using Mongoose for data storage.
        Define Mongoose schemas for products and cart items.
        Implement endpoints to handle:
            Fetching product categories and products.
            Adding items to the cart.
            Sending order details via SMS (consider using Twilio or similar service).
    Database Schema Design:
        Create schemas for:
            Product

```js
            typescript
            import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
            import { Document } from 'mongoose';

            export type ProductDocument = Product & Document;

            @Schema()
            export class Product {
                @Prop({ required: true })
                name: string;

                @Prop({ required: true })
                category: string;

                @Prop({ required: true })
                price: number;

                @Prop()
                imageUrl?: string;

                @Prop({ default: 0 })
                stockQuantity: number;
            }

            export const ProductSchema = SchemaFactory.createForClass(Product);

Cart

typescript;
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
@Prop({ required: true })
userId: string; // Assuming user identification

@Prop({ type: [String], required: true }) // Array of product IDs
productIds: string[];

@Prop({ default: Date.now })
createdAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

```

    Functionality Overview:
        On scanning a QR code, redirect users to the relevant category page.
        The sidebar should allow users to switch between categories seamlessly.
        The search bar should provide real-time filtering of products as users type.
        The cart should maintain state across sessions using local storage or context API.
        When the order button is clicked, send a text message with cart details to a specified phone number.
    Deployment Considerations:
        Prepare Docker configurations if necessary for local development.
        Ensure environment variables are used for sensitive information (e.g., database connection strings, API keys).
        Provide instructions for setting up both backend and frontend environments.

Additional Instructions

    Ensure that all components are modular and reusable where possible.
    Write clear comments and documentation within the codebase to facilitate future maintenance and updates.
    Consider implementing error handling and validation both on the client-side and server-side.

This prompt should provide Claude AI with enough context and detail to generate the necessary code structure, components, and documentation needed for your grocery store website project. You can save this prompt in a text file or PDF format for easy sharing and reference.

```

```
