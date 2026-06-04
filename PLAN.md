# Portfolio Glauco Developer — Guia de Implementação

## Stack técnica

| Ferramenta | Versão | Para que serve |
|---|---|---|
| Next.js | 16 | Framework React com App Router, SSR e performance |
| React | 19 | Biblioteca de UI baseada em componentes |
| TypeScript | 5 | JavaScript com tipos estáticos |
| Tailwind CSS | 4 | Estilização utility-first direto no JSX |
| Framer Motion | latest | Animações declarativas e transições suaves |
| Lucide React | latest | Ícones modernos em SVG |
| Supabase | — | Banco de dados e API (fases futuras) |

---

## Conceitos React/Next que você vai aprender por fase

### O que é um componente?
Um componente React é uma função que retorna JSX (HTML-like dentro do JavaScript).
```tsx
// Um componente simples
export function Titulo() {
  return <h1>Olá mundo</h1>
}
```

### O que é props?
Props são parâmetros que você passa para um componente, como atributos HTML.
```tsx
function Card({ titulo, texto }: { titulo: string; texto: string }) {
  return <div><h2>{titulo}</h2><p>{texto}</p></div>
}
// Uso: <Card titulo="React" texto="Biblioteca de UI" />
```

### O que é useState?
Hook para criar estado local — quando o estado muda, o componente re-renderiza.
```tsx
const [dark, setDark] = useState(false)
// dark é o valor atual, setDark é a função para mudar
```

### O que é useEffect?
Hook para efeitos colaterais (ler localStorage, fetch, timers).
```tsx
useEffect(() => {
  // roda após a renderização
  document.title = "Novo título"
}, []) // [] = roda só uma vez
```

### App Router (Next.js)
Cada `page.tsx` dentro de `src/app/` vira uma rota automaticamente:
- `src/app/page.tsx` → `/` (home)
- `src/app/sobre/page.tsx` → `/sobre`
- `src/app/projetos/page.tsx` → `/projetos`

### "use client" vs Server Component
- **Server Component** (padrão): renderiza no servidor, sem estado, sem eventos
- **"use client"**: adicionar no topo do arquivo para usar useState, useEffect, eventos

---

## Fases de implementação

### Fase 1 — Home page (atual)
- [x] Setup do projeto Next.js + TypeScript + Tailwind
- [x] Dark/Light mode com toggle
- [x] Navbar responsiva
- [x] Hero section com animações
- [x] Seção de tecnologias
- [x] Projetos em destaque
- [x] Call to action
- [x] Footer

### Fase 2 — Páginas internas
- [ ] Página /sobre com trajetória e skills
- [ ] Página /projetos com grid e filtros por categoria
- [ ] Página /contato com formulário
- [ ] Roteamento entre páginas com Link

### Fase 3 — Supabase
- [ ] Criar projeto no Supabase
- [ ] Tabela de projetos (id, titulo, descricao, tech, url, imagem)
- [ ] Tabela de mensagens do formulário de contato
- [ ] Buscar projetos dinamicamente via Server Component
- [ ] Salvar mensagens de contato

### Fase 4 — Polish e deploy
- [ ] Metadados SEO (og:image, twitter cards)
- [ ] Otimização de imagens com next/image
- [ ] Deploy na Vercel
- [ ] Domínio personalizado

---

## Estrutura de pastas

```
src/
  app/
    page.tsx          ← Home page
    layout.tsx        ← Layout global (Navbar + Footer)
    globals.css       ← Estilos globais + variáveis CSS
    sobre/
      page.tsx        ← Fase 2
    projetos/
      page.tsx        ← Fase 2
    contato/
      page.tsx        ← Fase 2
  components/
    Navbar.tsx        ← Navegação + toggle dark/light
    Footer.tsx        ← Rodapé
    ThemeProvider.tsx ← Contexto do tema
    home/
      Hero.tsx        ← Seção hero
      Technologies.tsx ← Grade de tecnologias
      Projects.tsx    ← Projetos em destaque
      CallToAction.tsx ← CTA para contato
  data/
    projects.ts       ← Dados estáticos dos projetos
    technologies.ts   ← Dados das tecnologias
  types/
    index.ts          ← Tipos TypeScript compartilhados
```

---

## Convenções do projeto

- Nomes de componentes: PascalCase (`HeroSection`, `ProjectCard`)
- Nomes de arquivos: PascalCase para componentes, camelCase para utils
- Props sempre tipadas com TypeScript
- Animações via Framer Motion com `motion.div`
- Cores via variáveis CSS para suportar dark/light
- Todos os componentes de UI são "use client" apenas se precisarem de estado
