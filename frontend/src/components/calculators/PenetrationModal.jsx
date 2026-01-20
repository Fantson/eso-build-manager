import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, ProgressBar } from 'react-bootstrap';

export const PenetrationModal = ({ show, handleClose }) => {
  // --- STAŁE WARTOŚCI (Twoje wytyczne) ---
  const TARGET_PEN = 18200;
  
  const VALUES = {
    // Support / Debuffy
    majorBreach: 5948,
    minorBreach: 2974,
    crusher: 2108,
    alkosh: 6000,
    crimson: 3541,      // New
    tremorscale: 2400,  // New
    runicSunder: 2200,  // New

    // Character Passive / Gear
    heraldOfTome: 1240, // Per stack/skill
    graveLord: 3271,    // Necromancer
    velothi: 1650,      // Mythic
    
    lightArmor: 939,    // Per piece
    weaponMace: 1650,   // Per mace (1H)
    weaponMaul: 2974,   // 2H (Mutually exclusive with Mace logic for calculation simplicity)
    sharpened1H: 1638,  // Per trait (1H value)

    // CP & Race & Mundus
    forceOfNature: 600, // Per status effect
    piercingCP: 700,
    woodElf: 950,
    loverMundus: 4489,
    
    otherSetLines: 1487, // Per line
  };

  // --- STANY ---
  const [stats, setStats] = useState({
    // Support
    majorBreach: true,
    minorBreach: true,
    crusher: true,
    alkosh: false,
    crimson: false,
    tremorscale: false,
    runicSunder: false,

    // Character
    heraldOfTomeCount: 0, // Ilość (0-2 zazwyczaj)
    graveLord: false,
    velothi: false,
    
    lightArmorCount: 0,   // 0-7
    
    // Weapons
    isMaul: false,        // Czy używa Maul (2H)
    maceCount: 0,         // Ilość buław (1H), jeśli nie Maul
    sharpenedCount: 0,    // Ilość cech Sharpened (1H eq). Dla 2H zaznacz 2x.

    // CP / Inne
    forceOfNatureCount: 0, // Ilość statusów
    piercingCP: true,      // Bazowo włączony
    woodElf: false,
    loverMundus: false,
    
    otherSetLinesCount: 0, // Ilość linii 1487
    otherSources: 0        // Ręczne wpisywanie (1 pkt = 1 pen)
  });

  const [totalPen, setTotalPen] = useState(0);

  // --- OBLICZENIA ---
  useEffect(() => {
    let current = 0;

    // 1. Support
    if (stats.majorBreach) current += VALUES.majorBreach;
    if (stats.minorBreach) current += VALUES.minorBreach;
    if (stats.crusher) current += VALUES.crusher;
    if (stats.alkosh) current += VALUES.alkosh;
    if (stats.crimson) current += VALUES.crimson;
    if (stats.tremorscale) current += VALUES.tremorscale;
    if (stats.runicSunder) current += VALUES.runicSunder;

    // 2. Character Passives
    current += stats.heraldOfTomeCount * VALUES.heraldOfTome;
    if (stats.graveLord) current += VALUES.graveLord;
    if (stats.velothi) current += VALUES.velothi;
    if (stats.piercingCP) current += VALUES.piercingCP;
    if (stats.woodElf) current += VALUES.woodElf;
    if (stats.loverMundus) current += VALUES.loverMundus;

    // 3. Gear & Weapons
    current += stats.lightArmorCount * VALUES.lightArmor;
    
    // Logika broni: Maul albo Mace
    if (stats.isMaul) {
      current += VALUES.weaponMaul;
    } else {
      current += stats.maceCount * VALUES.weaponMace;
    }

    current += stats.sharpenedCount * VALUES.sharpened1H;
    current += stats.otherSetLinesCount * VALUES.otherSetLines;

    // 4. Force of Nature CP
    current += stats.forceOfNatureCount * VALUES.forceOfNature;

    // 5. Inne
    current += Number(stats.otherSources);

    setTotalPen(current);
  }, [stats]);

  // Reset Mace count if Maul is checked
  useEffect(() => {
    if (stats.isMaul && stats.maceCount > 0) {
      setStats(prev => ({ ...prev, maceCount: 0 }));
    }
  }, [stats.isMaul]);

  const handleChange = (field, value) => {
    setStats(prev => ({ ...prev, [field]: value }));
  };

  const remaining = TARGET_PEN - totalPen;
  const isOverPen = remaining < 0;
  const progressPercent = Math.min((totalPen / TARGET_PEN) * 100, 100);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>Penetration Calculator (Target: {TARGET_PEN})</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        
        {/* WYNIKI */}
        <div className="bg-white p-3 rounded shadow-sm mb-4 border">
          <Row className="text-center align-items-center">
            <Col>
              <h5 className="text-muted mb-0">Target</h5>
              <h3 className="fw-bold text-secondary">{TARGET_PEN}</h3>
            </Col>
            <Col>
              <h5 className="text-muted mb-0">Current</h5>
              <h3 className={`fw-bold ${isOverPen ? 'text-warning' : 'text-primary'}`}>
                {totalPen}
              </h3>
            </Col>
            <Col>
              <h5 className="text-muted mb-0">{isOverPen ? 'Zmarnowane' : 'Brakuje'}</h5>
              <h3 className={`fw-bold ${isOverPen ? 'text-danger' : 'text-success'}`}>
                {Math.abs(remaining)}
              </h3>
            </Col>
          </Row>
          <ProgressBar 
            now={progressPercent} 
            variant={isOverPen ? "warning" : "success"} 
            className="mt-3" 
            style={{ height: '12px' }} 
            label={`${totalPen}`}
          />
        </div>

        <Row>
          {/* KOLUMNA 1: SUPPORT / DEBUFFS */}
          <Col md={6}>
            <div className="p-3 border rounded bg-white h-100">
              <h6 className="fw-bold border-bottom pb-2 mb-3 text-uppercase text-secondary">Support / Debuffy</h6>
              
              <Form.Check type="switch" className="mb-2" label={`Major Breach (${VALUES.majorBreach})`}
                checked={stats.majorBreach} onChange={(e) => handleChange('majorBreach', e.target.checked)} />
              
              <Form.Check type="switch" className="mb-2" label={`Minor Breach (${VALUES.minorBreach})`}
                checked={stats.minorBreach} onChange={(e) => handleChange('minorBreach', e.target.checked)} />
              
              <Form.Check type="switch" className="mb-2" label={`Crusher (${VALUES.crusher})`}
                checked={stats.crusher} onChange={(e) => handleChange('crusher', e.target.checked)} />
              
              <Form.Check type="switch" className="mb-2" label={`Alkosh (${VALUES.alkosh})`}
                checked={stats.alkosh} onChange={(e) => handleChange('alkosh', e.target.checked)} />

              <Form.Check type="switch" className="mb-2" label={`Crimson Oath (${VALUES.crimson})`}
                checked={stats.crimson} onChange={(e) => handleChange('crimson', e.target.checked)} />

              <Form.Check type="switch" className="mb-2" label={`Tremorscale (${VALUES.tremorscale})`}
                checked={stats.tremorscale} onChange={(e) => handleChange('tremorscale', e.target.checked)} />

              <Form.Check type="switch" className="mb-2" label={`Runic Sunder (${VALUES.runicSunder})`}
                checked={stats.runicSunder} onChange={(e) => handleChange('runicSunder', e.target.checked)} />
            </div>
          </Col>

          {/* KOLUMNA 2: POSTAĆ */}
          <Col md={6}>
            <div className="p-3 border rounded bg-white h-100">
              <h6 className="fw-bold border-bottom pb-2 mb-3 text-uppercase text-secondary">Twoja Postać</h6>

              {/* Pasywki Specjalne */}
              <Row className="mb-2 align-items-center">
                 <Col xs={8}><span className="small">Herald of Tome (Arcanist)</span></Col>
                 <Col xs={4}>
                    <Form.Control type="number" min="0" max="2" size="sm" placeholder="Ilość"
                      value={stats.heraldOfTomeCount} onChange={(e) => handleChange('heraldOfTomeCount', Number(e.target.value))} />
                 </Col>
              </Row>

              <Form.Check type="checkbox" label={`Grave Lord (Necro) (+${VALUES.graveLord})`} className="mb-1 small"
                checked={stats.graveLord} onChange={(e) => handleChange('graveLord', e.target.checked)} />
              
              <Form.Check type="checkbox" label={`Velothi Mythic (+${VALUES.velothi})`} className="mb-3 small"
                checked={stats.velothi} onChange={(e) => handleChange('velothi', e.target.checked)} />

              <hr className="my-2"/>

              {/* Gear */}
              <Row className="mb-2 align-items-center">
                 <Col xs={8}><span className="small">Light Armor (+{VALUES.lightArmor}/szt)</span></Col>
                 <Col xs={4}>
                    <Form.Control type="number" min="0" max="7" size="sm"
                      value={stats.lightArmorCount} onChange={(e) => handleChange('lightArmorCount', Number(e.target.value))} />
                 </Col>
              </Row>

              {/* Bronie - Logika Maul vs Mace */}
              <div className="bg-light p-2 rounded mb-2 border">
                <Form.Check type="checkbox" label={`Maul (2H) (+${VALUES.weaponMaul})`} className="mb-2 fw-bold small"
                  checked={stats.isMaul} onChange={(e) => handleChange('isMaul', e.target.checked)} />
                
                <Row className="align-items-center">
                   <Col xs={8}><span className={`small ${stats.isMaul ? 'text-muted text-decoration-line-through' : ''}`}>Mace (1H) (+{VALUES.weaponMace}/szt)</span></Col>
                   <Col xs={4}>
                      <Form.Control type="number" min="0" max="2" size="sm" disabled={stats.isMaul}
                        value={stats.maceCount} onChange={(e) => handleChange('maceCount', Number(e.target.value))} />
                   </Col>
                </Row>
              </div>

              <Row className="mb-2 align-items-center">
                 <Col xs={8}><span className="small">Sharpened 1H (ilość cech)</span></Col>
                 <Col xs={4}>
                    <Form.Control type="number" min="0" max="2" size="sm"
                      value={stats.sharpenedCount} onChange={(e) => handleChange('sharpenedCount', Number(e.target.value))} />
                 </Col>
              </Row>

              <hr className="my-2"/>

              {/* CP / Race / Mundus */}
              <Row className="mb-2 align-items-center">
                 <Col xs={8}><span className="small">Force of Nature CP (Statusy)</span></Col>
                 <Col xs={4}>
                    <Form.Control type="number" min="0" max="10" size="sm"
                      value={stats.forceOfNatureCount} onChange={(e) => handleChange('forceOfNatureCount', Number(e.target.value))} />
                 </Col>
              </Row>

              <Form.Check type="switch" label={`Piercing CP (+${VALUES.piercingCP})`} className="mb-1 small"
                checked={stats.piercingCP} onChange={(e) => handleChange('piercingCP', e.target.checked)} />
              
              <Form.Check type="switch" label={`Wood Elf (+${VALUES.woodElf})`} className="mb-1 small"
                checked={stats.woodElf} onChange={(e) => handleChange('woodElf', e.target.checked)} />

              <Form.Check type="switch" label={`Lover Mundus (+${VALUES.loverMundus})`} className="mb-2 small"
                checked={stats.loverMundus} onChange={(e) => handleChange('loverMundus', e.target.checked)} />

              {/* Inne */}
              <Row className="mb-2 align-items-center border-top pt-2">
                 <Col xs={8}><span className="small">Inne linie setów (+{VALUES.otherSetLines})</span></Col>
                 <Col xs={4}>
                    <Form.Control type="number" min="0" max="5" size="sm"
                      value={stats.otherSetLinesCount} onChange={(e) => handleChange('otherSetLinesCount', Number(e.target.value))} />
                 </Col>
              </Row>
              <Row className="align-items-center">
                 <Col xs={8}><span className="small">Other sources (Ręcznie)</span></Col>
                 <Col xs={4}>
                    <Form.Control type="number" placeholder="0" size="sm"
                      value={stats.otherSources} onChange={(e) => handleChange('otherSources', e.target.value)} />
                 </Col>
              </Row>

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