import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Google Vision", price: 1.5, focus: "Equilíbrio" },
  { name: "Azure Vision", price: 1.0, focus: "Mais barato" },
  { name: "Amazon Textract", price: 1.5, focus: "Tabelas e Formulários" },
  { name: "OpenAI Vision", price: 7.5, focus: "Interpretação + OCR" },
  { name: "DocuClipper", price: 30, focus: "Focado em Notas Fiscais" },
  { name: "Klippa", price: 50, focus: "Alta precisão em NF" },
  { name: "Docsumo", price: 500, focus: "Alta precisão (Enterprise)" },
  { name: "Mindee", price: 0.1, focus: "Flexível para Startups" },
];

export default function DashboardOCR() {
  const [selected, setSelected] = useState("Google Vision");

  const cards = {
    "Google Vision": {
      vantagens: ["SDKs oficiais e documentação excelente", "Boa precisão em textos comuns"],
      desvantagens: ["Pode falhar em notas fiscais complexas"],
    },
    "Azure Vision": {
      vantagens: ["Preço mais baixo", "Boa integração no ecossistema Azure"],
      desvantagens: ["Menor precisão em layouts complexos"],
    },
    "Amazon Textract": {
      vantagens: ["Ótimo em tabelas e formulários", "Alta escalabilidade"],
      desvantagens: ["Custo pode crescer", "Curva de aprendizado no AWS"],
    },
    "OpenAI Vision": {
      vantagens: ["Interpreta e organiza além do OCR", "Flexibilidade via prompts"],
      desvantagens: ["Custo elevado", "Depende de engenharia de prompt"],
    },
    "DocuClipper": {
      vantagens: ["Especializado em notas fiscais", "Retorna dados estruturados prontos"],
      desvantagens: ["Pouca flexibilidade fora de NF"],
    },
    "Klippa": {
      vantagens: ["Alta precisão em NF", "Parser pronto para CNPJ, datas e totais"],
      desvantagens: ["Preço mais alto"],
    },
    "Docsumo": {
      vantagens: ["Altíssima precisão (95%+)", "Lida bem com documentos imperfeitos"],
      desvantagens: ["Custo muito alto (Enterprise)"],
    },
    "Mindee": {
      vantagens: ["APIs pré-treinadas para NF e recibos", "Flexível e adaptável"],
      desvantagens: ["Preço variável conforme volume"],
    },
  };

  const highlights = [
    { title: "💲 Melhor Custo", text: "Azure Vision (US$1 / 1.000 transações)" },
    { title: "🎯 Mais Preciso em NF", text: "Klippa / DocuClipper / Docsumo" },
    { title: "⚖️ Melhor Equilíbrio", text: "Google Vision" },
    { title: "📑 Melhor em Tabelas/Formulários", text: "Amazon Textract" },
    { title: "🤖 Mais Flexível (OCR + Interpretação)", text: "OpenAI Vision" },
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard OCR – Comparativo de Tecnologias</h1>

      {/* Gráfico de preços */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">💲 Comparação de Preços</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-25} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="price" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Tabs com detalhes */}
      <Tabs defaultValue="Google Vision" onValueChange={(v) => setSelected(v)}>
        <TabsList className="grid grid-cols-4 gap-2 mb-4">
          {Object.keys(cards).map((key) => (
            <TabsTrigger key={key} value={key}>
              {key}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(cards).map(([key, val]) => (
          <TabsContent key={key} value={key}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6">
                <CardContent className="space-y-4">
                  <h3 className="text-2xl font-semibold">{key}</h3>
                  <p className="text-sm text-gray-500">Foco: {data.find((d) => d.name === key)?.focus}</p>

                  <div>
                    <h4 className="font-semibold mb-1">✅ Vantagens</h4>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      {val.vantagens.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-1">⚠️ Desvantagens</h4>
                    <ul className="list-disc ml-6 text-sm space-y-1">
                      {val.desvantagens.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Resumo visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {highlights.map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Card className="p-4 shadow-md rounded-2xl">
              <h4 className="text-lg font-bold mb-2">{h.title}</h4>
              <p className="text-sm text-gray-700">{h.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
