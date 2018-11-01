/**/


SELECT DeleteFunctions('Biblioteca', 'SelecionarEditora');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarEditora(
    pSearch    VARCHAR(200),
    pPage      INTEGER,
    pLines     INTEGER,
    pOrderNome VARCHAR
)
    RETURNS TABLE(
        "lineCount" BIGINT,
        "id"        TEXT,
        "nome"      Biblioteca.Editora.nome%TYPE
    ) AS $$

/*
Documentation
Source file.......: Editora.sql
Description.......: Selecionar editoras
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarEditora(null, 1, 10, null, null, null, null);

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
        EncryptId(e.id)      id,
        e.nome
    FROM Biblioteca.Editora e
    WHERE CASE
          WHEN pSearch IS NOT NULL
              THEN
                  unaccent(e.nome) ILIKE '%' || pSearch || '%'
          ELSE
              TRUE
          END
    ORDER BY
        (CASE
         WHEN pOrderNome = 'ASC'
             THEN e.nome
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderNome = 'DESC'
             THEN e.nome
         ELSE NULL END) DESC,
        (COALESCE(e.data_alteracao, e.data_cadastro)) DESC
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


SELECT DeleteFunctions('Biblioteca', 'SelecionarEditoraSimples');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarEditoraSimples()
    RETURNS TABLE(
        "id"   TEXT,
        "nome" Biblioteca.Editora.nome%TYPE
    ) AS $$

/*
Documentação
Arquivo Fonte.....: Editora.sql
Objetivo..........: Selecionar editora para dropdown
Autor.............: Ítalo Andrade
Data..............: 24/08/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarEditoraSimples();

*/

BEGIN
    RETURN QUERY
    SELECT
        EncryptId(e.id),
        e.nome
    FROM Biblioteca.Editora e
    ORDER BY e.nome;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('Biblioteca', 'SelecionarEditoraPorId');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarEditoraPorId(
    pId TEXT
)
    RETURNS TABLE(
        "id"                   TEXT,
        "nome"                 Biblioteca.Editora.nome%TYPE,
        "nomeUsuarioCadastro"  Biblioteca.Usuario.nome%TYPE,
        "dataCadastro"         Biblioteca.Editora.data_cadastro%TYPE,
        "nomeUsuarioAlteracao" Biblioteca.Usuario.nome%TYPE,
        "dataAlteracao"        Biblioteca.Cliente.data_alteracao%TYPE
    ) AS $$

/*
Documentation
Source file.......: Editora.sql
Description.......: Selecionar editora por id
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarEditoraPorId('mVoAUYZunrg');

*/

DECLARE vId INTEGER;

BEGIN
    vId = DecryptId(pId);

    RETURN QUERY
    SELECT
        EncryptId(e.id) id,
        e.nome,
        uc.nome         nomeUsuarioCadastro,
        e.data_cadastro,
        ua.nome         nomeUsuarioAlteracao,
        e.data_alteracao
    FROM Biblioteca.Editora e
        LEFT JOIN Biblioteca.Usuario uc
            ON uc.id = e.id_usuario_cadastro
        LEFT JOIN Biblioteca.Usuario ua
            ON ua.id = e.id_usuario_alteracao
    WHERE e.id = vId;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('Biblioteca', 'InserirEditora');
CREATE OR REPLACE FUNCTION Biblioteca.InserirEditora(
    pIdUsuario Biblioteca.Usuario.id%TYPE,
    pNome      Biblioteca.Editora.nome%TYPE
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Editora.sql
Description.......: Inserir a new editora
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.InserirEditora(1, '1', 'Test', null, null, '24364775000104', null, null, false, null, null,
null,
 null, null);

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;

BEGIN
    INSERT INTO Biblioteca.Editora (
        nome,
        id_usuario_cadastro
    ) VALUES (
        pNome,
        pIdUsuario
    )
    RETURNING id
        INTO vId;

    RETURN
    json_build_object(
        'executionCode', 0,
        'content', json_build_object(
            'id', EncryptId(vId)
        )
    );
    EXCEPTION WHEN OTHERS
    THEN
        GET STACKED DIAGNOSTICS vErrorProcedure = MESSAGE_TEXT;
        GET STACKED DIAGNOSTICS vErrorMessage = PG_EXCEPTION_CONTEXT;
        RAISE EXCEPTION 'Internal Error: (%) %', vErrorProcedure, vErrorMessage;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('Biblioteca', 'AtualizarEditora');
CREATE OR REPLACE FUNCTION Biblioteca.AtualizarEditora(
    pIdUsuario Biblioteca.Usuario.id%TYPE,
    pId        TEXT,
    pNome      Biblioteca.Editora.nome%TYPE
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Editora.sql
Description.......: Atualizar a editora
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.AtualizarEditora(1, '2', '1', 'Test', null, null, '24364775000104', null, null, false, null,
null,
null, null, null);

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;

BEGIN
    vId = DecryptId(pId);

    IF NOT EXISTS(SELECT 1
                  FROM Biblioteca.Editora e
                  WHERE e.id = vId
                  LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 1,
            'message', 'Editora não encontrada'
        );
    END IF;

    UPDATE Biblioteca.Editora
    SET nome                 = pNome,
        id_usuario_alteracao = pIdUsuario,
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


SELECT DeleteFunctions('Biblioteca', 'RemoverEditora');
CREATE OR REPLACE FUNCTION Biblioteca.RemoverEditora(
    pId TEXT
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Editora.sql
Description.......: Remover a editora
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.RemoverEditora('2');

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;

BEGIN
    vId = DecryptId(pId);

    IF NOT EXISTS(SELECT 1
                  FROM Biblioteca.Editora e
                  WHERE e.id = vId
                  LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 1,
            'message', 'Editora não encontrada'
        );
    END IF;

    IF EXISTS(SELECT 1
              FROM Biblioteca.Livro l
              WHERE l.id_editora = vId
              LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 2,
            'message', 'Contém vínculo com livro'
        );
    END IF;

    DELETE FROM Biblioteca.Editora
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
