import "./deleteBotaniste.css"

export default function DeleteBotaniste({ closeModal }) {
  const handleDelete = () => {
    closeModal();
  };

  return (
    <div>
      <button onClick={handleDelete}>Supprimer</button>
      <button onClick={handleDelete}>Fermer</button>
    </div>
  );
}
