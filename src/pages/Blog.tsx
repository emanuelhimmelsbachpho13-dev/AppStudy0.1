import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MOCK_POSTS = [
  {
    id: 1,
    title: "Como maximizar seus estudos com IA",
    summary: "Descubra técnicas avançadas para transformar PDFs em material de estudo ativo em segundos.",
    date: "12 Out, 2023",
    tag: "Produtividade"
  },
  {
    id: 2,
    title: "A ciência da repetição espaçada",
    summary: "Entenda por que revisar o conteúdo em intervalos específicos é a chave para a memória de longo prazo.",
    date: "05 Out, 2023",
    tag: "Ciência"
  },
  {
    id: 3,
    title: "Resumos automáticos vs. Manuais",
    summary: "Uma análise comparativa sobre a eficiência de gerar resumos com inteligência artificial.",
    date: "28 Set, 2023",
    tag: "Tecnologia"
  },
  {
    id: 4,
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
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Blog & Recursos</h1>
          <p className="text-muted-foreground text-lg">
            Dicas, tutoriais e artigos sobre aprendizagem acelerada.
          </p>
        </div>

        <div className="grid gap-6">
          {MOCK_POSTS.map((post) => (
            <Card key={post.id} className="p-6 border border-border hover:border-primary/50 transition-colors bg-card shadow-sm hover:shadow-md group cursor-pointer">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-2">
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-normal">
                  {post.tag}
                </Badge>
                <span className="text-sm text-muted-foreground">{post.date}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 group-hover:underline decoration-1 underline-offset-4">
                {post.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {post.summary}
              </p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Blog;
