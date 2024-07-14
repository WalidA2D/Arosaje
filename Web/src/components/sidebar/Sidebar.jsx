import './sidebar.css'
import RssFeedIcon from '@mui/icons-material/RssFeed';

export default function Sidebar() {
  return (
    <div className="sidebar">
        <div className="sidebarWrapper">
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <RssFeedIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Poste</span>
            </li>
            <li className="sidebarListItem">
              <RssFeedIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Paramètres</span>
            </li>
            <li className="sidebarListItem">
              <RssFeedIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Dashboard</span>
            </li>
            <li className="sidebarListItem">
              <RssFeedIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Deconnexion</span>
            </li>
          </ul>
        </div>
    </div>
  )
}