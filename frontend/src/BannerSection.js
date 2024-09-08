import React from 'react';
import './BannerSection.css'; // Import the CSS file

const BannerSection = () => {
  return (
    <div className="full-width-section">
      <div className="content-container">
        <h1>Visvesvaraya Technological University in Association with The International Institute of Medical Science & Technology Council Welcomes you to the Opportunities on Transforming India Through Youth Skill Development!</h1>

      </div>
      <div className="image-container">
        <div className="image-group">
          <img src="/Pictures/VTU Logo.png" alt="AICTE Logo 1" />
          <img src="/Pictures/AICTE logo.png" alt="AICTE Logo 2" />
        </div>
        <div className="image-group">
          <img src="/Pictures/UGC Logo.png" alt="AICTE Logo 3" />
          <img src="/Pictures/IIMSTC logo.png" alt="AICTE Logo 4" />
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
