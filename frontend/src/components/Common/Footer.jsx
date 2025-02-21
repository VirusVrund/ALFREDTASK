import React from 'react';

const Footer = () => {
    return (
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="social-links">
                <a href="https://github.com/VirusVrund" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-github"></i>
                </a>
                <a href="https://linkedin.com/in/vrundpatell" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=vrundpatel451@gmail.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="bi bi-envelope"></i>
                </a>
              </div>
              <small className="text-muted">Flash. Learn. Repeat. © 2025 MINDFLIP</small>
            </div>
          </div>
        </div>
      </footer>
    );
  };

export default Footer;