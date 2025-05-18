
import React from "react";
import { Navigate } from "react-router-dom";

// This file redirects to the welcome page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
