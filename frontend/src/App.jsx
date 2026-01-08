import { useEffect } from 'react';
import { useBuildStore } from './store/useBuildStore';
import { Container, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';

function App() {
  // Wyciągamy dane i funkcję z naszego magazynu (Zustand)
  const { builds, fetchBuilds, isLoading } = useBuildStore();

  // Pobierz dane przy pierwszym uruchomieniu strony
  useEffect(() => {
    fetchBuilds();
  }, [fetchBuilds]);

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">ESO Build Manager</h1>

      {/* Spinner ładowania */}
      {isLoading && <div className="text-center"><Spinner animation="border" /></div>}

      {/* Lista Buildów */}
      <Row>
        {builds.map((build) => (
          <Col key={build.id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>{build.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {build.class}
                </Card.Subtitle>
                <Card.Text>
                  Rola: <Badge bg="info">{build.role}</Badge>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Komunikat gdy brak danych */}
      {!isLoading && builds.length === 0 && (
        <p className="text-center text-muted">Brak buildów w bazie. Dodaj pierwszy przez Swaggera!</p>
      )}
    </Container>
  );
}

export default App;