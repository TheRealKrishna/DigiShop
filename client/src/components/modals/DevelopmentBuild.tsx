import { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

function DigiShop() {
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);

  useEffect(() => {
    // Check if the user has a cookie indicating a previous visit
    const hasVisitedBefore = sessionStorage.getItem('hasVisitedBefore');
    
    if (!hasVisitedBefore && process.env.NODE_ENV === "production") {
      setShowDevelopmentModal(true);
      sessionStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  return (
    <div>
      <Modal
        show={showDevelopmentModal}
        backdrop="static"
        centered
        onHide={() => setShowDevelopmentModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Welcome To DigiShop!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Attention: This version of DigiShop is an alpha build and is a work in progress. Your feedback would be appreciated as we continue to refine and improve the platform. Thank you!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDevelopmentModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DigiShop;
