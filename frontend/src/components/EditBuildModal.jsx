import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useBuildStore } from '../store/useBuildStore';

export const EditBuildModal = ({ show, handleClose, build }) => {
  const updateBuild = useBuildStore((state) => state.updateBuild);

  // Stany lokalne
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [role, setRole] = useState('DPS');

  // Gdy otwieramy okno (zmienia się 'build'), wpisujemy stare dane do pól
  useEffect(() => {
    if (build) {
      setTitle(build.title);
      setClassName(build.class);
      setRole(build.role);
    }
  }, [build]);

  const handleSubmit = async () => {
    await updateBuild({
      id: build.id,
      title,
      class: className,
      role
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edytuj Build</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nazwa Buildu</Form.Label>
            <Form.Control 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Klasa</Form.Label>
            <Form.Control 
              type="text" 
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rola</Form.Label>
            <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="DPS">DPS</option>
              <option value="Tank">Tank</option>
              <option value="Healer">Healer</option>
              <option value="PVP">PVP</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Anuluj</Button>
        <Button variant="primary" onClick={handleSubmit}>Zapisz Zmiany</Button>
      </Modal.Footer>
    </Modal>
  );
};