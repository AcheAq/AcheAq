import Header from "../components/Header";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Header />

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;