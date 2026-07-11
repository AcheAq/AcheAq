import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnuncioForm from "../../components/AnuncioForm/AnuncioForm";
import { useToast } from "../../components/Toast/ToastProvider";
import userService from "../../services/userService";
import categoryService from "../../services/categoryService";
import itemService from "../../services/itemService";
import "./NovoAnuncio.css";

export default function NovoAnuncio() {
  const navigate = useNavigate();
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      categoryService.getAll().catch(() => []),
      userService.getMe().catch(() => null),
    ]).then(([cats, me]) => {
      if (!active) return;
      setCategories(cats);
      setUser(me);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(formData) {
    setApiError("");
    setSubmitting(true);
    try {
      const created = await itemService.create(formData);
      toast.success("Anúncio publicado com sucesso!");
      navigate(created?.id ? `/item/${created.id}` : "/meus-anuncios");
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Não foi possível publicar o anúncio. Tente novamente.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="nova">
      <div className="nova-hero">
        <div className="nova-hero-inner">
          <h1>Novo Anúncio</h1>
          <p>Preencha as informações abaixo para publicar um objeto perdido ou encontrado.</p>
        </div>
      </div>

      <div className="nova-body">
        <AnuncioForm
          mode="create"
          categories={categories}
          currentUser={user}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          submitting={submitting}
          apiError={apiError}
        />
      </div>
    </div>
  );
}
