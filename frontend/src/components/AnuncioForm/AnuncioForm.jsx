import { useEffect, useRef, useState } from "react";
import { Box, UploadCloud, Lock } from "lucide-react";
import FormInput from "../FormInput/FormInput";
import ActionButton from "../ActionButton/ActionButton";
import { useToast } from "../Toast/ToastProvider";
import CustomDatePicker from "../CustomDatePicker/CustomDatePicker";
import CustomTimePicker from "../CustomTimePicker/CustomTimePicker";
import CustomSelect from "../CustomSelect/CustomSelect";
import { imageUrl } from "../../utils/imageUrl";
import "./AnuncioForm.css";

// Extrai "YYYY-MM-DD" e "HH:MM" de uma data ISO (para edição).
function splitDateTime(iso) {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "", time: "" };
  const pad = (n) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

function initialState(item) {
  const dt = splitDateTime(item?.occurrenceDate);
  return {
    type: (item?.type || "LOST").toUpperCase(),
    title: item?.title || "",
    categoryId: item?.categoryId || item?.category?.id || "",
    description: item?.description || "",
    location: item?.location || "",
    date: dt.date,
    time: dt.time,
    observations: item?.observations || "",
  };
}

/**
 * Formulário reutilizável de anúncio (Novo e Editar).
 * Monta um FormData multipart e chama onSubmit(formData).
 * A foto só é enviada quando o usuário escolhe um novo arquivo.
 */
