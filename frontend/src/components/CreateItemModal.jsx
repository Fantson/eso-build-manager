import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useBuildStore } from '../store/useBuildStore';

export const CreateItemModal = ({ show, handleClose, buildId }) => {
  const addItem = useBuildStore((state) => state.addItem);

  // Lokalne stany formularza
  const [name, setName] = useState('');
  const [slot, setSlot] = useState('Main Hand');
  const [trait, setTrait] = useState('Precise');

  const handleSubmit = async () => {
    if (!name) return;

    // Wywołanie akcji ze store'a
    await addItem({
      name,
      slot,
      trait,
      buildId: buildId // ID przekazane z góry (z App.jsx)
    });

    // Reset i zamknięcie
    setName('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Dodaj Przedmiot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nazwa Przedmiotu</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="np. Ring of the Pale Order"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Slot</Form.Label>
            <Form.Select value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option>Main Hand</option>
              <option>Off Hand</option>
              <option>Head</option>
              <option>Chest</option>
              <option>Legs</option>
              <option>Ring</option>
              <option>Necklace</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cecha (Trait)</Form.Label>
            <Form.Select value={trait} onChange={(e) => setTrait(e.target.value)}>
              <option>Divines</option>
              <option>Infused</option>
              <option>Precise</option>
              <option>Sharpened</option>
              <option>Training</option>
              <option>Impenetrable</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Anuluj
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          Zapisz Przedmiot
        </Button>
      </Modal.Footer>
    </Modal>
  );
};