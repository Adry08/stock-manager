import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document {
  _id : string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

// Exporte le modèle Product
export default mongoose.models.Product || mongoose.model<Product>('Product', ProductSchema);