import Button from "../../components/Button/Button";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>

      <Button>Entrar</Button>

      <Button variant="secondary">
        Cancelar
      </Button>

      <Button variant="danger">
        Excluir
      </Button>

      <Button variant="ghost">
        Voltar
      </Button>

      <Button disabled>
        Desabilitado
      </Button>
    </div>
  );


}