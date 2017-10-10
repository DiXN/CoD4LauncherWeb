import Firebase from 'firebase'

const config = {
  apiKey: "AIzaSyCEu3diDp0MSpX43udUG0Ba-H6tdB9W2Dw",
  authDomain: "launcher-3ba7c.firebaseapp.com",
  databaseURL: "https://launcher-3ba7c.firebaseio.com",
  projectId: "launcher-3ba7c",
  storageBucket: "launcher-3ba7c.appspot.com",
  messagingSenderId: "820437973399"
}

Firebase.initializeApp(config)

export const provider = new Firebase.auth.GoogleAuthProvider()
export const auth = Firebase.auth()

export default Firebase
