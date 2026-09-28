import dotenv from "dotenv"
import express from "express"
import pool from "./config/db.js"
import morgan from "morgan"
import cors from "cors"
import { ChatGroq } from "@langchain/groq"
import { tool } from "@langchain/core/tools"
import z from "zod"
import { createAgent } from "langchain"

dotenv.config()

const porta = process.env.PORTA_SERVIDOR
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

async function VerificarConexao(){
    try {
        const pegarConexao = await pool.getConnection()
        console.log("Conectado com susseco!")
        pegarConexao.release()
    } catch (error) {
        console.log(error.message)
    }
}
VerificarConexao()

const modeloGroq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0.7,
    apiKey: process.env.API_GROQ
})

const toolVerTodosProdutoS = tool(
    async function VizualizarProdutos (){
        try {
            const [pegarTodosDados] = await pool.execute(
                "select * from produtos;"
            )

            return pegarTodosDados
        } catch (error) {
            console.log(error)
        }
    },{
        name: "ToolVerTodosOsProdutos", 
        description: "utilize esta tool para vizualizar TODOS os produtos diponiveis",
        schema: z.object({})
    }
)

const toolVerProdutoPorNome = tool(
    async function VizualizarProdutos ({nome_produto}){
        try {
            const [pegarTodosDadosEspecifico] = await pool.execute(
                "select * from produtos where nome_produto = ?;",
                [nome_produto]
            )

            return String(pegarTodosDadosEspecifico)
        } catch (error) {
            console.log(error)
        }
    },{
        name: "ToolProdutosPorNome", 
        description: "utilize esta tool para vizualizar produto especifico pelo o nome do produto",
        schema: z.object({
            nome_produto: z.string()
        })
    }
)

const agentMercado = createAgent({
    model: modeloGroq,
    systemPrompt: "Voce é agente de supermercado cujo o nome do supermercado é Vende Mais sempre atenda os clientes com respeito, e que smepre convensa e tente persuadir o cliente de comprar algo, para ver todos os produtos que esta disponiveis utilize a tool: ToolVerTodosOsProdutos, e para ver um produto especifico pelo o nome utilize a tool: ToolProdutosPorNome, seja sempre curto, direto e amigavel em suas vendas!",
    tools: [
        toolVerProdutoPorNome,
        toolVerTodosProdutoS
    ]
})

const historico = []

app.post("/conversa" , async (req ,res) => {
    try {
        const { pergunta } = req.body

        historico.push({role : "user" , content: pergunta})

        const respostaAgentMercado = await agentMercado.invoke({
            messages: historico 
        })

        if(!respostaAgentMercado){
            return res.status(500).json({"Resposta": "Ocorreu um erro em nosso agent, tente novamente mais tarde!"})
        }

        historico.push({role: "assistant" , content: respostaAgentMercado.messages.at(-1).content})
        return res.status(200).json({"Resposta" : respostaAgentMercado.messages.at(-1).content})
    } catch (error) {
        console.log(error)
    }
})

app.get("/conversa/historico" , async (req , res) => {
    try {
        if(historico.length === 0){
            return res.status(404).json({"Resposta": "Nenhum usuario encontrado, faca alguma pergunta na rota /conversa e tente novamente!"})
        }
        return res.status(200).json({"Historico de conversa": historico})
    } catch (error) {
        console.log(error)
    }
})

app.use((req , res , next) => {res.status(404).json({"Resposta": "Rota não encontrada, tente novamente mais tarde!"})})

app.listen(porta , () => {
    console.log(`http://localhost:${porta}`)
})