//import express from 'express';
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const { Pool } = require('pg');
const notifier = require('node-notifier');//exibir popup na tela

//variavel que guarda o estoque do produto para verificar se tem estoque disponivel
var estoque=0;

//VARIAVEL QUE ARMAZENA O TOTAL GERAL
var total = 0.0;


// Criação do array vazio para armazenar os objetos
var listaDeObjetos = [];

//aceitando EJS
app.set('view engine', 'ejs');
app.set('views', './views');



//NECESSARIO PARA PASSAR DADOS DO FORMULARIO PARA OUTRA PAGINA
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//NECESSARIO PARA USAR O ARQUIVOS DE OUTRA PASTA
//REMOVE ERRO DE MIME TYPE CSS
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, '/')));



// Configura��o do banco de dados
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vendas',
    password: 'root',
    port: 5432, // porta padr�o do Postgres
});

// Conex�o com o banco de dados
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro ao conectar ao banco de dados', err.stack);
    }
    console.log('Conex�o estabelecida com sucesso ao banco de dados');
});

//SOBE O SERVIDOR
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


app.get('/', (req, res) => {
        total=0;
        listaDeObjetos=[];
        res.render('home', { varTitle: "Sistema de Vendas - HOME"});

    
});

app.get('/teste', (req, res) => {
    res.render('teste');


});

app.get('/relvendas', (req, res) => {
    res.render('relVendas');


});

app.get('/relvendasCarrinhoPeriodo', (req, res) => {
    res.render('relvendasCarrinhoPeriodo');


});

app.get('/rel_cliente_mais_comprou', (req, res) => {
    res.render('rel_cliente_mais_comprou');


});

//SELECT E PREENCHE a variavel 'produtos'' com o resultset
app.get('/produtos', (req, res) => {
    pool.query('SELECT * FROM produto order by codPro desc', (error, results) => {
        if (error) {
            throw error;
        }

        res.render('produtos', { varTitle: "Sistema de Vendas - Produtos", produtos: results.rows });

    });
});



//SELECT E PREENCHE a variavel 'produtos'' com o resultset Filtrado
app.post('/produtosFiltro', (req, res) => {
    var filtro=req.body.filtro;
    console.log(filtro);
    pool.query("SELECT * FROM produto where nome ilike '%"+filtro+"%'",(error, results) => {
        if (error) {
            throw error;
        }

        res.render('produtos', { varTitle: "Sistema de Vendas - Produtos", produtos: results.rows });

    });
});

//SELECT E PREENCHE a variavel 'pessoas'' com o resultset
app.get('/clientes', (req, res) => {
    pool.query('SELECT * FROM cliente order by codCli desc', (error, results) => {
        if (error) {
            throw error;
        } 

        res.render('clientes', { varTitle: "Sistema de Vendas - Clientes", pessoas: results.rows });

    });
});


//DELETAR
app.get('/deletar/:codigo', (req, res) => {
    var codigo = req.params.codigo;
    pool.query('delete from cliente where codCli=$1', [codigo],(error, results) => {
        if (error) {
            throw error;
        }

            res.redirect('/clientes');

     

    });
});

//INSERIR
app.post('/inserir', (req, res) => {
    var cols = [req.body.nome, req.body.endereco, req.body.cpf, req.body.cel];
  
    pool.query('insert into cliente (nome,endereco,cpf,cel) values($1,$2,$3,$4)', cols, (error, results) => {
        if (error) {
            throw error;
        }

        res.redirect('/clientes');



    });
});

//DELETAR PRODUTO
app.get('/deletarProduto/:codigo', (req, res) => {
    var codigo = req.params.codigo;
    pool.query('delete from produto where codPro=$1', [codigo],(error, results) => {
        if (error) {
            //throw error;
            res.render('erro', { mensagem: `Este produto não pode ser excluido!
            Ele está relacionado a outras vendas!` });
           
        }

            res.redirect('/produtos');

     

    });
});

//INSERIR PRODUTO
app.post('/inserirProduto', (req, res) => {
    //parseFloat converte para numero
    //var soma=10+parseFloat(req.body.valor);
    var cols = [req.body.nome, req.body.precovenda,req.body.precocusto,req.body.estoque];
    
    pool.query('insert into produto (nome,precovenda,precocusto,estoque) values($1,$2,$3,$4)', cols, (error, results) => {
        if (error) {
            throw error;
        }

        res.redirect('/produtos');



    });
});

