// SignUpPage.jsx
import { SignUp } from '@clerk/nextjs';
import './page.css'; // Import the CSS module

export default function Page() {
  return (
    <div className="signup-container">
      {/* Left Side - Image with overlay and text */}
      <div className="signup-left">
        <div className="overlay" />
        <div className="text-content">
          <h2 className="title">Welcome to AI Interview Mocker 🧠</h2>
          <p className="subtitle">
            Get ready to enhance your interview skills with intelligent mock interviews powered by Gemini AI. 
            Practice with confidence, get instant feedback, and walk into your next interview fully prepared for your dream Job.
          </p>
        </div>
      </div>

      {/* Right Side - SignUp box */}
      <div className="signup-right">
        <div className="form-wrapper">
          <SignUp />
        </div>
      </div>
    </div>
  );
}