import React from "react";
import DashboardShell from "../components/dashboard/DashboardShell";

const Layout = ({ children }) => {
  return <DashboardShell>{children}</DashboardShell>;
};

export default Layout;
