"use client";
import { useEffect, useState } from "react";

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}


export const Meteors = ({ number = 20, children }) => {
    const [meteorStyles, setMeteorStyles] = useState([]);
  
    useEffect(() => {
      const styles = Array.from({ length: number }, () => ({
        top: '-5px',
        left: `${Math.floor(Math.random() * window.innerWidth)}px`,
        animationDelay: `${Math.random() * 1 + 0.2}s`,
        animationDuration: `${Math.floor(Math.random() * 8 + 2)}s`,
      }));
      setMeteorStyles(styles);
    }, [number]);
  
    return (
      <div style={{zIndex: 1}} >
        {meteorStyles.map((style, idx) => (
          // Meteor Head
          <span
            key={idx}
            className="pointer-events-none absolute left-1/2 top-1/2 size-0.5 rotate-[215deg] animate-meteor rounded-full bg-black shadow-[0_0_0_1px_#00000010]"
            style={style}
          >
            {/* Meteor Tail */}
            <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-black to-transparent" />
          </span>
        ))}
      </div>
    );
  };

export default Meteors;
