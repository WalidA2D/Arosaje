import './sidebar.css';
import { Link } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <HomeIcon className="sidebarIcon" />
            <Link to="/" className="sidebarListItemText">Accueil</Link>
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
    </div>
  );
}
