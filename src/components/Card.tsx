import React, { type ReactNode, type CSSProperties } from "react";

interface CardProps {
  children: ReactNode;
  colors: {
    border: string;
    surface: string;
  };
  style?: CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, colors, style }) => {
  return (
    <div
      style={{
        borderRadius: "12px",
        border: `1px solid ${colors.border}`,
        background: colors.surface,
        padding: "18px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;