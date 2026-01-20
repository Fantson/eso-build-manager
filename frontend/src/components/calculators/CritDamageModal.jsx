import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, ProgressBar } from 'react-bootstrap';

export const CritDamageModal = ({ show, handleClose }) => {
  // --- STAŁE WARTOŚCI (Wg Twoich wytycznych) ---
  const BASE_CRIT_DMG = 50;
  const CAP = 125;

  const VALUES = {
    // Support
    majorForce: 20,
    minorForce: 10,
    majorBrittle: 20,
    minorBrittle: 10,
    catalyst: 15, // Max stack (3 * 5%)

    // Pasywki Klasowe
    animalCompanions: 5,  // Per skill
    templar: 12,          // Aedric Spear
    nightblade: 10,       // Assassination
    arcanist: 12,         // Herald of Tome

    // Postać
    mediumArmor: 2,       // Per piece
    weaponAxe: 6,         // Per axe
    khajiit: 12,
    
    // CP & Gear
    shadowMundus: 17,
    harpooner: 10,
    cpBackstabber: 10,
    cpFinesse: 8,
    orderWrath: 8,
  };

  // --- STANY ---
  const [stats, setStats] = useState({
    // Support
    majorForce: true,
    minorForce: true,
    minorBrittle: true,
    majorBrittle: false,
    catalystStacks: 0,
    
    // Character Values
    animalCompanionsCount: 0, // Ile skilli
    isTemplar: false,
    isNightblade: false,
    isArcanist: false,
    
    mediumArmorCount: 0,      // Ile sztuk
    axeCount: 0,              // Ile toporów (0, 1, 2)
    
    isKhajiit: false,
    shadowMundus: false,
    harpooner: false,
    backstabber: false,
    fightingFinesse: false,
    orderWrath: false,
    
    otherSources: 0           // Ręczne wpisywanie
  });

  const [totalCrit, setTotalCrit] = useState(50);

  // --- OBLICZENIA ---
  useEffect(() => {
    let current = BASE_CRIT_DMG;

    // Support
    if (stats.majorForce) current += VALUES.majorForce;
    if (stats.minorForce) current += VALUES.minorForce;
    if (stats.minorBrittle) current += VALUES.minorBrittle;
    if (stats.majorBrittle) current += VALUES.majorBrittle;
    current += (stats.catalystStacks * 5); 

    // Pasywki Klasowe
    current += stats.animalCompanionsCount * VALUES.animalCompanions;
    if (stats.isTemplar) current += VALUES.templar;
    if (stats.isNightblade) current += VALUES.nightblade;
    if (stats.isArcanist) current += VALUES.arcanist;

    // Sprzęt i Broń
    current += stats.mediumArmorCount * VALUES.mediumArmor;
    current += stats.axeCount * VALUES.weaponAxe;

    // Rasa i Mundus
    if (stats.isKhajiit) current += VALUES.khajiit;
    if (stats.shadowMundus) current += VALUES.shadowMundus;

    // CP i Sety
    if (stats.harpooner) current += VALUES.harpooner;
    if (stats.backstabber) current += VALUES.cpBackstabber;
    if (stats.fightingFinesse) current += VALUES.cpFinesse;
    if (stats.orderWrath) current += VALUES.orderWrath;

    // Inne
    current += Number(stats.otherSources);

    setTotalCrit(current);
  }, [stats]);

  const handleChange = (field, value) => {
    setStats(prev => ({ ...prev, [field]: value }));
  };

  // Logika wizualna (pasek postępu)
  const isOverCap = totalCrit > CAP;
  const progressPercent = Math.min((totalCrit / CAP) * 100, 100);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Critical Damage Calculator (Cap: {CAP}%)</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        
        {/* WYNIKI */}
        <div className="bg-white p-3 rounded shadow-sm mb-4 border">
          <Row className="text-center align-items-center">
            <Col>
              <h5 className="text-muted mb-0">Base</h5>
              <h3 className="fw-bold text-secondary">{BASE_CRIT_DMG}%</h3>
            </Col>
            <Col>
              <h5 className="text-muted mb-0">Obecnie</h5>
              <h3 className={`fw-bold ${isOverCap ? 'text-danger' : 'text-primary'}`}>
                {totalCrit}%
              </h3>
            </Col>
            <Col>
              <h5 className="text-muted mb-0">Status</h5>
              {isOverCap ? (
                <span className="badge bg-danger fs-6">Zmarnowane: {totalCrit - CAP}%</span>
              ) : (
                <span className="badge bg-success fs-6">OK (Brakuje: {CAP - totalCrit}%)</span>
              )}
            </Col>
          </Row>
          <ProgressBar 
            now={progressPercent} 
            variant={isOverCap ? "danger" : "info"} 
            className="mt-3" 
            style={{ height: '12px' }} 
            label={`${totalCrit}%`}
          />
        </div>

        <Row>
          {/* KOLUMNA 1: SUPPORT */}
          <Col md={6}>
            <div className="p-3 border rounded bg-white h-100">
              <h6 className="fw-bold border-bottom pb-2 mb-3 text-uppercase text-secondary">Support / Grupa</h6>
              
              <Form.Check type="switch" className="mb-2" label="Major Force (+20%)"
                checked={stats.majorForce} onChange={(e) => handleChange('majorForce', e.target.checked)} />
              
              <Form.Check type="switch" className="mb-2" label="Minor Force (+10%)"
                checked={stats.minorForce} onChange={(e) => handleChange('minorForce', e.target.checked)} />
              
              <Form.Check type="switch" className="mb-2" label="Minor Brittle (+10%)"
                checked={stats.minorBrittle} onChange={(e) => handleChange('minorBrittle', e.target.checked)} />
              
              <Form.Check type="switch" className="mb-2 text-muted" label="Major Brittle (+20%)"
                checked={stats.majorBrittle} onChange={(e) => handleChange('majorBrittle', e.target.checked)} />
              
              <hr />
              <Form.Group className="mb-2">
                <Form.Label>Elemental Catalyst (5% per stack)</Form.Label>
                <Form.Select value={stats.catalystStacks} onChange={(e) => handleChange('catalystStacks', Number(e.target.value))}>
                  <option value="0">0</option>
                  <option value="1">1 (+5%)</option>
                  <option value="2">2 (+10%)</option>
                  <option value="3">3 (+15%)</option>
                </Form.Select>
              </Form.Group>
            </div>
          </Col>

          {/* KOLUMNA 2: POSTAĆ */}
          <Col md={6}>
            <div className="p-3 border rounded bg-white h-100">
              <h6 className="fw-bold border-bottom pb-2 mb-3 text-uppercase text-secondary">Twoja Postać</h6>

              {/* KLASY */}
              <div className="mb-3">
                 <Form.Label className="fw-bold small">Pasywki Klasowe</Form.Label>
                 <Form.Group className="mb-2 d-flex justify-content-between align-items-center">
                    <Form.Label className="m-0 small">Warden (Animal Companions +5%)</Form.Label>
                    <Form.Control type="number" min="0" max="6" style={{width: '60px'}} size="sm"
                      value={stats.animalCompanionsCount}
                      onChange={(e) => handleChange('animalCompanionsCount', Number(e.target.value))}
                    />
                 </Form.Group>

                 <Form.Check type="checkbox" label="Templar (Aedric Spear +12%)" className="mb-1"
                    checked={stats.isTemplar} onChange={(e) => handleChange('isTemplar', e.target.checked)} />
                 <Form.Check type="checkbox" label="Nightblade (Assassination +10%)" className="mb-1"
                    checked={stats.isNightblade} onChange={(e) => handleChange('isNightblade', e.target.checked)} />
                 <Form.Check type="checkbox" label="Arcanist (Herald of Tome +12%)" className="mb-1"
                    checked={stats.isArcanist} onChange={(e) => handleChange('isArcanist', e.target.checked)} />
              </div>

              <hr />

              {/* SPRZĘT */}
              <Row className="mb-2">
                 <Col xs={8}>Medium Armor (+2% sztuka)</Col>
                 <Col xs={4}>
                    <Form.Control type="number" min="0" max="7" size="sm"
                      value={stats.mediumArmorCount} onChange={(e) => handleChange('mediumArmorCount', Number(e.target.value))} />
                 </Col>
              </Row>
              <Row className="mb-3">
                 <Col xs={8}>Weapon Axe (+6% sztuka)</Col>
                 <Col xs={4}>
                    <Form.Control type="number" min="0" max="2" size="sm"
                      value={stats.axeCount} onChange={(e) => handleChange('axeCount', Number(e.target.value))} />
                 </Col>
              </Row>

              {/* CP / INNE */}
              <Form.Check type="switch" label="Khajiit Race (+12%)" className="mb-1"
                checked={stats.isKhajiit} onChange={(e) => handleChange('isKhajiit', e.target.checked)} />
              
              <Form.Check type="switch" label="Shadow Mundus (+17%)" className="mb-1"
                checked={stats.shadowMundus} onChange={(e) => handleChange('shadowMundus', e.target.checked)} />
              
              <Form.Check type="switch" label="Backstabber CP (+10%)" className="mb-1"
                checked={stats.backstabber} onChange={(e) => handleChange('backstabber', e.target.checked)} />
              
              <Form.Check type="switch" label="Fighting Finesse CP (+8%)" className="mb-1"
                checked={stats.fightingFinesse} onChange={(e) => handleChange('fightingFinesse', e.target.checked)} />

              <Form.Check type="switch" label="Harpooner's Kilt (+10%)" className="mb-1"
                checked={stats.harpooner} onChange={(e) => handleChange('harpooner', e.target.checked)} />

              <Form.Check type="switch" label="Order's Wrath (+8%)" className="mb-1"
                checked={stats.orderWrath} onChange={(e) => handleChange('orderWrath', e.target.checked)} />

               <Form.Group className="mt-2 pt-2 border-top">
                <Form.Label className="small">Inne źródła (+1% per point)</Form.Label>
                <Form.Control type="number" placeholder="0" size="sm"
                  value={stats.otherSources}
                  onChange={(e) => handleChange('otherSources', e.target.value)}
                />
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Zamknij</Button>
      </Modal.Footer>
    </Modal>
  );
};