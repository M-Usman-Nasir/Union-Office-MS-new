--
-- PostgreSQL database dump
--

\restrict TpiGUhXBwlbv7J199UfgbsRUXKWuta2xODU5wA4Rp1jEmViVyU86cOycnDeZKtx

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, role, society_apartment_id, unit_id, cnic, contact_number, emergency_contact, move_in_date, created_at, updated_at, is_active, last_login, created_by, profile_image, address, city, postal_code, work_employer, work_title, work_phone) FROM stdin;
64	User C-110	user_322_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	322	\N	\N	\N	\N	2026-02-24 11:52:58.057142	2026-02-24 11:52:58.057142	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
54	Hamza Iqbal	user_311_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	311	\N	\N	\N	\N	2026-02-24 11:52:58.023136	2026-02-24 12:10:57.722721	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
65	User C-111	user_323_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	323	\N	\N	\N	\N	2026-02-24 11:52:58.059573	2026-02-24 11:52:58.059573	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
57	User B-103	user_315_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	315	\N	\N	\N	\N	2026-02-24 11:52:58.028282	2026-02-24 11:52:58.028282	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
58	User A-104	user_316_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	316	\N	\N	\N	\N	2026-02-24 11:52:58.030428	2026-02-24 11:52:58.030428	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
59	User A-105	user_317_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	317	\N	\N	\N	\N	2026-02-24 11:52:58.036484	2026-02-24 11:52:58.036484	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
60	User C-106	user_318_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	318	\N	\N	\N	\N	2026-02-24 11:52:58.04041	2026-02-24 11:52:58.04041	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
61	User C-107	user_319_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	319	\N	\N	\N	\N	2026-02-24 11:52:58.044769	2026-02-24 11:52:58.044769	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
62	User C-108	user_320_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	320	\N	\N	\N	\N	2026-02-24 11:52:58.051357	2026-02-24 11:52:58.051357	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
63	User C-109	user_321_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	321	\N	\N	\N	\N	2026-02-24 11:52:58.054308	2026-02-24 11:52:58.054308	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
66	User A-201	user_325_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	325	\N	\N	\N	\N	2026-02-24 11:52:58.061924	2026-02-24 11:52:58.061924	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
67	User A-202	user_326_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	326	\N	\N	\N	\N	2026-02-24 11:52:58.063849	2026-02-24 11:52:58.063849	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
68	User B-203	user_327_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	327	\N	\N	\N	\N	2026-02-24 11:52:58.068302	2026-02-24 11:52:58.068302	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
69	User A-204	user_328_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	328	\N	\N	\N	\N	2026-02-24 11:52:58.075293	2026-02-24 11:52:58.075293	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
70	User A-205	user_329_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	329	\N	\N	\N	\N	2026-02-24 11:52:58.078684	2026-02-24 11:52:58.078684	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
71	User C-206	user_330_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	330	\N	\N	\N	\N	2026-02-24 11:52:58.083632	2026-02-24 11:52:58.083632	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
72	User C-207	user_331_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	331	\N	\N	\N	\N	2026-02-24 11:52:58.091326	2026-02-24 11:52:58.091326	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
73	User C-208	user_332_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	332	\N	\N	\N	\N	2026-02-24 11:52:58.09404	2026-02-24 11:52:58.09404	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
74	User C-209	user_333_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	333	\N	\N	\N	\N	2026-02-24 11:52:58.096532	2026-02-24 11:52:58.096532	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
75	User D-210	user_334_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	334	\N	\N	\N	\N	2026-02-24 11:52:58.101625	2026-02-24 11:52:58.101625	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
76	User A1-209	user_335_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	335	\N	\N	\N	\N	2026-02-24 11:52:58.108009	2026-02-24 11:52:58.108009	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
77	User A-301	user_337_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	337	\N	\N	\N	\N	2026-02-24 11:52:58.111108	2026-02-24 11:52:58.111108	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
78	User A-302	user_338_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	338	\N	\N	\N	\N	2026-02-24 11:52:58.113627	2026-02-24 11:52:58.113627	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
79	User B-303	user_339_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	339	\N	\N	\N	\N	2026-02-24 11:52:58.120366	2026-02-24 11:52:58.120366	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
80	User A-304	user_340_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	340	\N	\N	\N	\N	2026-02-24 11:52:58.125911	2026-02-24 11:52:58.125911	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
81	User A-305	user_341_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	341	\N	\N	\N	\N	2026-02-24 11:52:58.12831	2026-02-24 11:52:58.12831	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
82	User C-306	user_342_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	342	\N	\N	\N	\N	2026-02-24 11:52:58.132194	2026-02-24 11:52:58.132194	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
83	User C-307	user_343_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	343	\N	\N	\N	\N	2026-02-24 11:52:58.139409	2026-02-24 11:52:58.139409	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
84	User C-308	user_344_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	344	\N	\N	\N	\N	2026-02-24 11:52:58.142658	2026-02-24 11:52:58.142658	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
85	User C-309	user_345_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	345	\N	\N	\N	\N	2026-02-24 11:52:58.145194	2026-02-24 11:52:58.145194	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
86	User D-310	user_346_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	346	\N	\N	\N	\N	2026-02-24 11:52:58.14832	2026-02-24 11:52:58.14832	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
87	User A1-309	user_347_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	347	\N	\N	\N	\N	2026-02-24 11:52:58.153306	2026-02-24 11:52:58.153306	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
88	User A-401	user_349_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	349	\N	\N	\N	\N	2026-02-24 11:52:58.15858	2026-02-24 11:52:58.15858	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
89	User A-402	user_350_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	350	\N	\N	\N	\N	2026-02-24 11:52:58.161287	2026-02-24 11:52:58.161287	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
90	User B-403	user_351_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	351	\N	\N	\N	\N	2026-02-24 11:52:58.163865	2026-02-24 11:52:58.163865	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
91	User A-404	user_352_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	352	\N	\N	\N	\N	2026-02-24 11:52:58.169326	2026-02-24 11:52:58.169326	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
92	User A-405	user_353_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	353	\N	\N	\N	\N	2026-02-24 11:52:58.173195	2026-02-24 11:52:58.173195	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
93	User E-406	user_354_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	354	\N	\N	\N	\N	2026-02-24 11:52:58.175076	2026-02-24 11:52:58.175076	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
53	Zainab Farooq	user_310_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	310	\N	\N	\N	\N	2026-02-24 11:52:58.020204	2026-02-24 12:11:13.749794	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
52	Saad Ahmed	user_309_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	309	\N	\N	\N	\N	2026-02-24 11:52:58.017913	2026-02-24 12:11:26.617998	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
55	Hassan Raza	user_313_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	313	\N	\N	\N	\N	2026-02-24 11:52:58.025227	2026-02-24 14:35:40.553371	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
56	Sana Malik	user_314_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	314	\N	\N	\N	\N	2026-02-24 11:52:58.026791	2026-02-24 14:35:57.432885	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
51	Aisha Siddiqui	user_308_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	308	\N	\N	\N	\N	2026-02-24 11:52:57.982552	2026-02-27 16:16:39.134592	t	2026-02-27 16:16:39.134592+05	\N	\N	\N	\N	\N	\N	\N	\N
126	User E-706	user_390_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	390	\N	\N	\N	\N	2026-02-24 11:52:58.27339	2026-02-24 11:52:58.27339	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
127	User E-707	user_391_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	391	\N	\N	\N	\N	2026-02-24 11:52:58.275267	2026-02-24 11:52:58.275267	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
50	Muhammad Ali	user1@gmail.com	$2a$10$4jb3C3uJSBIxjgHBuKbege83EbO2yPpou2EuAGm28ymzRlreEPql6	resident	31	307	\N	\N	\N	2026-02-22	2026-02-23 16:43:30.296096	2026-02-24 12:12:09.597053	\N	\N	49	\N	\N	\N	\N	\N	\N	\N
94	User E-407	user_355_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	355	\N	\N	\N	\N	2026-02-24 11:52:58.176708	2026-02-24 11:52:58.176708	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
95	User E-408	user_356_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	356	\N	\N	\N	\N	2026-02-24 11:52:58.179009	2026-02-24 11:52:58.179009	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
96	User E-409	user_357_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	357	\N	\N	\N	\N	2026-02-24 11:52:58.18151	2026-02-24 11:52:58.18151	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
97	User E-410	user_358_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	358	\N	\N	\N	\N	2026-02-24 11:52:58.18776	2026-02-24 11:52:58.18776	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
98	User E-411	user_359_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	359	\N	\N	\N	\N	2026-02-24 11:52:58.191251	2026-02-24 11:52:58.191251	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
99	User A-501	user_361_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	361	\N	\N	\N	\N	2026-02-24 11:52:58.193232	2026-02-24 11:52:58.193232	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
100	User A-502	user_362_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	362	\N	\N	\N	\N	2026-02-24 11:52:58.195186	2026-02-24 11:52:58.195186	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
101	User B-503	user_363_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	363	\N	\N	\N	\N	2026-02-24 11:52:58.197449	2026-02-24 11:52:58.197449	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
102	User A-504	user_364_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	364	\N	\N	\N	\N	2026-02-24 11:52:58.202104	2026-02-24 11:52:58.202104	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
103	User A-505	user_365_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	365	\N	\N	\N	\N	2026-02-24 11:52:58.207288	2026-02-24 11:52:58.207288	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
104	User E-506	user_366_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	366	\N	\N	\N	\N	2026-02-24 11:52:58.209134	2026-02-24 11:52:58.209134	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
105	User E-507	user_367_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	367	\N	\N	\N	\N	2026-02-24 11:52:58.210911	2026-02-24 11:52:58.210911	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
106	User E-508	user_368_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	368	\N	\N	\N	\N	2026-02-24 11:52:58.213155	2026-02-24 11:52:58.213155	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
107	User E-509	user_369_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	369	\N	\N	\N	\N	2026-02-24 11:52:58.217346	2026-02-24 11:52:58.217346	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
108	User E-510	user_370_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	370	\N	\N	\N	\N	2026-02-24 11:52:58.223163	2026-02-24 11:52:58.223163	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
109	User E-511	user_371_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	371	\N	\N	\N	\N	2026-02-24 11:52:58.226213	2026-02-24 11:52:58.226213	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
110	User A-601	user_373_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	373	\N	\N	\N	\N	2026-02-24 11:52:58.228143	2026-02-24 11:52:58.228143	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
111	User A-602	user_374_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	374	\N	\N	\N	\N	2026-02-24 11:52:58.230046	2026-02-24 11:52:58.230046	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
112	User B-603	user_375_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	375	\N	\N	\N	\N	2026-02-24 11:52:58.234324	2026-02-24 11:52:58.234324	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
113	User A-604	user_376_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	376	\N	\N	\N	\N	2026-02-24 11:52:58.239691	2026-02-24 11:52:58.239691	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
114	User A-605	user_377_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	377	\N	\N	\N	\N	2026-02-24 11:52:58.241249	2026-02-24 11:52:58.241249	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
115	User E-606	user_378_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	378	\N	\N	\N	\N	2026-02-24 11:52:58.243074	2026-02-24 11:52:58.243074	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
116	User E-607	user_379_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	379	\N	\N	\N	\N	2026-02-24 11:52:58.245033	2026-02-24 11:52:58.245033	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
117	User E-608	user_380_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	380	\N	\N	\N	\N	2026-02-24 11:52:58.246829	2026-02-24 11:52:58.246829	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
118	User E-609	user_381_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	381	\N	\N	\N	\N	2026-02-24 11:52:58.251018	2026-02-24 11:52:58.251018	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
128	User E-708	user_392_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	392	\N	\N	\N	\N	2026-02-24 11:52:58.276958	2026-02-24 11:52:58.276958	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
119	User E-610	user_382_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	382	\N	\N	\N	\N	2026-02-24 11:52:58.255505	2026-02-24 11:52:58.255505	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
120	User E-611	user_383_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	383	\N	\N	\N	\N	2026-02-24 11:52:58.257443	2026-02-24 11:52:58.257443	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
121	User A-701	user_385_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	385	\N	\N	\N	\N	2026-02-24 11:52:58.258927	2026-02-24 11:52:58.258927	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
122	User A-702	user_386_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	386	\N	\N	\N	\N	2026-02-24 11:52:58.261004	2026-02-24 11:52:58.261004	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
123	User B-703	user_387_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	387	\N	\N	\N	\N	2026-02-24 11:52:58.262539	2026-02-24 11:52:58.262539	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
124	User A-704	user_388_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	388	\N	\N	\N	\N	2026-02-24 11:52:58.264331	2026-02-24 11:52:58.264331	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
125	User A-705	user_389_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	389	\N	\N	\N	\N	2026-02-24 11:52:58.268862	2026-02-24 11:52:58.268862	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
129	User E-709	user_393_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	393	\N	\N	\N	\N	2026-02-24 11:52:58.279047	2026-02-24 11:52:58.279047	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
130	User E-710	user_394_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	394	\N	\N	\N	\N	2026-02-24 11:52:58.281247	2026-02-24 11:52:58.281247	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
131	User E-711	user_395_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	395	\N	\N	\N	\N	2026-02-24 11:52:58.285328	2026-02-24 11:52:58.285328	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
132	User A-801	user_397_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	397	\N	\N	\N	\N	2026-02-24 11:52:58.289806	2026-02-24 11:52:58.289806	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
133	User A-802	user_398_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	398	\N	\N	\N	\N	2026-02-24 11:52:58.292017	2026-02-24 11:52:58.292017	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
134	User B-803	user_399_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	399	\N	\N	\N	\N	2026-02-24 11:52:58.293886	2026-02-24 11:52:58.293886	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
135	User A-804	user_400_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	400	\N	\N	\N	\N	2026-02-24 11:52:58.295608	2026-02-24 11:52:58.295608	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
136	User A-805	user_401_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	401	\N	\N	\N	\N	2026-02-24 11:52:58.297183	2026-02-24 11:52:58.297183	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
137	User E-806	user_402_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	402	\N	\N	\N	\N	2026-02-24 11:52:58.304405	2026-02-24 11:52:58.304405	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
138	User E-807	user_403_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	403	\N	\N	\N	\N	2026-02-24 11:52:58.307789	2026-02-24 11:52:58.307789	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
139	User E-808	user_404_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	404	\N	\N	\N	\N	2026-02-24 11:52:58.309403	2026-02-24 11:52:58.309403	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
140	User E-809	user_405_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	405	\N	\N	\N	\N	2026-02-24 11:52:58.311073	2026-02-24 11:52:58.311073	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
141	User E-810	user_406_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	406	\N	\N	\N	\N	2026-02-24 11:52:58.312633	2026-02-24 11:52:58.312633	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
142	User E-811	user_407_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	407	\N	\N	\N	\N	2026-02-24 11:52:58.314442	2026-02-24 11:52:58.314442	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
143	User A-101	user_491_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	491	\N	\N	\N	\N	2026-02-24 11:52:58.31814	2026-02-24 11:52:58.31814	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
144	User A-102	user_492_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	492	\N	\N	\N	\N	2026-02-24 11:52:58.322286	2026-02-24 11:52:58.322286	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
145	User B-103	user_493_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	493	\N	\N	\N	\N	2026-02-24 11:52:58.324241	2026-02-24 11:52:58.324241	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
146	User A-104	user_494_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	494	\N	\N	\N	\N	2026-02-24 11:52:58.325994	2026-02-24 11:52:58.325994	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
147	User C-109	user_495_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	495	\N	\N	\N	\N	2026-02-24 11:52:58.327702	2026-02-24 11:52:58.327702	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
148	User C-106	user_496_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	496	\N	\N	\N	\N	2026-02-24 11:52:58.329306	2026-02-24 11:52:58.329306	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
149	User C-107	user_497_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	497	\N	\N	\N	\N	2026-02-24 11:52:58.332259	2026-02-24 11:52:58.332259	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
150	User C-108	user_498_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	498	\N	\N	\N	\N	2026-02-24 11:52:58.336506	2026-02-24 11:52:58.336506	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
151	User A2-109	user_499_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	499	\N	\N	\N	\N	2026-02-24 11:52:58.340141	2026-02-24 11:52:58.340141	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
152	User A1-105	user_500_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	500	\N	\N	\N	\N	2026-02-24 11:52:58.342035	2026-02-24 11:52:58.342035	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
153	User A-201	user_501_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	501	\N	\N	\N	\N	2026-02-24 11:52:58.343705	2026-02-24 11:52:58.343705	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
154	User A-202	user_502_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	502	\N	\N	\N	\N	2026-02-24 11:52:58.345332	2026-02-24 11:52:58.345332	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
155	User B-203	user_503_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	503	\N	\N	\N	\N	2026-02-24 11:52:58.346681	2026-02-24 11:52:58.346681	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
156	User A-204	user_504_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	504	\N	\N	\N	\N	2026-02-24 11:52:58.35033	2026-02-24 11:52:58.35033	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
157	User A-209	user_505_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	505	\N	\N	\N	\N	2026-02-24 11:52:58.355285	2026-02-24 11:52:58.355285	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
158	User C-206	user_506_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	506	\N	\N	\N	\N	2026-02-24 11:52:58.358622	2026-02-24 11:52:58.358622	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
159	User C-207	user_507_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	507	\N	\N	\N	\N	2026-02-24 11:52:58.360685	2026-02-24 11:52:58.360685	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
160	User C-208	user_508_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	508	\N	\N	\N	\N	2026-02-24 11:52:58.362309	2026-02-24 11:52:58.362309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
161	User A2-209	user_509_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	509	\N	\N	\N	\N	2026-02-24 11:52:58.363925	2026-02-24 11:52:58.363925	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
162	User A1-205	user_510_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	510	\N	\N	\N	\N	2026-02-24 11:52:58.368823	2026-02-24 11:52:58.368823	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
163	User A-301	user_511_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	511	\N	\N	\N	\N	2026-02-24 11:52:58.373316	2026-02-24 11:52:58.373316	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
164	User A-302	user_512_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	512	\N	\N	\N	\N	2026-02-24 11:52:58.375321	2026-02-24 11:52:58.375321	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
165	User B-303	user_513_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	513	\N	\N	\N	\N	2026-02-24 11:52:58.377125	2026-02-24 11:52:58.377125	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
166	User A-304	user_514_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	514	\N	\N	\N	\N	2026-02-24 11:52:58.378588	2026-02-24 11:52:58.378588	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
167	User A-309	user_515_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	515	\N	\N	\N	\N	2026-02-24 11:52:58.38109	2026-02-24 11:52:58.38109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
168	User C-306	user_516_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	516	\N	\N	\N	\N	2026-02-24 11:52:58.386318	2026-02-24 11:52:58.386318	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
169	User C-307	user_517_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	517	\N	\N	\N	\N	2026-02-24 11:52:58.391074	2026-02-24 11:52:58.391074	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
170	User D-309	user_518_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	518	\N	\N	\N	\N	2026-02-24 11:52:58.393528	2026-02-24 11:52:58.393528	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
171	User C-310	user_519_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	519	\N	\N	\N	\N	2026-02-24 11:52:58.395341	2026-02-24 11:52:58.395341	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
172	User A1-305	user_520_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	520	\N	\N	\N	\N	2026-02-24 11:52:58.396908	2026-02-24 11:52:58.396908	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
173	User A-401	user_521_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	521	\N	\N	\N	\N	2026-02-24 11:52:58.401101	2026-02-24 11:52:58.401101	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
174	User A-402	user_522_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	522	\N	\N	\N	\N	2026-02-24 11:52:58.406307	2026-02-24 11:52:58.406307	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
175	User B-403	user_523_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	523	\N	\N	\N	\N	2026-02-24 11:52:58.408265	2026-02-24 11:52:58.408265	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
176	User A-404	user_524_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	524	\N	\N	\N	\N	2026-02-24 11:52:58.410112	2026-02-24 11:52:58.410112	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
177	User A-409	user_525_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	525	\N	\N	\N	\N	2026-02-24 11:52:58.412153	2026-02-24 11:52:58.412153	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
178	User C-406	user_526_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	526	\N	\N	\N	\N	2026-02-24 11:52:58.414671	2026-02-24 11:52:58.414671	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
179	User C-407	user_527_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	527	\N	\N	\N	\N	2026-02-24 11:52:58.423011	2026-02-24 11:52:58.423011	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
180	User C-408	user_528_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	528	\N	\N	\N	\N	2026-02-24 11:52:58.425595	2026-02-24 11:52:58.425595	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
181	User A2-409	user_529_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	529	\N	\N	\N	\N	2026-02-24 11:52:58.428192	2026-02-24 11:52:58.428192	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
182	User A1-405	user_530_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	530	\N	\N	\N	\N	2026-02-24 11:52:58.430631	2026-02-24 11:52:58.430631	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
183	User A-501	user_531_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	531	\N	\N	\N	\N	2026-02-24 11:52:58.44362	2026-02-24 11:52:58.44362	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
184	User A-502	user_532_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	532	\N	\N	\N	\N	2026-02-24 11:52:58.445718	2026-02-24 11:52:58.445718	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
185	User B-503	user_533_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	533	\N	\N	\N	\N	2026-02-24 11:52:58.447836	2026-02-24 11:52:58.447836	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
186	User A-504	user_534_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	534	\N	\N	\N	\N	2026-02-24 11:52:58.454228	2026-02-24 11:52:58.454228	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
187	User A-509	user_535_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	535	\N	\N	\N	\N	2026-02-24 11:52:58.459242	2026-02-24 11:52:58.459242	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
188	User E-506	user_536_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	536	\N	\N	\N	\N	2026-02-24 11:52:58.461765	2026-02-24 11:52:58.461765	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
189	User E-507	user_537_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	537	\N	\N	\N	\N	2026-02-24 11:52:58.464555	2026-02-24 11:52:58.464555	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
190	User E-508	user_538_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	538	\N	\N	\N	\N	2026-02-24 11:52:58.470901	2026-02-24 11:52:58.470901	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
191	User E-509	user_539_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	539	\N	\N	\N	\N	2026-02-24 11:52:58.47527	2026-02-24 11:52:58.47527	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
192	User E-510	user_540_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	540	\N	\N	\N	\N	2026-02-24 11:52:58.477745	2026-02-24 11:52:58.477745	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
193	User E-505	user_541_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	541	\N	\N	\N	\N	2026-02-24 11:52:58.480157	2026-02-24 11:52:58.480157	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
194	User A-601	user_542_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	542	\N	\N	\N	\N	2026-02-24 11:52:58.485	2026-02-24 11:52:58.485	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
195	User A-602	user_543_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	543	\N	\N	\N	\N	2026-02-24 11:52:58.490873	2026-02-24 11:52:58.490873	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
196	User B-603	user_544_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	544	\N	\N	\N	\N	2026-02-24 11:52:58.493277	2026-02-24 11:52:58.493277	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
197	User A-604	user_545_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	545	\N	\N	\N	\N	2026-02-24 11:52:58.495543	2026-02-24 11:52:58.495543	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
198	User A-609	user_546_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	546	\N	\N	\N	\N	2026-02-24 11:52:58.497944	2026-02-24 11:52:58.497944	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
199	User E-606	user_547_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	547	\N	\N	\N	\N	2026-02-24 11:52:58.503819	2026-02-24 11:52:58.503819	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
200	User E-607	user_548_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	548	\N	\N	\N	\N	2026-02-24 11:52:58.50775	2026-02-24 11:52:58.50775	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
201	User E-608	user_549_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	549	\N	\N	\N	\N	2026-02-24 11:52:58.509712	2026-02-24 11:52:58.509712	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
202	User E-609	user_550_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	550	\N	\N	\N	\N	2026-02-24 11:52:58.511641	2026-02-24 11:52:58.511641	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
203	User E-610	user_551_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	551	\N	\N	\N	\N	2026-02-24 11:52:58.513766	2026-02-24 11:52:58.513766	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
204	User E-605	user_552_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	552	\N	\N	\N	\N	2026-02-24 11:52:58.518331	2026-02-24 11:52:58.518331	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
205	User A-701	user_553_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	553	\N	\N	\N	\N	2026-02-24 11:52:58.524	2026-02-24 11:52:58.524	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
206	User A-702	user_554_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	554	\N	\N	\N	\N	2026-02-24 11:52:58.526238	2026-02-24 11:52:58.526238	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
207	User B-703	user_555_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	555	\N	\N	\N	\N	2026-02-24 11:52:58.528402	2026-02-24 11:52:58.528402	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
208	User A-704	user_556_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	556	\N	\N	\N	\N	2026-02-24 11:52:58.530283	2026-02-24 11:52:58.530283	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
209	User A-709	user_557_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	557	\N	\N	\N	\N	2026-02-24 11:52:58.535094	2026-02-24 11:52:58.535094	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
210	User E-706	user_558_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	558	\N	\N	\N	\N	2026-02-24 11:52:58.541442	2026-02-24 11:52:58.541442	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
211	User E-707	user_559_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	559	\N	\N	\N	\N	2026-02-24 11:52:58.54393	2026-02-24 11:52:58.54393	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
212	User E-708	user_560_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	560	\N	\N	\N	\N	2026-02-24 11:52:58.546855	2026-02-24 11:52:58.546855	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
213	User E-709	user_561_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	561	\N	\N	\N	\N	2026-02-24 11:52:58.551332	2026-02-24 11:52:58.551332	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
214	User E-710	user_562_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	562	\N	\N	\N	\N	2026-02-24 11:52:58.55765	2026-02-24 11:52:58.55765	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
215	User E-705	user_563_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	563	\N	\N	\N	\N	2026-02-24 11:52:58.562137	2026-02-24 11:52:58.562137	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
216	User A-801	user_564_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	564	\N	\N	\N	\N	2026-02-24 11:52:58.564723	2026-02-24 11:52:58.564723	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
217	User A-802	user_565_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	565	\N	\N	\N	\N	2026-02-24 11:52:58.569913	2026-02-24 11:52:58.569913	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
218	User B-803	user_566_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	566	\N	\N	\N	\N	2026-02-24 11:52:58.574144	2026-02-24 11:52:58.574144	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
219	User A-804	user_567_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	567	\N	\N	\N	\N	2026-02-24 11:52:58.576371	2026-02-24 11:52:58.576371	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
220	User A-809	user_568_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	568	\N	\N	\N	\N	2026-02-24 11:52:58.578402	2026-02-24 11:52:58.578402	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
221	User E-806 (I)	user_569_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	569	\N	\N	\N	\N	2026-02-24 11:52:58.580499	2026-02-24 11:52:58.580499	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
222	User E-806 (II)	user_570_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	570	\N	\N	\N	\N	2026-02-24 11:52:58.585512	2026-02-24 11:52:58.585512	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
223	User E-807	user_571_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	571	\N	\N	\N	\N	2026-02-24 11:52:58.590714	2026-02-24 11:52:58.590714	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
224	User E-808	user_576_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	576	\N	\N	\N	\N	2026-02-24 11:52:58.593138	2026-02-24 11:52:58.593138	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
225	User E-809	user_577_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	577	\N	\N	\N	\N	2026-02-24 11:52:58.595763	2026-02-24 11:52:58.595763	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
228	Muhammad Iqbal	staff-31-1771920723441-4ad56765@no-login.local	$2a$10$RND7SFxzup/.K5qp0BmJwuKxGs4Uhm5sLV1SkTYng.eomYe963hlO	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:12:03.541218	2026-02-24 13:12:03.541218	\N	\N	49	\N	\N	\N	\N	\N	Supervisor	\N
229	Fazal	staff-31-1771920866635-01264fad@no-login.local	$2a$10$SLDE9VB1y8evbejSv7hkCOI3XiWh9zYbVFiNnSWSiTyGYoK0KBHxa	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:14:26.721668	2026-02-24 13:14:26.721668	\N	\N	49	\N	\N	\N	\N	\N	Guard	\N
230	Gul Muhammad	staff-31-1771920893201-f0f0d79c@no-login.local	$2a$10$YF2MDUUb/r581boioR7GX.wUWEo8GF9Vzb9LNjuxnLmx7GK/H4yV.	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:14:53.278925	2026-02-24 13:14:53.278925	\N	\N	49	\N	\N	\N	\N	\N	Guard	\N
231	Muhammad Ayub	staff-31-1771920929335-2669b9aa@no-login.local	$2a$10$4Hs2j/rMKB7W7eM6.Gsl9.on65t52LGazNKKdM/iW8kHpuvqD.dMu	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:15:29.4133	2026-02-24 13:15:29.4133	\N	\N	49	\N	\N	\N	\N	\N	Guard	\N
232	Nazir Baba	staff-31-1771920951385-c37a2999@no-login.local	$2a$10$s6dgVU0zvVGrflKMJE/9CeWqGHqk63E9J/7uiQigUv9/HhPl2HE1q	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:15:51.462937	2026-02-24 13:15:51.462937	\N	\N	49	\N	\N	\N	\N	\N	Guard	\N
233	Abdullah	staff-31-1771920983533-e2c91a7d@no-login.local	$2a$10$Lvyl9OZVZrbT7GJAVAuhFe/MOX7fJ4ZtQhtJy6SBjbcah58lFZX5u	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:16:23.612409	2026-02-24 13:16:23.612409	\N	\N	49	\N	\N	\N	\N	\N	Sweeper	\N
234	Zahoor	staff-31-1771921012737-8b33350c@no-login.local	$2a$10$.DxUksKI4eJLzZHzDD8WuueBFT0rP6F.aF1cHassenVq1DVwsqqK2	staff	31	\N	\N	\N	\N	\N	2026-02-24 13:16:52.814365	2026-02-24 13:18:19.487939	\N	\N	49	\N	\N	\N	\N	\N	Lift Operator	\N
235	Uzair Siddique	uzair@test.com	$2a$10$l5LDc42WJCjjgQIFTGQe8e75mXE.w2wbDfzVNTZfJfxSmhOjG3e2G	union_admin	32	\N	\N	\N	\N	\N	2026-03-03 15:44:07.905293	2026-03-03 15:44:07.905293	\N	\N	1	\N	\N	\N	\N	\N	\N	\N
49	Muneeb Khan	muneebkhan@gmail.com	$2a$10$62QQO3GhzyB/gmc1pL8M/e0jT.YqxF3sM6G9HEOKhQfA8DEuaMHvi	union_admin	31	\N	012012012012	0101	1010	\N	2026-02-23 12:52:19.304651	2026-03-03 16:01:06.458914	t	2026-03-03 16:01:06.458914+05	1	\N	\N	\N	\N	\N	\N	\N
1	Sheikh Hasan Khalid	hasanshkh17@gmail.com	$2a$10$vykkG6yqvExk.QnANIb/JOL3jvno5Fjp6LIDOqY7pyayI9KmOr2ym	super_admin	\N	\N	\N	+92 301 1457030	0332 3883890	\N	2026-01-26 16:45:51.541343	2026-03-03 16:07:44.210816	t	2026-03-03 16:07:44.210816+05	\N	/uploads/profiles/user_1_1771582975987.webp	\N	\N	\N	\N	\N	\N
226	User E-810	user_578_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	578	\N	\N	\N	\N	2026-02-24 11:52:58.598913	2026-02-27 15:44:30.878175	t	\N	\N	\N	\N	\N	\N	\N	\N	\N
227	User E-805	user_579_society31@example.com	$2a$10$klBkjq6QsCFhA.lVmUwhfONS8Qr591V6ScYHIPgtkJlC.LFDiW22i	resident	31	579	\N	\N	\N	\N	2026-02-24 11:52:58.606347	2026-02-27 15:46:58.34471	t	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: apartments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.apartments (id, name, address, city, total_blocks, total_units, created_at, updated_at, total_floors, area, union_admin_name, union_admin_email, union_admin_phone, is_active, approval_status, approval_notes, approved_at, approved_by) FROM stdin;
32	Panjabi Sodagaran 	X49M+J99, Punjabi Saudagar Society Sector 25 A Gulzar E Hijri Scheme 33, Karachi, Pakistan	Karachi	17	0	2026-03-03 15:44:07.674863	2026-03-03 15:55:22.768344	29	Punjabi Saudagar Society Sector 25 A Gulzar E Hijri Scheme 33	Uzair Siddique	Uzair@test.com	\N	t	approved	test	2026-03-03 15:55:22.768344	1
31	Homeland Appartments 	Homeland Apartments, Block 13-C Block 13 C Gulshan-e-Iqbal, Karachi, 74300, Pakistan	Karachi	2	178	2026-02-20 16:46:16.689533	2026-03-03 12:50:10.710326	9	Block 13-C Block 13 C Gulshan-e-Iqbal	Muneeb Khan	\N	\N	t	approved	\N	2026-02-23 16:26:11.543339	\N
\.


