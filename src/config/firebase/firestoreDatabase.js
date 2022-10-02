import { firestoreDB } from "src/config/firebase/index";
import { collection, doc, query, where } from "firebase/firestore";
import * as Constants from "src/constants";

const refs = {
  addBuy: () => collection(firestoreDB, Constants.COLLECTIONS.BUYS),
  getBuys: () => collection(firestoreDB, Constants.COLLECTIONS.BUYS),
  getOneBuy: (id) => doc(firestoreDB, Constants.COLLECTIONS.BUYS, id),

  getProducts: () => collection(firestoreDB, Constants.COLLECTIONS.PRODUCTS),
  getOneProduct: (id) => doc(firestoreDB, Constants.COLLECTIONS.PRODUCTS, id),
  modifyProduct: (id) => doc(firestoreDB, Constants.COLLECTIONS.PRODUCTS, id),

  addUser: (id) => doc(firestoreDB, Constants.COLLECTIONS.USERS, id),
  getOneUser: (id) => doc(firestoreDB, Constants.COLLECTIONS.USERS, id),
};

export { refs };
