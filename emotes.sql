PGDMP         (    	            w            emotes #   11.5 (Ubuntu 11.5-0ubuntu0.19.04.1) #   11.5 (Ubuntu 11.5-0ubuntu0.19.04.1)     _           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            `           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            a           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            b           1262    16386    emotes    DATABASE     p   CREATE DATABASE emotes WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE emotes;
             root    false            �            1259    16389    cheers    TABLE     y   CREATE TABLE public.cheers (
    id integer NOT NULL,
    cheer character varying(40),
    url character varying(255)
);
    DROP TABLE public.cheers;
       public         root    false            �            1259    16387    cheers_id_seq    SEQUENCE     �   CREATE SEQUENCE public.cheers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.cheers_id_seq;
       public       root    false    197            c           0    0    cheers_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.cheers_id_seq OWNED BY public.cheers.id;
            public       root    false    196            �            1259    16395    test_cheers    TABLE     T   CREATE TABLE public.test_cheers (
    name character(20),
    url character(125)
);
    DROP TABLE public.test_cheers;
       public         root    false            �            1259    16398    test_cheers2    TABLE     V   CREATE TABLE public.test_cheers2 (
    cheer character(20),
    url character(125)
);
     DROP TABLE public.test_cheers2;
       public         root    false            �
           2604    16392 	   cheers id    DEFAULT     f   ALTER TABLE ONLY public.cheers ALTER COLUMN id SET DEFAULT nextval('public.cheers_id_seq'::regclass);
 8   ALTER TABLE public.cheers ALTER COLUMN id DROP DEFAULT;
       public       root    false    197    196    197            Z          0    16389    cheers 
   TABLE DATA               0   COPY public.cheers (id, cheer, url) FROM stdin;
    public       root    false    197   m       [          0    16395    test_cheers 
   TABLE DATA               0   COPY public.test_cheers (name, url) FROM stdin;
    public       root    false    198   $       \          0    16398    test_cheers2 
   TABLE DATA               2   COPY public.test_cheers2 (cheer, url) FROM stdin;
    public       root    false    199   n       d           0    0    cheers_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.cheers_id_seq', 142, true);
            public       root    false    196            �
           2606    16394    cheers cheers_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.cheers
    ADD CONSTRAINT cheers_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.cheers DROP CONSTRAINT cheers_pkey;
       public         root    false    197            Z   �  x����r�6�k�a,�g�6������Ig��"Q$"�PH*����.���κ���K+�:�oں�h�q?��X����V�]9����V��t�uW������4�X�~�P�ީ�^-�B^7z}%��Ej9W�����E����^�j�3�?����bR�΢�4s*n.r�2v)_Ց���<�\�Tj�yֵ�#p�`�%�\4رg��ۓg�7���ɇ�4��\`�q�2�u��u��l8蹯����1 �\����<�h�T��p�um�\&d�2v��l8���i����.I����'��3��,(��SyXp�)k�����e�s[;�V�2���]�4�l6t��|<���g��Q�#�-��4�g�^L���9�fN�a���e�A.P������wí1+�q<6v0��ʳɯ��g�����ˉ� 	�4�32�^������i(��,���³(4͜�Â����\��E�]��^u���������?��U(S[�h�:�<�]�:~<� !w���p$�h�cc�;�Sp��04�P���=���u>�R�U�p�v���+;�ع�6+���C�k]D�͆�.}��?������_���n�-y���n΃���gS�qh��:~>� ��&pF@F)>��N��w�c�[;�m.�v v��e.l��l8豯����Y-_����|V�W?���pV�R����a5��_.s��V(�߹h׺�<�]�:~<� !�]�����Y���w���SyXpsp�`���h�K����'�п�=�v0��ʳ�_��p���>��c��0&`D<�����D�n�zSn5�3jgƭ�h��F:	�>��1d��ɟ���`L�<�7�Jq���F-��&;��s��WH��R	�xo'�p6y��|>ē ��H��N�i���aZ}4���Ա���.�� f��Α�/<�MG����v$���m�S�5V�%��4�⽷`&i�4��x��l:��ؿ���?,G���w�
�CK��g!���b
>��yo�?1'aT�sw����~�4\}�DR;ϙx�4��,*�ұ<.�1�L2҉����������w��ij퐍�3gӑ�}��ǀb�����Ijכ�~1�i.��
i��yz��&9�MG^�<���$�1�E�}}uu�/rv�R      [   :  x����N�@�u�<I�.P�P��V�J��b�X�q꘢�}K<3�s������,�>��3�3NYVN�Z?�U�ݽ��7�g�/�כ�jr<[��CYl��MV�̬ʋ�nt�\b��r92�|m�,MF��y�p�$�z��:i��eR!�&O
M:$�Ԑ�	4%�2O3��%ۻ&Q�%�mIL{�Ix{;��	noO��["��}�x�d���H�K���#1�'��HD/	$��<	�%�D�R���H�)��ӅYo����Jސ�H��I�'��.h&5dj��I�����YQlw\zJ(�wM��;J"�ے����v$"��ޞ���DC��&�t9������mI��/y>y;RǤ@"L�D��DI��%1�'��(���_1��ZÉ'�$��\�$<�$�K	Nd6��$p8�!A��Ԕ՞�9y.��sr q;'1�sR����(��9�$f�$N�wN�xiHp.e�zwQi��C�8WB���	�ʆG�H�2 �Q)�����4V'���l��K�C	���ITzGIDz[��q�ގD��@��ۓ���Hhz��f�������Jh�ޞ���$�W�go�.(	]Pd���$pA�!A�e��xܷw�l	���$"��K��?q	}��ĉ$��H�'��'��lvf�윸Z��Ix/I$���K"	쥀���L"{	O����W�E>��2��җPz�lHp/�$���K2	륐�R��%�ղ���Zޕ��)Sf8�%ԆG"��'��/(	]P"	�����LbC���Kz��^���H�Gz_��~nvkb�v%�foO"���	~�D��$�I���'��=qo/3�r�އ���5������}oKb���$|�ۑ�N �#�'�$��S˧���1sb8�%�N-=	?��H�eC�O-Exj��SK���Z�$�Բ��'���:_fw����H
Jh4x�~p=$�k�����~p��4I�M]�X�4ؔ��|u��̩�-�vj�Hĩ�@�O-=	?��H�eC�O-Exj��SK�����2�VP��z�,�t�$|�u$b�H��IxH$4"	����֬*���z�mIԷO�$�ۧ��|�4N¿}�HķO|eϓ�+{	l�O�Y����YU�ne �U���	�*{I�T�!!Se?i�T�%��ICM��꤁��>�ޓLz.�x�&q7�b$��WM��*�$b�Ғ�5.N��8G"�8��q7�����3��Jh�Zz��J$t�mH�+��e7 ���2	{�I�e	۫\�uY̖�]˺��]KKb�Z�I�]KG"�Z
$���'�w-%zײ!�w-E��?��$�bQ-T      \      x������ � �     