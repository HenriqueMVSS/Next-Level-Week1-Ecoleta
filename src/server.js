const express = require("express") //linha para usar o express para iniciar o servidor.
const server = express()

//pegar o banco de dados

const db = require("./database/db")

// configurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body 
server.use(express.urlencoded({extended:true}))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true   //não utiliza cash
})



// configurar caminhos da minha aplicação
// pagina inicial
// req é a requisição
// res é uma resposta
server.get("/", function (req, res) {
  //__dirname variavel global que não precisa declarar, ele devolve qual o caminho completo que vc quer ter acesso.
  return res.render("index.html", { title: "Um título" })
})  //sendFile - Evie um arquivo

server.get("/create-point", function (req, res) {
  // req.query: Query strings da nossa url
  

  return res.render("create-point.html")
})

server.post("/savepoint",(req, res)=>{
  // req.body é o corpo do formulário
  

  //inserir dados no banco de dados
  const query = `
     INSERT INTO places (
       image,
       name,
       address,
       address2,
       state,
       city,
       items 
     ) VALUES (?,?,?,?,?,?,?);
     `
    const values = [
      req.body.image,
      req.body.name,
      req.body.address,
      req.body.address2,
      req.body.state,
      req.body.city,
      req.body.items,

    ]

    function afterInsertData(err){
      if(err){
        return console.log(err)
      }

      console.log("Cadastrado com sucesso")
      console.log(this)
      return res.render("create-point.html",{saved: true})
    }

    db.run(query, values, afterInsertData) // essa linha que inseri itens na tabela
  
})

server.get("/search-results", function (req, res) {

  const search = req.query.search

  if(search == ""){
    //pesquisa vazia
    return res.render("search-results.html", {total: 0})
  }


  //pegar os dados do banco de dados
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
          if(err){
            console.log(err)
            return res.send("Erro no cadastro!")
          }

          const total = rows.length
          // mostrar a pagina html com os dados do banco de dados
          return res.render("search-results.html", {places: rows, total: total})
        })

  
})
//ligar o servidor
server.listen(3000)
