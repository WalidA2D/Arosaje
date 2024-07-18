import "./deleteBotaniste.css"

export default function DeleteBotaniste({ closeModalDelete }) {
  const handleDelete = () => {
    closeModalDelete();
  };

  return (
    <div>

      <button onClick={handleDelete}>Supprimer</button>
      <button onClick={closeModalDelete}>Fermer</button>
    </div>
  );
}
