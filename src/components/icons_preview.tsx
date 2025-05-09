import React from "react";
import { icons } from "./icons";

const IconPreview: React.FC = () => {
  return (
    <>
      {Object.entries(icons).map(([categoryName, categoryIcons]) => (
        <div key={categoryName}>
          <div className="text-xl">
            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {Object.entries(categoryIcons).map(([iconName, IconComponent]) => (
              <div
                className="bg-danger-50 size-14 overflow-hidden rounded-md text-center"
                key={iconName}>
                <div className="mx-auto w-9 text-3xl">{IconComponent}</div>
                <p className="text-md text-ellipsis">{iconName}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default IconPreview;
