import { render } from "react-dom";
import React, { useState } from "react";
import { useSpring, animated as a } from "react-spring";

export function Card() {
  const [flipped, set] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  return (
    <div className="container" style={{ height: "100%", position: "relative" }}>
      <div onClick={() => set((state) => !state)}>
        <a.div
          className="c back"
          style={{ opacity: opacity.interpolate((o) => 1 - o), transform }}
        >
          <h1>Front content</h1>
        </a.div>
        <a.div
          className="c front"
          style={{
            opacity,
            transform: transform.interpolate((t) => `${t} rotateX(180deg)`),
          }}
        >
          <h1>Back content</h1>
        </a.div>
      </div>
    </div>
  );
}
