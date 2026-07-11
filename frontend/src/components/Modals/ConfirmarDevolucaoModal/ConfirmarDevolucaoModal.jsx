import { useEffect, useState } from "react";
import { CheckCircle2, Info } from "lucide-react";
import Modal from "../../Modal/Modal";
import ActionButton from "../../ActionButton/ActionButton";
import ItemMiniCard from "../ItemMiniCard";
import { useToast } from "../../Toast/ToastProvider";
import itemService from "../../../services/itemService";
import "../modalForm.css";

function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Confirmação de devolução (PATCH /item/:id/resolve) com data e nota.
 */
export default function ConfirmarDevolucaoModal({ isOpen, onClose, item, onResolved }) {
  const toast = useToast();
  const [returnedAt, setReturnedAt] = useState(today());
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReturnedAt(today());
      setNote("");
      setError("");
    }
  }, [isOpen]);

  async function handleConfirm() {
    setError("");
    setLoading(true);
    try {
      const updated = await itemService.resolve(item.id, {
        returnedAt: new Date(`${returnedAt}T00:00:00`).toISOString(),
        returnNote: note || undefined,
      });
      toast.success("Devolução confirmada!");
      onResolved?.(updated);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Não foi possível confirmar a devolução. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  const title = (
    <span className="mtitle">
      <span className="mtitle-icon">
        <CheckCircle2 size={20} aria-hidden="true" />
      </span>
      Confirmar devolução
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
          Confirme que este objeto já foi devolvido ao seu proprietário. Após a
          confirmação, o anúncio será identificado como &apos;Devolvido&apos;.
        </p>

        <ItemMiniCard item={item} />

        <div className="mform-field">
          <label className="mform-textarea-label" htmlFor="dev-date">
            Data de devolução
          </label>
          <input
            id="dev-date"
            type="date"
            className="mform-date"
            value={returnedAt}
            onChange={(e) => setReturnedAt(e.target.value)}
          />
        </div>

        <div className="mform-field">
          <label className="mform-textarea-label" htmlFor="dev-note">
            Observação <span>(opcional)</span>
          </label>
          <textarea
            id="dev-note"
            className="mform-textarea"
            placeholder="Ex.: O objeto foi entregue na secretaria da instituição."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="mform-info mform-info--success">
          <Info size={18} aria-hidden="true" />
          <span>
            O status do anúncio será atualizado para Devolvido e ficará visível na
            plataforma como resolvido.
          </span>
        </div>

        <div className="mform-footer">
          <ActionButton variant="outline" type="button" onClick={onClose}>
            Cancelar
          </ActionButton>
          <ActionButton variant="orange" type="button" loading={loading} onClick={handleConfirm}>
            Confirmar
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
