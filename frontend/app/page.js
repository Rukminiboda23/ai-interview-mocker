"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Inline style for the button
  const shadowBtnStyle = {
    padding: "10px 20px",
    border: "none",
    fontSize: "17px",
    color: "#fff",
    borderRadius: "7px",
    letterSpacing: "4px",
    fontWeight: 700,
    textTransform: "uppercase",
    background: "rgb(0,140,255)",
    boxShadow: isHovered
      ? "0 0 5px rgb(0,140,255), 0 0 25px rgb(0,140,255), 0 0 50px rgb(0,140,255), 0 0 100px rgb(0,140,255)"
      : "0 0 25px rgb(0,140,255)",
    transition: "0.5s",
    transitionProperty: "box-shadow",
    cursor: "pointer",
  };

  return (
    <div className="relative min-h-screen flex">
      {/* Background Image */}
      <Image
        src="/image1.jpg"
        alt="Landing"
        fill
        priority
        className="object-cover z-0"
        style={{ objectFit: "cover" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />
      {/* Left-aligned, vertically spaced Content */}
      <div
        className="relative z-20 flex flex-col items-start"
        style={{
          marginLeft: "80px",
          marginTop: "50px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{
            color: "whitesmoke",
            marginBottom: "30px",
            fontSize:"60px",
          }}
        >
          Succeed Your Next Interview with Confidence 🚀
        </h1>
        <p
          className="text-lg md:text-xl mb-12"
          style={{
            color: "whitesmoke",
            marginBottom: "48px",
            maxWidth: "90%",
          }}
        >
          Experience personalized mock interviews powered by AI — get instant, actionable feedback to sharpen your skills and land your dream job faster. 💡🎯
        </p>
      </div>
      {/* Button fixed at bottom right */}
      <button
        style={{
          ...shadowBtnStyle,
          position: "absolute", // or "absolute" if you want it relative to the page container
          right: "150px",
          bottom: "90px",
          zIndex: 50,
        }}
        onClick={() => router.push("/dashboard")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Get Started
      </button>
    </div>
  );
}
