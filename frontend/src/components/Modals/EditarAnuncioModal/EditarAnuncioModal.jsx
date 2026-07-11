import { useState } from "react";
import { Pencil } from "lucide-react";
import Modal from "../../Modal/Modal";
import AnuncioForm from "../../AnuncioForm/AnuncioForm";
import { useToast } from "../../Toast/ToastProvider";
import itemService from "../../../services/itemService";
import "../modalForm.css";

/**
 * Edição de anúncio reutilizando o AnuncioForm (PATCH /item/:id).
 * A foto só é reenviada se o usuário escolher um novo arquivo.
 */
export default function EditarAnuncioModal({
  isOpen,
  onClose,
  item,
  categories = [],
  currentUser = null,
  onUpdated,
}) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleSubmit(formData) {
    setApiError("");
    setSubmitting(true);
    try {
      const updated = await itemService.update(item.id, formData);
      toast.success("Anúncio atualizado com sucesso!");
      onUpdated?.(updated);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Não foi possível salvar as alterações. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const title = (
    <span className="mtitle">
      <span className="mtitle-icon">
        <Pencil size={20} aria-hidden="true" />
      </span>
      Editar Anúncio
    </span>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Atualize as informações do objeto sempre que necessário."
    >
      <AnuncioForm
        mode="edit"
        item={item}
        categories={categories}
        currentUser={currentUser}
        lockContact
        submitting={submitting}
        apiError={apiError}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
