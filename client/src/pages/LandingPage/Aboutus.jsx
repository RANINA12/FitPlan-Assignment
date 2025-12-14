import React from 'react';
import './About.css';

const About = () => {
    return (
        <section id="about" className="about-section texture-grid">
            {/* Background Glows */}
            <div className="glow-blob blob-1"></div>
            <div className="glow-blob blob-2"></div>

            <div className="about-container">

                {/* Left: Text Content */}
                <div className="about-content">
                    <div className="badge">Who We Are</div>
                    <h2 className="about-title">
                        Building the Future <br /> of <span className="text-gradient">Optimization</span>
                    </h2>
                    <p className="about-desc">
                        At Debugging Engines, we don't just fix code; we architect solutions.
                        We integrate complex systems with seamless efficiency. Our team is dedicated
                        to transforming digital chaos into structured performance.
                    </p>
                </div>

                {/* Right: 3D Overlapping Images */}
                <div className="about-visuals">
                    <div className="card-stack card-1">
                        <img src="/path-to-image-1.jpg" alt="Team Work" />
                    </div>
                    <div className="card-stack card-2">
                        <img src="/path-to-image-2.jpg" alt="Analytics" />
                    </div>
                    <div className="card-stack card-3">
                        <img src="/path-to-image-3.jpg" alt="Code" />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;