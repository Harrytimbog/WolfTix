import { OrderStatus } from "@clonedwolftickets/common";
import mongoose from "mongoose";

interface orderAttrs {
  // list of properties required to create a new order
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface orderDoc extends mongoose.Document {
  // list of properties a order document has
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface orderModel extends mongoose.Model<orderDoc> {
  // list of properties a order model has
  build(attrs: orderAttrs): orderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: orderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    price: attrs.price,
    status: attrs.status,
  });
};

const Order = mongoose.model<orderDoc, orderModel>("Order", orderSchema);
export { Order };
