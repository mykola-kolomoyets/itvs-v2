import { memo } from 'react';
import LandingLayout from '@/components/layout/LandingLayout';
import Hiro from './components/Hiro';
import About from './components/About';
import History from './components/History';
import Staff from './components/Staff';

const HomeModule: React.FC = () => {
    return (
        <LandingLayout>
            <Hiro />
            <About />
            <History />
            <Staff />
        </LandingLayout>
    );
};

export default memo(HomeModule);
