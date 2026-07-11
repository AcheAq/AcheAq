import { useEffect, useRef, useState } from "react";
import { User, Camera } from "lucide-react";
import Modal from "../../Modal/Modal";
import FormInput from "../../FormInput/FormInput";
import ActionButton from "../../ActionButton/ActionButton";
import { useToast } from "../../Toast/ToastProvider";
import userService from "../../../services/userService";
import "../modalForm.css";

const BIO_MAX = 60;

/**
 * Modal de edição de perfil. Persiste apenas os campos suportados pelo
 * backend (PATCH /user/me). Foto e Biografia são apenas visuais (o backend
 * não possui campos/endpoint para eles) — ver pontos de coordenação.
 */
export default function EditarPerfilModal({ isOpen, onClose, user, onUpdated }) {
  const fileInputRef = useRef(null);
  const toast = useToast();
  const [form, setForm] = useState(mapUser(user));
  const [bio, setBio] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(mapUser(user));
      setErrors({});
      setApiError("");
    }
  }, [isOpen, user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handlePhotoPick(event) {
    const file = event.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Informe o nome.";
    if (!form.email.trim()) next.email = "Informe o e-mail.";
    if (!form.phone.trim()) next.phone = "Informe o telefone.";
    if (!form.institution.trim()) next.institution = "Informe a instituição.";
    if (!form.course.trim()) next.course = "Informe o curso.";
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError("");
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
      const updated = await userService.updateMe({
        name: form.name,
        email: form.email,
        phone: form.phone,
        institution: form.institution,
        course: form.course,
        registration: form.registration,
      });
      toast.success("Perfil atualizado com sucesso!");
      onUpdated(updated);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Não foi possível salvar as alterações. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  const title = (
    <span className="mtitle">
      <span className="mtitle-icon">
        <User size={20} aria-hidden="true" />
      </span>
      Editar Perfil
    </span>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="modal--narrow">
      {/* Enter não salva: o save só ocorre pelo clique em "Salvar". */}
      <form className="mform" onSubmit={(e) => e.preventDefault()} noValidate>
        {apiError && (
          <div className="mform-alert" role="alert">
            {apiError}
          </div>
        )}

        <div className="mform-photo">
          <div className="mform-photo-avatar">
            {photoPreview ? (
              <img src={photoPreview} alt="Pré-visualização do avatar" />
            ) : (
              <span aria-hidden="true">
                {(form.name || "?").charAt(0).toUpperCase()}
              </span>
            )}
            <button
              type="button"
              className="mform-photo-cam"
              aria-label="Alterar foto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={16} aria-hidden="true" />
            </button>
          </div>
          <div className="mform-photo-buttons">
            <button
              type="button"
              className="mform-photo-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              Alterar foto
            </button>
            <button
              type="button"
              className="mform-photo-btn mform-photo-btn--muted"
              onClick={() => setPhotoPreview(null)}
            >
              Remover
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePhotoPick}
          />
        </div>

        <FormInput
          label="Nome Completo"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />

        <div className="mform-grid">
          <FormInput
            label="Email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <FormInput
            label="Telefone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />
        </div>

        <div className="mform-grid">
          <FormInput
            label="Instituição de Ensino"
            name="institution"
            required
            value={form.institution}
            onChange={handleChange}
            error={errors.institution}
          />
          <FormInput
            label="Curso"
            name="course"
            required
            placeholder="Ex.: Ciência da Computação"
            value={form.course}
            onChange={handleChange}
            error={errors.course}
          />
        </div>

        <FormInput
          label="Matrícula"
          name="registration"
          value={form.registration}
          onChange={handleChange}
          helperText="Opcional"
        />

        <div>
          <label className="mform-textarea-label" htmlFor="edit-bio">
            Biografia <span>(opcional)</span>
          </label>
          <textarea
            id="edit-bio"
            className="mform-textarea"
            maxLength={BIO_MAX}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Fale um pouco sobre você."
          />
          <p className="mform-counter">
            {bio.length}/{BIO_MAX}
          </p>
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

function mapUser(user) {
  return {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    institution: user?.institution || "",
    course: user?.course || "",
    registration: user?.registration || "",
  };
}
