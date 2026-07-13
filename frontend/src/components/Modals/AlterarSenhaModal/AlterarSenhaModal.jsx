import { useEffect, useState } from "react";
import { Lock, Info } from "lucide-react";
import Modal from "../../Modal/Modal";
import FormInput from "../../FormInput/FormInput";
import ActionButton from "../../ActionButton/ActionButton";
import PasswordStrength, {
  isPasswordStrong,
} from "../../PasswordStrength/PasswordStrength";
import { useToast } from "../../Toast/ToastProvider";
import authService from "../../../services/authService";
import "../modalForm.css";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

/**
 * Modal de alteração de senha (PATCH /auth/change-password).
 * Regras de força (PasswordStrength) são validação de UX no front;
 * o backend hoje exige apenas >= 6 caracteres.
 */
export default function AlterarSenhaModal({ isOpen, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY);
      setErrors({});
      setSuccess(false);
    }
  }, [isOpen]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const next = {};
    if (!form.currentPassword) next.currentPassword = "Informe sua senha atual.";
    if (!isPasswordStrong(form.newPassword))
      next.newPassword = "A senha não atende a todos os requisitos.";
    if (form.confirmPassword !== form.newPassword)
      next.confirmPassword = "As senhas não coincidem.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await authService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Senha alterada com sucesso!");
      onClose();
    } catch (err) {
      setErrors({
        currentPassword: err.response?.data?.message || "Senha atual incorreta.",
      });
    } finally {
      setLoading(false);
    }
  }

  const title = (
    <span className="mtitle">
      <span className="mtitle-icon">
        <Lock size={20} aria-hidden="true" />
      </span>
      Alterar Senha
    </span>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Para sua segurança, informe sua senha atual e escolha uma nova senha forte."
      className="modal--narrow"
    >
      {/* Enter não salva: o save só ocorre pelo clique em "Salvar". */}
      <form className="mform" onSubmit={(e) => e.preventDefault()} noValidate>
        {success && (
          <div className="mform-info mform-info--success" role="status">
            <Info size={18} aria-hidden="true" />
            <span>Senha alterada com sucesso.</span>
          </div>
        )}

        <FormInput
          label="Senha atual"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
        />

        <FormInput
          label="Nova Senha"
          name="newPassword"
          type="password"
          required
          autoComplete="new-password"
          value={form.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
        />

        <PasswordStrength password={form.newPassword} confirmPassword={form.confirmPassword} />

        <FormInput
          label="Confirmar nova senha"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <div className="mform-info">
          <Info size={18} aria-hidden="true" />
          <span>
            Após alterar sua senha, utilize a nova senha em seus próximos acessos
            ao sistema.
          </span>
        </div>

        <div className="mform-footer">
          <ActionButton variant="outline" type="button" onClick={onClose}>
            Cancelar
          </ActionButton>
          <ActionButton
            variant="orange"
            type="button"
            loading={loading}
            onClick={handleSubmit}
          >
            Salvar
          </ActionButton>
        </div>
      </form>
    </Modal>
  );
}
