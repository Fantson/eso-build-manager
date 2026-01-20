import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useBuildStore } from '../store/useBuildStore';

export const SlotSelectorModal = ({ show, handleClose, buildId, slotName }) => {
  const equipItem = useBuildStore((state) => state.equipItem);

  const [name, setName] = useState('');
  const [trait, setTrait] = useState('Divines');
  const [weaponType, setWeaponType] = useState('');

  // Logika rozpoznawania typu slotu
  const isWeapon = slotName && (slotName.includes('Hand') || slotName.includes('Bar'));
  const isJewelry = slotName && ['Necklace', 'Ring 1', 'Ring 2'].includes(slotName);
  const isArmor = !isWeapon && !isJewelry;

  // Reset formularza i ustawienie domyślnych wartości przy otwarciu
  useEffect(() => {
    if (show) {
      setName('');
      setWeaponType('');
      
      // Ustawiamy domyślny trait w zależności od typu, żeby nie był pusty
      if (isJewelry) setTrait('Arcane');
      else if (isWeapon) setTrait('Precise');
      else setTrait('Divines'); // Armor
    }
  }, [show, slotName, isJewelry, isWeapon]);

  const handleSave = async () => {
    if (!name) return;
    
    if (equipItem) {
      await equipItem({
        buildId,
        slot: slotName,
        name: name,
        trait: trait
      });
    } else {
      console.error("Błąd: Funkcja equipItem nie została znaleziona w useBuildStore!");
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered data-bs-theme="dark">
      <Modal.Header closeButton className="border-secondary component-bg">
        <Modal.Title className="text-light">Edytuj: {slotName}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="component-bg text-light">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nazwa Przedmiotu / Setu</Form.Label>
            <Form.Control 
              type="text" 
              placeholder={isArmor ? "np. Relequen" : "np. Pillar of Nirn"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="bg-dark text-light border-secondary"
            />
          </Form.Group>

          {isWeapon && (
            <Form.Group className="mb-3">
              <Form.Label>Typ Broni</Form.Label>
              <Form.Select 
                className="bg-dark text-light border-secondary"
                onChange={(e) => setWeaponType(e.target.value)}
                value={weaponType}
              >
                <option value="">-- Wybierz typ --</option>
                <optgroup label="Two-Handed">
                  <option value="Greatsword">Greatsword</option>
                  <option value="Battle Axe">Battle Axe</option>
                  <option value="Maul">Maul</option>
                  <option value="Bow">Bow</option>
                  <option value="Inferno Staff">Inferno Staff</option>
                  <option value="Lightning Staff">Lightning Staff</option>
                  <option value="Ice Staff">Ice Staff</option>
                  <option value="Restoration Staff">Restoration Staff</option>
                </optgroup>
                <optgroup label="One-Handed">
                  <option value="Dagger">Dagger</option>
                  <option value="Sword">Sword</option>
                  <option value="Axe">Axe</option>
                  <option value="Mace">Mace</option>
                  <option value="Shield">Shield</option>
                </optgroup>
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Cecha (Trait)</Form.Label>
            <Form.Select 
              value={trait} 
              onChange={(e) => setTrait(e.target.value)}
              className="bg-dark text-light border-secondary"
            >
              {/* ARMOR TRAITS */}
              {isArmor && (
                <>
                  <option>Divines</option>
                  <option>Impenetrable</option>
                  <option>Infused</option>
                  <option>Intricate</option>
                  <option>Invigorating</option>
                  <option>Nirnhoned</option>
                  <option>Ornate</option>
                  <option>Reinforced</option>
                  <option>Sturdy</option>
                  <option>Training</option>
                  <option>Well-fitted</option>
                </>
              )}

              {/* WEAPON TRAITS */}
              {isWeapon && (
                <>
                  <option>Charged</option>
                  <option>Decisive</option>
                  <option>Defending</option>
                  <option>Infused</option>
                  <option>Intricate</option>
                  <option>Nirnhoned</option>
                  <option>Ornate</option>
                  <option>Powered</option>
                  <option>Precise</option>
                  <option>Sharpened</option>
                  <option>Training</option>
                </>
              )}

              {/* JEWELRY TRAITS */}
              {isJewelry && (
                <>
                  <option>Arcane</option>
                  <option>Bloodthirsty</option>
                  <option>Harmony</option>
                  <option>Healthy</option>
                  <option>Infused</option>
                  <option>Intricate</option>
                  <option>Ornate</option>
                  <option>Protective</option>
                  <option>Robust</option>
                  <option>Swift</option>
                  <option>Triune</option>
                </>
              )}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-secondary component-bg">
        <Button variant="secondary" onClick={handleClose}>Anuluj</Button>
        <Button variant="primary" onClick={handleSave}>Zapisz</Button>
      </Modal.Footer>
    </Modal>
  );
};