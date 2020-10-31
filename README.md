# Locus

Um simples gerenciador que permite às empresas distribuírem seus espaços internos de acordo com as regras de distanciamento social.

Com o Locus, você cadastra os locais que pretende controlar a ocupação como mesas e áreas comuns, e um QR Code é gerado para cada local.
Os colaboradores devem escanear esses QR Codes ao chegar e sair dos locais demarcados para indicar que estes estão ocupados, permitindo um melhor controle do espaço e, consequentemente, evitando aglomerações dentro do espaço de trabalho.

Feito com [Angular](https://angular.io), [Nest JS](https://nestjs.com) e muito :heart:

## Pré requisitos

- [Docker](https://www.docker.com)

## Como utilizar

Atualmente nós executamos o Locus em containers via docker-compose. Para isso, você vai precisar de um servidor local, ou um serviço que suporte a execução de containers (ECS, App Engine, etc.).

1. Clone esse repositório
2. No terminal, execute o comando `docker-compose up`.
3. Feito. Navegue para http://localhost:4200 para visualizar o leitor de QR Codes
4. Para cadastrar um QR Code ou exibir os QR Codes disponíveis, acesse http://localhost:4200/admin
