/**/


SELECT DeleteFunctions('Biblioteca', 'SelecionarCliente');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarCliente(
    pSearch     VARCHAR(200),
    pPage       INTEGER,
    pLines      INTEGER,
    pOrderNome  VARCHAR,
    pOrderEmail VARCHAR,
    pOrderCpf   VARCHAR
)
    RETURNS TABLE(
        "lineCount" BIGINT,
        "id"        TEXT,
        "nome"      Biblioteca.Usuario.nome%TYPE,
        "email"     Biblioteca.Usuario.email%TYPE,
        "cpf"       Biblioteca.Cliente.cpf%TYPE,
        "cor"       INTEGER
    ) AS $$

/*
Documentation
Source file.......: Cliente.sql
Description.......: Selecionar clientes
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarCliente(null, 1, 10, null, null, null);

*/

BEGIN
    IF pSearch IS NOT NULL
    THEN
        pSearch = unaccent(pSearch);
    END IF;

    RETURN QUERY
    SELECT
        COUNT(1)
        OVER (
            PARTITION BY 1 ) lineCount,
        EncryptId(c.id)      id,
        u.nome,
        u.email,
        c.cpf,
        u.id                 cor
    FROM Biblioteca.Usuario u
        LEFT JOIN Biblioteca.Cliente c
            ON c.id_usuario = u.id
    WHERE u.id_tipo_usuario = 2
          AND CASE
              WHEN pSearch IS NOT NULL
                  THEN
                      unaccent(u.nome) ILIKE '%' || pSearch || '%'
                      OR unaccent(u.email) ILIKE '%' || pSearch || '%'
                      OR unaccent(c.cpf) ILIKE '%' || regexp_replace(pSearch, '[./\- 	]', '', 'g') || '%'
              ELSE
                  TRUE
              END
    ORDER BY
        (CASE
         WHEN pOrderNome = 'ASC'
             THEN u.nome
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderNome = 'DESC'
             THEN u.nome
         ELSE NULL END) DESC,
        (CASE
         WHEN pOrderEmail = 'ASC'
             THEN u.email
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderEmail = 'DESC'
             THEN u.email
         ELSE NULL END) DESC,
        (CASE
         WHEN pOrderCpf = 'ASC'
             THEN c.cpf
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderCpf = 'DESC'
             THEN c.cpf
         ELSE NULL END) DESC,
        (COALESCE(c.data_alteracao, u.data_cadastro)) DESC
    LIMIT
        CASE WHEN pLines > 0 AND pPage > 0
            THEN pLines
        ELSE NULL END
    OFFSET
        CASE WHEN pLines > 0 AND pPage > 0
            THEN (pPage - 1) * pLines
        ELSE NULL END;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('Biblioteca', 'SelecionarClientePorId');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarClientePorId(
    pId TEXT
)
    RETURNS TABLE(
        "id"                   TEXT,
        "nome"                 Biblioteca.Usuario.nome%TYPE,
        "email"                Biblioteca.Usuario.email%TYPE,
        "cpf"                  Biblioteca.Cliente.cpf%TYPE,
        "rg"                   Biblioteca.Cliente.rg%TYPE,
        "endereco"             Biblioteca.Cliente.endereco%TYPE,
        "complemento"          Biblioteca.Cliente.complemento%TYPE,
        "bairro"               Biblioteca.Cliente.bairro%TYPE,
        "numero"               Biblioteca.Cliente.numero%TYPE,
        "uf"                   Biblioteca.Cliente.uf%TYPE,
        "cidade"               Biblioteca.Cliente.cidade%TYPE,
        "cep"                  Biblioteca.Cliente.cep%TYPE,
        "dataCadastro"         Biblioteca.Usuario.data_cadastro%TYPE,
        "nomeUsuarioAlteracao" Biblioteca.Usuario.nome%TYPE,
        "dataAlteracao"        Biblioteca.Cliente.data_alteracao%TYPE
    ) AS $$