//UPDATE
app.post('/alterar/:codigo', (req, res) => {
    var cols = [req.body.nome, req.body.endereco, req.body.cpf, req.body.cel,req.body.codcli]
    pool.query('update cliente set nome=$1,endereco=$2,cpf=$3, cel=$4 where codcli=$5', cols, (error, results) => {
        if (error) {
            throw error;
        }

        res.redirect('/clientes');



    });
});

app.post('/mostrar', (req, res) => {
   console.log(req.body.valor);
});


//UPDATE PRODUTO
app.post('/alterarProduto/:codigo', (req, res) => {
    var cols = [req.body.nome, req.body.valor, req.body.codigo]
    pool.query('update produto set nome=$1, valor=$2 where codPro=$3', cols, (error, results) => {
        if (error) {
            throw error;
        }

        res.redirect('/produtos');



    });
});


//CHAMA O FORM EDITAR
app.get('/editar/:codigo', (req, res) => {
    var cod = req.params.codigo;
    pool.query('SELECT * FROM cliente where codCli=$1 ',[cod], (error, results) => {
        if (error) {
            throw error;
        }

        res.render('edit', { varTitle: "Sistema de Vendas - Editar", pessoas: results.rows });

    });
});

//CHAMA O FORM EDITAR PRODUTO
app.get('/editarProduto/:codigo', (req, res) => {
    var cod = req.params.codigo;
    pool.query('SELECT * FROM produto where codPro=$1 ',[cod], (error, results) => {
        if (error) {
            throw error;
        }

        res.render('editProduto', { varTitle: "Sistema de Vendas - Editar Produto", produto: results.rows });

    });
});


//SELECT E PREENCHE a variavel 'pessoas'' com o resultset
app.get('/add', (req, res) => {

        res.render('add', { varTitle: "Sistema de Vendas - Cadastro" });

});

//SELECT E PREENCHE a variavel 'pessoas'' com o resultset
app.get('/addProdutos', (req, res) => {

    res.render('addProdutos', { varTitle: "Sistema de Vendas - Cadastro Produtos" });

});

//adiciona produtos no carrinho e verifica o estoque  antes
app.get('/addCarrinho', (req, res) => {

//recebe os parametros da URL
var codcliente = req.query.codcli;
var codproduto = req.query.codpro;
var quantidade = req.query.qtd;
var stotal = req.query.subtotal;


// Função para adicionar um novo objeto ao array
function adicionarObjeto(codcli, codpro, qtd, subtotal) {
  var novoObjeto = {
    codcli: codcli,
    codpro: codpro,
    qtd: qtd,
    subtotal: subtotal
  };

  listaDeObjetos.push(novoObjeto);
}


   //VERIFICA ESTOQUE ANTES
   pool.query('SELECT estoque FROM produto where codpro='+codproduto, (error, results) => {
   
    //pega o valor do resultado do select
    estoque = results.rows[0].estoque;
  

   if(Number(estoque) < Number(quantidade))
   {

           // Renderizar a página HTML com o novo valor do campo 'estoque'
           res.send(`
           <!DOCTYPE html>
           <html>
           <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <title>Erro: Quantidade maior do que estoque disponivel</title>
              
           </head>
           <body>
           <h1 style="position: relative; margin: 0; text-align: center;">
           Quantidade selecionada é maior do que disponivel em estoque!
           </h1>
           <br><br>
               Quantidade selecionada: ${quantidade} <br>
               Estoque disponivel: ${estoque}
         
           </body>
           </html>
           `);
           
   }else
   {
        //ADICIONA NO ARRAY
        adicionarObjeto(codcliente, codproduto, quantidade, stotal);

        //SOMA O SUBTOTAL E ARMAZENA O TOTAL GERAL DA VENDA NA VARIAL TOTAL
        total = total+parseFloat(stotal);

        console.log("tamanho lista "+listaDeObjetos.length);


        // Exemplo de exibição das informações dos objetos
        for (var i = 0; i < listaDeObjetos.length; i++) {
        var objeto = listaDeObjetos[i];
        console.log("Objeto " + (i + 1) + ":");
        console.log("Código do Cliente: " + objeto.codcli);
        console.log("Código do Produto: " + objeto.codpro);
        console.log("Quantidade: " + objeto.qtd);
        console.log("Subtotal: " + objeto.subtotal);
        console.log("----------------------");
    
        }

        console.log("total: "+total);

    }
   
    });

});

