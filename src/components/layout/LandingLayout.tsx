import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

const LandingLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="  ">
            <Header />
            <main className="relative">
                <div className="fixed inset-0 top-[-10%] z-[-1] h-full w-full">
                    <span className="md:top-1/5 absolute left-[-50%] top-1/3 h-[100vmin] w-[100vmin] bg-gradient-primary md:left-[-30%]" />
                    <span className="absolute -top-0 left-[70%] block h-[100vmin] w-[100vmin] bg-gradient-secondary" />
                </div>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default LandingLayout;
