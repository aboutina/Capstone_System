import GenerateQr from "@/components/GenerateQr";
import LoginPage from "@/components/auth/LoginPage";
import UserForm from "@/components/form/UserForm";
import Header from "@/components/layout/Header";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* <Header />
      <GenerateQr />
      <UserForm /> */}
      <LoginPage />
    </>
  );
}
