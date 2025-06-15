import AppHeader from '@/components/app/Header';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';
import MarkdownPreview from '@uiw/react-markdown-preview';

import './styles.scss';
import { BiArrowBack } from 'react-icons/bi';
import { ScrollArea } from '@/components/ui/scroll-area';

const About = () => {
  const navigate = useNavigate();

  const backToEditor = () => {
    navigate('/');
  };

  const md = `
# Gerencie seu arquivo hosts de forma intuitiva e prática  

O **Hosts Editor** é uma ferramenta simplificada e eficaz para editar o arquivo \`hosts\` do sistema, disponível para Windows e Linux. Ele oferece uma interface moderna e amigável, facilitando o gerenciamento de mapeamentos de IP e domínios. Ideal para desenvolvedores, administradores de sistemas e entusiastas que precisam controlar o roteamento local de nomes de domínio.  

## Funcionalidades principais:
- **Adicionar entradas:** Insira novos mapeamentos de IP e domínios de forma rápida, com suporte a descrições opcionais para organização.
- **Edição em massa:** Ative, desative ou remova várias entradas de uma só vez com apenas alguns cliques.
- **Ativar/Desativar individualmente:** Controle facilmente quais mapeamentos estão ativos sem removê-los permanentemente.
- **Comentários personalizados:** Adicione e edite comentários diretamente no aplicativo para documentar suas mudanças.

O **Hosts Editor** é projetado para tornar o processo de edição do arquivo \`hosts\` mais seguro, organizado e acessível.
`;

  return (
    <>
      <AppHeader />
      <div className="about-container">
        <ScrollArea className="scroll-area">
          <Button onClick={backToEditor}>
            <BiArrowBack /> Voltar para o Editor
          </Button>

          <hr />

          <MarkdownPreview
            source={md}
            wrapperElement={{
              'data-color-mode': 'light'
            }}
            rehypeRewrite={(node, _index, parent) => {
              const node_el = node as unknown as HTMLElement;
              const parent_el = parent as unknown as HTMLElement;
              if (node_el.tagName === 'a' && parent && /^h(1|2|3|4|5|6)/.test(parent_el.tagName)) {
                parent.children = parent.children.slice(1);
              }
            }}
          />
        </ScrollArea>
      </div>
    </>
  );
};

export default About;
