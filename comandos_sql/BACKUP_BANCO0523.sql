--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Ubuntu 14.8-0ubuntu0.22.10.1)
-- Dumped by pg_dump version 14.8 (Ubuntu 14.8-0ubuntu0.22.10.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: atualizar_estoque(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.atualizar_estoque() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE produto
    SET estoque = estoque - NEW.qtd
    WHERE codpro = NEW.produto_codpro;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.atualizar_estoque() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    codcli integer NOT NULL,
    nome character varying(255),
    endereco character varying(255),
    cpf character varying(14),
    cel character varying(20)
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- Name: cliente_codcli_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_codcli_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cliente_codcli_seq OWNER TO postgres;

--
-- Name: cliente_codcli_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliente_codcli_seq OWNED BY public.cliente.codcli;


--
-- Name: itens_venda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itens_venda (
    venda_codvenda integer,
    produto_codpro integer,
    subtotal numeric(15,2),
    qtd double precision
);


ALTER TABLE public.itens_venda OWNER TO postgres;

--
-- Name: produto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produto (
    codpro integer NOT NULL,
    nome character varying(255),
    precovenda numeric(15,2),
    precocusto numeric(15,2),
    estoque double precision
);


ALTER TABLE public.produto OWNER TO postgres;

--
-- Name: produto_codpro_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produto_codpro_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.produto_codpro_seq OWNER TO postgres;

--
-- Name: produto_codpro_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produto_codpro_seq OWNED BY public.produto.codpro;


--
-- Name: venda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venda (
    codvenda integer NOT NULL,
    cliente_codcli integer,
    produto_codpro integer,
    data_venda date DEFAULT CURRENT_DATE,
    data_hora timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    total numeric(15,2),
    qtd double precision
);


ALTER TABLE public.venda OWNER TO postgres;

--
-- Name: venda_codvenda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.venda_codvenda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.venda_codvenda_seq OWNER TO postgres;

--
-- Name: venda_codvenda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.venda_codvenda_seq OWNED BY public.venda.codvenda;


--
-- Name: cliente codcli; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente ALTER COLUMN codcli SET DEFAULT nextval('public.cliente_codcli_seq'::regclass);


--
-- Name: produto codpro; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto ALTER COLUMN codpro SET DEFAULT nextval('public.produto_codpro_seq'::regclass);


--
-- Name: venda codvenda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda ALTER COLUMN codvenda SET DEFAULT nextval('public.venda_codvenda_seq'::regclass);


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (codcli, nome, endereco, cpf, cel) FROM stdin;
1	cli1	ende1	09753175639	(32)98871-6047
2	cli3	ende2	09753175639	(32)98871-6047
3	Hg	Hdhshahah	776676665556	(32)98871-6047
4	Cliente 	Hdhshahah	36656565666666	(32)99966-5544
5	Cliente novo	Fffgghh	097.531.756-39	(32)98871-6047
6	New cliente 	Fffgghh	097.531.756-39	(32)98871-6047
\.


--
-- Data for Name: itens_venda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.itens_venda (venda_codvenda, produto_codpro, subtotal, qtd) FROM stdin;
44	4	20.00	1
45	5	60.00	2
45	4	20.00	1
46	1	10.50	1
46	2	100.00	2
47	5	60.00	2
47	4	20.00	1
48	2	50.00	1
48	5	30.00	1
49	4	20.00	1
50	4	20.00	1
50	2	50.00	1
51	4	20.00	1
51	5	30.00	1
52	6	20.00	1
52	5	30.00	1
\.


--
-- Data for Name: produto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produto (codpro, nome, precovenda, precocusto, estoque) FROM stdin;
1	pro1	10.50	5.50	19
2	produto	50.00	25.00	42
4	Chave 	20.00	10.00	23
5	Provavelmente 	30.00	15.00	50
6	New pro 	20.00	10.00	50
\.


--
-- Data for Name: venda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.venda (codvenda, cliente_codcli, produto_codpro, data_venda, data_hora, total, qtd) FROM stdin;
23	4	2	2023-05-26	2023-05-26 14:18:13.6538	70.00	\N
24	3	1	2023-05-26	2023-05-26 14:18:43.790117	10.50	\N
25	1	4	2023-05-26	2023-05-26 14:19:12.12233	60.00	\N
26	2	1	2023-05-26	2023-05-26 14:19:40.753229	60.50	\N
27	3	4	2023-05-26	2023-05-26 14:20:24.353994	170.00	\N
28	4	4	2023-05-26	2023-05-26 14:25:21.961199	20.00	\N
29	2	2	2023-05-26	2023-05-26 15:15:40.42801	320.00	\N
30	3	1	2023-05-26	2023-05-26 15:16:09.734885	30.50	\N
31	4	4	2023-05-26	2023-05-26 15:23:12.109889	20.00	\N
32	1	4	2023-05-26	2023-05-26 15:27:59.571597	0.00	1
33	4	4	2023-05-26	2023-05-26 15:28:11.065955	0.00	1
34	4	4	2023-05-26	2023-05-26 15:39:40.911114	20.00	\N
35	4	4	2023-05-26	2023-05-26 15:44:14.714752	20.00	\N
36	1	2	2023-05-26	2023-05-26 15:52:45.699258	50.00	\N
37	4	2	2023-05-26	2023-05-26 15:52:58.620219	50.00	\N
38	4	4	2023-05-26	2023-05-26 15:56:12.693968	120.00	\N
39	4	2	2023-05-27	2023-05-27 07:10:08.347219	130.50	\N
40	4	4	2023-05-27	2023-05-27 07:27:39.039576	20.00	\N
41	1	4	2023-05-27	2023-05-27 07:28:10.585466	70.00	\N
42	4	2	2023-05-27	2023-05-27 08:37:36.832552	70.00	\N
43	3	2	2023-05-27	2023-05-27 08:40:49.76556	50.00	\N
44	2	4	2023-05-27	2023-05-27 08:42:23.454636	20.00	\N
45	5	4	2023-05-27	2023-05-27 08:43:52.795529	80.00	\N
46	3	2	2023-05-27	2023-05-27 08:53:26.336813	110.50	\N
47	5	4	2023-05-27	2023-05-27 08:53:59.470325	80.00	\N
48	1	5	2023-05-27	2023-05-27 10:36:21.069942	80.00	\N
49	2	5	2023-05-27	2023-05-27 10:37:52.031395	20.00	\N
50	3	2	2023-05-27	2023-05-27 10:38:08.634867	70.00	\N
51	5	5	2023-05-27	2023-05-27 10:45:20.358736	50.00	\N
52	6	5	2023-05-27	2023-05-27 10:49:21.711755	50.00	\N
\.


--
-- Name: cliente_codcli_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cliente_codcli_seq', 6, true);


--
-- Name: produto_codpro_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produto_codpro_seq', 6, true);


--
-- Name: venda_codvenda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.venda_codvenda_seq', 52, true);


--
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (codcli);


--
-- Name: produto produto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_pkey PRIMARY KEY (codpro);


--
-- Name: venda venda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda
    ADD CONSTRAINT venda_pkey PRIMARY KEY (codvenda);


--
-- Name: itens_venda itens_venda_produto_codpro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_produto_codpro_fkey FOREIGN KEY (produto_codpro) REFERENCES public.produto(codpro);


--
-- Name: itens_venda itens_venda_venda_codvenda_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itens_venda
    ADD CONSTRAINT itens_venda_venda_codvenda_fkey FOREIGN KEY (venda_codvenda) REFERENCES public.venda(codvenda);


--
-- Name: venda venda_cliente_codcli_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda
    ADD CONSTRAINT venda_cliente_codcli_fkey FOREIGN KEY (cliente_codcli) REFERENCES public.cliente(codcli);


--
-- Name: venda venda_produto_codpro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda
    ADD CONSTRAINT venda_produto_codpro_fkey FOREIGN KEY (produto_codpro) REFERENCES public.produto(codpro);


--
-- PostgreSQL database dump complete
--

