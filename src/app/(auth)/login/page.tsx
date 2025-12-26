import Logo from "@/components/shared/Logo";
import LoginForm from "./_components/LoginForm.client";


const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm logo={<Logo />} />
    </div>
  );
};

export default LoginPage;
