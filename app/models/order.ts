import { Timestamp } from "firebase/firestore";
import { Product } from "./product";

export interface Order {
  id: string;
  isPaid : boolean;
  phone: string;
  orderItems : Product[];
  address: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