/*
Documentation
Source file.......: Cliente.sql
Description.......: Selecionar cliente por id
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarClientePorId('mVoAUYZunrg');

*/

DECLARE vId INTEGER;

BEGIN
    vId = DecryptId(pId);

    RETURN QUERY
    SELECT
        EncryptId(c.id) id,
        u.nome,
        u.email,
        c.cpf,
        c.rg,
        c.endereco,
        c.complemento,
        c.bairro,
        c.numero,
        c.uf,
        c.cidade,
        c.cep,
        u.data_cadastro,
        ua.nome         nomeUsuarioAlteracao,
        c.data_alteracao
    FROM Biblioteca.Cliente c
        LEFT JOIN Biblioteca.Usuario ua
            ON ua.id = c.id_usuario_alteracao
        INNER JOIN Biblioteca.Usuario u
            ON u.id = c.id_usuario
    WHERE c.id = vId;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('Biblioteca', 'AtualizarCliente');
CREATE OR REPLACE FUNCTION Biblioteca.AtualizarCliente(
    pIdUsuarioAcao Biblioteca.Usuario.id%TYPE,
    pId            TEXT,
    pNome          Biblioteca.Usuario.nome%TYPE,
    pEmail         Biblioteca.Usuario.email%TYPE,
    pCpf           Biblioteca.Cliente.cpf%TYPE,
    pRg            Biblioteca.Cliente.rg%TYPE,
    pEndereco      Biblioteca.Cliente.endereco%TYPE,
    pComplemento   Biblioteca.Cliente.complemento%TYPE,
    pBairro        Biblioteca.Cliente.bairro%TYPE,
    pNumero        Biblioteca.Cliente.numero%TYPE,
    pUf            Biblioteca.Cliente.uf%TYPE,
    pCidade        Biblioteca.Cliente.cidade%TYPE,
    pCep           Biblioteca.Cliente.cep%TYPE
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Cliente.sql
Description.......: Atualizar um cliente
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.AtualizarCliente(1, '2', '1', 'Test', null, null, '24364775000104', null, null, false, null,
null,
null, null, null);

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;
    vIdUsuario      INTEGER;

BEGIN
    vId = DecryptId(pId);

    SELECT c.id_usuario
    INTO vIdUsuario
    FROM Biblioteca.Cliente c
    WHERE c.id = vId
    LIMIT 1;

    IF vIdUsuario IS NULL
    THEN
        RETURN
        json_build_object(
            'executionCode', 1,
            'message', 'Cliente não encontrado'
        );
    END IF;

    IF pCpf IS NOT NULL AND EXISTS(SELECT 1
                                   FROM Biblioteca.Cliente c
                                   WHERE c.cpf = pCpf
                                         AND c.id <> vId
                                   LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 2,
            'message', 'Novo CPF existente'
        );
    END IF;

    UPDATE Biblioteca.Usuario
    SET nome  = pNome,
        email = pEmail
    WHERE id = vIdUsuario;

    UPDATE Biblioteca.Cliente
    SET cpf                  = pCpf,
        rg                   = pRg,
        endereco             = pEndereco,
        complemento          = pComplemento,
        bairro               = pBairro,
        numero               = pNumero,
        uf                   = pUf,
        cidade               = pCidade,
        cep                  = pCep,
        id_usuario_alteracao = pIdUsuarioAcao,
        data_alteracao       = CURRENT_TIMESTAMP
    WHERE id = vId;

    RETURN
    json_build_object(
        'executionCode', 0
    );
    EXCEPTION WHEN OTHERS
    THEN
        GET STACKED DIAGNOSTICS vErrorProcedure = MESSAGE_TEXT;
        GET STACKED DIAGNOSTICS vErrorMessage = PG_EXCEPTION_CONTEXT;
        RAISE EXCEPTION 'Internal Error: (%) %', vErrorProcedure, vErrorMessage;
END;
$$
LANGUAGE plpgsql;


/**/
