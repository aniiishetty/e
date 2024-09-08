import React, { useState, useEffect } from 'react';
import styles from '../styles/LoadingScreen.module.css';

const logos = [
    {
        src: "https://vectorseek.com/wp-content/uploads/2023/09/AICTE-Logo-Vector.svg-.png",
        alt: "AICTE Logo",
        className: styles.aicteLogo
    },
    {
        src: "https://iimstc.com/wp-content/uploads/2024/06/VTU-New.jpg",
        alt: "VTU Logo",
        className: styles.vtuLogo
    },
    {
        src: "https://iimstc.com/wp-content/uploads/2021/10/log.png",
        alt: "IIMSTC Logo",
        className: styles.iimstcLogo
    },
    {
        src: "https://presentations.gov.in/wp-content/uploads/2020/06/UGC-Preview.png?x31571",
        alt: "UGC Logo",
        className: styles.ugcLogo
    }
];

const LoadingScreen: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % logos.length);
      }, 2000); // adjust the interval time as needed
  
      return () => clearInterval(intervalId);
    }, []);
  
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.logosContainer}>
          <div className={styles.slideshow}>
            {logos.map((logo, index) => (
              <div
                key={index}
                className={`${styles.slide} ${
                  index === activeIndex ? styles.central : ''
                }`}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={logo.className}
                />
              </div>
            ))}
          </div>
        </div>
        
      </div>
    );
  };
  
  export default LoadingScreen;