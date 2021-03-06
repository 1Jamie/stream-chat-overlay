PGDMP                           x            emotes    9.5.19    9.5.19 -    p           0    0    ENCODING    ENCODING     #   SET client_encoding = 'SQL_ASCII';
                       false            q           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            r           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            s           1262    16385    emotes    DATABASE     i   CREATE DATABASE emotes WITH TEMPLATE = template0 ENCODING = 'SQL_ASCII' LC_COLLATE = 'C' LC_CTYPE = 'C';
    DROP DATABASE emotes;
             postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             postgres    false            t           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  postgres    false    6            u           0    0    SCHEMA public    ACL     �   REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;
                  postgres    false    6                        3079    12359    plpgsql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
    DROP EXTENSION plpgsql;
                  false            v           0    0    EXTENSION plpgsql    COMMENT     @   COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
                       false    1            �            1259    16386    cheers    TABLE     y   CREATE TABLE public.cheers (
    id integer NOT NULL,
    cheer character varying(40),
    url character varying(255)
);
    DROP TABLE public.cheers;
       public         root    false    6            �            1259    24620    comands    TABLE     �   CREATE TABLE public.comands (
    id integer NOT NULL,
    user_name text NOT NULL,
    command_name text NOT NULL,
    response text NOT NULL
);
    DROP TABLE public.comands;
       public         root    false    6            �            1259    24618    comands_id_seq    SEQUENCE     w   CREATE SEQUENCE public.comands_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.comands_id_seq;
       public       root    false    6    187            w           0    0    comands_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.comands_id_seq OWNED BY public.comands.id;
            public       root    false    186            �            1259    24631    commands    TABLE     �   CREATE TABLE public.commands (
    id integer NOT NULL,
    user_name text NOT NULL,
    command_name text NOT NULL,
    response text NOT NULL
);
    DROP TABLE public.commands;
       public         root    false    6            �            1259    24629    commands_id_seq    SEQUENCE     x   CREATE SEQUENCE public.commands_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.commands_id_seq;
       public       root    false    189    6            x           0    0    commands_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.commands_id_seq OWNED BY public.commands.id;
            public       root    false    188            �            1259    16389    test_cheers    TABLE     T   CREATE TABLE public.test_cheers (
    name character(20),
    url character(125)
);
    DROP TABLE public.test_cheers;
       public         root    false    6            �            1259    16392    test_cheers2    TABLE     V   CREATE TABLE public.test_cheers2 (
    cheer character(20),
    url character(125)
);
     DROP TABLE public.test_cheers2;
       public         root    false    6            �            1259    24578    users    TABLE     �   CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    created_on timestamp without time zone NOT NULL,
    channel text
);
    DROP TABLE public.users;
       public         root    false    6            �            1259    24576    users_user_id_seq    SEQUENCE     z   CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public       root    false    185    6            y           0    0    users_user_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;
            public       root    false    184            �            1259    24644    word_filter    TABLE     r   CREATE TABLE public.word_filter (
    channel text,
    word text,
    value integer,
    uid integer NOT NULL
);
    DROP TABLE public.word_filter;
       public         root    false    6            �            1259    24650    word_filter_uid_seq    SEQUENCE     |   CREATE SEQUENCE public.word_filter_uid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.word_filter_uid_seq;
       public       root    false    190    6            z           0    0    word_filter_uid_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.word_filter_uid_seq OWNED BY public.word_filter.uid;
            public       root    false    191            �           2604    24623    id    DEFAULT     h   ALTER TABLE ONLY public.comands ALTER COLUMN id SET DEFAULT nextval('public.comands_id_seq'::regclass);
 9   ALTER TABLE public.comands ALTER COLUMN id DROP DEFAULT;
       public       root    false    186    187    187            �           2604    24634    id    DEFAULT     j   ALTER TABLE ONLY public.commands ALTER COLUMN id SET DEFAULT nextval('public.commands_id_seq'::regclass);
 :   ALTER TABLE public.commands ALTER COLUMN id DROP DEFAULT;
       public       root    false    189    188    189            �           2604    24581    user_id    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN user_id DROP DEFAULT;
       public       root    false    184    185    185            �           2604    24652    uid    DEFAULT     r   ALTER TABLE ONLY public.word_filter ALTER COLUMN uid SET DEFAULT nextval('public.word_filter_uid_seq'::regclass);
 >   ALTER TABLE public.word_filter ALTER COLUMN uid DROP DEFAULT;
       public       root    false    191    190            c          0    16386    cheers 
   TABLE DATA               0   COPY public.cheers (id, cheer, url) FROM stdin;
    public       root    false    181   ++       i          0    24620    comands 
   TABLE DATA               H   COPY public.comands (id, user_name, command_name, response) FROM stdin;
    public       root    false    187   �/       {           0    0    comands_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.comands_id_seq', 1, false);
            public       root    false    186            k          0    24631    commands 
   TABLE DATA               I   COPY public.commands (id, user_name, command_name, response) FROM stdin;
    public       root    false    189   0       |           0    0    commands_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.commands_id_seq', 33, true);
            public       root    false    188            d          0    16389    test_cheers 
   TABLE DATA               0   COPY public.test_cheers (name, url) FROM stdin;
    public       root    false    182   ^1       e          0    16392    test_cheers2 
   TABLE DATA               2   COPY public.test_cheers2 (cheer, url) FROM stdin;
    public       root    false    183   
9       g          0    24578    users 
   TABLE DATA               Q   COPY public.users (user_id, username, password, created_on, channel) FROM stdin;
    public       root    false    185   '9       }           0    0    users_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_user_id_seq', 5, true);
            public       root    false    184            l          0    24644    word_filter 
   TABLE DATA               @   COPY public.word_filter (channel, word, value, uid) FROM stdin;
    public       root    false    190   �9       ~           0    0    word_filter_uid_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.word_filter_uid_seq', 11, true);
            public       root    false    191            �           2606    16396    cheers_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.cheers
    ADD CONSTRAINT cheers_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.cheers DROP CONSTRAINT cheers_pkey;
       public         root    false    181    181            �           2606    24628    comands_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.comands
    ADD CONSTRAINT comands_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.comands DROP CONSTRAINT comands_pkey;
       public         root    false    187    187            �           2606    24639    commands_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.commands
    ADD CONSTRAINT commands_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.commands DROP CONSTRAINT commands_pkey;
       public         root    false    189    189            �           2606    24583 
   users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public         root    false    185    185            �           2606    24585    users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public         root    false    185    185            �           2606    24654    word_filter_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.word_filter
    ADD CONSTRAINT word_filter_pkey PRIMARY KEY (uid);
 F   ALTER TABLE ONLY public.word_filter DROP CONSTRAINT word_filter_pkey;
       public         root    false    190    190            c   �  x����r�6�k�a,���mR�mҎ'N:�No�"QI�J��O_H&vA���v�}���Ѭ`SJ��^�v����&Q��+�Sy�ޛ�Ͷ7�x���J�Gm�a�>�6�߭T�j�7+��׍�^Uq�фZmRyXp%�L0�1�\4؉�������x
