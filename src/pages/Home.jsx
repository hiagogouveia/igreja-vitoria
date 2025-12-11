
import React from 'react';
import Hero from '../components/Hero';
import Beliefs from '../components/Beliefs';
import Ministries from '../components/Ministries';
import LiveSection from '../components/LiveSection';
import Events from '../components/Events';
import Donate from '../components/Donate';
import Testimonials from '../components/Testimonials';
import Location from '../components/Location';
import CavSection from '../components/CavSection';

const Home = () => {
    return (
        <div className="bg-black min-h-screen">
            <Hero />
            <Beliefs />
            <Ministries />
            <CavSection />
            <LiveSection />
            <Events />
            <Donate />
            <Testimonials />
            <Location />
            {/* Other sections will be added here */}
        </div>
    );
};

export default Home;
