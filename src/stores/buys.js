import { defineStore } from "pinia";
import { addDoc, getDocs, getDoc, query, where } from "firebase/firestore";
import { refs } from "src/config/firebase/firestoreDatabase";

export const useBuys = defineStore("buys", {
  state: () => ({}),
  getters: {},
  actions: {
    async addBuy(payload) {
      if (payload) {
        const docRef = await addDoc(refs.addBuy(), {
          user: payload.user,
          date: payload.date,
          time: payload.time,
          products: payload.products,
          count: payload.count,
          price: payload.price,
        });
        if (docRef.id) {
          return {
            value: docRef.id,
            status: 200,
          };
        } else {
          return { status: 400 };
        }
      } else {
        return { status: 400 };
      }
    },
    async listBuys(payload) {
      const ref = refs.getBuys();
      const q = query(ref, where("user", "==", payload));
      const response = await getDocs(q);
      let fbRows = [];
      response.forEach((doc) => {
        const row = {
          id: doc.id,
          date: doc.data().date,
          time: doc.data().time,
          products: doc.data().products,
          count: doc.data().count,
          price: doc.data().price,
        };
        fbRows.push(row);
      });
      if (fbRows) {
        return {
          value: fbRows,
          status: 200,
        };
      } else {
        return { status: 400 };
      }
    },
    async listOneBuy(payload) {
      const docSnap = await getDoc(refs.getOneBuy(payload));
      if (docSnap.exists()) {
        return {
          value: docSnap.data(),
          status: 200,
        };
      } else {
        return { status: 400 };
      }
    },
  },
});