//SELECT E PREENCHE a variavel 'clientes' e 'produtos' com o resultset para prenncher os selects
app.get('/venda', async (req, res) => {
  try {
    const clientes = await pool.query('SELECT * FROM cliente');
    const produtos = await pool.query('SELECT * FROM produto');
    res.render('venda', { varTitle: "Sistema de Vendas - Venda",clientes: clientes.rows, produtos: produtos.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

//CHAMA PAGINA VENDA CARRINHO
app.get('/venda_carrinho', async (req, res) => {
    try {
      const clientes = await pool.query('SELECT * FROM cliente order by codcli desc');
      const produtos = await pool.query('SELECT * FROM produto order by codpro desc');
      res.render('venda_carrinho', { varTitle: "Sistema de Vendas - Venda",clientes: clientes.rows, produtos: produtos.rows });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  });

//INSERIR VENDA
app.post('/inserirvenda', (req, res) => {
    //parseFloat converte para numero
    //var soma=10+parseFloat(req.body.valor);
    
    //teste pegando value do select
    const selectCliente = req.body.selectcliente;
    const selectProduto = req.body.selectproduto;
    console.log('codido do cleinte selecionado:'+parseInt(selectCliente,10));
    console.log('codido do produto selecionado:'+parseInt(selectProduto,10));
    //-----------------------------------------//

    var cols = [req.body.codcli, req.body.codpro ,req.body.qtd,req.body.total];
    
    
    //VERIFICA ESTOQUE ANTES
    pool.query('SELECT estoque FROM produto where codpro='+req.body.codpro, (error, results) => {
        if (error) {
            throw error;
        }
        //pega o valor do resultado do select
        estoque = results.rows[0].estoque;


       if(Number(estoque) < Number(cols[2]))
       {
           
               // Renderizar a página HTML com o novo valor do campo 'estoque'
               res.send(`
               <!DOCTYPE html>
               <html>
               <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                    <title>Erro: Quantidade maior do que estoque disponivel</title>
                  
               </head>
               <body>
               <h1 style="position: relative; margin: 0; text-align: center;">
               Quantidade selecionada é maior do que disponivel em estoque!
               </h1>
               <br><br>
                   Quantidade selecionada: ${cols[2]} <br>
                   Estoque disponivel: ${estoque}
             
               </body>
               </html>
               `);
               
       }else
       {
           pool.query('insert into venda (cliente_codcli,produto_codpro,qtd,total) values($1,$2,$3,$4)', cols, (error, results) => {
               if (error) {
                   throw error;
               }
   
               res.redirect('/historico_vendas');
   
           });
       }
       
    });
     
});


//HISTORICO VENDAS

app.get('/historico_vendas', (req, res) => {
    pool.query("SELECT *,TO_CHAR(data_venda,'DD/MM/YYYY') as datav,cliente.nome as nome_cliente,"+
    'produto.nome as nome_produto FROM venda inner join cliente on '+
    'venda.cliente_codcli = cliente.codcli '+
    'inner join produto on produto.codpro = venda.produto_codpro '+
    'order by codvenda desc', (error, results) => {
        if (error) {
            throw error;
        } 

        res.render('historico_vendas',{resultado : results.rows});

    });
});

//HISTORICO VENDAS CARRINHO
app.get('/historico_vendas_carrinho', (req, res) => {
    pool.query("SELECT *,TO_CHAR(data_venda,'DD/MM/YYYY') as datav,cliente.nome as nome_cliente "+
    ' FROM venda inner join cliente on '+
    ' venda.cliente_codcli = cliente.codcli '+
    ' order by codvenda desc', (error, results) => {
        if (error) {
            throw error;
        } 

        res.render('historico_vendas_carrinho',{resultado : results.rows});

    });
});


//pesquisa historico de vendas periodo
app.post('/pesquisa_venda', (req, res) => {

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    //FORMATA DATA QUE RECEBEU DOS CALENDARIOS ESCOLHIDO PELO USUARIO
    const dateStringStart = startDate;
    const parts = dateStringStart.split('-');
    const formattedDateStart = `${parts[2]}/${parts[1]}/${parts[0]}`;

    const dateStringEnd = endDate;
    const parts2 = dateStringEnd.split('-');
    const formattedDateEnd = `${parts2[2]}/${parts2[1]}/${parts2[0]}`;
 
    var sql = "select *,cliente.nome as nome_cliente,produto.nome as nome_produto,TO_CHAR(data_hora,'DD/MM/YYYY') as datav from venda inner join cliente on cliente.codcli = venda.cliente_codcli inner join produto on produto.codpro = venda.produto_codpro  where data_venda BETWEEN TO_DATE('"+formattedDateStart+"','DD/MM/YYYY') and TO_DATE('"+formattedDateEnd+"','DD/MM/YYYY')"+
    ' order by codvenda desc';

    pool.query(sql,(error, results) => {
        if (error) {
            throw error;
        }

        res.render('historico_vendas_periodo', { varTitle: "Sistema de Vendas - Resultado da Pesquisa", resultado: results.rows,datainicio: formattedDateStart,datafim: formattedDateEnd });

    });
  
  });

  //pesquisa historico de vendas carrinho periodo
app.post('/pesquisa_venda_carrinho_periodo', (req, res) => {

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    //FORMATA DATA QUE RECEBEU DOS CALENDARIOS ESCOLHIDO PELO USUARIO
    const dateStringStart = startDate;
    const parts = dateStringStart.split('-');
    const formattedDateStart = `${parts[2]}/${parts[1]}/${parts[0]}`;

    const dateStringEnd = endDate;
    const parts2 = dateStringEnd.split('-');
    const formattedDateEnd = `${parts2[2]}/${parts2[1]}/${parts2[0]}`;
 
    var sql = "SELECT *,TO_CHAR(data_venda,'DD/MM/YYYY') as datav,cliente.nome as nome_cliente "+
    ' FROM venda inner join cliente on '+
    'venda.cliente_codcli = cliente.codcli '+
    " where data_venda BETWEEN TO_DATE('"+formattedDateStart+"','DD/MM/YYYY') and TO_DATE('"+formattedDateEnd+"','DD/MM/YYYY')"+
    ' order by codvenda desc';
    pool.query(sql,(error, results) => {
        if (error) {
            throw error;
        }

        res.render('historico_vendas_carrinho_periodo', { varTitle: "Sistema de Vendas - Resultado da Pesquisa", resultado: results.rows,datainicio: formattedDateStart,datafim: formattedDateEnd });

    });
  
  });


  //ordena de forma descrescente historico de vendas de acordo com o radio selecionado
app.post('/pesquisaRadio', (req, res) => {

    const valorSelecionado = req.body.opcao;
    console.log("Valor recebido no Node.js: " + valorSelecionado);
 

    var sql = "select *,cliente.nome as nome_cliente,produto.nome as nome_produto,TO_CHAR(data_hora,'DD/MM/YYYY') as datav from venda inner join cliente on cliente.codcli = venda.cliente_codcli inner join produto on produto.codpro = venda.produto_codpro order by "+valorSelecionado+" desc";

    pool.query(sql, (error, results) => {
        if (error) {
            throw error;
        } 

        res.render('historico_vendas', { varTitle: "Sistema de Vendas - Historico Vendas", resultado: results.rows });

    });
     
  
  });
  

  //DELETAR EVNDA
app.get('/deletarvenda/:codigo', (req, res) => {
    var codigo = req.params.codigo;
    pool.query('delete from venda where codvenda=$1', [codigo],(error, results) => {
        if (error) {
            throw error;
        }

            res.redirect('/historico_vendas');

     

    });
});

//pesquisa cliente que mais comprou
app.post('/pesquisa_cliente_mais_comprou', (req, res) => {

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;

    //FORMATA DATA QUE RECEBEU DOS CALENDARIOS ESCOLHIDO PELO USUARIO
    const dateStringStart = startDate;
    const parts = dateStringStart.split('-');
    const formattedDateStart = `${parts[2]}/${parts[1]}/${parts[0]}`;

    const dateStringEnd = endDate;
    const parts2 = dateStringEnd.split('-');
    const formattedDateEnd = `${parts2[2]}/${parts2[1]}/${parts2[0]}`;
 
    var sql = "select cliente.codcli,sum(total) as total_comprou ,cliente.nome as nome_cliente "+
    " from venda inner join cliente on cliente.codcli = venda.cliente_codcli "+
    " "+
    " where data_venda BETWEEN TO_DATE('"+formattedDateStart+"','DD/MM/YYYY') and TO_DATE('"+formattedDateEnd+"','DD/MM/YYYY')group by(venda.cliente_codcli,cliente.nome,cliente.codcli) order by total_comprou desc";

    pool.query(sql,(error, results) => {
        if (error) {
            throw error;
        }

        res.render('historico_vendas_periodo_clientes_mais_comprou', { varTitle: "Sistema de Vendas - Resultado da Pesquisa", resultado: results.rows,datainicio: formattedDateStart,datafim: formattedDateEnd });

    });
  
  });




//INSERIR VENDA CARRINHO
app.post('/inserirvendacarrinho', (req, res) => {
    //parseFloat converte para numero
    //var soma=10+parseFloat(req.body.valor);

    
    //teste pegando value do select
    /*const selectCliente = req.body.codcli;
    const selectProduto = req.body.selectproduto;
    console.log('scliente'+selectCliente);
    console.log('codido do clinte selecionadoo:'+parseInt(selectCliente,10));
    console.log('codido do produto selecionado:'+parseInt(selectProduto,10));*/
    //-----------------------------------------//

    var cols = [req.body.codcli,total];
    
    var codvenda=0;
    
    
    pool.query('insert into venda (cliente_codcli,total) values($1,$2)', cols, (error, results) => {
        if (error) {
            throw error;
        }
   
    });

    pool.query('SELECT codvenda FROM venda ORDER BY codvenda DESC LIMIT 1',(error, results) => {
        if (error) {
            throw error;
        }
            codvenda = results.rows[0].codvenda;

            //insert itens_venda
            for (var i = 0; i < listaDeObjetos.length; i++) {
                var objeto = listaDeObjetos[i];
                var cols_itens = [codvenda, objeto.codpro ,objeto.subtotal,objeto.qtd];

                pool.query('insert into itens_venda (venda_codvenda,produto_codpro,subtotal,qtd) values($1,$2,$3,$4)',cols_itens,(error, results) => {
                    if (error) {
                        throw error;
                    }
        
                });
            }

            //ZERA VARIAVEIS GLOBAIS
            total=0;
            listaDeObjetos=[];

            //REDIRECIONA PARA O HISTORICO DE VENDAS
            res.redirect('/historico_vendas_carrinho');

            


    });

});

//CHAMA PAGINA DETALHES VENDA DE TODAS AS VENDAS
app.get('/detalhes_todas_vendas', async (req, res) => {
    try {
      var codigo = req.params.codigo;
      const resultados = await pool.query('SELECT *,itens_venda.qtd as quantidade,cliente.nome as nome_cliente, '+
       ' produto.nome as nome_produto FROM itens_venda inner join produto on produto.codpro = itens_venda.produto_codpro'+
       ' inner join venda on venda.codvenda = itens_venda.venda_codvenda '+
       ' inner join cliente on cliente.codcli = venda.cliente_codcli group by (venda.codvenda,produto.codpro,itens_venda.venda_codvenda,itens_venda.produto_codpro,itens_venda.subtotal,itens_venda.qtd,cliente.codcli) order by venda.codvenda desc');
      
      res.render('detalhes_todas_vendas', { varTitle: "Sistema de Vendas - Venda",resultado: resultados.rows });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  });

//CHAMA PAGINA DETALHES VENDA E MOSTRA OS PRODUTOS APENAS DA VENDA SELECIONADA
app.get('/detalhes_venda/:codigo', async (req, res) => {
    try {
      var codigo_venda = req.params.codigo;
      const resultados = await pool.query('SELECT *,itens_venda.qtd as quantidade,cliente.nome as nome_cliente, '+
       ' produto.nome as nome_produto FROM itens_venda inner join produto on produto.codpro = itens_venda.produto_codpro'+
       ' inner join venda on venda.codvenda = itens_venda.venda_codvenda '+
       ' inner join cliente on cliente.codcli = venda.cliente_codcli where codvenda='+codigo_venda+' group by (venda.codvenda,produto.codpro,itens_venda.venda_codvenda,itens_venda.produto_codpro,itens_venda.subtotal,itens_venda.qtd,cliente.codcli)  order by venda.codvenda desc ');
      
      res.render('detalhes_venda', { varTitle: "Sistema de Vendas - Venda",resultado: resultados.rows });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  });





  