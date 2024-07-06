import { React, useState, useEffect } from "react";
import googleImage from "./google.png";
import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login({setSignedIn}) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate=useNavigate();

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function signIn() {
    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      setSignedIn(true);
      setError(""); 
      navigate("/");
    } catch (e) {
      handleError(e);
    }
  }

  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
      setSignedIn(true);
      setError("");
      navigate("/"); 
    } catch (e) {
      handleError(e);
    }
  }

  function handleError(error) {
    let errorMessage;
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "The email address is already in use by another account.";
        break;
      case "auth/invalid-email":
        errorMessage = "The email address is not valid.";
        break;
      case "auth/operation-not-allowed":
        errorMessage = "Email/Password accounts are not enabled.";
        break;
      case "auth/weak-password":
        errorMessage = "The password is too weak.";
        break;
      case "auth/wrong-password":
        errorMessage = "Incorrect password.";
        break;
      case "auth/user-not-found":
        errorMessage = "No user found with this email.";
        break;
      default:
        errorMessage = "An error occurred. Please try again.";
    }
    setError(errorMessage);
  }

  return (
    <>
      <div className="circle top-right"></div>
      <div className="circle bottom-left"></div>
      <div className="login-container">
        <input
          type="text"
          placeholder="Enter Email"
          className="input-field"
          name="email"
          onChange={handleChange}
          value={formData.email}
        />
        <input
          type="password"
          placeholder="Enter Password"
          className="input-field"
          name="password"
          onChange={handleChange}
          value={formData.password}
        />
        <button className="sign-in-button" onClick={signIn}>
          Sign In
        </button>
        <div className="or-divider">or</div>
        <button className="google-button" onClick={signInWithGoogle}>
          <img src={googleImage} alt="Google Logo" className="google-logo" />
          Sign in with Google
        </button>
        {error && <p className="error-message" style={{"color":"red"}}>&#x26A0; {error}</p>}
        
      </div>
    </>
  );
}
