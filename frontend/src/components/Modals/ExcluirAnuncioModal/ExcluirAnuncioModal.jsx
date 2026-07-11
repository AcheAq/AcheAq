import { useState } from "react";
import { Trash2, Info } from "lucide-react";
import Modal from "../../Modal/Modal";
import ActionButton from "../../ActionButton/ActionButton";
import ItemMiniCard from "../ItemMiniCard";
import { useToast } from "../../Toast/ToastProvider";
import itemService from "../../../services/itemService";
import "../modalForm.css";

/**
 * Confirmação de exclusão de anúncio (DELETE /item/:id).
 */
export default function ExcluirAnuncioModal({ isOpen, onClose, item, onDeleted }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");
    setLoading(true);
    try {
      await itemService.remove(item.id);
      toast.success("Anúncio excluído.");
      onDeleted?.(item);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Não foi possível excluir o anúncio. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  const title = (
    <span className="mtitle">
      <span className="mtitle-icon mtitle-icon--danger">
        <Trash2 size={20} aria-hidden="true" />
      </span>
      Excluir anúncio
    </span>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="modal--narrow">
      <div className="mform">
        {error && (
          <div className="mform-alert" role="alert">
            {error}
          </div>
        )}

        <p className="mform-lead">
          Tem certeza de que deseja excluir este anúncio? Esta ação removerá
          permanentemente o anúncio da plataforma e não poderá ser desfeita.
        </p>

        <ItemMiniCard item={item} />

        <div className="mform-alert">
          <Info size={16} aria-hidden="true" style={{ verticalAlign: "-3px" }} /> Esta
          ação é permanente e não pode ser desfeita. Todos os dados relacionados a
          este anúncio serão removidos.
        </div>

        <div className="mform-footer">
          <ActionButton variant="outline" type="button" onClick={onClose}>
            Cancelar
          </ActionButton>
          <ActionButton variant="danger" type="button" loading={loading} onClick={handleDelete}>
            Excluir
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
