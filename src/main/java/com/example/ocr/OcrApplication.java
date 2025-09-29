package com.example.ocr;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.*;

@SpringBootApplication
@RestController
public class OcrApplication {

    public static void main(String[] args) {
        SpringApplication.run(OcrApplication.class, args);
    }

    @PostMapping("/upload")
    public Map<String, String> uploadNota(@RequestParam("file") MultipartFile file) throws IOException {
        System.out.println("✅ Recebendo arquivo: " + file.getOriginalFilename());
        System.out.println("📁 Tipo do arquivo: " + file.getContentType());
        System.out.println("📊 Tamanho: " + file.getSize() + " bytes");

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Arquivo vazio!");
        }

        // Criar arquivo temporário com a extensão correta
        String originalFilename = file.getOriginalFilename();
        String extension = "jpg"; // padrão

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        }

        File tempFile = File.createTempFile("nota", "." + extension);
        file.transferTo(tempFile);

        System.out.println("📄 Arquivo temporário: " + tempFile.getAbsolutePath());

        Tesseract tesseract = new Tesseract();

        try {
            tesseract.setDatapath("C:\\Program Files\\Tesseract-OCR\\tessdata");
            tesseract.setLanguage("eng"); // Use inglês por enquanto
            tesseract.setPageSegMode(1);
            tesseract.setOcrEngineMode(1);

            System.out.println("🔍 Iniciando OCR no arquivo: " + tempFile.getAbsolutePath());
            String textoExtraido = tesseract.doOCR(tempFile);
            System.out.println("✅ OCR concluído com sucesso!");
            System.out.println("📄 Primeiros 200 caracteres: " +
                    textoExtraido.substring(0, Math.min(200, textoExtraido.length())));

            Map<String, String> dadosExtraidos = extrairDados(textoExtraido);

            // Limpar arquivo temporário
            tempFile.delete();

            return dadosExtraidos;

        } catch (Exception e) {
            System.out.println("❌ Erro no OCR: " + e.getMessage());
            e.printStackTrace();

            // Limpar arquivo em caso de erro
            if (tempFile.exists()) {
                tempFile.delete();
            }

            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Falha no processamento: " + e.getMessage());
            erro.put("dica", "Envie imagens JPG, PNG ou PDF");
            erro.put("arquivo_enviado", originalFilename);
            erro.put("tipo_arquivo", file.getContentType());
            return erro;
        }
    }

    private Map<String, String> extrairDados(String texto) {
        Map<String, String> dados = new HashMap<>();

        // CNPJ (ex: 12.345.678/0001-90)
        Matcher cnpj = Pattern.compile("\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}").matcher(texto);
        if (cnpj.find()) {
            dados.put("CNPJ", cnpj.group());
            System.out.println("🔍 CNPJ encontrado: " + cnpj.group());
        }

        // Data (ex: 24/09/2025)
        Matcher data = Pattern.compile("\\d{2}/\\d{2}/\\d{4}").matcher(texto);
        if (data.find()) {
            dados.put("Data", data.group());
            System.out.println("🔍 Data encontrada: " + data.group());
        }

        // Valor (ex: R$ 1.234,56)
        Matcher valor = Pattern.compile("R\\$\\s?\\d{1,3}(?:\\.\\d{3})*,\\d{2}").matcher(texto);
        if (valor.find()) {
            dados.put("Valor", valor.group());
            System.out.println("🔍 Valor encontrado: " + valor.group());
        }

        // Nome (procura por padrões comuns em notas)
        Matcher nome = Pattern.compile("(?i)(nome:|cliente:)\\s*([A-ZÀ-Ú\\s]+)").matcher(texto);
        if (nome.find()) {
            dados.put("Nome", nome.group(2).trim());
            System.out.println("🔍 Nome encontrado: " + nome.group(2));
        }

        dados.put("TextoCompleto", texto.length() > 500 ? texto.substring(0, 500) + "..." : texto);

        return dados;
    }

    // Endpoint de teste para verificar se a API está no ar
    @GetMapping("/status")
    public String status() {
        return "✅ API OCR está funcionando!";
    }

    @GetMapping("/teste-tesseract")
    public String testarTesseract() {
        try {
            Tesseract tesseract = new Tesseract();

            // Testar caminhos possíveis
            String[] paths = {
                    "C:\\Program Files\\Tesseract-OCR\\tessdata",
                    "C:\\Program Files\\Tesseract-OCR",
                    "tessdata"
            };

            StringBuilder resultado = new StringBuilder();
            resultado.append("🔍 Testando configuração do Tesseract:\n");

            for (String path : paths) {
                File dir = new File(path);
                resultado.append("\nCaminho: ").append(path);
                resultado.append("\nExiste: ").append(dir.exists());
                resultado.append("\nÉ diretório: ").append(dir.isDirectory());

                if (dir.exists() && dir.isDirectory()) {
                    File[] files = dir.listFiles((d, name) -> name.endsWith(".traineddata"));
                    resultado.append("\nArquivos .traineddata: ").append(files != null ? files.length : 0);
                    if (files != null) {
                        for (File f : files) {
                            resultado.append("\n  - ").append(f.getName());
                        }
                    }
                }
                resultado.append("\n---");
            }

            return resultado.toString();

        } catch (Exception e) {
            return "❌ Erro no teste: " + e.getMessage();
        }
    }
}