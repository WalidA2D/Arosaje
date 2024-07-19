import "./dashboard.css"

const alerte = () => {
    alert('ss')
}

function Dashboard() {
    return (
        <div className="dashboardContainer">
            <div className="gridContainerTop">
                <button className="grid1" onClick={alerte}>
                    <div> Ajouter un botaniste</div>
                </button>
                <button className="grid2">
                    <div>Supprimer un botaniste</div>
                </button>
            </div>
            <div className="gridContainerBottom">
                <button className="grid3">
                <div>Bloquer un utilisateur</div>
                </button>
                <button className="grid4">
                <div>Débloquer un utilisateur</div>
                </button>
            </div>
        </div>
    );
}

export default Dashboard;