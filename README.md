# Igreja Vitória - Site Institucional

Bem-vindo ao repositório oficial do site da **Igreja Vitória** (Campo Grande — MS). A interface segue o **Design System "Glow"** (tema escuro premium, acentos âmbar/azul/vermelho, tipografia Archivo/Hanken Grotesk, glassmorphism e motion em CSS), entregue pelo Claude Design e implementado como fonte da verdade do projeto.

## 🎨 Design System

As variáveis vivem em [`src/index.css`](src/index.css) (`:root`): cores (`--glow`, `--beam`, `--pulse`, superfícies `--s1..s3`), fontes (`--display`, `--head`, `--body`, `--mono`), easing e keyframes (`rise`, `kenburns`, `beamSweep`, `pulse`, `reveal`). Classes utilitárias de hover/foco (`.btn-glow`, `.lift`, `.btn-ghost`…) padronizam as interações. Mobile First, validado em 390 / 768 / 1024 / 1440 / 1920 px.

## 🚀 Tecnologias Utilizadas

*   **[React 19](https://reactjs.org/)**: Biblioteca JavaScript para construção da interface.
*   **[Vite](https://vitejs.dev/)**: Build tool rápida e leve.
*   **[React Router](https://reactrouter.com/)**: Roteamento das páginas internas.
*   **[Tailwind CSS v4](https://tailwindcss.com/)** + CSS custom properties: estilização.
*   **[Lucide React](https://lucide.dev/)**: Ícones leves e consistentes.

## 🛠️ Como Rodar o Projeto

Siga os passos abaixo para rodar o projeto em sua máquina local:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/hiagogouveia/igreja-vitoria.git
    ```

2.  **Instale as dependências:**
    ```bash
    cd igreja-vitoria
    npm install
    ```

3.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O site estará disponível em `http://localhost:5173`.

## 📦 Deploy

Este projeto está configurado para deploy fácil na **Vercel**.

1.  Crie uma conta na [Vercel](https://vercel.com/).
2.  Importe este repositório do GitHub.
3.  As configurações de rota (`vercel.json`) já estão incluídas no projeto.
4.  O deploy será automático a cada `git push`.

## 📁 Estrutura do Projeto

*   `src/components`: Componentes reutilizáveis (Navbar, Footer, Seções).
*   `src/pages`: Páginas principais (Home, CAV, Ministérios).
*   `public`: Imagens e logos estáticos.

---
Desenvolvido com excelência para o Reino.
