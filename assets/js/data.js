/*
 * Conteúdo do portfólio.
 * Para adicionar um projeto, certificado ou habilidade, basta incluir um item
 * na lista correspondente — o site monta os cards e os modais sozinho.
 *
 * Textos traduzidos usam { pt: '...', en: '...' }. Campos com um texto só
 * (nomes de tecnologias, comandos) aparecem iguais nos dois idiomas.
 */

const CONTACT = {
  linkedin: 'https://www.linkedin.com/in/pedro-henrique-340358433',
  email: 'pedrohenriquesademaria@gmail.com'
};

const COURSE = {
  name: { pt: 'Tecnólogo em Segurança Cibernética', en: 'Technologist Degree in Cybersecurity' },
  school: 'FIAP',
  start: '2026-08-01',
  end: '2028-12-31',
  semesters: 5
};

const CATALOG = {
  projects: [
    {
      id: 'secscan',
      title: 'SecScan',
      short: 'SCAN',
      art: 'scan',
      match: 99,
      year: '2026',
      kind: { pt: 'Projeto pessoal', en: 'Personal project' },
      length: { pt: 'CLI em Python', en: 'Python CLI' },
      blurb: {
        pt: 'Toolkit de auditoria de segurança que encontra portas abertas, falhas em aplicações web e CVEs, e gera relatórios em PDF e JSON.',
        en: 'Security auditing toolkit that finds open ports, web application flaws and CVEs, and generates PDF and JSON reports.'
      },
      tags: { pt: ['Python', 'Auditoria', 'Web', 'Relatórios'], en: ['Python', 'Auditing', 'Web', 'Reports'] },
      synopsis: {
        pt: 'Uma ferramenta de linha de comando, modular, para auditar redes, aplicações web, dependências e o próprio sistema, com foco em detecção e não em ataque. O netscan descobre portas abertas e identifica os serviços; o webscan analisa uma aplicação web e aponta headers de segurança ausentes, cookies sem as flags HttpOnly e SameSite e, de forma opcional, possíveis XSS refletidos; o cvecheck verifica CVEs conhecidas nos pacotes Python; e o sysaudit revisa contas, firewall e serviços do Windows local. Cada achado vem com severidade e recomendação de correção, e o resultado pode ser salvo em JSON ou em um relatório PDF com gráfico de severidade.',
        en: 'A modular command-line tool for auditing networks, web applications, dependencies and the local system, focused on detection rather than attack. netscan discovers open ports and identifies services; webscan analyzes a web application and flags missing security headers, cookies without the HttpOnly and SameSite flags and, optionally, possible reflected XSS; cvecheck looks for known CVEs in Python packages; and sysaudit reviews accounts, firewall and services on local Windows. Every finding comes with a severity and a remediation tip, and results can be saved as JSON or as a PDF report with a severity chart.'
      },
      learned: {
        pt: [
          'Limitar o escopo: a ferramenta só aceita alvos em rede privada, localhost ou na allowlist e recusa o resto',
          'Identificar headers de segurança que faltam, como CSP, X-Frame-Options e X-Content-Type-Options',
          'Testar XSS refletido de forma segura, só quando ativado e com um marcador inofensivo',
          'Classificar achados por severidade e escrever recomendações de correção',
          'Gerar relatórios em PDF com gráficos e saída em JSON para integrar com outras ferramentas'
        ],
        en: [
          'Enforcing scope: the tool only accepts targets on private networks, localhost or an allowlist, and refuses everything else',
          'Spotting missing security headers such as CSP, X-Frame-Options and X-Content-Type-Options',
          'Testing for reflected XSS safely, only when enabled and with a harmless marker',
          'Ranking findings by severity and writing remediation advice',
          'Generating PDF reports with charts and JSON output to integrate with other tools'
        ]
      },
      tech: ['Python 3', 'requests', 'reportlab', 'matplotlib', 'pytest', { pt: 'Flask (app de teste)', en: 'Flask (test app)' }],
      video: 'assets/video/demo-secscan.mp4',
      links: [],
      code: ['$ secscan netscan 127.0.0.1 --ports 22,80,3306', '[INFO] Porta 3306/tcp aberta (MySQL)', '$ secscan webscan http://127.0.0.1:5000', '[MEDIO] Header ausente: Content-Security-Policy', '[ALTO] Possível XSS refletido no parâmetro q', '$ secscan netscan 8.8.8.8', 'Erro: alvo não autorizado']
    },
    {
      id: 'fim',
      title: { pt: 'Monitor de Integridade de Arquivos', en: 'File Integrity Monitor' },
      short: 'FIM',
      art: 'hash',
      match: 98,
      year: '2026',
      kind: { pt: 'Projeto em grupo', en: 'Group project' },
      length: { pt: 'CLI em Python', en: 'Python CLI' },
      blurb: {
        pt: 'Ferramenta de linha de comando, no estilo Tripwire, que detecta arquivos criados, alterados ou removidos.',
        en: 'Tripwire-style command-line tool that detects created, modified or deleted files.'
      },
      tags: ['Python', 'SHA-256', 'CLI', 'Blue Team'],
      synopsis: {
        pt: 'Desenvolvido em grupo para a disciplina Coding for Security, na FIAP. O monitor cria uma linha de base com o hash de cada arquivo de um diretório e, nas verificações seguintes, compara o estado atual com essa referência. Qualquer arquivo novo, modificado ou apagado aparece no relatório, o mesmo princípio usado por ferramentas como o Tripwire para revelar alterações não autorizadas.',
        en: 'Built as a group project for the Coding for Security course at FIAP. The monitor creates a baseline with the hash of every file in a directory and, on each later check, compares the current state against it. Any new, modified or deleted file shows up in the report, the same principle tools like Tripwire use to reveal unauthorized changes.'
      },
      learned: {
        pt: [
          'Como hashes criptográficos garantem a integridade, o "I" da tríade CIA',
          'Criar e proteger uma linha de base confiável antes de monitorar',
          'Estruturar uma ferramenta CLI em Python com argumentos e relatórios legíveis',
          'Dividir tarefas e revisar código em equipe usando Git'
        ],
        en: [
          'How cryptographic hashes guarantee integrity, the "I" in the CIA triad',
          'Creating and protecting a trusted baseline before monitoring',
          'Structuring a Python CLI tool with arguments and readable reports',
          'Splitting tasks and reviewing code as a team with Git'
        ]
      },
      tech: ['Python 3', 'hashlib', 'argparse', 'JSON', 'Git'],
      // Vídeo de demonstração exibido no modal do projeto
      video: 'assets/video/demo-fim.mp4',
      links: [],
      code: {
        pt: ['$ python fim.py --baseline ./etc', '[+] 214 arquivos registrados', '$ python fim.py --check ./etc', '[!] MODIFICADO  passwd', '[!] NOVO        cron.d/job', '[-] REMOVIDO    hosts.bak'],
        en: ['$ python fim.py --baseline ./etc', '[+] 214 files registered', '$ python fim.py --check ./etc', '[!] MODIFIED  passwd', '[!] NEW       cron.d/job', '[-] DELETED   hosts.bak']
      }
    },
    {
      id: 'packet-tracer',
      title: { pt: 'Laboratório de Segurança de Redes', en: 'Network Security Lab' },
      short: 'NETLAB',
      art: 'net',
      match: 95,
      year: '2026',
      kind: { pt: 'Projeto pessoal', en: 'Personal project' },
      length: 'Cisco Packet Tracer',
      blurb: {
        pt: 'Rede corporativa simulada com segmentação por VLANs, listas de acesso e endurecimento dos equipamentos.',
        en: 'Simulated corporate network with VLAN segmentation, access lists and device hardening.'
      },
      tags: ['Packet Tracer', 'VLAN', 'ACL', 'Hardening'],
      synopsis: {
        pt: 'Um laboratório montado no Cisco Packet Tracer para praticar a defesa de uma rede pequena. A topologia separa setores em VLANs diferentes, controla o tráfego entre elas com ACLs e aplica boas práticas de configuração nos switches e roteadores: senhas criptografadas, acesso remoto por SSH no lugar do Telnet e port security nas portas de acesso.',
        en: 'A lab built in Cisco Packet Tracer to practice defending a small network. The topology splits departments into separate VLANs, controls traffic between them with ACLs and applies configuration best practices on switches and routers: encrypted passwords, remote access over SSH instead of Telnet, and port security on access ports.'
      },
      learned: {
        pt: [
          'Segmentar uma rede para limitar o alcance de um incidente',
          'Escrever ACLs padrão e estendidas e testar o que elas realmente bloqueiam',
          'Desativar serviços inseguros e trocar Telnet por SSH',
          'Documentar a topologia para que outra pessoa consiga manter a rede'
        ],
        en: [
          'Segmenting a network to limit the blast radius of an incident',
          'Writing standard and extended ACLs and testing what they actually block',
          'Disabling insecure services and replacing Telnet with SSH',
          'Documenting the topology so someone else can maintain the network'
        ]
      },
      tech: ['Cisco Packet Tracer', 'Cisco IOS', 'VLAN', 'ACL', 'SSH', 'Port Security'],
      links: [],
      // Capturas do laboratório exibidas no modal do projeto
      images: [
        {
          src: 'assets/img/lab-topologia.jpg',
          alt: { pt: 'Topologia no Packet Tracer: roteador 2911 ligado a um switch 2960 com quatro PCs e um servidor', en: 'Packet Tracer topology: a 2911 router connected to a 2960 switch with four PCs and a server' },
          caption: { pt: 'Topologia: roteador 2911, switch 2960, quatro PCs e um servidor', en: 'Topology: 2911 router, 2960 switch, four PCs and a server' }
        },
        {
          src: 'assets/img/lab-ssh.jpg',
          alt: { pt: 'Terminal com ping bem-sucedido para 192.168.10.11 e acesso SSH ao switch exibindo o banner de acesso restrito', en: 'Terminal with a successful ping to 192.168.10.11 and SSH access to the switch showing the restricted access banner' },
          caption: { pt: 'Ping entre VLANs e acesso SSH ao switch com banner de acesso restrito', en: 'Inter-VLAN ping and SSH access to the switch with a restricted access banner' }
        },
        {
          src: 'assets/img/lab-acl.jpg',
          alt: { pt: 'Terminal com ping liberado para 192.168.30.10, ping bloqueado para 192.168.20.11 e SSH recusado no roteador', en: 'Terminal with ping allowed to 192.168.30.10, ping blocked to 192.168.20.11 and SSH refused on the router' },
          caption: { pt: 'ACL em ação: tráfego liberado para uma VLAN, bloqueado para outra e SSH recusado no roteador', en: 'ACL in action: traffic allowed to one VLAN, blocked to another, and SSH refused on the router' }
        }
      ],
      code: ['C:\\>ping 192.168.30.10', 'Reply from 192.168.30.10: TTL=127', 'C:\\>ping 192.168.20.11', 'Destination host unreachable.', 'C:\\>ssh -l admin 192.168.99.2', 'ACESSO RESTRITO - Somente pessoal autorizado']
    },
    {
      id: 'apampesp',
      title: 'App APAMPESP',
      short: 'APP',
      art: 'app',
      match: 96,
      year: '2026',
      kind: { pt: 'App mobile', en: 'Mobile app' },
      length: 'React Native + Expo',
      // Projetos em primeira versão mostram o selo e o aviso de atualizações
      version: 'v1.0',
      blurb: {
        pt: 'Aplicativo para associados com carteirinha digital, reservas e convênios, construído com segurança desde o login.',
        en: 'Members app with a digital ID card, bookings and partner benefits, built with security from the login screen up.'
      },
      tags: { pt: ['React Native', 'TypeScript', 'Biometria', 'Secure Storage'], en: ['React Native', 'TypeScript', 'Biometrics', 'Secure Storage'] },
      synopsis: {
        pt: 'Aplicativo mobile para os associados da APAMPESP, com carteirinha digital, notícias, convênios, reserva da colônia de férias, pagamentos via Pix e contato com as regionais. Como os dados são pessoais, a segurança entrou no projeto desde o começo: o login é bloqueado temporariamente após tentativas erradas, o app pode exigir digital, rosto ou senha do celular para abrir, a sessão expira por inatividade e as informações sensíveis ficam guardadas no armazenamento seguro do aparelho.',
        en: 'Mobile app for APAMPESP members, with a digital ID card, news, partner benefits, holiday resort bookings, Pix payments and contact with regional offices. Since it handles personal data, security was part of the project from the start: login is temporarily locked after failed attempts, the app can require fingerprint, face or the phone passcode to open, sessions expire after inactivity and sensitive data is kept in the device\'s secure storage.'
      },
      learned: {
        pt: [
          'Bloquear o login após 5 tentativas erradas, com tempo de espera que dobra a cada novo bloqueio (de 5 até 60 minutos)',
          'Usar biometria e a senha do aparelho para proteger o acesso ao app',
          'Encerrar a sessão automaticamente depois de 15 minutos em segundo plano',
          'Guardar dados sensíveis com o Secure Store em vez de armazenamento comum',
          'Validar formulários com Zod para não confiar em dados de entrada'
        ],
        en: [
          'Locking login after 5 failed attempts, with a wait time that doubles on each new lockout (from 5 up to 60 minutes)',
          'Using biometrics and the device passcode to protect access to the app',
          'Ending the session automatically after 15 minutes in the background',
          'Storing sensitive data with Secure Store instead of regular storage',
          'Validating forms with Zod instead of trusting input data'
        ]
      },
      tech: ['React Native', 'Expo', 'TypeScript', 'Expo Router', 'React Query', 'Zod', 'Expo Secure Store', 'Expo Local Authentication'],
      video: 'assets/video/demo-apampesp.mp4',
      links: [],
      code: ['const MAX_TENTATIVAS = 5;', 'const DURACAO_BASE_MINUTOS = 5;', 'const DURACAO_MAXIMA_MINUTOS = 60;', 'const LIMITE_INATIVIDADE_MS = 15 * 60 * 1000;', 'SecureStore.getItemAsync(key)']
    },
    {
      id: 'inventario',
      title: { pt: 'Inventário de TI Corporativo', en: 'Corporate IT Inventory' },
      short: 'INV',
      art: 'inv',
      match: 94,
      year: '2026',
      kind: { pt: 'Sistema web', en: 'Web system' },
      length: 'React + Node.js + MySQL',
      version: 'v1.0',
      blurb: {
        pt: 'Dashboard para controlar hardware, licenças de software, equipamentos de rede e chamados de manutenção.',
        en: 'Dashboard to track hardware, software licenses, network equipment and maintenance tickets.'
      },
      tags: ['React', 'Node.js', 'MySQL', 'REST API'],
      synopsis: {
        pt: 'Sistema de inventário de tecnologia para empresas, com um dashboard central e módulos de hardware, software e licenças, rede e infraestrutura, manutenção e chamados, fornecedores, compras e relatórios. O backend é uma API REST em Node.js com Express e Sequelize sobre MySQL, e o frontend é feito em React com Vite e Ant Design. Saber exatamente quais ativos existem, onde estão e quando suas licenças vencem é o primeiro passo para proteger um ambiente.',
        en: 'An IT inventory system for companies, with a central dashboard and modules for hardware, software and licenses, network and infrastructure, maintenance and tickets, suppliers, purchases and reports. The backend is a REST API in Node.js with Express and Sequelize on MySQL, and the frontend is built in React with Vite and Ant Design. Knowing exactly which assets exist, where they are and when their licenses expire is the first step to protecting an environment.'
      },
      learned: {
        pt: [
          'Modelar um banco relacional com hardware, licenças, dispositivos de rede e histórico de manutenção',
          'Construir uma API REST organizada em rotas, controllers e models',
          'Montar um dashboard com indicadores a partir dos dados da API',
          'Entender por que o inventário de ativos é a base da gestão de segurança'
        ],
        en: [
          'Modeling a relational database with hardware, licenses, network devices and maintenance history',
          'Building a REST API organized into routes, controllers and models',
          'Putting together a KPI dashboard from the API data',
          'Understanding why asset inventory is the foundation of security management'
        ]
      },
      roadmap: {
        pt: [
          'Login com JWT e perfis de acesso (admin, técnico e leitura)',
          'Exportação de relatórios e alertas de vencimento de licenças',
          'Filtros avançados e anexos',
          'App mobile usando a mesma API'
        ],
        en: [
          'JWT login and access roles (admin, technician and read-only)',
          'Report export and license expiration alerts',
          'Advanced filters and attachments',
          'Mobile app using the same API'
        ]
      },
      tech: ['React', 'Vite', 'Ant Design', 'Node.js', 'Express', 'Sequelize', 'MySQL'],
      video: 'assets/video/demo-inventario.mp4',
      links: [],
      code: {
        pt: ['$ npm run dev', 'API em http://localhost:3001', 'GET /api/dashboard/resumo', 'GET /api/hardware', 'GET /api/licencas', 'GET /api/chamados'],
        en: ['$ npm run dev', 'API on http://localhost:3001', 'GET /api/dashboard/resumo', 'GET /api/hardware', 'GET /api/licencas', 'GET /api/chamados']
      }
    }
  ],

  certs: [
    {
      id: 'rh124',
      title: 'Red Hat System Administration I',
      short: 'RH124',
      art: 'cert',
      match: 97,
      year: { pt: 'out/2026', en: 'Oct 2026' },
      kind: 'Red Hat Academy',
      length: { pt: '40 horas', en: '40 hours' },
      blurb: {
        pt: 'Fundamentos de administração do Red Hat Enterprise Linux, do terminal ao gerenciamento de serviços.',
        en: 'Red Hat Enterprise Linux administration fundamentals, from the terminal to service management.'
      },
      tags: ['Linux', 'RHEL', 'Bash', 'systemd'],
      synopsis: {
        pt: 'Curso oficial RH124 da Red Hat Academy, concluído em outubro de 2026 com carga de 40 horas. Cobre as tarefas essenciais de quem administra servidores Linux, uma base indispensável para qualquer trabalho de segurança: é no servidor que se aplicam permissões, se leem logs e se encontram os sinais de um ataque.',
        en: 'The official RH124 course from Red Hat Academy, completed in October 2026 with 40 hours of coursework. It covers the essential tasks of a Linux server administrator, an indispensable foundation for any security work: the server is where permissions are enforced, logs are read and the signs of an attack are found.'
      },
      learned: {
        pt: [
          'Navegar e gerenciar arquivos pela linha de comando',
          'Administrar usuários, grupos e permissões de arquivos',
          'Controlar processos e serviços com systemd',
          'Configurar acesso remoto seguro com SSH',
          'Analisar e armazenar logs do sistema',
          'Instalar e atualizar pacotes de software'
        ],
        en: [
          'Navigating and managing files from the command line',
          'Managing users, groups and file permissions',
          'Controlling processes and services with systemd',
          'Configuring secure remote access with SSH',
          'Analyzing and storing system logs',
          'Installing and updating software packages'
        ]
      },
      tech: ['RHEL', 'Bash', 'systemd', 'SSH', 'journalctl', 'dnf'],
      // Se tiver o link da credencial (Credly, por exemplo), coloque aqui com primary: true
      links: [],
      code: ['[pedro@rhel ~]$ sudo useradd -m analista', '[pedro@rhel ~]$ chmod 640 relatorio.log', '[pedro@rhel ~]$ systemctl status sshd', '[pedro@rhel ~]$ journalctl -u sshd --since today']
    }
  ],

  skills: [
    {
      id: 'programacao', title: { pt: 'Programação', en: 'Programming' }, level: 65, episode: 7, icon: 'code', image: 'assets/img/skill-programacao.jpg',
      blurb: { pt: 'Desenvolvimento full stack: sistemas web e apps mobile do banco de dados até a interface.', en: 'Full stack development: web systems and mobile apps from the database to the interface.' },
      tags: ['PHP', 'JavaScript', 'TypeScript', 'HTML', 'CSS']
    },
    {
      id: 'python', title: 'Python', level: 60, episode: 6, icon: 'py', image: 'assets/img/skill-python.jpg',
      blurb: { pt: 'Scripts de automação e ferramentas de segurança, como o monitor de integridade.', en: 'Automation scripts and security tools, like the file integrity monitor.' },
      tags: { pt: ['hashlib', 'argparse', 'automação'], en: ['hashlib', 'argparse', 'automation'] }
    },
    {
      id: 'linux', title: 'Linux', level: 65, episode: 7, icon: 'linux', image: 'assets/img/skill-linux.jpg',
      blurb: { pt: 'Administração de RHEL: usuários, permissões, serviços, SSH e logs.', en: 'RHEL administration: users, permissions, services, SSH and logs.' },
      tags: ['RHEL', 'Bash', 'systemd']
    },
    {
      id: 'redes', title: { pt: 'Redes', en: 'Networking' }, level: 55, episode: 6, icon: 'net', image: 'assets/img/lab-topologia.jpg',
      blurb: { pt: 'Modelo OSI e TCP/IP, endereçamento, VLANs e roteamento básico.', en: 'OSI and TCP/IP models, addressing, VLANs and basic routing.' },
      tags: { pt: ['TCP/IP', 'VLAN', 'sub-redes'], en: ['TCP/IP', 'VLAN', 'subnetting'] }
    },
    {
      id: 'packet', title: 'Cisco Packet Tracer', level: 60, episode: 6, icon: 'cisco', image: 'assets/img/lab-acl.jpg',
      blurb: { pt: 'Simulação de topologias, configuração de IOS e testes de ACL.', en: 'Topology simulation, IOS configuration and ACL testing.' },
      tags: ['Cisco IOS', 'ACL', 'SSH']
    },
    {
      id: 'infosec', title: { pt: 'Segurança da Informação', en: 'Information Security' }, level: 50, episode: 5, icon: 'shield', image: 'assets/img/skill-infosec.jpg',
      blurb: { pt: 'Tríade CIA, gestão de riscos, controles de acesso e hardening.', en: 'CIA triad, risk management, access control and hardening.' },
      tags: { pt: ['CIA', 'riscos', 'hardening'], en: ['CIA', 'risk', 'hardening'] }
    }
  ],

  soon: [
    {
      id: 'rh134',
      title: 'Red Hat System Administration II',
      short: 'RH134',
      image: 'assets/img/soon-rh134.jpg',
      art: 'soon',
      year: { pt: 'Próxima temporada', en: 'Next season' },
      kind: 'Red Hat Academy',
      length: { pt: 'Em planejamento', en: 'Planned' },
      blurb: {
        pt: 'Continuação do RH124: automação com scripts, SELinux, armazenamento e firewall.',
        en: 'The follow-up to RH124: scripting automation, SELinux, storage and firewall.'
      },
      tags: ['Linux', 'SELinux', 'firewalld'],
      synopsis: {
        pt: 'O próximo passo depois do RH124. Aprofunda a administração do RHEL com foco em temas que pesam muito em segurança, como SELinux, firewalld e agendamento de tarefas.',
        en: 'The next step after RH124. It goes deeper into RHEL administration, focusing on topics that matter a lot for security, such as SELinux, firewalld and task scheduling.'
      },
      learned: [],
      tech: ['RHEL', 'SELinux', 'firewalld', 'Bash'],
      links: []
    },
    {
      id: 'secplus',
      title: 'CompTIA Security+',
      short: 'SEC+',
      image: 'assets/img/soon-secplus.jpg',
      art: 'soon',
      year: { pt: 'Próxima temporada', en: 'Next season' },
      kind: { pt: 'Certificação', en: 'Certification' },
      length: { pt: 'Em estudo', en: 'Studying' },
      blurb: {
        pt: 'A certificação de entrada mais pedida em vagas de segurança.',
        en: 'The most requested entry-level certification in security job postings.'
      },
      tags: { pt: ['Ameaças', 'Riscos', 'Governança'], en: ['Threats', 'Risk', 'Governance'] },
      synopsis: {
        pt: 'Estudo para a Security+, que cobre ameaças e vulnerabilidades, arquitetura segura, operações de segurança e governança. É a base teórica que conecta tudo o que estou praticando.',
        en: 'Studying for Security+, which covers threats and vulnerabilities, secure architecture, security operations and governance. It is the theoretical foundation that ties together everything I am practicing.'
      },
      learned: [],
      tech: { pt: ['Fundamentos', 'Gestão de riscos', 'Resposta a incidentes'], en: ['Fundamentals', 'Risk management', 'Incident response'] },
      links: []
    },
    {
      id: 'soc',
      title: { pt: 'Trilha de analista SOC', en: 'SOC Analyst Path' },
      short: 'SOC',
      image: 'assets/img/soon-soc.jpg',
      art: 'soon',
      year: { pt: 'Próxima temporada', en: 'Next season' },
      kind: { pt: 'Laboratórios práticos', en: 'Hands-on labs' },
      length: { pt: 'Em estudo', en: 'Studying' },
      blurb: {
        pt: 'Análise de logs, SIEM e triagem de alertas em laboratórios práticos.',
        en: 'Log analysis, SIEM and alert triage in hands-on labs.'
      },
      tags: ['SIEM', 'Logs', 'Wireshark'],
      synopsis: {
        pt: 'Prática em plataformas de laboratório com foco no dia a dia de um analista de SOC: ler logs, investigar alertas, analisar tráfego no Wireshark e documentar o que foi encontrado.',
        en: 'Practice on lab platforms focused on the day-to-day of a SOC analyst: reading logs, investigating alerts, analyzing traffic in Wireshark and documenting findings.'
      },
      learned: [],
      tech: { pt: ['SIEM', 'Wireshark', 'Análise de logs'], en: ['SIEM', 'Wireshark', 'Log analysis'] },
      links: []
    }
  ]
};