--
-- Data for Name: blocks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blocks (id, society_apartment_id, name, total_floors, total_units, created_at, updated_at) FROM stdin;
65	31	Block 2	8	85	2026-02-20 16:46:16.739722	2026-02-23 16:26:11.540116
66	32	Block 1	29	0	2026-03-03 15:44:07.976723	2026-03-03 15:44:07.976723
67	32	Block 2	29	0	2026-03-03 15:44:08.095626	2026-03-03 15:44:08.095626
68	32	Block 3	29	0	2026-03-03 15:44:08.236039	2026-03-03 15:44:08.236039
69	32	Block 4	29	0	2026-03-03 15:44:08.370245	2026-03-03 15:44:08.370245
70	32	Block 5	29	0	2026-03-03 15:44:08.499026	2026-03-03 15:44:08.499026
71	32	Block 6	29	0	2026-03-03 15:44:08.635363	2026-03-03 15:44:08.635363
72	32	Block 7	29	0	2026-03-03 15:44:08.667601	2026-03-03 15:44:08.667601
73	32	Block 8	29	0	2026-03-03 15:44:08.815588	2026-03-03 15:44:08.815588
74	32	Block 9	29	0	2026-03-03 15:44:08.839572	2026-03-03 15:44:08.839572
75	32	Block 10	29	0	2026-03-03 15:44:09.020132	2026-03-03 15:44:09.020132
76	32	Block 11	29	0	2026-03-03 15:44:09.129698	2026-03-03 15:44:09.129698
77	32	Block 12	29	0	2026-03-03 15:44:09.283027	2026-03-03 15:44:09.283027
78	32	Block 13	29	0	2026-03-03 15:44:09.352401	2026-03-03 15:44:09.352401
64	31	Block 1	9	93	2026-02-20 16:46:16.715464	2026-02-23 15:51:43.900546
79	32	Block 14	29	0	2026-03-03 15:44:09.372017	2026-03-03 15:44:09.372017
80	32	Block 15	29	0	2026-03-03 15:44:09.456092	2026-03-03 15:44:09.456092
81	32	Block 16	29	0	2026-03-03 15:44:09.543342	2026-03-03 15:44:09.543342
82	32	Block 17	29	0	2026-03-03 15:44:09.647432	2026-03-03 15:44:09.647432
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.announcements (id, title, description, type, audience, language, visible_to_all, is_active, society_apartment_id, block_id, created_by, created_at, updated_at, announcement_date) FROM stdin;
39	Maintenance Notice	The water supply will be off.	notice	all_residents	en	t	t	31	\N	49	2026-02-24 16:08:38.400325	2026-02-24 16:08:38.400325	2025-01-03
\.


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_log (id, created_at, user_id, role, action, resource_type, resource_id, society_apartment_id, details, ip, user_agent) FROM stdin;
1	2026-03-03 15:44:07.788574	1	super_admin	apartment.create	apartment	32	32	{"name": "Panjabi Sodagaran "}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
2	2026-03-03 15:55:22.771741	1	super_admin	apartment.approve	apartment	32	32	{"name": "Panjabi Sodagaran ", "notes": "test"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
\.


--
-- Data for Name: floors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.floors (id, block_id, floor_number, total_units, created_at) FROM stdin;
66	64	0	5	2026-02-20 16:46:48.987861
67	64	1	9	2026-02-20 16:47:09.078874
68	64	2	9	2026-02-20 16:47:15.490563
69	64	3	9	2026-02-20 16:47:19.785422
70	64	4	9	2026-02-20 16:47:23.28554
71	64	5	9	2026-02-20 16:47:26.238016
72	64	6	9	2026-02-20 16:47:29.649085
73	64	7	9	2026-02-20 16:47:32.693337
74	64	8	9	2026-02-20 16:47:35.466844
75	65	1	9	2026-02-20 16:47:54.433293
76	65	2	9	2026-02-20 16:47:57.76396
77	65	3	9	2026-02-20 16:48:00.396892
78	65	4	9	2026-02-20 16:48:02.866355
79	65	5	9	2026-02-20 16:48:05.355954
80	65	6	9	2026-02-20 16:48:08.213853
81	65	7	9	2026-02-20 16:48:11.763465
82	65	8	9	2026-02-20 16:48:14.727961
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.units (id, society_apartment_id, block_id, floor_id, unit_number, owner_name, resident_name, contact_number, email, k_electric_account, gas_account, water_account, phone_tv_account, car_make_model, license_plate, number_of_cars, created_at, updated_at, telephone_bills, other_bills, is_occupied, number_of_bikes, bike_make_model, bike_license_plate) FROM stdin;
315	31	64	67	B-103	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.216351	2026-02-23 15:45:55.216351	[]	[]	f	0	\N	\N
316	31	64	67	A-104	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.225139	2026-02-23 15:45:55.225139	[]	[]	f	0	\N	\N
317	31	64	67	A-105	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.234132	2026-02-23 15:45:55.234132	[]	[]	f	0	\N	\N
318	31	64	67	C-106	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.23955	2026-02-23 15:45:55.23955	[]	[]	f	0	\N	\N
319	31	64	67	C-107	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.244561	2026-02-23 15:45:55.244561	[]	[]	f	0	\N	\N
320	31	64	67	C-108	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.248106	2026-02-23 15:45:55.248106	[]	[]	f	0	\N	\N
321	31	64	67	C-109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.254452	2026-02-23 15:45:55.254452	[]	[]	f	0	\N	\N
322	31	64	67	C-110	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.259831	2026-02-23 15:45:55.259831	[]	[]	f	0	\N	\N
323	31	64	67	C-111	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.267748	2026-02-23 15:45:55.267748	[]	[]	f	0	\N	\N
311	31	64	66	A-005	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.194707	2026-02-24 12:10:57.72899	[]	[]	f	0	\N	\N
325	31	64	68	A-201	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.278328	2026-02-23 15:45:55.278328	[]	[]	f	0	\N	\N
326	31	64	68	A-202	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.281901	2026-02-23 15:45:55.281901	[]	[]	f	0	\N	\N
327	31	64	68	B-203	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.287229	2026-02-23 15:45:55.287229	[]	[]	f	0	\N	\N
328	31	64	68	A-204	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.292576	2026-02-23 15:45:55.292576	[]	[]	f	0	\N	\N
329	31	64	68	A-205	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.296838	2026-02-23 15:45:55.296838	[]	[]	f	0	\N	\N
330	31	64	68	C-206	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.304725	2026-02-23 15:45:55.304725	[]	[]	f	0	\N	\N
331	31	64	68	C-207	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.31144	2026-02-23 15:45:55.31144	[]	[]	f	0	\N	\N
332	31	64	68	C-208	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.317895	2026-02-23 15:45:55.317895	[]	[]	f	0	\N	\N
333	31	64	68	C-209	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.325644	2026-02-23 15:45:55.325644	[]	[]	f	0	\N	\N
334	31	64	68	D-210	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.329755	2026-02-23 15:45:55.329755	[]	[]	f	0	\N	\N
335	31	64	68	A1-209	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.334787	2026-02-23 15:45:55.334787	[]	[]	f	0	\N	\N
310	31	64	66	A-004	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.190518	2026-02-24 12:11:13.756936	[]	[]	f	0	\N	\N
337	31	64	69	A-301	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.34555	2026-02-23 15:45:55.34555	[]	[]	f	0	\N	\N
338	31	64	69	A-302	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.349604	2026-02-23 15:45:55.349604	[]	[]	f	0	\N	\N
339	31	64	69	B-303	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.353489	2026-02-23 15:45:55.353489	[]	[]	f	0	\N	\N
340	31	64	69	A-304	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.356745	2026-02-23 15:45:55.356745	[]	[]	f	0	\N	\N
341	31	64	69	A-305	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.360508	2026-02-23 15:45:55.360508	[]	[]	f	0	\N	\N
342	31	64	69	C-306	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.364048	2026-02-23 15:45:55.364048	[]	[]	f	0	\N	\N
343	31	64	69	C-307	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.368049	2026-02-23 15:45:55.368049	[]	[]	f	0	\N	\N
344	31	64	69	C-308	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.371549	2026-02-23 15:45:55.371549	[]	[]	f	0	\N	\N
345	31	64	69	C-309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.374668	2026-02-23 15:45:55.374668	[]	[]	f	0	\N	\N
346	31	64	69	D-310	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.377661	2026-02-23 15:45:55.377661	[]	[]	f	0	\N	\N
347	31	64	69	A1-309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.381127	2026-02-23 15:45:55.381127	[]	[]	f	0	\N	\N
309	31	64	66	A-003	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.186224	2026-02-24 12:11:26.62416	[]	[]	f	0	\N	\N
349	31	64	70	A-401	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.387772	2026-02-23 15:45:55.387772	[]	[]	f	0	\N	\N
350	31	64	70	A-402	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.391066	2026-02-23 15:45:55.391066	[]	[]	f	0	\N	\N
351	31	64	70	B-403	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.394381	2026-02-23 15:45:55.394381	[]	[]	f	0	\N	\N
352	31	64	70	A-404	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.397483	2026-02-23 15:45:55.397483	[]	[]	f	0	\N	\N
353	31	64	70	A-405	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.401242	2026-02-23 15:45:55.401242	[]	[]	f	0	\N	\N
354	31	64	70	E-406	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.404464	2026-02-23 15:45:55.404464	[]	[]	f	0	\N	\N
355	31	64	70	E-407	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.407416	2026-02-23 15:45:55.407416	[]	[]	f	0	\N	\N
356	31	64	70	E-408	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.410508	2026-02-23 15:45:55.410508	[]	[]	f	0	\N	\N
357	31	64	70	E-409	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.413417	2026-02-23 15:45:55.413417	[]	[]	f	0	\N	\N
358	31	64	70	E-410	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.417368	2026-02-23 15:45:55.417368	[]	[]	f	0	\N	\N
359	31	64	70	E-411	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.420596	2026-02-23 15:45:55.420596	[]	[]	f	0	\N	\N
308	31	64	66	A-002	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.179678	2026-02-24 12:11:43.0494	[]	[]	f	0	\N	\N
361	31	64	71	A-501	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.426669	2026-02-23 15:45:55.426669	[]	[]	f	0	\N	\N
362	31	64	71	A-502	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.430051	2026-02-23 15:45:55.430051	[]	[]	f	0	\N	\N
363	31	64	71	B-503	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.434172	2026-02-23 15:45:55.434172	[]	[]	f	0	\N	\N
364	31	64	71	A-504	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.437399	2026-02-23 15:45:55.437399	[]	[]	f	0	\N	\N
365	31	64	71	A-505	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.440838	2026-02-23 15:45:55.440838	[]	[]	f	0	\N	\N
366	31	64	71	E-506	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.444148	2026-02-23 15:45:55.444148	[]	[]	f	0	\N	\N
367	31	64	71	E-507	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.447255	2026-02-23 15:45:55.447255	[]	[]	f	0	\N	\N
368	31	64	71	E-508	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.451255	2026-02-23 15:45:55.451255	[]	[]	f	0	\N	\N
369	31	64	71	E-509	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.454469	2026-02-23 15:45:55.454469	[]	[]	f	0	\N	\N
370	31	64	71	E-510	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.457497	2026-02-23 15:45:55.457497	[]	[]	f	0	\N	\N
371	31	64	71	E-511	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.460624	2026-02-23 15:45:55.460624	[]	[]	f	0	\N	\N
307	31	64	66	A-001	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.164748	2026-02-24 12:12:09.60251	[]	[]	f	0	\N	\N
373	31	64	72	A-601	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.467337	2026-02-23 15:45:55.467337	[]	[]	f	0	\N	\N
374	31	64	72	A-602	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.470702	2026-02-23 15:45:55.470702	[]	[]	f	0	\N	\N
375	31	64	72	B-603	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.473816	2026-02-23 15:45:55.473816	[]	[]	f	0	\N	\N
376	31	64	72	A-604	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.476921	2026-02-23 15:45:55.476921	[]	[]	f	0	\N	\N
377	31	64	72	A-605	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.48041	2026-02-23 15:45:55.48041	[]	[]	f	0	\N	\N
378	31	64	72	E-606	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.48496	2026-02-23 15:45:55.48496	[]	[]	f	0	\N	\N
379	31	64	72	E-607	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.488529	2026-02-23 15:45:55.488529	[]	[]	f	0	\N	\N
380	31	64	72	E-608	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.491951	2026-02-23 15:45:55.491951	[]	[]	f	0	\N	\N
381	31	64	72	E-609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.495242	2026-02-23 15:45:55.495242	[]	[]	f	0	\N	\N
382	31	64	72	E-610	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.498344	2026-02-23 15:45:55.498344	[]	[]	f	0	\N	\N
383	31	64	72	E-611	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.502425	2026-02-23 15:45:55.502425	[]	[]	f	0	\N	\N
313	31	64	67	A-101	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.206393	2026-02-24 14:35:40.874534	[]	[]	f	0	\N	\N
385	31	64	73	A-701	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.510765	2026-02-23 15:45:55.510765	[]	[]	f	0	\N	\N
386	31	64	73	A-702	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.514142	2026-02-23 15:45:55.514142	[]	[]	f	0	\N	\N
387	31	64	73	B-703	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.520549	2026-02-23 15:45:55.520549	[]	[]	f	0	\N	\N
314	31	64	67	A-102	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.210539	2026-02-24 14:35:57.93487	[]	[]	f	0	\N	\N
579	31	65	82	E-805	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:26:11.505963	2026-02-27 15:46:58.552995	[]	[]	f	0	\N	\N
388	31	64	73	A-704	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.525132	2026-02-23 15:45:55.525132	[]	[]	f	0	\N	\N
389	31	64	73	A-705	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.529436	2026-02-23 15:45:55.529436	[]	[]	f	0	\N	\N
390	31	64	73	E-706	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.533939	2026-02-23 15:45:55.533939	[]	[]	f	0	\N	\N
391	31	64	73	E-707	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.537529	2026-02-23 15:45:55.537529	[]	[]	f	0	\N	\N
392	31	64	73	E-708	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.540742	2026-02-23 15:45:55.540742	[]	[]	f	0	\N	\N
393	31	64	73	E-709	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.543986	2026-02-23 15:45:55.543986	[]	[]	f	0	\N	\N
394	31	64	73	E-710	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.547426	2026-02-23 15:45:55.547426	[]	[]	f	0	\N	\N
395	31	64	73	E-711	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.55088	2026-02-23 15:45:55.55088	[]	[]	f	0	\N	\N
397	31	64	74	A-801	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.557075	2026-02-23 15:45:55.557075	[]	[]	f	0	\N	\N
398	31	64	74	A-802	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.560203	2026-02-23 15:45:55.560203	[]	[]	f	0	\N	\N
399	31	64	74	B-803	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.563369	2026-02-23 15:45:55.563369	[]	[]	f	0	\N	\N
400	31	64	74	A-804	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.56731	2026-02-23 15:45:55.56731	[]	[]	f	0	\N	\N
401	31	64	74	A-805	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.571478	2026-02-23 15:45:55.571478	[]	[]	f	0	\N	\N
402	31	64	74	E-806	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.574824	2026-02-23 15:45:55.574824	[]	[]	f	0	\N	\N
403	31	64	74	E-807	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.578385	2026-02-23 15:45:55.578385	[]	[]	f	0	\N	\N
404	31	64	74	E-808	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.582439	2026-02-23 15:45:55.582439	[]	[]	f	0	\N	\N
405	31	64	74	E-809	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.586203	2026-02-23 15:45:55.586203	[]	[]	f	0	\N	\N
406	31	64	74	E-810	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.589335	2026-02-23 15:45:55.589335	[]	[]	f	0	\N	\N
407	31	64	74	E-811	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 15:45:55.593497	2026-02-23 15:45:55.593497	[]	[]	f	0	\N	\N
491	31	65	75	A-101	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.353212	2026-02-23 16:04:31.353212	[]	[]	f	0	\N	\N
492	31	65	75	A-102	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.386193	2026-02-23 16:04:31.386193	[]	[]	f	0	\N	\N
493	31	65	75	B-103	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.389523	2026-02-23 16:04:31.389523	[]	[]	f	0	\N	\N
494	31	65	75	A-104	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.392455	2026-02-23 16:04:31.392455	[]	[]	f	0	\N	\N
495	31	65	75	C-109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.395463	2026-02-23 16:04:31.395463	[]	[]	f	0	\N	\N
496	31	65	75	C-106	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.400484	2026-02-23 16:04:31.400484	[]	[]	f	0	\N	\N
497	31	65	75	C-107	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.405516	2026-02-23 16:04:31.405516	[]	[]	f	0	\N	\N
498	31	65	75	C-108	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.409287	2026-02-23 16:04:31.409287	[]	[]	f	0	\N	\N
499	31	65	75	A2-109	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.412715	2026-02-23 16:04:31.412715	[]	[]	f	0	\N	\N
500	31	65	75	A1-105	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.417479	2026-02-23 16:04:31.417479	[]	[]	f	0	\N	\N
501	31	65	76	A-201	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.421356	2026-02-23 16:04:31.421356	[]	[]	f	0	\N	\N
502	31	65	76	A-202	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.424227	2026-02-23 16:04:31.424227	[]	[]	f	0	\N	\N
503	31	65	76	B-203	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.42723	2026-02-23 16:04:31.42723	[]	[]	f	0	\N	\N
504	31	65	76	A-204	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.430089	2026-02-23 16:04:31.430089	[]	[]	f	0	\N	\N
505	31	65	76	A-209	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.435269	2026-02-23 16:04:31.435269	[]	[]	f	0	\N	\N
506	31	65	76	C-206	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.438865	2026-02-23 16:04:31.438865	[]	[]	f	0	\N	\N
507	31	65	76	C-207	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.441809	2026-02-23 16:04:31.441809	[]	[]	f	0	\N	\N
508	31	65	76	C-208	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.444689	2026-02-23 16:04:31.444689	[]	[]	f	0	\N	\N
509	31	65	76	A2-209	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.44836	2026-02-23 16:04:31.44836	[]	[]	f	0	\N	\N
510	31	65	76	A1-205	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.452802	2026-02-23 16:04:31.452802	[]	[]	f	0	\N	\N
511	31	65	77	A-301	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.455748	2026-02-23 16:04:31.455748	[]	[]	f	0	\N	\N
512	31	65	77	A-302	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.458647	2026-02-23 16:04:31.458647	[]	[]	f	0	\N	\N
513	31	65	77	B-303	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.461533	2026-02-23 16:04:31.461533	[]	[]	f	0	\N	\N
514	31	65	77	A-304	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.464891	2026-02-23 16:04:31.464891	[]	[]	f	0	\N	\N
515	31	65	77	A-309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.470024	2026-02-23 16:04:31.470024	[]	[]	f	0	\N	\N
516	31	65	77	C-306	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.473188	2026-02-23 16:04:31.473188	[]	[]	f	0	\N	\N
517	31	65	77	C-307	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.476069	2026-02-23 16:04:31.476069	[]	[]	f	0	\N	\N
518	31	65	77	D-309	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.485299	2026-02-23 16:04:31.485299	[]	[]	f	0	\N	\N
519	31	65	77	C-310	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.48909	2026-02-23 16:04:31.48909	[]	[]	f	0	\N	\N
520	31	65	77	A1-305	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.491946	2026-02-23 16:04:31.491946	[]	[]	f	0	\N	\N
521	31	65	78	A-401	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.495324	2026-02-23 16:04:31.495324	[]	[]	f	0	\N	\N
522	31	65	78	A-402	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.499606	2026-02-23 16:04:31.499606	[]	[]	f	0	\N	\N
523	31	65	78	B-403	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.50451	2026-02-23 16:04:31.50451	[]	[]	f	0	\N	\N
524	31	65	78	A-404	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.508193	2026-02-23 16:04:31.508193	[]	[]	f	0	\N	\N
525	31	65	78	A-409	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.511785	2026-02-23 16:04:31.511785	[]	[]	f	0	\N	\N
526	31	65	78	C-406	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.516204	2026-02-23 16:04:31.516204	[]	[]	f	0	\N	\N
527	31	65	78	C-407	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.519993	2026-02-23 16:04:31.519993	[]	[]	f	0	\N	\N
528	31	65	78	C-408	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.522918	2026-02-23 16:04:31.522918	[]	[]	f	0	\N	\N
529	31	65	78	A2-409	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.526267	2026-02-23 16:04:31.526267	[]	[]	f	0	\N	\N
530	31	65	78	A1-405	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.529173	2026-02-23 16:04:31.529173	[]	[]	f	0	\N	\N
531	31	65	79	A-501	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.533403	2026-02-23 16:04:31.533403	[]	[]	f	0	\N	\N
532	31	65	79	A-502	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.536833	2026-02-23 16:04:31.536833	[]	[]	f	0	\N	\N
533	31	65	79	B-503	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.540663	2026-02-23 16:04:31.540663	[]	[]	f	0	\N	\N
534	31	65	79	A-504	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.544811	2026-02-23 16:04:31.544811	[]	[]	f	0	\N	\N
535	31	65	79	A-509	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.54946	2026-02-23 16:04:31.54946	[]	[]	f	0	\N	\N
536	31	65	79	E-506	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.55471	2026-02-23 16:04:31.55471	[]	[]	f	0	\N	\N
537	31	65	79	E-507	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.558129	2026-02-23 16:04:31.558129	[]	[]	f	0	\N	\N
538	31	65	79	E-508	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.561687	2026-02-23 16:04:31.561687	[]	[]	f	0	\N	\N
539	31	65	79	E-509	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.566053	2026-02-23 16:04:31.566053	[]	[]	f	0	\N	\N
540	31	65	79	E-510	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.570457	2026-02-23 16:04:31.570457	[]	[]	f	0	\N	\N
541	31	65	79	E-505	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.573637	2026-02-23 16:04:31.573637	[]	[]	f	0	\N	\N
542	31	65	80	A-601	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.57668	2026-02-23 16:04:31.57668	[]	[]	f	0	\N	\N
543	31	65	80	A-602	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.57989	2026-02-23 16:04:31.57989	[]	[]	f	0	\N	\N
544	31	65	80	B-603	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.58438	2026-02-23 16:04:31.58438	[]	[]	f	0	\N	\N
545	31	65	80	A-604	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.58775	2026-02-23 16:04:31.58775	[]	[]	f	0	\N	\N
546	31	65	80	A-609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.591701	2026-02-23 16:04:31.591701	[]	[]	f	0	\N	\N
547	31	65	80	E-606	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.594909	2026-02-23 16:04:31.594909	[]	[]	f	0	\N	\N
548	31	65	80	E-607	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.598734	2026-02-23 16:04:31.598734	[]	[]	f	0	\N	\N
549	31	65	80	E-608	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.602434	2026-02-23 16:04:31.602434	[]	[]	f	0	\N	\N
550	31	65	80	E-609	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.60516	2026-02-23 16:04:31.60516	[]	[]	f	0	\N	\N
551	31	65	80	E-610	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.608085	2026-02-23 16:04:31.608085	[]	[]	f	0	\N	\N
552	31	65	80	E-605	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.611183	2026-02-23 16:04:31.611183	[]	[]	f	0	\N	\N
553	31	65	81	A-701	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.614003	2026-02-23 16:04:31.614003	[]	[]	f	0	\N	\N
554	31	65	81	A-702	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.61752	2026-02-23 16:04:31.61752	[]	[]	f	0	\N	\N
555	31	65	81	B-703	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.62077	2026-02-23 16:04:31.62077	[]	[]	f	0	\N	\N
556	31	65	81	A-704	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.624385	2026-02-23 16:04:31.624385	[]	[]	f	0	\N	\N
557	31	65	81	A-709	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.62741	2026-02-23 16:04:31.62741	[]	[]	f	0	\N	\N
558	31	65	81	E-706	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.630259	2026-02-23 16:04:31.630259	[]	[]	f	0	\N	\N
559	31	65	81	E-707	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.633821	2026-02-23 16:04:31.633821	[]	[]	f	0	\N	\N
560	31	65	81	E-708	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.636775	2026-02-23 16:04:31.636775	[]	[]	f	0	\N	\N
561	31	65	81	E-709	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.639487	2026-02-23 16:04:31.639487	[]	[]	f	0	\N	\N
562	31	65	81	E-710	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.642417	2026-02-23 16:04:31.642417	[]	[]	f	0	\N	\N
563	31	65	81	E-705	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.64516	2026-02-23 16:04:31.64516	[]	[]	f	0	\N	\N
564	31	65	82	A-801	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.648556	2026-02-23 16:04:31.648556	[]	[]	f	0	\N	\N
565	31	65	82	A-802	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.651545	2026-02-23 16:04:31.651545	[]	[]	f	0	\N	\N
566	31	65	82	B-803	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.65428	2026-02-23 16:04:31.65428	[]	[]	f	0	\N	\N
567	31	65	82	A-804	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.657103	2026-02-23 16:04:31.657103	[]	[]	f	0	\N	\N
568	31	65	82	A-809	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.659815	2026-02-23 16:04:31.659815	[]	[]	f	0	\N	\N
569	31	65	82	E-806 (I)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.662713	2026-02-23 16:04:31.662713	[]	[]	f	0	\N	\N
570	31	65	82	E-806 (II)	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.666072	2026-02-23 16:04:31.666072	[]	[]	f	0	\N	\N
571	31	65	82	E-807	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:04:31.669232	2026-02-23 16:04:31.669232	[]	[]	f	0	\N	\N
576	31	65	82	E-808	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:21:43.349591	2026-02-23 16:21:43.349591	{}	{}	f	0	\N	\N
577	31	65	82	E-809	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:21:53.328168	2026-02-23 16:21:53.328168	{}	{}	f	0	\N	\N
578	31	65	82	E-810	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	0	2026-02-23 16:22:03.08544	2026-02-23 16:22:03.08544	{}	{}	f	0	\N	\N
\.


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.complaints (id, unit_id, society_apartment_id, submitted_by, assigned_to, title, description, status, priority, is_public, attachments, created_at, updated_at, type, remarks, submitted_by_name_override, escalated_at, escalated_by, escalation_reason, resolved_by_super_at, resolved_by_super_id, resolution_notes) FROM stdin;
\.


--
-- Data for Name: complaint_progress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.complaint_progress (id, complaint_id, updated_by, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: maintenance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenance (id, unit_id, society_apartment_id, month, year, base_amount, total_amount, status, amount_paid, due_date, created_at, updated_at, payment_date, receipt_path) FROM stdin;
267	307	31	2	2026	4000.00	4000.00	paid	4000.00	2026-02-28	2026-02-23 16:48:05.609884	2026-02-23 16:50:34.944821	\N	\N
268	307	31	3	2026	4000.00	4000.00	pending	0.00	\N	2026-02-23 16:51:39.620158	2026-02-23 16:51:39.620158	\N	\N
280	308	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.007466	2026-02-23 16:58:19.007466	\N	\N
281	308	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.010851	2026-02-23 16:58:19.010851	\N	\N
292	309	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.042302	2026-02-23 16:58:19.042302	\N	\N
293	309	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.044598	2026-02-23 16:58:19.044598	\N	\N
303	310	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.072739	2026-02-23 16:58:19.072739	\N	\N
603	337	31	1	2026	4000.00	4000.00	paid	4000.00	\N	2026-02-23 16:58:19.817152	2026-03-02 16:19:31.949333	\N	\N
305	310	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.077589	2026-02-23 16:58:19.077589	\N	\N
316	311	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.110405	2026-02-23 16:58:19.110405	\N	\N
317	311	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.114438	2026-02-23 16:58:19.114438	\N	\N
327	579	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.140966	2026-02-23 16:58:19.140966	\N	\N
328	579	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.143726	2026-02-23 16:58:19.143726	\N	\N
329	579	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.147472	2026-02-23 16:58:19.147472	\N	\N
339	313	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.190346	2026-02-23 16:58:19.190346	\N	\N
340	313	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.192852	2026-02-23 16:58:19.192852	\N	\N
341	313	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.195529	2026-02-23 16:58:19.195529	\N	\N
269	307	31	1	2026	4000.00	4000.00	paid	4000.00	\N	2026-02-23 16:58:18.961793	2026-02-27 15:17:26.360533	2026-02-27	\N
279	308	31	1	2026	4000.00	4000.00	partially_paid	3000.00	\N	2026-02-23 16:58:19.004885	2026-02-27 15:38:15.044343	\N	\N
291	309	31	1	2026	4000.00	4000.00	paid	4000.00	\N	2026-02-23 16:58:19.040123	2026-02-27 16:37:30.738976	\N	\N
315	311	31	1	2026	4000.00	4000.00	paid	4000.00	\N	2026-02-23 16:58:19.10796	2026-02-27 16:43:37.699739	2026-02-27	\N
351	314	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.219833	2026-02-23 16:58:19.219833	\N	\N
352	314	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.221924	2026-02-23 16:58:19.221924	\N	\N
353	314	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.22394	2026-02-23 16:58:19.22394	\N	\N
363	315	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.246686	2026-02-23 16:58:19.246686	\N	\N
364	315	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.249459	2026-02-23 16:58:19.249459	\N	\N
365	315	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.251489	2026-02-23 16:58:19.251489	\N	\N
375	316	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.272922	2026-02-23 16:58:19.272922	\N	\N
376	316	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.274843	2026-02-23 16:58:19.274843	\N	\N
377	316	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.276875	2026-02-23 16:58:19.276875	\N	\N
387	317	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.301269	2026-02-23 16:58:19.301269	\N	\N
388	317	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.303146	2026-02-23 16:58:19.303146	\N	\N
389	317	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.305314	2026-02-23 16:58:19.305314	\N	\N
401	318	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.333236	2026-02-23 16:58:19.333236	\N	\N
411	319	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.357425	2026-02-23 16:58:19.357425	\N	\N
412	319	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.360068	2026-02-23 16:58:19.360068	\N	\N
413	319	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.363044	2026-02-23 16:58:19.363044	\N	\N
423	320	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.38998	2026-02-23 16:58:19.38998	\N	\N
424	320	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.39187	2026-02-23 16:58:19.39187	\N	\N
425	320	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.393932	2026-02-23 16:58:19.393932	\N	\N
400	318	31	2	2026	4000.00	4000.00	paid	4000.00	\N	2026-02-23 16:58:19.331064	2026-03-02 15:02:22.405643	2026-03-02	\N
435	321	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.417772	2026-02-23 16:58:19.417772	\N	\N
436	321	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.419833	2026-02-23 16:58:19.419833	\N	\N
437	321	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.421879	2026-02-23 16:58:19.421879	\N	\N
447	322	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.443828	2026-02-23 16:58:19.443828	\N	\N
448	322	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.446873	2026-02-23 16:58:19.446873	\N	\N
449	322	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.450834	2026-02-23 16:58:19.450834	\N	\N
459	323	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.472664	2026-02-23 16:58:19.472664	\N	\N
460	323	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.474662	2026-02-23 16:58:19.474662	\N	\N
461	323	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.476812	2026-02-23 16:58:19.476812	\N	\N
471	325	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.501005	2026-02-23 16:58:19.501005	\N	\N
472	325	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.502955	2026-02-23 16:58:19.502955	\N	\N
473	325	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.504814	2026-02-23 16:58:19.504814	\N	\N
483	326	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.527276	2026-02-23 16:58:19.527276	\N	\N
484	326	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.530131	2026-02-23 16:58:19.530131	\N	\N
485	326	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.532779	2026-02-23 16:58:19.532779	\N	\N
495	327	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.555572	2026-02-23 16:58:19.555572	\N	\N
496	327	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.559606	2026-02-23 16:58:19.559606	\N	\N
497	327	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.564262	2026-02-23 16:58:19.564262	\N	\N
507	328	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.593202	2026-02-23 16:58:19.593202	\N	\N
508	328	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.595211	2026-02-23 16:58:19.595211	\N	\N
509	328	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.598625	2026-02-23 16:58:19.598625	\N	\N
519	329	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.620635	2026-02-23 16:58:19.620635	\N	\N
520	329	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.622691	2026-02-23 16:58:19.622691	\N	\N
521	329	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.624602	2026-02-23 16:58:19.624602	\N	\N
531	330	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.649104	2026-02-23 16:58:19.649104	\N	\N
532	330	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.651137	2026-02-23 16:58:19.651137	\N	\N
533	330	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.652979	2026-02-23 16:58:19.652979	\N	\N
543	331	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.675445	2026-02-23 16:58:19.675445	\N	\N
544	331	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.677773	2026-02-23 16:58:19.677773	\N	\N
545	331	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.681453	2026-02-23 16:58:19.681453	\N	\N
555	332	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.703531	2026-02-23 16:58:19.703531	\N	\N
556	332	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.705383	2026-02-23 16:58:19.705383	\N	\N
557	332	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.707577	2026-02-23 16:58:19.707577	\N	\N
567	333	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.72929	2026-02-23 16:58:19.72929	\N	\N
568	333	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.73259	2026-02-23 16:58:19.73259	\N	\N
569	333	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.734785	2026-02-23 16:58:19.734785	\N	\N
579	334	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.757255	2026-02-23 16:58:19.757255	\N	\N
580	334	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.759785	2026-02-23 16:58:19.759785	\N	\N
581	334	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.763008	2026-02-23 16:58:19.763008	\N	\N
591	335	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.790751	2026-02-23 16:58:19.790751	\N	\N
592	335	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.792759	2026-02-23 16:58:19.792759	\N	\N
593	335	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.794808	2026-02-23 16:58:19.794808	\N	\N
604	337	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.818987	2026-02-23 16:58:19.818987	\N	\N
605	337	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.821054	2026-02-23 16:58:19.821054	\N	\N
615	338	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.842703	2026-02-23 16:58:19.842703	\N	\N
616	338	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.844645	2026-02-23 16:58:19.844645	\N	\N
617	338	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.848652	2026-02-23 16:58:19.848652	\N	\N
627	339	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.881904	2026-02-23 16:58:19.881904	\N	\N
628	339	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.884078	2026-02-23 16:58:19.884078	\N	\N
629	339	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.885982	2026-02-23 16:58:19.885982	\N	\N
639	340	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.90746	2026-02-23 16:58:19.90746	\N	\N
640	340	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.9094	2026-02-23 16:58:19.9094	\N	\N
641	340	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.911293	2026-02-23 16:58:19.911293	\N	\N
651	341	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.93394	2026-02-23 16:58:19.93394	\N	\N
652	341	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.935921	2026-02-23 16:58:19.935921	\N	\N
653	341	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.937722	2026-02-23 16:58:19.937722	\N	\N
663	342	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.961686	2026-02-23 16:58:19.961686	\N	\N
664	342	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:19.965538	2026-02-23 16:58:19.965538	\N	\N
665	342	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:19.970411	2026-02-23 16:58:19.970411	\N	\N
675	343	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:19.999784	2026-02-23 16:58:19.999784	\N	\N
676	343	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.001863	2026-02-23 16:58:20.001863	\N	\N
677	343	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.003806	2026-02-23 16:58:20.003806	\N	\N
687	344	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.024716	2026-02-23 16:58:20.024716	\N	\N
688	344	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.02666	2026-02-23 16:58:20.02666	\N	\N
689	344	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.028721	2026-02-23 16:58:20.028721	\N	\N
699	345	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.051888	2026-02-23 16:58:20.051888	\N	\N
700	345	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.054229	2026-02-23 16:58:20.054229	\N	\N
701	345	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.056343	2026-02-23 16:58:20.056343	\N	\N
711	346	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.077147	2026-02-23 16:58:20.077147	\N	\N
712	346	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.080268	2026-02-23 16:58:20.080268	\N	\N
713	346	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.0827	2026-02-23 16:58:20.0827	\N	\N
723	347	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.10393	2026-02-23 16:58:20.10393	\N	\N
724	347	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.105934	2026-02-23 16:58:20.105934	\N	\N
725	347	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.107924	2026-02-23 16:58:20.107924	\N	\N
735	349	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.131252	2026-02-23 16:58:20.131252	\N	\N
736	349	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.133536	2026-02-23 16:58:20.133536	\N	\N
737	349	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.136024	2026-02-23 16:58:20.136024	\N	\N
747	350	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.158113	2026-02-23 16:58:20.158113	\N	\N
748	350	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.160684	2026-02-23 16:58:20.160684	\N	\N
749	350	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.165094	2026-02-23 16:58:20.165094	\N	\N
759	351	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.192625	2026-02-23 16:58:20.192625	\N	\N
760	351	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.194542	2026-02-23 16:58:20.194542	\N	\N
761	351	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.197742	2026-02-23 16:58:20.197742	\N	\N
771	352	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.218482	2026-02-23 16:58:20.218482	\N	\N
772	352	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.220359	2026-02-23 16:58:20.220359	\N	\N
773	352	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.222308	2026-02-23 16:58:20.222308	\N	\N
783	353	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.242686	2026-02-23 16:58:20.242686	\N	\N
784	353	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.244543	2026-02-23 16:58:20.244543	\N	\N
785	353	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.247914	2026-02-23 16:58:20.247914	\N	\N
795	354	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.268863	2026-02-23 16:58:20.268863	\N	\N
796	354	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.270725	2026-02-23 16:58:20.270725	\N	\N
797	354	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.27278	2026-02-23 16:58:20.27278	\N	\N
807	355	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.293456	2026-02-23 16:58:20.293456	\N	\N
808	355	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.295337	2026-02-23 16:58:20.295337	\N	\N
809	355	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.298541	2026-02-23 16:58:20.298541	\N	\N
819	356	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.319622	2026-02-23 16:58:20.319622	\N	\N
820	356	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.321589	2026-02-23 16:58:20.321589	\N	\N
821	356	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.323415	2026-02-23 16:58:20.323415	\N	\N
831	357	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.344073	2026-02-23 16:58:20.344073	\N	\N
832	357	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.347014	2026-02-23 16:58:20.347014	\N	\N
833	357	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.349354	2026-02-23 16:58:20.349354	\N	\N
843	358	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.376412	2026-02-23 16:58:20.376412	\N	\N
844	358	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.378416	2026-02-23 16:58:20.378416	\N	\N
845	358	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.382303	2026-02-23 16:58:20.382303	\N	\N
855	359	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.403724	2026-02-23 16:58:20.403724	\N	\N
856	359	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.405479	2026-02-23 16:58:20.405479	\N	\N
857	359	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.407549	2026-02-23 16:58:20.407549	\N	\N
867	361	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.428857	2026-02-23 16:58:20.428857	\N	\N
868	361	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.431671	2026-02-23 16:58:20.431671	\N	\N
869	361	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.433774	2026-02-23 16:58:20.433774	\N	\N
879	362	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.458302	2026-02-23 16:58:20.458302	\N	\N
880	362	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.460874	2026-02-23 16:58:20.460874	\N	\N
881	362	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.464987	2026-02-23 16:58:20.464987	\N	\N
891	363	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.485683	2026-02-23 16:58:20.485683	\N	\N
892	363	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.487657	2026-02-23 16:58:20.487657	\N	\N
893	363	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.489591	2026-02-23 16:58:20.489591	\N	\N
903	364	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.51011	2026-02-23 16:58:20.51011	\N	\N
904	364	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.512071	2026-02-23 16:58:20.512071	\N	\N
905	364	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.515204	2026-02-23 16:58:20.515204	\N	\N
915	365	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.537418	2026-02-23 16:58:20.537418	\N	\N
916	365	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.539903	2026-02-23 16:58:20.539903	\N	\N
917	365	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.541819	2026-02-23 16:58:20.541819	\N	\N
927	366	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.570054	2026-02-23 16:58:20.570054	\N	\N
928	366	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.573563	2026-02-23 16:58:20.573563	\N	\N
929	366	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.598088	2026-02-23 16:58:20.598088	\N	\N
939	367	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.619187	2026-02-23 16:58:20.619187	\N	\N
940	367	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.621077	2026-02-23 16:58:20.621077	\N	\N
941	367	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.62305	2026-02-23 16:58:20.62305	\N	\N
951	368	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.647256	2026-02-23 16:58:20.647256	\N	\N
952	368	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.650102	2026-02-23 16:58:20.650102	\N	\N
953	368	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.652177	2026-02-23 16:58:20.652177	\N	\N
963	369	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.67345	2026-02-23 16:58:20.67345	\N	\N
964	369	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.675258	2026-02-23 16:58:20.675258	\N	\N
965	369	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.677242	2026-02-23 16:58:20.677242	\N	\N
975	370	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.699079	2026-02-23 16:58:20.699079	\N	\N
976	370	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.700923	2026-02-23 16:58:20.700923	\N	\N
977	370	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.702944	2026-02-23 16:58:20.702944	\N	\N
987	371	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.725092	2026-02-23 16:58:20.725092	\N	\N
988	371	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.727051	2026-02-23 16:58:20.727051	\N	\N
989	371	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.729497	2026-02-23 16:58:20.729497	\N	\N
999	373	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.752536	2026-02-23 16:58:20.752536	\N	\N
1000	373	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.754693	2026-02-23 16:58:20.754693	\N	\N
1001	373	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.757468	2026-02-23 16:58:20.757468	\N	\N
1011	374	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.788395	2026-02-23 16:58:20.788395	\N	\N
1012	374	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.790532	2026-02-23 16:58:20.790532	\N	\N
1013	374	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.792433	2026-02-23 16:58:20.792433	\N	\N
1023	375	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.815448	2026-02-23 16:58:20.815448	\N	\N
1024	375	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.81745	2026-02-23 16:58:20.81745	\N	\N
1025	375	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.81978	2026-02-23 16:58:20.81978	\N	\N
1035	376	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.840094	2026-02-23 16:58:20.840094	\N	\N
1036	376	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.841894	2026-02-23 16:58:20.841894	\N	\N
1037	376	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.843697	2026-02-23 16:58:20.843697	\N	\N
1047	377	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.873022	2026-02-23 16:58:20.873022	\N	\N
1048	377	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.875114	2026-02-23 16:58:20.875114	\N	\N
1049	377	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.879697	2026-02-23 16:58:20.879697	\N	\N
1059	378	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.914938	2026-02-23 16:58:20.914938	\N	\N
1060	378	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.916842	2026-02-23 16:58:20.916842	\N	\N
1061	378	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.918747	2026-02-23 16:58:20.918747	\N	\N
1071	379	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.938965	2026-02-23 16:58:20.938965	\N	\N
1072	379	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.940907	2026-02-23 16:58:20.940907	\N	\N
1073	379	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.942684	2026-02-23 16:58:20.942684	\N	\N
1083	380	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.968372	2026-02-23 16:58:20.968372	\N	\N
1084	380	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.971041	2026-02-23 16:58:20.971041	\N	\N
1085	380	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:20.973267	2026-02-23 16:58:20.973267	\N	\N
1095	381	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:20.996915	2026-02-23 16:58:20.996915	\N	\N
1096	381	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:20.999336	2026-02-23 16:58:20.999336	\N	\N
1097	381	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.001298	2026-02-23 16:58:21.001298	\N	\N
1107	382	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.022027	2026-02-23 16:58:21.022027	\N	\N
1108	382	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.023783	2026-02-23 16:58:21.023783	\N	\N
1109	382	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.025747	2026-02-23 16:58:21.025747	\N	\N
1119	383	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.04775	2026-02-23 16:58:21.04775	\N	\N
1120	383	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.049928	2026-02-23 16:58:21.049928	\N	\N
1121	383	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.051838	2026-02-23 16:58:21.051838	\N	\N
1131	385	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.07407	2026-02-23 16:58:21.07407	\N	\N
1132	385	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.075852	2026-02-23 16:58:21.075852	\N	\N
1133	385	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.077846	2026-02-23 16:58:21.077846	\N	\N
1143	386	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.099392	2026-02-23 16:58:21.099392	\N	\N
1144	386	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.101197	2026-02-23 16:58:21.101197	\N	\N
1145	386	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.103092	2026-02-23 16:58:21.103092	\N	\N
1155	387	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.124042	2026-02-23 16:58:21.124042	\N	\N
1156	387	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.125882	2026-02-23 16:58:21.125882	\N	\N
1157	387	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.127838	2026-02-23 16:58:21.127838	\N	\N
1167	388	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.149955	2026-02-23 16:58:21.149955	\N	\N
1168	388	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.151976	2026-02-23 16:58:21.151976	\N	\N
1169	388	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.15397	2026-02-23 16:58:21.15397	\N	\N
1179	389	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.182222	2026-02-23 16:58:21.182222	\N	\N
1180	389	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.185641	2026-02-23 16:58:21.185641	\N	\N
1181	389	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.18846	2026-02-23 16:58:21.18846	\N	\N
1191	390	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.209524	2026-02-23 16:58:21.209524	\N	\N
1192	390	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.211385	2026-02-23 16:58:21.211385	\N	\N
1193	390	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.214619	2026-02-23 16:58:21.214619	\N	\N
1203	391	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.235644	2026-02-23 16:58:21.235644	\N	\N
1204	391	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.237481	2026-02-23 16:58:21.237481	\N	\N
1205	391	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.239215	2026-02-23 16:58:21.239215	\N	\N
1215	392	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.259277	2026-02-23 16:58:21.259277	\N	\N
1216	392	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.261339	2026-02-23 16:58:21.261339	\N	\N
1217	392	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.264596	2026-02-23 16:58:21.264596	\N	\N
1227	393	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.285278	2026-02-23 16:58:21.285278	\N	\N
1228	393	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.287109	2026-02-23 16:58:21.287109	\N	\N
1229	393	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.288865	2026-02-23 16:58:21.288865	\N	\N
1239	394	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.309161	2026-02-23 16:58:21.309161	\N	\N
1240	394	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.311193	2026-02-23 16:58:21.311193	\N	\N
1241	394	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.314247	2026-02-23 16:58:21.314247	\N	\N
1251	395	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.335753	2026-02-23 16:58:21.335753	\N	\N
1252	395	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.337641	2026-02-23 16:58:21.337641	\N	\N
1253	395	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.339578	2026-02-23 16:58:21.339578	\N	\N
1263	397	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.361354	2026-02-23 16:58:21.361354	\N	\N
1264	397	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.364872	2026-02-23 16:58:21.364872	\N	\N
1265	397	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.370106	2026-02-23 16:58:21.370106	\N	\N
1275	398	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.392513	2026-02-23 16:58:21.392513	\N	\N
1276	398	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.394399	2026-02-23 16:58:21.394399	\N	\N
1277	398	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.39794	2026-02-23 16:58:21.39794	\N	\N
1287	399	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.419214	2026-02-23 16:58:21.419214	\N	\N
1288	399	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.421342	2026-02-23 16:58:21.421342	\N	\N
1289	399	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.423268	2026-02-23 16:58:21.423268	\N	\N
1299	400	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.443507	2026-02-23 16:58:21.443507	\N	\N
1300	400	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.446107	2026-02-23 16:58:21.446107	\N	\N
1301	400	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.44857	2026-02-23 16:58:21.44857	\N	\N
1311	401	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.468956	2026-02-23 16:58:21.468956	\N	\N
1312	401	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.470963	2026-02-23 16:58:21.470963	\N	\N
1313	401	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.472765	2026-02-23 16:58:21.472765	\N	\N
1323	402	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.492852	2026-02-23 16:58:21.492852	\N	\N
1324	402	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.494785	2026-02-23 16:58:21.494785	\N	\N
1325	402	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.497954	2026-02-23 16:58:21.497954	\N	\N
1335	403	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.519087	2026-02-23 16:58:21.519087	\N	\N
1336	403	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.521401	2026-02-23 16:58:21.521401	\N	\N
1337	403	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.523295	2026-02-23 16:58:21.523295	\N	\N
1347	404	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.544705	2026-02-23 16:58:21.544705	\N	\N
1348	404	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.548007	2026-02-23 16:58:21.548007	\N	\N
1349	404	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.549971	2026-02-23 16:58:21.549971	\N	\N
1359	405	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.575777	2026-02-23 16:58:21.575777	\N	\N
1360	405	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.578011	2026-02-23 16:58:21.578011	\N	\N
1361	405	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.581457	2026-02-23 16:58:21.581457	\N	\N
1371	406	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.603273	2026-02-23 16:58:21.603273	\N	\N
1372	406	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.605187	2026-02-23 16:58:21.605187	\N	\N
1373	406	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.606979	2026-02-23 16:58:21.606979	\N	\N
1383	407	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.626874	2026-02-23 16:58:21.626874	\N	\N
1384	407	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.629683	2026-02-23 16:58:21.629683	\N	\N
1385	407	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.632084	2026-02-23 16:58:21.632084	\N	\N
1395	491	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.65223	2026-02-23 16:58:21.65223	\N	\N
1396	491	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.654144	2026-02-23 16:58:21.654144	\N	\N
1397	491	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.655882	2026-02-23 16:58:21.655882	\N	\N
1407	492	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.676135	2026-02-23 16:58:21.676135	\N	\N
1408	492	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.678059	2026-02-23 16:58:21.678059	\N	\N
1409	492	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.681153	2026-02-23 16:58:21.681153	\N	\N
1419	493	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.701639	2026-02-23 16:58:21.701639	\N	\N
1420	493	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.703594	2026-02-23 16:58:21.703594	\N	\N
1421	493	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.705515	2026-02-23 16:58:21.705515	\N	\N
1431	494	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.725409	2026-02-23 16:58:21.725409	\N	\N
1432	494	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.727211	2026-02-23 16:58:21.727211	\N	\N
1433	494	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.729946	2026-02-23 16:58:21.729946	\N	\N
1443	495	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.751198	2026-02-23 16:58:21.751198	\N	\N
1444	495	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.753288	2026-02-23 16:58:21.753288	\N	\N
1445	495	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.755214	2026-02-23 16:58:21.755214	\N	\N
1455	496	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.781826	2026-02-23 16:58:21.781826	\N	\N
1456	496	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.784387	2026-02-23 16:58:21.784387	\N	\N
1457	496	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.786759	2026-02-23 16:58:21.786759	\N	\N
1467	497	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.809606	2026-02-23 16:58:21.809606	\N	\N
1468	497	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.811509	2026-02-23 16:58:21.811509	\N	\N
1469	497	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.814761	2026-02-23 16:58:21.814761	\N	\N
1479	498	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.836418	2026-02-23 16:58:21.836418	\N	\N
1480	498	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.838514	2026-02-23 16:58:21.838514	\N	\N
1481	498	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.840383	2026-02-23 16:58:21.840383	\N	\N
1491	499	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.86352	2026-02-23 16:58:21.86352	\N	\N
1492	499	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.865799	2026-02-23 16:58:21.865799	\N	\N
1493	499	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.867674	2026-02-23 16:58:21.867674	\N	\N
1503	500	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.888135	2026-02-23 16:58:21.888135	\N	\N
1504	500	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.890149	2026-02-23 16:58:21.890149	\N	\N
1505	500	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.892025	2026-02-23 16:58:21.892025	\N	\N
1515	501	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.91411	2026-02-23 16:58:21.91411	\N	\N
1516	501	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.916851	2026-02-23 16:58:21.916851	\N	\N
1517	501	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.919264	2026-02-23 16:58:21.919264	\N	\N
1527	502	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.939966	2026-02-23 16:58:21.939966	\N	\N
1528	502	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.942027	2026-02-23 16:58:21.942027	\N	\N
1529	502	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.944142	2026-02-23 16:58:21.944142	\N	\N
1539	503	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.967633	2026-02-23 16:58:21.967633	\N	\N
1540	503	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:21.969919	2026-02-23 16:58:21.969919	\N	\N
1541	503	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:21.974267	2026-02-23 16:58:21.974267	\N	\N
1551	504	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:21.999242	2026-02-23 16:58:21.999242	\N	\N
1552	504	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.00167	2026-02-23 16:58:22.00167	\N	\N
1553	504	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.003785	2026-02-23 16:58:22.003785	\N	\N
1563	505	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.026664	2026-02-23 16:58:22.026664	\N	\N
1564	505	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.028623	2026-02-23 16:58:22.028623	\N	\N
1565	505	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.032016	2026-02-23 16:58:22.032016	\N	\N
1575	506	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.053166	2026-02-23 16:58:22.053166	\N	\N
1576	506	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.055022	2026-02-23 16:58:22.055022	\N	\N
1577	506	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.056994	2026-02-23 16:58:22.056994	\N	\N
1587	507	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.078034	2026-02-23 16:58:22.078034	\N	\N
1588	507	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.081208	2026-02-23 16:58:22.081208	\N	\N
1589	507	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.083328	2026-02-23 16:58:22.083328	\N	\N
1599	508	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.103708	2026-02-23 16:58:22.103708	\N	\N
1600	508	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.105453	2026-02-23 16:58:22.105453	\N	\N
1601	508	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.107453	2026-02-23 16:58:22.107453	\N	\N
1611	509	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.12805	2026-02-23 16:58:22.12805	\N	\N
1612	509	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.131305	2026-02-23 16:58:22.131305	\N	\N
1613	509	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.133555	2026-02-23 16:58:22.133555	\N	\N
1623	510	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.153967	2026-02-23 16:58:22.153967	\N	\N
1624	510	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.155793	2026-02-23 16:58:22.155793	\N	\N
1625	510	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.157785	2026-02-23 16:58:22.157785	\N	\N
1635	511	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.188335	2026-02-23 16:58:22.188335	\N	\N
1636	511	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.190765	2026-02-23 16:58:22.190765	\N	\N
1637	511	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.193317	2026-02-23 16:58:22.193317	\N	\N
1647	512	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.224272	2026-02-23 16:58:22.224272	\N	\N
1648	512	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.226055	2026-02-23 16:58:22.226055	\N	\N
1649	512	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.228057	2026-02-23 16:58:22.228057	\N	\N
1659	513	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.653853	2026-02-23 16:58:22.653853	\N	\N
1660	513	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.667434	2026-02-23 16:58:22.667434	\N	\N
1661	513	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.741666	2026-02-23 16:58:22.741666	\N	\N
1671	514	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.797789	2026-02-23 16:58:22.797789	\N	\N
1672	514	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.801555	2026-02-23 16:58:22.801555	\N	\N
1673	514	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.80495	2026-02-23 16:58:22.80495	\N	\N
1683	515	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.831226	2026-02-23 16:58:22.831226	\N	\N
1684	515	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.833197	2026-02-23 16:58:22.833197	\N	\N
1685	515	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.835085	2026-02-23 16:58:22.835085	\N	\N
1695	516	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.855273	2026-02-23 16:58:22.855273	\N	\N
1696	516	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.857711	2026-02-23 16:58:22.857711	\N	\N
1697	516	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.860164	2026-02-23 16:58:22.860164	\N	\N
1707	517	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.890184	2026-02-23 16:58:22.890184	\N	\N
1708	517	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.892137	2026-02-23 16:58:22.892137	\N	\N
1709	517	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.893912	2026-02-23 16:58:22.893912	\N	\N
1719	518	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.9149	2026-02-23 16:58:22.9149	\N	\N
1720	518	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.917003	2026-02-23 16:58:22.917003	\N	\N
1721	518	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.919271	2026-02-23 16:58:22.919271	\N	\N
1731	519	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.941946	2026-02-23 16:58:22.941946	\N	\N
1732	519	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.943709	2026-02-23 16:58:22.943709	\N	\N
1733	519	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.947473	2026-02-23 16:58:22.947473	\N	\N
1743	520	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.969319	2026-02-23 16:58:22.969319	\N	\N
1744	520	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.971278	2026-02-23 16:58:22.971278	\N	\N
1745	520	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:22.97324	2026-02-23 16:58:22.97324	\N	\N
1755	521	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:22.99515	2026-02-23 16:58:22.99515	\N	\N
1756	521	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:22.998955	2026-02-23 16:58:22.998955	\N	\N
1757	521	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.001474	2026-02-23 16:58:23.001474	\N	\N
1767	522	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.031154	2026-02-23 16:58:23.031154	\N	\N
1768	522	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.033188	2026-02-23 16:58:23.033188	\N	\N
1769	522	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.034926	2026-02-23 16:58:23.034926	\N	\N
1779	523	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.05421	2026-02-23 16:58:23.05421	\N	\N
1780	523	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.055857	2026-02-23 16:58:23.055857	\N	\N
1781	523	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.057834	2026-02-23 16:58:23.057834	\N	\N
1791	524	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.085102	2026-02-23 16:58:23.085102	\N	\N
1792	524	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.087176	2026-02-23 16:58:23.087176	\N	\N
1793	524	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.089279	2026-02-23 16:58:23.089279	\N	\N
1803	525	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.108889	2026-02-23 16:58:23.108889	\N	\N
1804	525	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.110584	2026-02-23 16:58:23.110584	\N	\N
1805	525	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.113544	2026-02-23 16:58:23.113544	\N	\N
1815	526	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.132856	2026-02-23 16:58:23.132856	\N	\N
1816	526	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.134551	2026-02-23 16:58:23.134551	\N	\N
1817	526	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.136174	2026-02-23 16:58:23.136174	\N	\N
1827	527	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.155239	2026-02-23 16:58:23.155239	\N	\N
1828	527	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.156919	2026-02-23 16:58:23.156919	\N	\N
1829	527	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.159054	2026-02-23 16:58:23.159054	\N	\N
1839	528	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.180158	2026-02-23 16:58:23.180158	\N	\N
1840	528	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.182364	2026-02-23 16:58:23.182364	\N	\N
1841	528	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.184234	2026-02-23 16:58:23.184234	\N	\N
1851	529	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.203566	2026-02-23 16:58:23.203566	\N	\N
1852	529	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.205315	2026-02-23 16:58:23.205315	\N	\N
1853	529	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.206975	2026-02-23 16:58:23.206975	\N	\N
1863	530	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.226057	2026-02-23 16:58:23.226057	\N	\N
1864	530	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.227927	2026-02-23 16:58:23.227927	\N	\N
1865	530	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.230964	2026-02-23 16:58:23.230964	\N	\N
1875	531	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.250692	2026-02-23 16:58:23.250692	\N	\N
1876	531	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.252473	2026-02-23 16:58:23.252473	\N	\N
1877	531	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.254277	2026-02-23 16:58:23.254277	\N	\N
1887	532	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.278406	2026-02-23 16:58:23.278406	\N	\N
1888	532	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.282143	2026-02-23 16:58:23.282143	\N	\N
1889	532	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.28414	2026-02-23 16:58:23.28414	\N	\N
1899	533	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.305123	2026-02-23 16:58:23.305123	\N	\N
1900	533	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.306938	2026-02-23 16:58:23.306938	\N	\N
1901	533	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.308623	2026-02-23 16:58:23.308623	\N	\N
1911	534	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.328406	2026-02-23 16:58:23.328406	\N	\N
1912	534	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.331426	2026-02-23 16:58:23.331426	\N	\N
1913	534	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.333257	2026-02-23 16:58:23.333257	\N	\N
1923	535	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.352412	2026-02-23 16:58:23.352412	\N	\N
1924	535	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.354171	2026-02-23 16:58:23.354171	\N	\N
1925	535	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.355857	2026-02-23 16:58:23.355857	\N	\N
1935	536	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.374646	2026-02-23 16:58:23.374646	\N	\N
1936	536	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.376291	2026-02-23 16:58:23.376291	\N	\N
1937	536	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.37806	2026-02-23 16:58:23.37806	\N	\N
1947	537	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.398135	2026-02-23 16:58:23.398135	\N	\N
1948	537	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.399997	2026-02-23 16:58:23.399997	\N	\N
1949	537	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.401752	2026-02-23 16:58:23.401752	\N	\N
1959	538	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.420742	2026-02-23 16:58:23.420742	\N	\N
1960	538	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.422522	2026-02-23 16:58:23.422522	\N	\N
1961	538	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.424239	2026-02-23 16:58:23.424239	\N	\N
1971	539	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.443445	2026-02-23 16:58:23.443445	\N	\N
1972	539	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.445284	2026-02-23 16:58:23.445284	\N	\N
1973	539	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.448162	2026-02-23 16:58:23.448162	\N	\N
1983	540	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.471423	2026-02-23 16:58:23.471423	\N	\N
1984	540	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.475834	2026-02-23 16:58:23.475834	\N	\N
1985	540	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.47791	2026-02-23 16:58:23.47791	\N	\N
1995	541	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.500305	2026-02-23 16:58:23.500305	\N	\N
1996	541	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.502064	2026-02-23 16:58:23.502064	\N	\N
1997	541	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.503684	2026-02-23 16:58:23.503684	\N	\N
2007	542	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.523264	2026-02-23 16:58:23.523264	\N	\N
2008	542	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.524898	2026-02-23 16:58:23.524898	\N	\N
2009	542	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.526672	2026-02-23 16:58:23.526672	\N	\N
2019	543	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.547337	2026-02-23 16:58:23.547337	\N	\N
2020	543	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.549487	2026-02-23 16:58:23.549487	\N	\N
2021	543	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.55368	2026-02-23 16:58:23.55368	\N	\N
2031	544	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.572797	2026-02-23 16:58:23.572797	\N	\N
2032	544	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.574569	2026-02-23 16:58:23.574569	\N	\N
2033	544	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.576291	2026-02-23 16:58:23.576291	\N	\N
2043	545	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.596288	2026-02-23 16:58:23.596288	\N	\N
2044	545	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.598502	2026-02-23 16:58:23.598502	\N	\N
2045	545	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.600411	2026-02-23 16:58:23.600411	\N	\N
2055	546	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.619585	2026-02-23 16:58:23.619585	\N	\N
2056	546	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.621325	2026-02-23 16:58:23.621325	\N	\N
2057	546	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.62301	2026-02-23 16:58:23.62301	\N	\N
2067	547	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.64248	2026-02-23 16:58:23.64248	\N	\N
2068	547	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.644124	2026-02-23 16:58:23.644124	\N	\N
2069	547	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.64705	2026-02-23 16:58:23.64705	\N	\N
2079	548	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.668329	2026-02-23 16:58:23.668329	\N	\N
2080	548	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.670297	2026-02-23 16:58:23.670297	\N	\N
2081	548	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.675365	2026-02-23 16:58:23.675365	\N	\N
2091	549	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.698081	2026-02-23 16:58:23.698081	\N	\N
2092	549	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.699955	2026-02-23 16:58:23.699955	\N	\N
2093	549	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.701809	2026-02-23 16:58:23.701809	\N	\N
2103	550	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.720713	2026-02-23 16:58:23.720713	\N	\N
2104	550	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.722465	2026-02-23 16:58:23.722465	\N	\N
2105	550	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.724147	2026-02-23 16:58:23.724147	\N	\N
2115	551	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.743299	2026-02-23 16:58:23.743299	\N	\N
2116	551	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.745078	2026-02-23 16:58:23.745078	\N	\N
2117	551	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.748375	2026-02-23 16:58:23.748375	\N	\N
2127	552	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.767468	2026-02-23 16:58:23.767468	\N	\N
2128	552	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.769212	2026-02-23 16:58:23.769212	\N	\N
2129	552	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.771114	2026-02-23 16:58:23.771114	\N	\N
2139	553	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.791954	2026-02-23 16:58:23.791954	\N	\N
2140	553	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.793629	2026-02-23 16:58:23.793629	\N	\N
2141	553	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.795292	2026-02-23 16:58:23.795292	\N	\N
2151	554	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.817675	2026-02-23 16:58:23.817675	\N	\N
2152	554	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.820502	2026-02-23 16:58:23.820502	\N	\N
2153	554	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.823567	2026-02-23 16:58:23.823567	\N	\N
2163	555	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.850252	2026-02-23 16:58:23.850252	\N	\N
2164	555	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.852084	2026-02-23 16:58:23.852084	\N	\N
2165	555	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.853741	2026-02-23 16:58:23.853741	\N	\N
2175	556	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.87746	2026-02-23 16:58:23.87746	\N	\N
2176	556	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.881212	2026-02-23 16:58:23.881212	\N	\N
2177	556	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.883316	2026-02-23 16:58:23.883316	\N	\N
2187	557	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.903387	2026-02-23 16:58:23.903387	\N	\N
2188	557	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.905147	2026-02-23 16:58:23.905147	\N	\N
2189	557	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.90685	2026-02-23 16:58:23.90685	\N	\N
2199	558	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.925647	2026-02-23 16:58:23.925647	\N	\N
2200	558	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.92732	2026-02-23 16:58:23.92732	\N	\N
2201	558	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.929607	2026-02-23 16:58:23.929607	\N	\N
2211	559	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.950109	2026-02-23 16:58:23.950109	\N	\N
2212	559	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.951894	2026-02-23 16:58:23.951894	\N	\N
2213	559	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.953526	2026-02-23 16:58:23.953526	\N	\N
2223	560	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.97255	2026-02-23 16:58:23.97255	\N	\N
2224	560	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.97419	2026-02-23 16:58:23.97419	\N	\N
2225	560	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:23.976265	2026-02-23 16:58:23.976265	\N	\N
2235	561	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:23.997664	2026-02-23 16:58:23.997664	\N	\N
2236	561	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:23.999657	2026-02-23 16:58:23.999657	\N	\N
2237	561	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.001415	2026-02-23 16:58:24.001415	\N	\N
2247	562	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.021225	2026-02-23 16:58:24.021225	\N	\N
2248	562	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.022868	2026-02-23 16:58:24.022868	\N	\N
2249	562	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.024587	2026-02-23 16:58:24.024587	\N	\N
2259	563	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.043498	2026-02-23 16:58:24.043498	\N	\N
2260	563	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.045513	2026-02-23 16:58:24.045513	\N	\N
2261	563	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.04803	2026-02-23 16:58:24.04803	\N	\N
2271	564	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.068667	2026-02-23 16:58:24.068667	\N	\N
2272	564	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.070801	2026-02-23 16:58:24.070801	\N	\N
2273	564	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.077523	2026-02-23 16:58:24.077523	\N	\N
2283	565	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.101681	2026-02-23 16:58:24.101681	\N	\N
2284	565	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.103437	2026-02-23 16:58:24.103437	\N	\N
2285	565	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.1052	2026-02-23 16:58:24.1052	\N	\N
2295	566	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.124295	2026-02-23 16:58:24.124295	\N	\N
2296	566	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.125923	2026-02-23 16:58:24.125923	\N	\N
2297	566	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.127857	2026-02-23 16:58:24.127857	\N	\N
2307	567	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.148464	2026-02-23 16:58:24.148464	\N	\N
2308	567	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.150243	2026-02-23 16:58:24.150243	\N	\N
2309	567	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.151894	2026-02-23 16:58:24.151894	\N	\N
2319	568	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.171585	2026-02-23 16:58:24.171585	\N	\N
2320	568	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.173231	2026-02-23 16:58:24.173231	\N	\N
2321	568	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.175112	2026-02-23 16:58:24.175112	\N	\N
2331	569	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.194311	2026-02-23 16:58:24.194311	\N	\N
2332	569	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.197106	2026-02-23 16:58:24.197106	\N	\N
2333	569	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.199476	2026-02-23 16:58:24.199476	\N	\N
2343	570	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.21845	2026-02-23 16:58:24.21845	\N	\N
2344	570	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.220239	2026-02-23 16:58:24.220239	\N	\N
2345	570	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.221986	2026-02-23 16:58:24.221986	\N	\N
2355	571	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.241225	2026-02-23 16:58:24.241225	\N	\N
2356	571	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.242875	2026-02-23 16:58:24.242875	\N	\N
2357	571	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.244611	2026-02-23 16:58:24.244611	\N	\N
2367	576	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.265704	2026-02-23 16:58:24.265704	\N	\N
2368	576	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.268221	2026-02-23 16:58:24.268221	\N	\N
2369	576	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.270563	2026-02-23 16:58:24.270563	\N	\N
2379	577	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.294396	2026-02-23 16:58:24.294396	\N	\N
2380	577	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.297872	2026-02-23 16:58:24.297872	\N	\N
2381	577	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.299782	2026-02-23 16:58:24.299782	\N	\N
2391	578	31	1	2026	4000.00	4000.00	pending	0.00	2026-02-01	2026-02-23 16:58:24.319089	2026-02-23 16:58:24.319089	\N	\N
2392	578	31	2	2026	4000.00	4000.00	pending	0.00	2026-03-01	2026-02-23 16:58:24.320734	2026-02-23 16:58:24.320734	\N	\N
2393	578	31	3	2026	4000.00	4000.00	pending	0.00	2026-04-01	2026-02-23 16:58:24.322489	2026-02-23 16:58:24.322489	\N	\N
304	310	31	2	2026	4000.00	4000.00	paid	4000.00	\N	2026-02-23 16:58:19.075195	2026-02-27 14:43:50.759466	\N	\N
399	318	31	1	2026	4000.00	4000.00	paid	4000.00	\N	2026-02-23 16:58:19.327689	2026-03-02 14:58:57.848751	\N	\N
\.


--
-- Data for Name: defaulters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.defaulters (id, unit_id, society_apartment_id, maintenance_id, amount_due, months_overdue, status, created_at, updated_at, remarks) FROM stdin;
1457	351	31	\N	48000.00	2	active	2026-03-02 16:26:00.050559	2026-03-02 16:26:00.050559	\N
1458	346	31	\N	48000.00	2	active	2026-03-02 16:26:00.086374	2026-03-02 16:26:00.086374	\N
1459	370	31	\N	48000.00	2	active	2026-03-02 16:26:00.093504	2026-03-02 16:26:00.093504	\N
1460	550	31	\N	48000.00	2	active	2026-03-02 16:26:00.100441	2026-03-02 16:26:00.100441	\N
1461	559	31	\N	48000.00	2	active	2026-03-02 16:26:00.107884	2026-03-02 16:26:00.107884	\N
1462	394	31	\N	48000.00	2	active	2026-03-02 16:26:00.113796	2026-03-02 16:26:00.113796	\N
1463	552	31	\N	48000.00	2	active	2026-03-02 16:26:00.118258	2026-03-02 16:26:00.118258	\N
1464	350	31	\N	48000.00	2	active	2026-03-02 16:26:00.121202	2026-03-02 16:26:00.121202	\N
1465	382	31	\N	48000.00	2	active	2026-03-02 16:26:00.123367	2026-03-02 16:26:00.123367	\N
1466	539	31	\N	48000.00	2	active	2026-03-02 16:26:00.127983	2026-03-02 16:26:00.127983	\N
1467	511	31	\N	48000.00	2	active	2026-03-02 16:26:00.13363	2026-03-02 16:26:00.13363	\N
1468	378	31	\N	48000.00	2	active	2026-03-02 16:26:00.138661	2026-03-02 16:26:00.138661	\N
1469	341	31	\N	48000.00	2	active	2026-03-02 16:26:00.140887	2026-03-02 16:26:00.140887	\N
1470	314	31	\N	48000.00	2	active	2026-03-02 16:26:00.146886	2026-03-02 16:26:00.146886	\N
1471	554	31	\N	48000.00	2	active	2026-03-02 16:26:00.150677	2026-03-02 16:26:00.150677	\N
1472	386	31	\N	48000.00	2	active	2026-03-02 16:26:00.15566	2026-03-02 16:26:00.15566	\N
1473	514	31	\N	48000.00	2	active	2026-03-02 16:26:00.157502	2026-03-02 16:26:00.157502	\N
1474	322	31	\N	48000.00	2	active	2026-03-02 16:26:00.164894	2026-03-02 16:26:00.164894	\N
1475	406	31	\N	48000.00	2	active	2026-03-02 16:26:00.170097	2026-03-02 16:26:00.170097	\N
1476	364	31	\N	48000.00	2	active	2026-03-02 16:26:00.173342	2026-03-02 16:26:00.173342	\N
1477	405	31	\N	48000.00	2	active	2026-03-02 16:26:00.180699	2026-03-02 16:26:00.180699	\N
1478	491	31	\N	48000.00	2	active	2026-03-02 16:26:00.185444	2026-03-02 16:26:00.185444	\N
1479	389	31	\N	48000.00	2	active	2026-03-02 16:26:00.1875	2026-03-02 16:26:00.1875	\N
1480	576	31	\N	48000.00	2	active	2026-03-02 16:26:00.189281	2026-03-02 16:26:00.189281	\N
1481	330	31	\N	48000.00	2	active	2026-03-02 16:26:00.192005	2026-03-02 16:26:00.192005	\N
1482	513	31	\N	48000.00	2	active	2026-03-02 16:26:00.198817	2026-03-02 16:26:00.198817	\N
1483	345	31	\N	48000.00	2	active	2026-03-02 16:26:00.202989	2026-03-02 16:26:00.202989	\N
1484	309	31	\N	44000.00	1	active	2026-03-02 16:26:00.204756	2026-03-02 16:26:00.204756	\N
1485	541	31	\N	48000.00	2	active	2026-03-02 16:26:00.206325	2026-03-02 16:26:00.206325	\N
1486	379	31	\N	48000.00	2	active	2026-03-02 16:26:00.208243	2026-03-02 16:26:00.208243	\N
1487	323	31	\N	48000.00	2	active	2026-03-02 16:26:00.213619	2026-03-02 16:26:00.213619	\N
1488	509	31	\N	48000.00	2	active	2026-03-02 16:26:00.219008	2026-03-02 16:26:00.219008	\N
1489	337	31	\N	44000.00	1	active	2026-03-02 16:26:00.222224	2026-03-02 16:26:00.222224	\N
1490	320	31	\N	48000.00	2	active	2026-03-02 16:26:00.224504	2026-03-02 16:26:00.224504	\N
1491	375	31	\N	48000.00	2	active	2026-03-02 16:26:00.229526	2026-03-02 16:26:00.229526	\N
1492	504	31	\N	48000.00	2	active	2026-03-02 16:26:00.233664	2026-03-02 16:26:00.233664	\N
1493	399	31	\N	48000.00	2	active	2026-03-02 16:26:00.23745	2026-03-02 16:26:00.23745	\N
1494	560	31	\N	48000.00	2	active	2026-03-02 16:26:00.239307	2026-03-02 16:26:00.239307	\N
1495	547	31	\N	48000.00	2	active	2026-03-02 16:26:00.241876	2026-03-02 16:26:00.241876	\N
1496	518	31	\N	48000.00	2	active	2026-03-02 16:26:00.247663	2026-03-02 16:26:00.247663	\N
1497	556	31	\N	48000.00	2	active	2026-03-02 16:26:00.252208	2026-03-02 16:26:00.252208	\N
1498	569	31	\N	48000.00	2	active	2026-03-02 16:26:00.254648	2026-03-02 16:26:00.254648	\N
1499	493	31	\N	48000.00	2	active	2026-03-02 16:26:00.25703	2026-03-02 16:26:00.25703	\N
1500	529	31	\N	48000.00	2	active	2026-03-02 16:26:00.262697	2026-03-02 16:26:00.262697	\N
1501	555	31	\N	48000.00	2	active	2026-03-02 16:26:00.268842	2026-03-02 16:26:00.268842	\N
1502	500	31	\N	48000.00	2	active	2026-03-02 16:26:00.271894	2026-03-02 16:26:00.271894	\N
1503	522	31	\N	48000.00	2	active	2026-03-02 16:26:00.273879	2026-03-02 16:26:00.273879	\N
1504	390	31	\N	48000.00	2	active	2026-03-02 16:26:00.280971	2026-03-02 16:26:00.280971	\N
1505	577	31	\N	48000.00	2	active	2026-03-02 16:26:00.285525	2026-03-02 16:26:00.285525	\N
1506	567	31	\N	48000.00	2	active	2026-03-02 16:26:00.287727	2026-03-02 16:26:00.287727	\N
1507	329	31	\N	48000.00	2	active	2026-03-02 16:26:00.289562	2026-03-02 16:26:00.289562	\N
1508	311	31	\N	44000.00	1	active	2026-03-02 16:26:00.292442	2026-03-02 16:26:00.292442	\N
1509	505	31	\N	48000.00	2	active	2026-03-02 16:26:00.297416	2026-03-02 16:26:00.297416	\N
1510	502	31	\N	48000.00	2	active	2026-03-02 16:26:00.301719	2026-03-02 16:26:00.301719	\N
1511	401	31	\N	48000.00	2	active	2026-03-02 16:26:00.304585	2026-03-02 16:26:00.304585	\N
1512	527	31	\N	48000.00	2	active	2026-03-02 16:26:00.306852	2026-03-02 16:26:00.306852	\N
1513	561	31	\N	48000.00	2	active	2026-03-02 16:26:00.311311	2026-03-02 16:26:00.311311	\N
1514	376	31	\N	48000.00	2	active	2026-03-02 16:26:00.314224	2026-03-02 16:26:00.314224	\N
1515	328	31	\N	48000.00	2	active	2026-03-02 16:26:00.317211	2026-03-02 16:26:00.317211	\N
1516	525	31	\N	48000.00	2	active	2026-03-02 16:26:00.321191	2026-03-02 16:26:00.321191	\N
1517	507	31	\N	48000.00	2	active	2026-03-02 16:26:00.323053	2026-03-02 16:26:00.323053	\N
1518	338	31	\N	48000.00	2	active	2026-03-02 16:26:00.325022	2026-03-02 16:26:00.325022	\N
1519	543	31	\N	48000.00	2	active	2026-03-02 16:26:00.328799	2026-03-02 16:26:00.328799	\N
1520	358	31	\N	48000.00	2	active	2026-03-02 16:26:00.330764	2026-03-02 16:26:00.330764	\N
1521	565	31	\N	48000.00	2	active	2026-03-02 16:26:00.332411	2026-03-02 16:26:00.332411	\N
1522	578	31	\N	48000.00	2	active	2026-03-02 16:26:00.334344	2026-03-02 16:26:00.334344	\N
1523	566	31	\N	48000.00	2	active	2026-03-02 16:26:00.337121	2026-03-02 16:26:00.337121	\N
1524	551	31	\N	48000.00	2	active	2026-03-02 16:26:00.33964	2026-03-02 16:26:00.33964	\N
1525	532	31	\N	48000.00	2	active	2026-03-02 16:26:00.344363	2026-03-02 16:26:00.344363	\N
1526	564	31	\N	48000.00	2	active	2026-03-02 16:26:00.347059	2026-03-02 16:26:00.347059	\N
1527	349	31	\N	48000.00	2	active	2026-03-02 16:26:00.349686	2026-03-02 16:26:00.349686	\N
1528	535	31	\N	48000.00	2	active	2026-03-02 16:26:00.352986	2026-03-02 16:26:00.352986	\N
1529	510	31	\N	48000.00	2	active	2026-03-02 16:26:00.354759	2026-03-02 16:26:00.354759	\N
1530	579	31	\N	40000.00	2	active	2026-03-02 16:26:00.356382	2026-03-02 16:26:00.356382	\N
1531	553	31	\N	48000.00	2	active	2026-03-02 16:26:00.357921	2026-03-02 16:26:00.357921	\N
1532	519	31	\N	48000.00	2	active	2026-03-02 16:26:00.361189	2026-03-02 16:26:00.361189	\N
1533	521	31	\N	48000.00	2	active	2026-03-02 16:26:00.364383	2026-03-02 16:26:00.364383	\N
1534	506	31	\N	48000.00	2	active	2026-03-02 16:26:00.367223	2026-03-02 16:26:00.367223	\N
1535	508	31	\N	48000.00	2	active	2026-03-02 16:26:00.370235	2026-03-02 16:26:00.370235	\N
1536	310	31	\N	44000.00	2	active	2026-03-02 16:26:00.371766	2026-03-02 16:26:00.371766	\N
1537	357	31	\N	48000.00	2	active	2026-03-02 16:26:00.373453	2026-03-02 16:26:00.373453	\N
1538	331	31	\N	48000.00	2	active	2026-03-02 16:26:00.375966	2026-03-02 16:26:00.375966	\N
1539	404	31	\N	48000.00	2	active	2026-03-02 16:26:00.379775	2026-03-02 16:26:00.379775	\N
1540	398	31	\N	48000.00	2	active	2026-03-02 16:26:00.381686	2026-03-02 16:26:00.381686	\N
1541	353	31	\N	48000.00	2	active	2026-03-02 16:26:00.385557	2026-03-02 16:26:00.385557	\N
1542	315	31	\N	48000.00	2	active	2026-03-02 16:26:00.387274	2026-03-02 16:26:00.387274	\N
1543	366	31	\N	48000.00	2	active	2026-03-02 16:26:00.388702	2026-03-02 16:26:00.388702	\N
1544	307	31	\N	40000.00	0	active	2026-03-02 16:26:00.390199	2026-03-02 16:26:00.390199	\N
1545	388	31	\N	48000.00	2	active	2026-03-02 16:26:00.392669	2026-03-02 16:26:00.392669	\N
1546	397	31	\N	48000.00	2	active	2026-03-02 16:26:00.396682	2026-03-02 16:26:00.396682	\N
1547	515	31	\N	48000.00	2	active	2026-03-02 16:26:00.399498	2026-03-02 16:26:00.399498	\N
1548	531	31	\N	48000.00	2	active	2026-03-02 16:26:00.402937	2026-03-02 16:26:00.402937	\N
1549	347	31	\N	48000.00	2	active	2026-03-02 16:26:00.404643	2026-03-02 16:26:00.404643	\N
1550	546	31	\N	48000.00	2	active	2026-03-02 16:26:00.406075	2026-03-02 16:26:00.406075	\N
1551	562	31	\N	48000.00	2	active	2026-03-02 16:26:00.407365	2026-03-02 16:26:00.407365	\N
1552	361	31	\N	48000.00	2	active	2026-03-02 16:26:00.410919	2026-03-02 16:26:00.410919	\N
1553	321	31	\N	48000.00	2	active	2026-03-02 16:26:00.414255	2026-03-02 16:26:00.414255	\N
1554	407	31	\N	48000.00	2	active	2026-03-02 16:26:00.416659	2026-03-02 16:26:00.416659	\N
1555	333	31	\N	48000.00	2	active	2026-03-02 16:26:00.419967	2026-03-02 16:26:00.419967	\N
1556	325	31	\N	48000.00	2	active	2026-03-02 16:26:00.422235	2026-03-02 16:26:00.422235	\N
1557	402	31	\N	48000.00	2	active	2026-03-02 16:26:00.42548	2026-03-02 16:26:00.42548	\N
1558	571	31	\N	48000.00	2	active	2026-03-02 16:26:00.429515	2026-03-02 16:26:00.429515	\N
1559	516	31	\N	48000.00	2	active	2026-03-02 16:26:00.432054	2026-03-02 16:26:00.432054	\N
1560	542	31	\N	48000.00	2	active	2026-03-02 16:26:00.434346	2026-03-02 16:26:00.434346	\N
1561	395	31	\N	48000.00	2	active	2026-03-02 16:26:00.436491	2026-03-02 16:26:00.436491	\N
1562	387	31	\N	48000.00	2	active	2026-03-02 16:26:00.440427	2026-03-02 16:26:00.440427	\N
1563	537	31	\N	48000.00	2	active	2026-03-02 16:26:00.446962	2026-03-02 16:26:00.446962	\N
1564	334	31	\N	48000.00	2	active	2026-03-02 16:26:00.449718	2026-03-02 16:26:00.449718	\N
1565	558	31	\N	48000.00	2	active	2026-03-02 16:26:00.452223	2026-03-02 16:26:00.452223	\N
1566	540	31	\N	48000.00	2	active	2026-03-02 16:26:00.454643	2026-03-02 16:26:00.454643	\N
1567	400	31	\N	48000.00	2	active	2026-03-02 16:26:00.457416	2026-03-02 16:26:00.457416	\N
1568	526	31	\N	48000.00	2	active	2026-03-02 16:26:00.465548	2026-03-02 16:26:00.465548	\N
1569	373	31	\N	48000.00	2	active	2026-03-02 16:26:00.470812	2026-03-02 16:26:00.470812	\N
1570	352	31	\N	48000.00	2	active	2026-03-02 16:26:00.473453	2026-03-02 16:26:00.473453	\N
1571	393	31	\N	48000.00	2	active	2026-03-02 16:26:00.478113	2026-03-02 16:26:00.478113	\N
1572	363	31	\N	48000.00	2	active	2026-03-02 16:26:00.486035	2026-03-02 16:26:00.486035	\N
1573	343	31	\N	48000.00	2	active	2026-03-02 16:26:00.489593	2026-03-02 16:26:00.489593	\N
1574	524	31	\N	48000.00	2	active	2026-03-02 16:26:00.49246	2026-03-02 16:26:00.49246	\N
1575	362	31	\N	48000.00	2	active	2026-03-02 16:26:00.498774	2026-03-02 16:26:00.498774	\N
1576	327	31	\N	48000.00	2	active	2026-03-02 16:26:00.502266	2026-03-02 16:26:00.502266	\N
1577	512	31	\N	48000.00	2	active	2026-03-02 16:26:00.504252	2026-03-02 16:26:00.504252	\N
1578	498	31	\N	48000.00	2	active	2026-03-02 16:26:00.508007	2026-03-02 16:26:00.508007	\N
1579	497	31	\N	48000.00	2	active	2026-03-02 16:26:00.515714	2026-03-02 16:26:00.515714	\N
1580	340	31	\N	48000.00	2	active	2026-03-02 16:26:00.518973	2026-03-02 16:26:00.518973	\N
1581	523	31	\N	48000.00	2	active	2026-03-02 16:26:00.522182	2026-03-02 16:26:00.522182	\N
1582	356	31	\N	48000.00	2	active	2026-03-02 16:26:00.534211	2026-03-02 16:26:00.534211	\N
1583	494	31	\N	48000.00	2	active	2026-03-02 16:26:00.539209	2026-03-02 16:26:00.539209	\N
1584	533	31	\N	48000.00	2	active	2026-03-02 16:26:00.544466	2026-03-02 16:26:00.544466	\N
1585	499	31	\N	48000.00	2	active	2026-03-02 16:26:00.551661	2026-03-02 16:26:00.551661	\N
1586	391	31	\N	48000.00	2	active	2026-03-02 16:26:00.557354	2026-03-02 16:26:00.557354	\N
1587	317	31	\N	48000.00	2	active	2026-03-02 16:26:00.562411	2026-03-02 16:26:00.562411	\N
1588	342	31	\N	48000.00	2	active	2026-03-02 16:26:00.565409	2026-03-02 16:26:00.565409	\N
1589	368	31	\N	48000.00	2	active	2026-03-02 16:26:00.567834	2026-03-02 16:26:00.567834	\N
1590	369	31	\N	48000.00	2	active	2026-03-02 16:26:00.570491	2026-03-02 16:26:00.570491	\N
1591	339	31	\N	48000.00	2	active	2026-03-02 16:26:00.573695	2026-03-02 16:26:00.573695	\N
1592	538	31	\N	48000.00	2	active	2026-03-02 16:26:00.579213	2026-03-02 16:26:00.579213	\N
1593	326	31	\N	48000.00	2	active	2026-03-02 16:26:00.583873	2026-03-02 16:26:00.583873	\N
1594	568	31	\N	48000.00	2	active	2026-03-02 16:26:00.586114	2026-03-02 16:26:00.586114	\N
1595	344	31	\N	48000.00	2	active	2026-03-02 16:26:00.588344	2026-03-02 16:26:00.588344	\N
1596	385	31	\N	48000.00	2	active	2026-03-02 16:26:00.591358	2026-03-02 16:26:00.591358	\N
1597	371	31	\N	48000.00	2	active	2026-03-02 16:26:00.599036	2026-03-02 16:26:00.599036	\N
1598	367	31	\N	48000.00	2	active	2026-03-02 16:26:00.607153	2026-03-02 16:26:00.607153	\N
1599	492	31	\N	48000.00	2	active	2026-03-02 16:26:00.612841	2026-03-02 16:26:00.612841	\N
1600	374	31	\N	48000.00	2	active	2026-03-02 16:26:00.619048	2026-03-02 16:26:00.619048	\N
1601	335	31	\N	48000.00	2	active	2026-03-02 16:26:00.622665	2026-03-02 16:26:00.622665	\N
1602	544	31	\N	48000.00	2	active	2026-03-02 16:26:00.625138	2026-03-02 16:26:00.625138	\N
1603	534	31	\N	48000.00	2	active	2026-03-02 16:26:00.632108	2026-03-02 16:26:00.632108	\N
1604	365	31	\N	48000.00	2	active	2026-03-02 16:26:00.638422	2026-03-02 16:26:00.638422	\N
1605	355	31	\N	48000.00	2	active	2026-03-02 16:26:00.645855	2026-03-02 16:26:00.645855	\N
1606	383	31	\N	48000.00	2	active	2026-03-02 16:26:00.649321	2026-03-02 16:26:00.649321	\N
1607	318	31	\N	40000.00	0	active	2026-03-02 16:26:00.653864	2026-03-02 16:26:00.653864	\N
1608	308	31	\N	45000.00	2	active	2026-03-02 16:26:00.655837	2026-03-02 16:26:00.655837	\N
1609	381	31	\N	48000.00	2	active	2026-03-02 16:26:00.657867	2026-03-02 16:26:00.657867	\N
1610	313	31	\N	48000.00	2	active	2026-03-02 16:26:00.661764	2026-03-02 16:26:00.661764	\N
1611	359	31	\N	48000.00	2	active	2026-03-02 16:26:00.665749	2026-03-02 16:26:00.665749	\N
1612	354	31	\N	48000.00	2	active	2026-03-02 16:26:00.669284	2026-03-02 16:26:00.669284	\N
1613	503	31	\N	48000.00	2	active	2026-03-02 16:26:00.674684	2026-03-02 16:26:00.674684	\N
1614	377	31	\N	48000.00	2	active	2026-03-02 16:26:00.68046	2026-03-02 16:26:00.68046	\N
1615	392	31	\N	48000.00	2	active	2026-03-02 16:26:00.684016	2026-03-02 16:26:00.684016	\N
1616	548	31	\N	48000.00	2	active	2026-03-02 16:26:00.686781	2026-03-02 16:26:00.686781	\N
1617	495	31	\N	48000.00	2	active	2026-03-02 16:26:00.688823	2026-03-02 16:26:00.688823	\N
1618	570	31	\N	48000.00	2	active	2026-03-02 16:26:00.694063	2026-03-02 16:26:00.694063	\N
1619	316	31	\N	48000.00	2	active	2026-03-02 16:26:00.699754	2026-03-02 16:26:00.699754	\N
1620	501	31	\N	48000.00	2	active	2026-03-02 16:26:00.703854	2026-03-02 16:26:00.703854	\N
1621	403	31	\N	48000.00	2	active	2026-03-02 16:26:00.706152	2026-03-02 16:26:00.706152	\N
1622	332	31	\N	48000.00	2	active	2026-03-02 16:26:00.71192	2026-03-02 16:26:00.71192	\N
1623	545	31	\N	48000.00	2	active	2026-03-02 16:26:00.718296	2026-03-02 16:26:00.718296	\N
1624	319	31	\N	48000.00	2	active	2026-03-02 16:26:00.720713	2026-03-02 16:26:00.720713	\N
1625	530	31	\N	48000.00	2	active	2026-03-02 16:26:00.722892	2026-03-02 16:26:00.722892	\N
1626	536	31	\N	48000.00	2	active	2026-03-02 16:26:00.726038	2026-03-02 16:26:00.726038	\N
1627	549	31	\N	48000.00	2	active	2026-03-02 16:26:00.732432	2026-03-02 16:26:00.732432	\N
1628	517	31	\N	48000.00	2	active	2026-03-02 16:26:00.736564	2026-03-02 16:26:00.736564	\N
1629	528	31	\N	48000.00	2	active	2026-03-02 16:26:00.738564	2026-03-02 16:26:00.738564	\N
1630	520	31	\N	48000.00	2	active	2026-03-02 16:26:00.740446	2026-03-02 16:26:00.740446	\N
1631	380	31	\N	48000.00	2	active	2026-03-02 16:26:00.745172	2026-03-02 16:26:00.745172	\N
1632	563	31	\N	48000.00	2	active	2026-03-02 16:26:00.749983	2026-03-02 16:26:00.749983	\N
1633	557	31	\N	48000.00	2	active	2026-03-02 16:26:00.754388	2026-03-02 16:26:00.754388	\N
1634	496	31	\N	48000.00	2	active	2026-03-02 16:26:00.75679	2026-03-02 16:26:00.75679	\N
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employees (id, user_id, society_apartment_id, created_by, department, designation, salary_rupees, created_at, updated_at) FROM stdin;
1	228	31	49	Admin	Supervisor	25000.00	2026-02-24 13:12:03.548485	2026-02-24 13:12:03.548485
2	229	31	49	Security Guard	Guard	20000.00	2026-02-24 13:14:26.797621	2026-02-24 13:14:26.797621
3	230	31	49	Security Guard	Guard	20000.00	2026-02-24 13:14:53.440476	2026-02-24 13:14:53.440476
4	231	31	49	Security Guard	Guard	20000.00	2026-02-24 13:15:30.115282	2026-02-24 13:15:30.115282
5	232	31	49	Security Guard	Guard	20000.00	2026-02-24 13:15:51.466251	2026-02-24 13:15:51.466251
6	233	31	49	Cleaning	Sweeper	50000.00	2026-02-24 13:16:23.616287	2026-02-24 13:16:23.616287
7	234	31	49	Admin	Lift Operator	20000.00	2026-02-24 13:16:52.859042	2026-02-24 13:18:19.503275
\.


--
-- Data for Name: family_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.family_members (id, resident_id, name, relation, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: finance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.finance (id, society_apartment_id, added_by, transaction_date, transaction_type, expense_type, income_type, description, amount, payment_mode, remarks, month, year, status, created_at, updated_at, maintenance_id) FROM stdin;
135	31	49	2026-02-24	expense	Utility Payment	\N	Electricity Bill	375000.00	Cash	\N	2	2026	paid	2026-02-24 13:21:00.337117	2026-02-24 13:21:00.337117	\N
136	31	49	2026-02-24	expense	Repairs	\N	Repair and Maintenance	50000.00	Cash	\N	2	2026	paid	2026-02-24 13:21:39.406817	2026-02-24 13:21:39.406817	\N
137	31	49	2026-02-27	income	\N	maintenance	Maintenance payment – Unit A-005, January 2026	4000.00	\N	\N	1	2026	paid	2026-02-27 16:43:32.424209	2026-02-27 16:43:32.424209	\N
138	31	\N	2026-02-23	income	\N	maintenance	Maintenance payment – Unit A-001, February 2026 (historical)	4000.00	\N	\N	2	2026	paid	2026-02-27 16:46:45.726285	2026-02-27 16:46:45.726285	267
139	31	\N	2026-02-27	income	\N	maintenance	Maintenance payment – Unit A-001, January 2026 (historical)	4000.00	\N	\N	1	2026	paid	2026-02-27 16:46:45.726285	2026-02-27 16:46:45.726285	269
140	31	\N	2026-02-27	income	\N	maintenance	Maintenance payment – Unit A-002, January 2026 (historical)	3000.00	\N	\N	1	2026	paid	2026-02-27 16:46:45.726285	2026-02-27 16:46:45.726285	279
141	31	\N	2026-02-27	income	\N	maintenance	Maintenance payment – Unit A-003, January 2026 (historical)	4000.00	\N	\N	1	2026	paid	2026-02-27 16:46:45.726285	2026-02-27 16:46:45.726285	291
142	31	\N	2026-02-27	income	\N	maintenance	Maintenance payment – Unit A-005, January 2026 (historical)	4000.00	\N	\N	1	2026	paid	2026-02-27 16:46:45.726285	2026-02-27 16:46:45.726285	315
143	31	\N	2026-02-27	income	\N	maintenance	Maintenance payment – Unit A-004, February 2026 (historical)	4000.00	\N	\N	2	2026	paid	2026-02-27 16:46:45.726285	2026-02-27 16:46:45.726285	304
145	31	49	2026-03-02	income	\N	maintenance	Maintenance payment – Unit C-106, February 2026	4000.00	\N	\N	2	2026	paid	2026-03-02 15:02:15.903766	2026-03-02 15:02:15.903766	400
144	31	\N	2026-02-27	income	\N	maintenance	Maintenance payment – Unit A-002, December 2025 (historical)	4000.00	\N	\N	12	2025	paid	2026-02-27 16:46:45.726285	2026-03-02 15:48:22.039305	\N
146	31	\N	2026-03-02	income	\N	maintenance	Maintenance payment – Unit C-106, January 2026 (historical)	4000.00	\N	\N	1	2026	paid	2026-03-03 12:50:10.604964	2026-03-03 12:50:10.604964	399
147	31	\N	2026-03-02	income	\N	maintenance	Maintenance payment – Unit A-301, January 2026 (historical)	4000.00	\N	\N	1	2026	paid	2026-03-03 12:50:10.604964	2026-03-03 12:50:10.604964	603
\.


--
-- Data for Name: global_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.global_settings (id, key, value, value_json, updated_at, updated_by) FROM stdin;
1	default_currency	PKR	\N	2026-03-03 12:50:10.77612	\N
2	default_due_day	1	\N	2026-03-03 12:50:10.77612	\N
3	maintenance_reminder_days_default	3	\N	2026-03-03 12:50:10.77612	\N
4	max_upload_size_mb	5	\N	2026-03-03 12:50:10.77612	\N
\.


--
-- Data for Name: maintenance_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenance_config (id, society_apartment_id, base_amount, created_at, updated_at, block_id, unit_id) FROM stdin;
5	31	4000.00	2026-02-23 16:47:46.434521	2026-03-02 16:25:37.206395	\N	\N
\.


--
-- Data for Name: maintenance_payment_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.maintenance_payment_requests (id, maintenance_id, submitted_by, proof_path, note, status, created_at, reviewed_at, reviewed_by, rejection_reason) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, sender_id, receiver_id, body, read_at, created_at) FROM stdin;
\.


--
-- Data for Name: monthly_dues_generation_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.monthly_dues_generation_log (id, generation_date, month, year, total_units, successful_generations, failed_generations, errors, created_at) FROM stdin;
\.


--
-- Data for Name: payment_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment_history (id, maintenance_id, updated_by, previous_status, new_status, previous_amount_paid, new_amount_paid, amount_change, notes, created_at) FROM stdin;
\.


--
-- Data for Name: push_subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.push_subscriptions (id, user_id, endpoint, p256dh, auth, created_at) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, society_apartment_id, defaulter_list_visible, complaint_logs_visible, financial_reports_visible, created_at, updated_at, email_dues_on_generate, email_reminder_days_before) FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscription_plans (id, name, amount, interval_months, is_active, created_at, updated_at) FROM stdin;
1	Monthly	4000.00	1	t	2026-02-10 14:12:56.489501	2026-02-23 12:40:31.81576
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscriptions (id, user_id, society_apartment_id, plan_id, status, start_date, end_date, next_billing_date, created_at, updated_at) FROM stdin;
23	49	31	1	active	2026-02-23	\N	2026-03-23	2026-02-23 12:52:19.619675	2026-02-23 16:35:07.704938
25	235	32	1	active	2026-03-03	\N	2026-04-03	2026-03-03 15:44:07.941545	2026-03-03 15:55:10.801156
\.


--
-- Data for Name: super_admin_invoices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.super_admin_invoices (id, user_id, society_apartment_id, subscription_id, amount, currency, status, due_date, period_start, period_end, notes, created_at, updated_at, payment_proof_path, payment_proof_uploaded_at) FROM stdin;
4	49	31	23	4000.00	PKR	sent	2026-03-29	2026-02-23	2026-03-22	\N	2026-02-23 13:11:29.180358	2026-02-23 13:11:29.180358	\N	\N
5	235	32	25	4000.00	PKR	paid	2026-04-09	2026-03-03	2026-04-02	\N	2026-03-03 15:55:10.855255	2026-03-03 16:00:07.341125	/uploads/invoice-payment-proofs/invoice_5_user_1_1772535607328.jpeg	2026-03-03 16:00:07.341125
\.


--
-- Data for Name: union_features; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.union_features (society_apartment_id, feature_key, enabled, updated_at) FROM stdin;
\.


--
-- Data for Name: union_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.union_members (id, member_name, designation, phone, email, joining_date, unit_id, society_apartment_id, created_by, created_at, updated_at) FROM stdin;
1	Shahid Hussain	President	(301) 145-7030	hasanshkh17@gmail.com	2025-01-01	533	31	49	2026-02-24 16:47:24.523279	2026-02-24 16:47:24.523279
\.


--
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.announcements_id_seq', 39, true);


--
-- Name: audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_log_id_seq', 2, true);


--
-- Name: blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blocks_id_seq', 82, true);


--
-- Name: complaint_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.complaint_progress_id_seq', 1, false);


--
-- Name: complaints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.complaints_id_seq', 50, true);


--
-- Name: defaulters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.defaulters_id_seq', 1634, true);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.employees_id_seq', 7, true);


