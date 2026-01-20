import { useState } from 'react';
import { useBuildStore } from '../store/useBuildStore';
import { Form, Button, Card } from 'react-bootstrap';

export const CreateBuildForm = () => {
  const addBuild = useBuildStore((state) => state.addBuild);
  
  // Lokalne stany dla pól formularza
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [role, setRole] = useState('DPS');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !className) return;

    // Wywołanie funkcji z naszego Store
    await addBuild({ title, class: className, role });

    // Wyczyszczenie formularza po wysłaniu
    setTitle('');
    setClassName('');
  };

  return (
    <Card className="mb-4 p-3 shadow-sm">
      <Card.Body>
        <Card.Title>Dodaj nowy build</Card.Title>
        <Form onSubmit={handleSubmit}>
          
          <Form.Group className="mb-3">
            <Form.Label>Nazwa Buildu</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="np. Magicka Templar" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Klasa</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="np. Templar" 
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

          <Button variant="primary" type="submit" className="w-100">
            Dodaj Build
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};