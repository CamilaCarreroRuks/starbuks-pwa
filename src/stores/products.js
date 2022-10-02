import { defineStore } from "pinia";
import { getDocs, getDoc, updateDoc, query, where } from "firebase/firestore";
import { refs } from "src/config/firebase/firestoreDatabase";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export const useProducts = defineStore("products", {
  state: () => ({}),
  getters: {},
  actions: {
    async listProducts() {
      const querySnapshot = await getDocs(refs.getProducts());
      let fbRows = [];
      querySnapshot.forEach((doc) => {
        const row = {
          id: doc.id,
          name: doc.data().name,
          stock: doc.data().stock,
          price: doc.data().price,
          icon: doc.data().icon,
          type: doc.data().type,
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
    async listOneProduct(payload) {
      const ref = refs.getProducts();
      const q = query(ref, where("name", "==", payload));
      const response = await getDocs(q);
      let fbRows = [];
      response.forEach((doc) => {
        const row = {
          id: doc.id,
          stock: doc.data().stock,
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
    async modifyProduct(payload) {
      if (payload) {
        try {
          await updateDoc(refs.modifyProduct(payload.id), {
            stock: payload.count,
          });
          return { status: 200 };
        } catch (error) {
          return { status: 400, error: error };
        }
      } else {
        return { status: 400, error: error };
      }
    },
    async getUrl(payload) {
      try {
          const storage = getStorage();
          const storageRef = ref(
            storage,
            "/images/" + payload
          );
          let dateUrl = [];
          await getDownloadURL(storageRef).then((url) => {
            //window.open(url);
            dateUrl.push(url);
          });
          return {
            value: dateUrl,
            status: 200,
          };
      } catch (error) {
        return { status: 400, error: error };

      }
    },
  },
});