export default function AnuncioForm({
  mode = "create",
  item = null,
  currentUser = null,
  categories = [],
  onSubmit,
  onCancel,
  submitting = false,
  apiError = "",
  submitLabel,
  lockContact = false,
}) {
  const fileRef = useRef(null);
  const formRef = useRef(null);
  const toast = useToast();
  const [form, setForm] = useState(() => initialState(item));
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(item?.photoUrl ? imageUrl(item.photoUrl) : null);
  const [dragOver, setDragOver] = useState(false);
  const [allowContact, setAllowContact] = useState(true);

  useEffect(() => {
    setForm(initialState(item));
    setPreview(item?.photoUrl ? imageUrl(item.photoUrl) : null);
    setFile(null);
    setErrors({});
    setAllowContact(item?.allowContact !== undefined ? item.allowContact : true);
  }, [item]);

  function set(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleChange(e) {
    set(e.target.name, e.target.value);
  }

  function pickFile(selected) {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, image: "Selecione um arquivo de imagem." }));
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, image: "A imagem deve ter no máximo 5 MB." }));
      return;
    }
    setErrors((p) => ({ ...p, image: undefined }));
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function removePhoto() {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Informe o nome do objeto.";
    if (!form.categoryId) next.categoryId = "Selecione uma categoria.";
    if (!form.description.trim()) next.description = "Descreva o objeto.";
    if (!form.location.trim()) {
      next.location = "Informe o local.";
    } else if (form.location.trim().length <= 3) {
      next.location = "O local deve ter mais de 3 caracteres.";
    }
    if (!form.date) next.date = "Informe a data de ocorrência.";
    if (mode === "create" && !file) next.image = "Adicione uma foto do objeto.";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).filter((k) => v[k]).length > 0) {
      // Feedback claro em vez de "botão sem efeito": avisa e leva ao 1º erro.
      toast.error("Preencha os campos obrigatórios destacados.");
      setTimeout(() => {
        const el = formRef.current?.querySelector(
          '[aria-invalid="true"], .af-select.is-error, .af-textarea.is-error, .af-drop.is-error, .cdp-trigger.is-error, .ctp-trigger.is-error, .cs-trigger.is-error',
        );
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus?.();
      }, 30);
      return;
    }

    const occurrenceDate = new Date(
      `${form.date}T${form.time || "00:00"}:00`,
    ).toISOString();

    const fd = new FormData();
    fd.append("type", form.type);
    fd.append("title", form.title);
    fd.append("categoryId", form.categoryId);
    fd.append("description", form.description);
    fd.append("location", form.location);
    fd.append("occurrenceDate", occurrenceDate);
    fd.append("allowContact", allowContact);
    if (form.observations) fd.append("observations", form.observations);
    if (file) fd.append("image", file);

    onSubmit(fd);
  }

  return (
    // Enter não publica/salva: a ação só ocorre pelo clique no botão.
    <form ref={formRef} className="af" onSubmit={(e) => e.preventDefault()} noValidate>
      {apiError && (
        <div className="af-alert" role="alert">
          {apiError}
        </div>
      )}

      {/* Tipo de anúncio */}
      <h2 className="af-h2">Tipo de Anúncio</h2>
      <div className="af-toggle" role="group" aria-label="Tipo de anúncio">
        <button
          type="button"
          className={`af-toggle-btn ${form.type === "LOST" ? "is-active" : ""}`}
          aria-pressed={form.type === "LOST"}
          onClick={() => set("type", "LOST")}
        >
          Objeto Perdido
        </button>
        <button
          type="button"
          className={`af-toggle-btn ${form.type === "FOUND" ? "is-active" : ""}`}
          aria-pressed={form.type === "FOUND"}
          onClick={() => set("type", "FOUND")}
        >
          Objeto Encontrado
        </button>
      </div>

      <div className="af-grid">
        <div className="af-main">
          {/* Informações do objeto */}
          <section className="af-card">
            <h3 className="af-card-title">
              <Box size={18} aria-hidden="true" /> Informações do Objeto
            </h3>

            <FormInput
              label="Nome do objeto"
              name="title"
              required
              placeholder="Ex.: Mochila Azul da Kipling"
              value={form.title}
              onChange={handleChange}
              error={errors.title}
            />

            <CustomSelect
              label="Categoria"
              required
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              value={form.categoryId}
              onChange={(val) => set("categoryId", val)}
              error={errors.categoryId}
              placeholder="Selecione uma categoria"
            />

            <div className="af-field">
              <label className="af-label" htmlFor="af-desc">
                Descrição <span aria-hidden="true">*</span>
              </label>
              <div className="af-char-count-wrapper">
                <textarea
                  id="af-desc"
                  name="description"
                  className={`af-textarea ${errors.description ? "is-error" : ""}`}
                  placeholder="Descreva o objeto com detalhes."
                  value={form.description}
                  onChange={handleChange}
                  aria-invalid={errors.description ? "true" : undefined}
                />
                <span
                  className={`af-char-count ${
                    form.description.trim().length >= 10 ? "is-valid" : "is-invalid"
                  }`}
                >
                  {form.description.trim().length} / 10 caracteres mínimos
                </span>
              </div>
              {errors.description && (
                <p className="af-error" role="alert">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="af-row">
              <FormInput
                label="Local"
                name="location"
                required
                placeholder="Ex.: Bloco A, Sala 202"
                value={form.location}
                onChange={handleChange}
                error={errors.location}
              />
              <CustomDatePicker
                label="Data de ocorrência"
                required
                value={form.date}
                onChange={(val) => set("date", val)}
                error={errors.date}
              />
            </div>

            <div className="af-row af-row--half">
              <CustomTimePicker
                label="Horário"
                helperText="Opcional"
                value={form.time}
                onChange={(val) => set("time", val)}
              />
            </div>
          </section>

          {/* Foto */}
          <section className="af-card">
            <h3 className="af-card-title">
              <Box size={18} aria-hidden="true" /> Foto do objeto
            </h3>

            <div
              className={`af-drop ${dragOver ? "is-drag" : ""} ${errors.image ? "is-error" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
            >
              <UploadCloud size={28} aria-hidden="true" />
              <p className="af-drop-title">Arraste e solte uma imagem aqui</p>
              <p className="af-drop-sub">ou clique para selecionar do computador</p>
              <p className="af-drop-hint">JPG ou PNG • máx. 5 MB</p>
              <ActionButton
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
              >
                Selecionar arquivo
              </ActionButton>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
            </div>
            {errors.image && (
              <p className="af-error" role="alert">
                {errors.image}
              </p>
            )}

            {preview && (
              <div className="af-preview">
                <img src={preview} alt="Pré-visualização do objeto" />
                <div className="af-preview-info">
                  <strong>{file?.name || "Imagem atual"}</strong>
                  <small>{file ? "Pronta para upload" : "Já publicada"}</small>
                </div>
                <div className="af-preview-actions">
                  <ActionButton
                    type="button"
                    variant="orange"
                    onClick={() => fileRef.current?.click()}
                  >
                    Alterar
                  </ActionButton>
                  <ActionButton type="button" variant="outline" onClick={removePhoto}>
                    Remover
                  </ActionButton>
                </div>
              </div>
            )}
          </section>

          {/* Observações */}
          <section className="af-card">
            <h3 className="af-card-title">
              <Box size={18} aria-hidden="true" /> Observações do Objeto
            </h3>
            <div className="af-field">
              <label className="af-label" htmlFor="af-obs">
                Informações adicionais <span className="af-muted">(opcional)</span>
              </label>
              <textarea
                id="af-obs"
                name="observations"
                className="af-textarea"
                placeholder="Ex.: Possui adesivos na capa, foi encontrado próximo à biblioteca..."
                value={form.observations}
                onChange={handleChange}
              />
            </div>
          </section>
        </div>

        {/* Contato (aside) */}
        <aside className="af-aside">
          <section className="af-card">
            <h3 className="af-card-title af-card-title--center">
              Informações de Contato
            </h3>
            <p className="af-contact-note">
              <Lock size={13} aria-hidden="true" /> Seu contato vem do seu perfil.
            </p>

            <FormInput
              label="Responsável"
              value={currentUser?.name || ""}
              disabled
              placeholder="Nome responsável"
            />
            <FormInput
              label="Email"
              value={currentUser?.email || ""}
              disabled
              placeholder="exemplo@email.com"
            />
            <FormInput
              label="Telefone"
              value={currentUser?.phone || ""}
              disabled
              placeholder="(00) 00000-0000"
            />

            <label className="af-check">
              <input
                type="checkbox"
                checked={allowContact}
                onChange={(e) => setAllowContact(e.target.checked)}
              />
              <span>Permitir que outras pessoas entrem em contato comigo.</span>
            </label>
          </section>

          <section className="af-tips">
            <strong>Dicas para um bom anúncio</strong>
            <ul>
              <li>Seja específico na descrição do objeto.</li>
              <li>Adicione uma foto de qualidade.</li>
              <li>Informe o local exato.</li>
              <li>Mantenha seu contato atualizado.</li>
            </ul>
          </section>
        </aside>
      </div>

      <div className="af-footer">
        <ActionButton type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </ActionButton>
        <ActionButton
          type="button"
          variant="orange"
          loading={submitting}
          onClick={handleSubmit}
        >
          {submitLabel || (mode === "edit" ? "Salvar Alterações" : "Publicar Anúncio")}
        </ActionButton>
      </div>
    </form>
  );
}
