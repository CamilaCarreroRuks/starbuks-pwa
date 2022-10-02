import { auth } from "src/config/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export async function loginAPI(payload) {
  return await signInWithEmailAndPassword(auth, payload.email, payload.password)
    .then((response) => response)
    .catch((error) => error);
}

export async function recoverPasswordAPI(payload) {
  return await sendPasswordResetEmail(auth, payload.email)
    .then((response) => {
      return { status: 200 };
    })
    .catch((error) => error);
}

export async function createUser(payload) {
  return await createUserWithEmailAndPassword(
    auth,
    payload.email,
    payload.password
  )
    .then((response) => response)
    .catch((error) => error);
}
