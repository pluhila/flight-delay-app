import React from 'react';

interface SideMenuProps {
  open: boolean;
  onClear: () => void;
  onSecret: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClear, onSecret }) => {
  return (
    <div className={`side-menu${open ? ' open' : ''}`}>
      <button className="side-menu-btn" onClick={onClear}>Clear Result</button>
      <button className="side-menu-btn" onClick={onSecret}>Secret Stuff</button>
    </div>
  );
};

export default SideMenu;
