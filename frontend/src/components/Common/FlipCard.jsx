import React from 'react';
import { motion } from 'framer-motion';

const FlipCard = ({ frontContent, backContent, isFlipped, onClick, onResponse }) => {
  return (
    <div className="my-flipcard" onClick={onClick}>
      <motion.div
        className="my-flipcard-inner"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.8,
          ease: [0.645, 0.045, 0.355, 1.0],
          type: "tween"
        }}
      >
        {/* Front Side */}
        <motion.div 
          className="my-flipcard-front"
          initial={false}
          animate={{ opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="card-body text-center d-flex flex-column justify-content-between">
            <div>
              <h5 className="card-title mb-4">Question</h5>
              <div className="card-text fs-4 mb-4" style={{ overflowY: 'auto', maxHeight: '200px' }}>
                {frontContent}
              </div>
            </div>
            <small className="text-muted">Click to see answer</small>
          </div>
        </motion.div>

        {/* Back Side */}
        <motion.div 
          className="my-flipcard-back"
          initial={false}
          animate={{ opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="card-body text-center d-flex flex-column justify-content-between">
            <div>
              <h5 className="card-title mb-4">Answer</h5>
              <div className="card-text fs-4 mb-4" style={{ overflowY: 'auto', maxHeight: '200px' }}>
                {backContent}
              </div>
            </div>
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className="btn btn-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onResponse(false);
                }}
              >
                <i className="bi bi-x-lg me-2"></i>
                Got it Wrong
              </button>
              <button
                className="btn btn-success"
                onClick={(e) => {
                  e.stopPropagation();
                  onResponse(true);
                }}
              >
                <i className="bi bi-check-lg me-2"></i>
                Got it Right
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FlipCard;