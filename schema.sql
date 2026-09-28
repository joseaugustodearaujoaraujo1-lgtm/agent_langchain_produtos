create database supermercado;
use supermercado;

create table if not exists lotes(
	id_lote int auto_increment primary key,
    data_validade datetime not null,
    data_fabricacao datetime not null,
    quantidade_itens int not null,
    criado_em timestamp default now(),
    atualizado_em timestamp default now() on update now()
);

create table if not exists categorias (
	id_categoria int auto_increment primary key,
    nome_categoria varchar(50) not null,
    criado_em timestamp default now(),
    atualizado_em timestamp default now() on update now()
);

create table if not exists produtos(
	id_produto int auto_increment primary key,
    nome_produto varchar(60) not null,
    preco_produto float(8 , 2) not null,
    id_lote int,
    id_categoria int,
    constraint FK_id_lote foreign key (id_lote) references lotes (id_lote),
    constraint FK_id_categoria foreign key (id_categoria) references categorias (id_categoria),
    criado_em timestamp default now(),
    atualizado_em timestamp default now() on update now()
);

create table if not exists fornecedores(
	id_fornecedor int auto_increment primary key,
    nome_fornecedor varchar(80) not null,
    cpf int,
    cnpj int,
    criado_em timestamp default now(),
    atualizado_em timestamp default now() on update now()
);

create table if not exists fornecedores_produtos(
	id_fornecedor_produto int auto_increment primary key,
    id_fornecedor int,
    id_produto int,
    constraint FK_id_fornecedor foreign key (id_fornecedor) references fornecedores (id_fornecedor),
    constraint FK_id_produto foreign key (id_produto) references produtos (id_produto),
    criado_em timestamp default now(),
    atualizado_em timestamp default now() on update now()
);

create table if not exists clientes (
	id_cliente int auto_increment primary key,
    nome_cliente varchar(50) not null,
    cpf_cliente varchar(50) not null,
    criado_em timestamp default now(),
    atualizado_em timestamp default now() on update now()
);

create table if not exists vendas (
	id_venda int auto_increment primary key,
    data_venda datetime not null,
    valor_venda float(8, 2) not null,
    quantidade_produto int not null,
    criado_em timestamp default now(),
    atualizado_em timestamp default now() on update now()
);

create table if not exists funcionarios (
	id_funcionario int primary key auto_increment,
    nome_funcionario varchar(60),
    cpf_funcionario int not null,
    data_inicio_funcionario datetime not null,
    data_saida_funcionario datetime ,
    criado_em timestamp default now(),
    atualizado_em timestamp default now() on update now()
);

create table if not exists vendas_produtos(
	id_venda_produto int primary key auto_increment,
    id_venda int, 
    id_produto int, 
    constraint FK_id_venda foreign key (id_venda) references vendas (id_venda),
    constraint FK_id_produto_tabela_vendas_produtosforeign foreign key (id_produto) references produtos (id_produto),
    criado_em timestamp default now(),
    atualizado_em timestamp default now() on update now()
);

create table if not exists vendas_produtos (
	id_venda_produto int primary key auto_increment,
    id_venda int,
    id_produto int,
    constraint FK_id_venda_vendas_produtos foreign key (id_venda) references vendas (id_venda),
    constraint FK_id_produto_vendas_produtos foreign key (id_produto) references produtos (id_produto),
    criado_em timestamp default now(),
    atualizado_em timestamp default now() on update now()
);

show tables;
describe table categorias;

select * from funcionarios;
select * from categorias;
select * from vendas;
select * from clientes;
select * from lotes;
select * from vendas_produtos;
select * from fornecedores_produtos;
select * from vendas_produtos;
select * from fornecedores;
