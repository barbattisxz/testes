📄 Projeto OCR - Leitura de Notas Fiscais

Este projeto é uma API em Java com Spring Boot que utiliza Tesseract OCR (via biblioteca Tess4J) para extrair informações de notas fiscais.
Ele consegue identificar e retornar dados como:

📅 Data

🏢 CNPJ

👤 Nome (ex: estabelecimento ou cliente)

💳 Número do cartão (quando presente na fatura/notas)

⚙️ Tecnologias Utilizadas

Java 17

Spring Boot 3.x

Tess4J (wrapper para Tesseract OCR)

Maven

📥 Instalação
1. Clonar o repositório
git clone https://github.com/seu-usuario/ocr-projeto.git
cd ocr-projeto

2. Instalar dependências

O Maven cuidará disso:

mvn clean install

3. Instalar o Tesseract OCR

Windows

Baixe o instalador: Tesseract no GitHub

Instale em C:\Program Files\Tesseract-OCR

Adicione ao PATH:

C:\Program Files\Tesseract-OCR

Linux (Ubuntu/Debian)

sudo apt update
sudo apt install tesseract-ocr
sudo apt install libtesseract-dev


Verificar instalação

tesseract -v

▶️ Como rodar
1. Iniciar a API
mvn spring-boot:run

2. Testar no navegador

A API roda por padrão em:

http://localhost:8080

📡 Endpoints
🔹 Upload de Nota Fiscal

POST /api/ocr/upload

Envia uma imagem de nota fiscal e retorna os campos extraídos.

Exemplo (cURL):
curl -X POST http://localhost:8080/api/ocr/upload \
  -F "file=@nota-fiscal.png"

Resposta (JSON):
{
  "data": "24/09/2025",
  "cnpj": "12.345.678/0001-99",
  "nome": "Supermercado Exemplo",
  "cartao": "**** **** **** 1234"
}

📜 Expressões Regulares Usadas

Data:

\b\d{2}[\/\-]\d{2}[\/\-]\d{4}\b


CNPJ:

\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b


Número de Cartão (últimos 4 dígitos):

(?:\d{4}[ -]?){3}\d{4}


Nome (genérico, letras e espaços):

[A-Za-zÀ-ÖØ-öø-ÿ\s]{3,}

🌐 Front-end (opcional)

Para adicionar uma interface gráfica, você pode:

Criar um React ou Angular que envia imagens para a API.

Usar um simples HTML + JavaScript com fetch para chamar o endpoint /api/ocr/upload.

📌 Próximos Passos

Melhorar regex para capturar diferentes formatos de CNPJ e cartões.

Adicionar persistência em banco de dados (ex: PostgreSQL).

Criar autenticação JWT para proteger a API.
