import { defineStore } from "pinia";
import { addDoc, getDoc, query, setDoc, where } from "firebase/firestore";
import { refs } from "src/config/firebase/firestoreDatabase";

export const useUser = defineStore("users", {
  state: () => ({}),
  getters: {},
  actions: {
    async addUser(payload) {
      if (payload) {
        const docRef = await setDoc(refs.addUser(payload.id), {
          id: payload.id,
          name: payload.name,
          identification: payload.identification,
          phone: payload.phone,
          direction: payload.direction,
        });
        return {
          status: 200,
        };
      } else {
        return { status: 400 };
      }
    },
    async isExistUser(payload) {
      const docSnap = await getDoc(refs.getOneUser(payload));
      if (docSnap.exists()) {
        return {
          value: docSnap.data(),
          status: 200,
        };
      } else {
        return { status: 400 };
      }
    },
    async listOneUser(payload) {
      const docSnap = await getDoc(refs.getOneUser(payload));
      if (docSnap) {
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