/* Textos e destinos personalizados para cada perfil de "Quem está assistindo?" */
const PROFILES = {
  recrutador: {
    label: { pt: 'Recrutador', en: 'Recruiter' },
    target: 'projetos',
    synopsis: {
      pt: 'Estudante de Segurança Cibernética na FIAP com certificação Red Hat RH124 e projetos práticos em Python e redes. Procuro meu primeiro estágio ou vaga júnior em segurança, e aprendo rápido.',
      en: 'Cybersecurity student at FIAP with the Red Hat RH124 certification and hands-on projects in Python and networking. I am looking for my first internship or junior security role, and I learn fast.'
    }
  },
  dev: {
    label: 'Dev/Tech',
    target: 'habilidades',
    synopsis: {
      pt: 'Python para ferramentas de defesa, Linux no dia a dia e redes configuradas na mão no Packet Tracer. Por aqui o foco é Blue Team: integridade, segmentação e hardening.',
      en: 'Python for defensive tools, Linux every day and networks configured by hand in Packet Tracer. The focus here is Blue Team: integrity, segmentation and hardening.'
    }
  },
  curioso: {
    label: { pt: 'Curioso', en: 'Curious' },
    target: 'sobre',
    synopsis: {
      pt: 'Sou estudante de Segurança Cibernética e decidi ficar do lado de quem defende. Esta é a primeira temporada da minha série, e você pode acompanhar cada episódio.',
      en: 'I am a cybersecurity student who chose to be on the defending side. This is the first season of my series, and you can follow every episode.'
    }
  }
};

/* Frases da "legenda" que aparece no rodapé do hero */
const CAPTIONS = {
  pt: [
    '$ whoami  ->  pedro, estudante de segurança cibernética',
    '$ cat formacao.txt  ->  FIAP, ago/2026 a dez/2028',
    '$ ls certificados/  ->  RH124_red_hat_sysadmin_I',
    '$ grep -r "objetivo" .  ->  primeira vaga em cibersegurança'
  ],
  en: [
    '$ whoami  ->  pedro, cybersecurity student',
    '$ cat education.txt  ->  FIAP, Aug 2026 to Dec 2028',
    '$ ls certificates/  ->  RH124_red_hat_sysadmin_I',
    '$ grep -r "goal" .  ->  first job in cybersecurity'
  ]
};
