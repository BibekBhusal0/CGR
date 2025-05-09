import React from 'react';
import { icons } from './icons';

const IconPreview: React.FC = () => {
  return (
    <>
      {Object.entries(icons).map(([categoryName, categoryIcons]) => (
        <div key={categoryName}>
          <div className='text-xl'>{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {Object.entries(categoryIcons).map(([iconName, IconComponent]) => (
              <div className='bg-danger-50 text-center size-14 rounded-md overflow-hidden' key={iconName} >
                <div className='text-3xl w-9 mx-auto'>{IconComponent}</div>
                <p className='text-md text-ellipsis'>{iconName}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default IconPreview;
