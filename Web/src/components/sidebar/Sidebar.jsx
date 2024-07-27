import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import './sidebar.css';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AddBotaniste from './components/AddBotaniste';
import DeleteBotaniste from './components/DeleteBotaniste';

export default function Sidebar() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false); // State pour le modal de suppression

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModalDelete = () => {
    setModalDeleteIsOpen(true);
  };

  const closeModalDelete = () => {
    setModalDeleteIsOpen(false);
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <HomeIcon className="sidebarIcon" />
            <Link to="/" className="sidebarListItemText">Accueil</Link>
          </li>
          <li className="sidebarListItem">
            <GroupAddIcon className="sidebarIcon" />
            <Link className="sidebarListItemText" onClick={openModal}>Ajouter un botaniste</Link>
          </li>
          <li className="sidebarListItem">
            <PersonRemoveIcon className="sidebarIcon" />
            <Link className="sidebarListItemText" onClick={openModalDelete}>Supprimer un botaniste</Link>
          </li>
          <li className="sidebarListItem">
            <SettingsIcon className="sidebarIcon" />
            <Link to="/settings" className="sidebarListItemText">Paramètres</Link>
          </li>
          <li className="sidebarListItem">
            <DashboardCustomizeIcon className="sidebarIcon" />
            <Link to="/dashboard" className="sidebarListItemText">Dashboard</Link>
          </li>
          <li className="sidebarListItem">
            <ExitToAppIcon className="sidebarIcon" />
            <Link to="/login" className="sidebarListItemText">Déconnexion</Link>
          </li>
        </ul>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Ajouter un botaniste"
      >
        <AddBotaniste closeModal={closeModal} />
      </Modal>

      <Modal
        isOpen={modalDeleteIsOpen}
        onRequestClose={closeModalDelete}
        contentLabel="Supprimer un botaniste"
      >
        <DeleteBotaniste closeModal={closeModalDelete}/>
      </Modal>
    </div>
  );
}