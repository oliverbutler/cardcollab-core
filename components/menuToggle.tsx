import { motion } from "framer-motion";

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

export default ({ isActive }) => {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      style={{ height: "2rem", width: "2rem" }}
    >
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
        transition={{ duration: 0.2 }}
        animate={isActive ? "open" : "closed"}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        initial={{ opacity: 0 }}
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.2 }}
        animate={isActive ? "open" : "closed"}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
        transition={{ duration: 0.2 }}
        animate={isActive ? "open" : "closed"}
      />
    </svg>
  );
};
