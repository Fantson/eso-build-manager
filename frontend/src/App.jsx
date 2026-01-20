import { useEffect, useState } from 'react';
import { useBuildStore } from './store/useBuildStore';
import { CreateBuildForm } from './components/CreateBuildForm';
import { CreateItemModal } from './components/CreateItemModal';
import { EditBuildModal } from './components/EditBuildModal';
// Importy kalkulatorów
import { PenetrationModal } from './components/calculators/PenetrationModal'; 
import { CritDamageModal } from './components/calculators/CritDamageModal';
// Import nowego Edytora
import { BuildEditor } from './components/BuildEditor'; 

import { Container, Row, Col, Card, Badge, Spinner, Button } from 'react-bootstrap';
import { 
  GiBroadsword, GiCheckedShield, GiHealthNormal, GiCrossedSwords,
  GiCalculator 
} from "react-icons/gi";
import { BiEdit } from "react-icons/bi";

function App() {
  // ZMIANA 1: Pobieramy zmienne do paginacji (currentPage, totalPages)
  const { 
    builds, fetchBuilds, isLoading, deleteBuild, 
    currentPage, totalPages 
  } = useBuildStore();

  // STANY WIDOKU
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [activeBuildId, setActiveBuildId] = useState(null);

  const [showPenCalc, setShowPenCalc] = useState(false);
  const [showCritCalc, setShowCritCalc] = useState(false);

  // Stany dla starych modali (opcjonalne, jeśli nadal używasz CreateItemModal gdzieś indziej)
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedBuildId, setSelectedBuildId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [buildToEdit, setBuildToEdit] = useState(null);

  useEffect(() => {
    fetchBuilds();
  }, [fetchBuilds]);

  // --- OBSŁUGA ---
  
  const handleEditClick = (buildId) => {
    setActiveBuildId(buildId);
    setCurrentView('editor'); // Przełącz widok na edytor
  };

  const handleBackToDashboard = () => {
    setActiveBuildId(null);
    setCurrentView('dashboard'); // Wróć do listy
    fetchBuilds(currentPage); // Odśwież listę na aktualnej stronie
  };

  const handleDelete = (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten build?')) {
      deleteBuild(id);
    }
  };

  const getRoleIcon = (role) => {
      if (role === 'Tank') return <GiCheckedShield />;
      if (role === 'Healer') return <GiHealthNormal />;
      if (role === 'PVP') return <GiCrossedSwords />;
      return <GiBroadsword />;
  };
  const getRoleColor = (role) => role === 'Tank' ? 'danger' : 'primary';

  // --- RENDEROWANIE WIDOKÓW ---

  // 1. WIDOK EDYTORA
  if (currentView === 'editor') {
    const activeBuild = builds.find(b => b.id === activeBuildId);
    // Jeśli po odświeżeniu nie ma builda w pamięci, pokaż błąd lub wróć (proste zabezpieczenie)
    if (!activeBuild && !isLoading) return (
        <div className="d-flex flex-column vh-100 w-100 app-bg align-items-center justify-content-center text-light">
            <h3>Nie znaleziono builda.</h3>
            <Button variant="outline-light" onClick={handleBackToDashboard}>Wróć</Button>
        </div>
    );

    return (
      <div className="d-flex flex-column vh-100 w-100 app-bg" data-bs-theme="dark">
        {activeBuild && <BuildEditor build={activeBuild} onBack={handleBackToDashboard} />}
        
        <PenetrationModal show={showPenCalc} handleClose={() => setShowPenCalc(false)} />
        <CritDamageModal show={showCritCalc} handleClose={() => setShowCritCalc(false)} />
      </div>
    );
  }

  // 2. WIDOK DASHBOARD (LISTA)
  return (
    <div className="d-flex flex-column vh-100 w-100 app-bg" data-bs-theme="dark">
      
      {/* HEADER */}
      <div className="component-bg border-bottom border-secondary px-4 py-3 shadow-sm d-flex justify-content-between align-items-center flex-shrink-0">
        <div className="d-flex align-items-center gap-3">
            <h1 className="fw-bold text-light m-0 fs-3">ESO Build Manager</h1>
            <Badge bg="secondary" className="fs-6 px-3 py-1 rounded-pill">
              Strona: {currentPage} / {totalPages || 1}
            </Badge>
        </div>
        <div className="d-flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowPenCalc(true)}>
            <GiCalculator /> Penetracja
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={() => setShowCritCalc(true)}>
            <GiCalculator /> Crit Dmg
          </Button>
        </div>
      </div>

      {/* TREŚĆ */}
      <div className="flex-grow-1 overflow-auto w-100 custom-scrollbar">
        <Container fluid className="py-5 px-4"> 
          
          {/* Formularz dodawania */}
          <Row className="justify-content-center mb-5">
            <Col xs={12} md={8} lg={6} xl={4}>
              <Card className="border border-secondary shadow-sm component-bg">
                <Card.Body className="p-4">
                   <h4 className="fw-bold text-light text-center mb-3">Stwórz Nowy Build</h4>
                   <CreateBuildForm />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Nagłówek Listy */}
          <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
            <h3 className="text-secondary fw-light m-0">Twoja Kolekcja</h3>
          </div>

          {isLoading && <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>}

          {/* GRID KART */}
          <Row className="g-4">
            {builds.map((build) => (
              <Col key={build.id} xs={12} md={6} lg={4} xl={3} xxl={2}>
                <Card className="shadow-sm border border-secondary h-100 hover-shadow component-bg">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="fw-bold text-info text-truncate w-75">{build.title}</h5>
                      <Badge bg={getRoleColor(build.role)}>{build.role}</Badge>
                    </div>
                    <div className="text-secondary mb-3 small">{build.class}</div>
                    
                    {/* Info o itemach */}
                    <div className="mb-3 p-2 rounded bg-dark border border-secondary text-center text-muted small">
                       Posiada {build.items.length} przedmiotów
                    </div>

                    <div className="d-flex gap-2 mt-auto">
                      <Button variant="outline-primary" size="sm" className="w-50" onClick={() => handleEditClick(build.id)}>
                        <BiEdit /> Edytuj
                      </Button>
                      <Button variant="outline-danger" size="sm" className="w-50" onClick={() => handleDelete(build.id)}>
                        Usuń
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* ZMIANA 2: PAGINACJA (Przyciski na dole) */}
          <div className="d-flex justify-content-center align-items-center gap-3 mt-5 pb-5">
            <Button 
                variant="outline-secondary" 
                disabled={currentPage === 1}
                onClick={() => fetchBuilds(currentPage - 1)}
            >
                &larr; Poprzednia
            </Button>
            
            <span className="text-light small">
                Strona {currentPage} z {totalPages || 1}
            </span>

            <Button 
                variant="outline-secondary" 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => fetchBuilds(currentPage + 1)}
            >
                Następna &rarr;
            </Button>
           </div>

        </Container>
      </div>

      {/* Modale */}
      <PenetrationModal show={showPenCalc} handleClose={() => setShowPenCalc(false)} />
      <CritDamageModal show={showCritCalc} handleClose={() => setShowCritCalc(false)} />
      
      {/* Stare modale (dla kompatybilności, jeśli potrzebne) */}
      <CreateItemModal show={showItemModal} handleClose={() => setShowItemModal(false)} buildId={selectedBuildId} />
      <EditBuildModal show={showEditModal} handleClose={() => setShowEditModal(false)} build={buildToEdit} />
    </div>
  );
}

export default App;