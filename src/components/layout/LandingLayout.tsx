import Header from "@/components/landing/Header";

const LandingLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen bg-blue-300">
      <Header />
      <main className="container">{children}</main>
    </div>
  );
};

export default LandingLayout;
