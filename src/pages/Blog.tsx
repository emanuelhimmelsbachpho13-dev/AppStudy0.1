import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const MOCK_POSTS = [
  {
    id: 1,
    slug: "como-maximizar-estudos-ia",
    title: "Como maximizar seus estudos com IA",
    summary: "Descubra técnicas avançadas para transformar PDFs em material de estudo ativo em segundos.",
    date: "12 Out, 2023",
    tag: "Produtividade"
  },
  {
    id: 2,
    slug: "ciencia-repeticao-espacada",
    title: "A ciência da repetição espaçada",
    summary: "Entenda por que revisar o conteúdo em intervalos específicos é a chave para a memória de longo prazo.",
    date: "05 Out, 2023",
    tag: "Ciência"
  },
  {
    id: 3,
    slug: "resumos-automaticos-vs-manuais",
    title: "Resumos automáticos vs. Manuais",
    summary: "Uma análise comparativa sobre a eficiência de gerar resumos com inteligência artificial.",
    date: "28 Set, 2023",
    tag: "Tecnologia"
  },
  {
    id: 4,
    slug: "futuro-educacao-personalizada",
    title: "O futuro da educação personalizada",
    summary: "Como ferramentas de IA estão permitindo que cada estudante tenha um currículo adaptado às suas necessidades.",
    date: "15 Set, 2023",
    tag: "Futuro"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-5xl font-light tracking-tight text-gradient-slim">Blog & Insights</h1>
          <p className="text-muted-foreground text-xl font-light max-w-2xl mx-auto">
            Explore artigos sobre ciência da aprendizagem, produtividade e o futuro da educação com IA.
          </p>
        </div>

        <div className="grid gap-8">
          {MOCK_POSTS.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="p-8 border border-zinc-200 hover:border-black transition-all duration-300 bg-white shadow-sm hover:shadow-md group cursor-pointer rounded-xl">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                  <Badge variant="secondary" className="bg-zinc-50 text-zinc-600 font-normal px-3 py-1 hover:bg-zinc-100">
                    {post.tag}
                  </Badge>
                  <span className="text-sm text-zinc-400 font-light">{post.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-medium mb-3 group-hover:text-black/80 transition-colors">
                  {post.title}
                </h2>
                <p className="text-zinc-500 leading-relaxed font-light text-lg">
                  {post.summary}
                </p>
                <div className="mt-6 flex items-center text-sm font-medium text-black underline decoration-1 underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ler artigo completo
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Blog;
