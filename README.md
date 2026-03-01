📘 AGENDAWEB

Sistema web de agendamentos desenvolvido como projeto da disciplina Software Product: Analysis, Specification, Project & Implementation da Faculdade Impacta.

📌 Sobre o Projeto

O AgendaWeb é uma aplicação web que permite o gerenciamento completo de agendamentos online.

O sistema possui dois perfis de acesso:

👤 Usuário comum

👨‍💼 Administrador

A plataforma possibilita criação, edição, cancelamento e controle de horários disponíveis, além de um painel administrativo para gerenciamento geral.

🚀 Funcionalidades
👤 Área do Usuário

✅ Cadastro e login

✅ Criação de agendamento

✅ Edição de agendamento

✅ Cancelamento de agendamento

✅ Listagem de agendamentos do próprio usuário

✅ Visualização de data formatada (dd/mm/aaaa)

✅ Visualização do dia da semana

✅ Integração com link direto para WhatsApp

✅ Bloqueio automático de horários já ocupados

✅ Bloqueio automático de datas lotadas

✅ Calendário interativo com Flatpickr

✅ Logout do sistema

👨‍💼 Painel Administrativo

✅ Login exclusivo para administrador

✅ Listagem completa de todos os agendamentos

✅ Exibição de:

Nome

Sobrenome

Email

WhatsApp

Data

Horário

Serviço

Status

✅ Botão de confirmar agendamento

✅ Botão de cancelar agendamento

✅ Atualização dinâmica da tabela

✅ Controle de status:

🟡 Pendente

🟢 Confirmado

🔴 Cancelado

✅ Link direto para WhatsApp do cliente

✅ Interface estilizada com CSS moderno

🛠 Tecnologias Utilizadas
Backend

Node.js

Express

MySQL

Frontend

HTML5

CSS3

JavaScript

Flatpickr (calendário interativo)


🔐 Controle de Acesso

O sistema diferencia os usuários através do campo tipo no banco de dados:

"admin" → acesso ao painel administrativo

"usuario" → acesso à área de agendamentos

📊 Regras de Negócio

Não é permitido agendar aos domingos e segundas-feiras

Horários disponíveis variam conforme o dia da semana

Não é possível agendar horário já ocupado

Datas são bloqueadas automaticamente quando atingem limite

Apenas administrador pode alterar status de agendamento
