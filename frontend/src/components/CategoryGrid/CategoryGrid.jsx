import {
  Briefcase,
  Smartphone,
  Key,
  FileText,
  CupSoda,
  BookOpen,
  Headphones,
  Grid
} from "lucide-react";

import "./CategoryGrid.css";


const categoriasDefault = [
  {
    name: "Mochilas",
    query: "Mochilas",
    icon: Briefcase
  },
  {
    name: "Celulares",
    query: "Celulares",
    icon: Smartphone
  },
  {
    name: "Chaves",
    query: "Chaves",
    icon: Key
  },
  {
    name: "Documentos",
    query: "Documentos",
    icon: FileText
  },
  {
    name: "Livros",
    query: "Livros",
    icon: BookOpen
  },
  {
    name: "Garrafas",
    query: "Garrafas",
    icon: CupSoda
  },
  {
    name: "Fones",
    query: "Fones",
    icon: Headphones
  },
  {
    name: "Outros",
    query: "Outros",
    icon: Grid
  }
];


function CategoryGrid({
  categories = categoriasDefault,
  onSelectCategory
}) {

  return (

    <section className="category-section">

      <div className="category-header">

        <div>

          <span className="category-tag">
            Explore por tipo
          </span>


          <h2>
            Categorias de objetos
          </h2>


          <p>
            Encontre rapidamente o que você está buscando.
          </p>

        </div>


        <a href="/objetos-encontrados">
          Ver todas →
        </a>


      </div>


      <div className="categories-grid">

        {categories.map((cat,index)=>{

          const Icon = cat.icon;


          return (

            <button
              key={index}
              className="category-item"
              onClick={() =>
                onSelectCategory &&
                onSelectCategory(cat.query)
              }
            >

              <div className="category-icon-box">

                <Icon size={20}/>

              </div>


              <span>
                {cat.name}
              </span>


            </button>

          )

        })}

      </div>


    </section>

  );
}


export default CategoryGrid;