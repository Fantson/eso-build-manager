import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
// UWAGA: Upewnij się, że ta linia nie ma błędów (literówek w nazwach ikon)
import { 
  GiVisoredHelm, GiShoulderArmor, GiBreastplate, GiGauntlet, GiBeltBuckles, GiLegArmor, GiBoots, // Armor
  GiNecklace, GiRing, // Jewelry
  GiBroadsword, GiCheckedShield, GiLockedChest // Weapons / Icons
} from "react-icons/gi";
import { SlotSelectorModal } from './SlotSelectorModal';
import { useBuildStore } from '../store/useBuildStore';

// Definicja slotów i ikon (musi być PO importach)
const SLOTS_CONFIG = {
  armor: [
    { id: 'Head', icon: <GiVisoredHelm size={32} /> },
    { id: 'Shoulders', icon: <GiShoulderArmor size={32} /> },
    { id: 'Chest', icon: <GiBreastplate size={32} /> },
    { id: 'Hands', icon: <GiGauntlet size={32} /> },
    { id: 'Waist', icon: <GiBeltBuckles size={32} /> },
    { id: 'Legs', icon: <GiLegArmor size={32} /> },
    { id: 'Feet', icon: <GiBoots size={32} /> },
  ],
  jewelry: [
    { id: 'Necklace', icon: <GiNecklace size={32} /> },
    { id: 'Ring 1', icon: <GiRing size={32} /> },
    { id: 'Ring 2', icon: <GiRing size={32} /> },
  ],
  mainBar: [
    { id: 'Main Hand', icon: <GiBroadsword size={32} /> },
    { id: 'Off Hand', icon: <GiCheckedShield size={32} /> },
  ],
  backBar: [
    { id: 'Backbar Main Hand', icon: <GiBroadsword size={32} /> },
    { id: 'Backbar Off Hand', icon: <GiCheckedShield size={32} /> },
  ]
};

const isTwoHanded = (itemName) => {
  if (!itemName) return false;
  const lower = itemName.toLowerCase();
  return lower.includes('greatsword') || lower.includes('maul') || lower.includes('battle axe') || 
         lower.includes('staff') || lower.includes('bow');
};

export const BuildEditor = ({ build, onBack }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(null);
  const deleteItem = useBuildStore((state) => state.deleteItem);

  // Zabezpieczenie: jeśli build nie ma tablicy items, użyj pustej tablicy
  const safeItems = build?.items || [];
  const getItem = (slotId) => safeItems.find(i => i.slot === slotId);

  const handleSlotClick = (slotId) => {
    // Logika blokowania off-hand dla broni 2H
    if (slotId === 'Off Hand') {
       const mainHandItem = getItem('Main Hand');
       if (mainHandItem && isTwoHanded(mainHandItem.name)) return;
    }
    if (slotId === 'Backbar Off Hand') {
       const mainHandItem = getItem('Backbar Main Hand');
       if (mainHandItem && isTwoHanded(mainHandItem.name)) return;
    }

    setCurrentSlot(slotId);
    setShowModal(true);
  };

  const handleRemove = (e, itemId) => {
    e.stopPropagation(); // Zapobiega otwarciu modala przy usuwaniu
    deleteItem(itemId, build.id);
  };

  // Komponent pojedynczego kafelka
  const SlotTile = ({ slotConfig, isLocked }) => {
    // Zabezpieczenie przed brakiem slotConfig
    if (!slotConfig) return null;

    const item = getItem(slotConfig.id);
    
    return (
      <Card 
        className={`mb-3 position-relative ${isLocked ? 'opacity-25' : 'hover-shadow cursor-pointer'}`}
        style={{ 
           backgroundColor: '#1e1e1e', 
           border: item ? '1px solid #0d6efd' : '1px solid #444',
           height: '80px',
           transition: 'all 0.2s'
        }}
        onClick={() => !isLocked && handleSlotClick(slotConfig.id)}
      >
        <Card.Body className="d-flex align-items-center p-2">
          <div className={`text-secondary me-3 ${item ? 'text-primary' : ''}`}>
             {isLocked ? <GiLockedChest size={32} /> : slotConfig.icon}
          </div>
          
          <div className="flex-grow-1 lh-1 overflow-hidden">
            <div className="text-secondary small text-uppercase fw-bold mb-1" style={{fontSize: '0.65rem'}}>
              {slotConfig.id}
            </div>
            {item ? (
              <div>
                <div className="fw-bold text-light text-truncate" title={item.name}>{item.name}</div>
                <Badge bg="dark" className="border border-secondary text-secondary fw-normal mt-1" style={{fontSize: '0.6rem'}}>
                  {item.trait}
                </Badge>
              </div>
            ) : (
              <div className="text-muted small fst-italic">Pusty</div>
            )}
          </div>

          {item && !isLocked && (
            <Button 
              variant="link" 
              className="text-danger p-0 position-absolute top-0 end-0 me-2 mt-1"
              onClick={(e) => handleRemove(e, item.id)}
            >
              &times;
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  };

  const mainHandItem = getItem('Main Hand');
  const mainLocked = mainHandItem && isTwoHanded(mainHandItem.name);

  const backHandItem = getItem('Backbar Main Hand');
  const backLocked = backHandItem && isTwoHanded(backHandItem.name);

  return (
    <Container fluid className="py-4 h-100 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary pb-3">
        <div>
          <Button variant="outline-secondary" size="sm" onClick={onBack} className="mb-2">
            &larr; Wróć do Listy
          </Button>
          <h2 className="text-light m-0">Edycja: <span className="text-primary">{build.title}</span></h2>
          <span className="text-muted small">{build.class} &bull; {build.role}</span>
        </div>
      </div>

      <Row className="flex-grow-1 overflow-auto custom-scrollbar">
        {/* Armor */}
        <Col md={4} lg={3}>
          <h5 className="text-secondary text-uppercase small border-bottom border-secondary pb-2 mb-3">Apparel (Armor)</h5>
          {SLOTS_CONFIG.armor.map(slot => (
            <SlotTile key={slot.id} slotConfig={slot} />
          ))}
        </Col>

        {/* Jewelry */}
        <Col md={4} lg={3}>
           <h5 className="text-secondary text-uppercase small border-bottom border-secondary pb-2 mb-3">Accessories</h5>
           {SLOTS_CONFIG.jewelry.map(slot => (
            <SlotTile key={slot.id} slotConfig={slot} />
          ))}
        </Col>

        {/* Weapons */}
        <Col md={4} lg={6}>
          <h5 className="text-secondary text-uppercase small border-bottom border-secondary pb-2 mb-3">Main Weapon Bar</h5>
          <Row>
            <Col sm={6}><SlotTile slotConfig={SLOTS_CONFIG.mainBar[0]} /></Col>
            <Col sm={6}><SlotTile slotConfig={SLOTS_CONFIG.mainBar[1]} isLocked={mainLocked} /></Col>
          </Row>

          <h5 className="text-secondary text-uppercase small border-bottom border-secondary pb-2 mb-3 mt-4">Back Weapon Bar</h5>
          <Row>
            <Col sm={6}><SlotTile slotConfig={SLOTS_CONFIG.backBar[0]} /></Col>
            <Col sm={6}><SlotTile slotConfig={SLOTS_CONFIG.backBar[1]} isLocked={backLocked} /></Col>
          </Row>
        </Col>
      </Row>

      <SlotSelectorModal 
        show={showModal} 
        handleClose={() => setShowModal(false)}
        buildId={build.id}
        slotName={currentSlot}
      />
    </Container>
  );
};