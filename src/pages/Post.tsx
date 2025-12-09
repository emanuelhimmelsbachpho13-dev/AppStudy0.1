import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data (in a real app, this would come from an API or MDX files)
const POSTS = {
  "como-maximizar-estudos-ia": {
    title: "Como maximizar seus estudos com IA",
    date: "12 Out, 2023",
    author: "Equipe AppStudy",
    tag: "Produtividade",
    content: `
      <p class="mb-6 text-lg leading-relaxed text-zinc-600 font-light">
        A inteligência artificial transformou radicalmente a maneira como processamos informações. No contexto educacional, ferramentas capazes de sintetizar grandes volumes de texto em conceitos-chave são o novo "superpoder" dos estudantes de alto desempenho.
      </p>

      <h2 class="text-2xl font-medium mt-8 mb-4 text-black">Aprendizagem Ativa vs. Passiva</h2>
      <p class="mb-6 text-lg leading-relaxed text-zinc-600 font-light">
        A leitura passiva de um PDF tem uma taxa de retenção baixa (cerca de 10%). Ao transformar esse conteúdo em um quiz interativo, você força seu cérebro a praticar a <strong class="text-black font-medium">recuperação ativa</strong>. Estudos mostram que testar a si mesmo é uma das formas mais eficazes de fixar conhecimento a longo prazo.
      </p>

      <h2 class="text-2xl font-medium mt-8 mb-4 text-black">O Papel do AppStudy</h2>
      <p class="mb-6 text-lg leading-relaxed text-zinc-600 font-light">
        Nossa plataforma automatiza esse processo. Em vez de gastar horas criando flashcards manuais, você pode fazer upload do seu material e começar a praticar em segundos. Isso libera tempo para o que realmente importa: a compreensão profunda dos tópicos mais complexos.
      </p>
    `
  },
  "ciencia-repeticao-espacada": {
    title: "A ciência da repetição espaçada",
    date: "05 Out, 2023",
    author: "Dr. Roberto Silva",
    tag: "Ciência",
    content: `
      <p class="mb-6 text-lg leading-relaxed text-zinc-600 font-light">
        A curva do esquecimento de Ebbinghaus nos ensina que esquecemos cerca de 50% do que aprendemos em apenas 24 horas. A única maneira de combater isso é através da revisão estratégica.
      </p>

      <h2 class="text-2xl font-medium mt-8 mb-4 text-black">Como funciona?</h2>
      <p class="mb-6 text-lg leading-relaxed text-zinc-600 font-light">
        A repetição espaçada envolve revisar o material em intervalos crescentes: 1 dia, 3 dias, 1 semana, 1 mês. Cada revisão "reseta" a curva do esquecimento, tornando a memória mais duradoura.
      </p>
    `
  }
};

const Post = () => {
  const { slug } = useParams();
  const post = slug ? POSTS[slug as keyof typeof POSTS] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-light mb-4">Post não encontrado</h1>
          <Link to="/blog">
            <Button variant="outline">Voltar para o Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center text-sm text-zinc-400 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Link>

        <article>
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 bg-zinc-100 text-zinc-600 hover:bg-zinc-200">{post.tag}</Badge>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-zinc-500 border-b border-zinc-100 pb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </div>
            </div>
          </div>

          <div
            className="prose prose-lg prose-zinc max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </div>
  );
};

export default Post;