--
-- Name: family_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.family_members_id_seq', 2, true);


--
-- Name: finance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.finance_id_seq', 147, true);


--
-- Name: floors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.floors_id_seq', 82, true);


--
-- Name: global_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.global_settings_id_seq', 12, true);


--
-- Name: maintenance_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.maintenance_config_id_seq', 5, true);


--
-- Name: maintenance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.maintenance_id_seq', 17359, true);


--
-- Name: maintenance_payment_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.maintenance_payment_requests_id_seq', 1, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.messages_id_seq', 4, true);


--
-- Name: monthly_dues_generation_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.monthly_dues_generation_log_id_seq', 1, false);


--
-- Name: payment_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payment_history_id_seq', 1, false);


--
-- Name: push_subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.push_subscriptions_id_seq', 1, false);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_id_seq', 3, true);


--
-- Name: societies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.societies_id_seq', 32, true);


--
-- Name: subscription_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscription_plans_id_seq', 1, true);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 26, true);


--
-- Name: super_admin_invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.super_admin_invoices_id_seq', 5, true);


--
-- Name: union_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.union_members_id_seq', 1, true);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.units_id_seq', 579, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 235, true);


--
-- PostgreSQL database dump complete
--

\unrestrict TpiGUhXBwlbv7J199UfgbsRUXKWuta2xODU5wA4Rp1jEmViVyU86cOycnDeZKtx