�M��I-��B�̩<,�9�L0��\4إxx���N������*�R�.��m���,Q���=�ݞ<Ӽk��H>|�Y��[�S��� �3�f�A�}�������`��ژ�@>����F+��߆��k�D�2� K��h�c�f�AOėNS��������Q{.��0{9H0��dAA-��ÂkOYk�>�o������\h[��V�v��ȳ�pХ�����3�1 �DՏ�G��y(��4�L���%�fN�a���e�A.P������í1�q<6v0��ʳ���g�����˙� 	�<�32�A�����y(��,�Lj�E�fN�a���e�A.P��.�M��]��A]��y���*���C�k�G�͆�.}��?��������t�x"�h�Sc�;�Sp��04�P���=���u>�R�W�p���؍�k�\h����!ڵ."�f�A���ǃ�|� HHď��V7͞��z_7���^�Գ�݃84�|��?����P�8# ��{}�z�����֎�v[�K��]�2B��[z6z��|<�oxV�7=�������j�?�ղz�X�Ǘi.��
e�{�v��ȳ�pХ�����3�1 ��Պ��7m�P���t2�}Qh�9��7�	�@���Oz;~R����`oC��<��5H�[���� g�	�#830$����՟[M��ڙqoGG;��:Jg��J��l���!����)^���`P)n����%�d�v.��
i�W*��DΦ#/}��ǀx���������u��L�O&�V�:�Zz�ž�L2�9�\6ⅇ��ȗ����ɿ��5ة�+ǒYZt��[0���D��F<�p6�D�ҿ���\�F�����CK��!���j
���eo��1'aT�}w����~�<\}�LR;/�x�4�PY�X�`&�D|���?ݖ����2I�����;�p6����|(f�	q����Y����炫���_�Y����j���t�����\ğ�WWW�q���      i      x������ � �      k   K  x��R�N�0>'O�3���#�����S�R���&&�H9����ݣ=�n�{�R���ॏ��p�P�r�fh
c� �E)�{WG��V1ʘ�	xTg䂹�羠��������ڜZ7Q�SG���L	�Nnu.|����!�����P��+��;�g����l�OP�^�,ϛ�1��Z�B���a�?���	S��7v[�ۋf���H�B�mv�,<�@~��n�u��?y/zUbɭ�L柮g�bv�y� ۊڑj�)��Nl�7�b�rRqZ,�c�ۇ?Q�+�t��@h�rB����F�N@���}^�׵��0���      d   �  x����n�6�s�������5�$�n�`�-�E/Z[���V*+��mlQ�=����} >ģ!E��Ū,��w���Vm���i:]�P�SW�����v��l�P?-�zӞm�vZ�۪�l�/CLEs?-6պh���|z~������x��lr��)	6�$ߔ����g�DM���Z�������$SyI���H�����v$Cy$��{^�	-�ۧo��n\߉����ۑ,�&��H�ZHp-�$��$���F�����&7��bU��O}�!2�@24��q=	��D����)	2�HΔ���&��~�ں�~����@2u� �н;��{�Ix�v$C�Hp��Ix��H`�cS��H��|+�4;��N�Wގtd�@2�:��%H2��t$K_
�}iU?��-�7D��IO2�%������%��%��.Nd�8�I��$B�'7E��;'/C��9ٓl;'!�e��@2�I����d�9	��G2�4	$�/��z{U���S�87D��Hx��Hh�Hp�I`��Hh��I�{�O�e'�����u�����d��A��{w$K�����H��-���ݓ��-���}�����jX{�!r��{�_�H����I����	E&a�O'�	�P�����n�3�H��տ{��/	$�/�$���H�7��'N$�O�GB�8��=q����X[vN���wO�kI"��4��ZI`-y$��d�����!A����Z.J�ղ"ӫ�@�kI$����Z�IX-�$��"$c-���1�j�����faY�tCd[�8�aq"���IO�'��N(	n"	l	m2���ٽ#$vo�mt�M�[۵a��ȵ��I��%���ʁ?q"	|�<���$��I�!AO܏�e���{�ȸ�} ����$þwG��{�I���#�p	^��$�/I$���k?K��"שeO�O-%zj9��SK��Zz$��R&a��>	<�������u���/���a�;�����G$�����/nD¾���Źb�IJ7�f�Iɦ�eQ=\Vە�Բ"۩�#N-|jٓ�SK���Z$��R$���	=��IP_������M�C��Б,�0	_�:�a�+���nO�DB��@���HB�4�z[<���>���;��קA��ק����0	���#~}*��+{=	��'������Pn��i�֕�AI$���W�	ZUFI��򈄬*��U�1i���jzM�e'%�&����I/Cd��v �n~�H��_�i�2H2�Uv$�&�s�#�8��q���8N�I$�!r�Z�$|ڕH�;��iW$�ӮGB_-e�j��W�	۫\릞ߛ�Z��wײ#Y�Z�I�]KG2ܵH�]˞�ߵ�H�]ˁߵIPy�j��$���$���Ha;Ib������6��6�!l
C�t$��yOC�pC�t$���Iaӑ��j3�!lC�t$���Iaӑ�6~��f"1�MGb[��6�!l㟠3��Bb����S$���Ha�Ha3�¦#1��1>���Db���6��[Gb��HaK#1�MGb[��6�!l1C�Iaӑ¦ 1�MGb[���4C�t$��� 1�MGb[���C�t$��iIaӑ�"1�MOb���6�!l:C�DC��Haӑ�'1�MGb[���C�t$���&1�MGb[���4C�t$��� 1�MGb[��65�!l:C�t$���HaIaK 1�MGb���6�!l�!l	$���HaӐ¦#1�M$1�-��6�!l�Iaӑ�&��Hb����6b|Db���6��[Gb��HaK#1�MGb[��6�!l1C�Iaӑ¦ 1�MGb[���4C�t$��� 1�MGb[���C�t$��iIaӑ�"1�MOb���6�!l:C�DC��Haӑ�H��g���?mǆ�      e      x������ � �      g   u   x�m�K
�@����)��z�3����@��r}�EP�ſ�O]�i��u���z����8����#�8~$q�����c~^~F�Ҥ6�PU5�;�l��(��Gf�bj�������@Dop�-�      l   c   x�M�A
�@F������^F�Gf:�I�_W���=�R���AW͞�Т'�Y̦���C-&��ft��I)2.�G8�l���<�zu�5�z�4���gJ%/     