import React from "react";

interface ScrollAreaProps {
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
}

export const ScrollArea = ({
  children,
  maxHeight = "600px",
  className = "",
}: ScrollAreaProps) => {
  return (
    <div
      className={`
        overflow-auto 
        /* Firefox (Limited styling support) */
        scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-transparent

        /* Chrome, Edge, Safari */
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar]:h-2
        
        /* The Track */
        [&::-webkit-scrollbar-track]:bg-slate-100/50
        dark:[&::-webkit-scrollbar-track]:bg-slate-800/50
        
        /* The Thumb (Primary Color) */
        [&::-webkit-scrollbar-thumb]:bg-teal-500
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-teal-600
        active:[&::-webkit-scrollbar-thumb]:bg-teal-700

        /* Up and Down Arrows (Buttons) */
        [&::-webkit-scrollbar-button:single-button:vertical:decrement]:bg-no-repeat
        [&::-webkit-scrollbar-button:single-button:vertical:decrement]:bg-center
        [&::-webkit-scrollbar-button:single-button:vertical:decrement]:[background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%2314b8a6' viewBox='0 0 24 24'%3E%3Cpath d='M7 14l5-5 5 5H7z'/%3E%3C/svg%3E")]
        
        [&::-webkit-scrollbar-button:single-button:vertical:increment]:bg-no-repeat
        [&::-webkit-scrollbar-button:single-button:vertical:increment]:bg-center
        [&::-webkit-scrollbar-button:single-button:vertical:increment]:[background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%2314b8a6' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E")]

        /* Button visibility */
        [&::-webkit-scrollbar-button]:block
        [&::-webkit-scrollbar-button]:h-4

        ${className}
      `}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
};
