import React from 'react';

const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="shop-card loading-skeleton">
        <div className="shop-card-image-container loading-skeleton" />
        <div className="shop-card-info">
          <div className="loading-skeleton" style={{ height: '20px', width: '80%', marginBottom: '8px' }} />
          <div className="loading-skeleton" style={{ height: '16px', width: '60%', marginBottom: '8px' }} />
          <div className="loading-skeleton" style={{ height: '24px', width: '40%', marginBottom: '12px' }} />
          <div className="loading-skeleton" style={{ height: '40px', width: '100%' }} />
        </div>
      </div>
    );
  }
  
  return <div className="loading-skeleton" style={{ height: '200px', width: '100%' }} />;
};

export default LoadingSkeleton;
