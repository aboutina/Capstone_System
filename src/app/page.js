import GenerateQr from "@/components/GenerateQr";
import LoginAdmin from "@/components/auth/LoginAdmin";
import LoginPage from "@/components/auth/LoginPage";
import UserForm from "@/components/form/UserForm";
import Header from "@/components/layout/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      {/* <Header />
      <GenerateQr />
      <UserForm /> 
      
      */}
      {/* <LoginPage /> */}
      <LoginAdmin />
    </div>
  );
}
