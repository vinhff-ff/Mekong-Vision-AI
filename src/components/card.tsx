import React from "react";

interface CardProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
}
export default function Card({ children, className = '', onClick }: CardProps) {

    return (
        <div
            onClick={onClick}
            className={className}
            style={{
                background: "#fff",
                boxShadow: "0 1px 2px rgba(0,0,0,.08)",
                borderRadius: "8px",
                padding: "16px",
            }}
        >
            {children}
        </div>
    );
}