import { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaList } from "react-icons/fa6";


export default function Authentication() {

    const [user, setUser] = useState(null);

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
        .then((result) => {

            // Mendapatkan Google Access Token
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // Mendapatkan user yang login
            const user = result.user;
            // Set user ke localStorage
            localStorage.setItem("userfb", JSON.stringify(user));
            localStorage.setItem("tokenfb", JSON.stringify(token));
            
            // Set user ke state
            setUser(user);
        }).catch((error) => {
            // Errors
            const errorCode = error.code;
            const errorMessage = error.message;
            // Email yang digunakan
            const email = error.email;
            // Auth credential
            const credential = GoogleAuthProvider.credentialFromError(error);
            // Error
            alert("Error GAuth\n", errorCode, errorMessage, email, credential);
        });
    }

    useEffect(() => {
        const userLocalStorage = localStorage.getItem("userfb");
        if (userLocalStorage) {
            const userLocalStorageObject = JSON.parse(userLocalStorage);
            setUser(userLocalStorageObject);
        }
    }, []);
    return (
        <div>
            <h1>Authentication</h1>
            {user ? (
            <div>
                <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    referrerPolicy="no-referrer" 
                    style={{
                    borderRadius: "100px",}}
                />
                <p>Selamat datang,  <strong>{user.displayName}</strong></p>
            <span>
                <button
                style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "15px",
                    border: "none",
                    borderRadius: "5px",
                }}
                >
                <Link to="/todo" style={{ textDecoration: "none", color: "white" }} >
                    To-Do List
                </Link>
                </button>
                <button
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    padding: "15px",
                    border: "none",
                    borderRadius: "5px",
                }}
                >
                 <Link to="/chat" style={{ textDecoration: "none", color: "white" }}>
                    Group Chat
                </Link>
                </button>
                
          </span>
            
            </div>
        ) : (
        <div>
            <p>Anda belum login</p>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
        )}
        </div>
    );
}