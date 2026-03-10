import React, { type ReactNode, type CSSProperties, useState } from "react";

interface CardProps {
  children: ReactNode;
  colors: {
    border: string;
    surface: string;
  };
  style?: CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, colors, style }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        borderRadius: "12px",
        border: `1px solid ${colors.border}`,
        background: colors.surface,
        padding: "18px",
        boxShadow: isHover
          ? "0 10px 24px rgba(0,0,0,0.08)"
          : "0 4px 10px rgba(0,0,0,0.05)",
        transform: isHover ? "translateY(-6px)" : "translateY(0)",
        transition: "all 0.25s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
