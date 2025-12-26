import Logo from "@/components/shared/Logo";
import SignupForm from "./_components/SignupForm.client";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <SignupForm logo={<Logo />} />
    </div>
  );
};

export default SignupPage;
