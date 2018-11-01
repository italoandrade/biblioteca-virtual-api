/**/


SELECT DeleteFunctions('Biblioteca', 'SelecionarAutor');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarAutor(
    pSearch    VARCHAR(200),
    pPage      INTEGER,
    pLines     INTEGER,
    pOrderNome VARCHAR
)
    RETURNS TABLE(
        "lineCount" BIGINT,
        "id"        TEXT,
        "nome"      Biblioteca.Autor.nome%TYPE
    ) AS $$

/*
Documentation
Source file.......: Autor.sql
Description.......: Selecionar autores
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarAutor(null, 1, 10, null);

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
    FROM Biblioteca.Autor e
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


SELECT DeleteFunctions('Biblioteca', 'SelecionarAutorSimples');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarAutorSimples()
    RETURNS TABLE(
        "id"   TEXT,
        "nome" Biblioteca.Autor.nome%TYPE
    ) AS $$

/*
Documentação
Arquivo Fonte.....: Autor.sql
Objetivo..........: Selecionar autor para dropdown
Autor.............: Ítalo Andrade
Data..............: 24/08/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarAutorSimples();

*/

BEGIN
    RETURN QUERY
    SELECT
        EncryptId(a.id),
        a.nome
    FROM Biblioteca.Autor a
    ORDER BY a.nome;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('Biblioteca', 'SelecionarAutorPorId');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarAutorPorId(
    pId TEXT
)
    RETURNS TABLE(
        "id"                   TEXT,
        "nome"                 Biblioteca.Autor.nome%TYPE,
        "nomeUsuarioCadastro"  Biblioteca.Usuario.nome%TYPE,
        "dataCadastro"         Biblioteca.Autor.data_cadastro%TYPE,
        "nomeUsuarioAlteracao" Biblioteca.Usuario.nome%TYPE,
        "dataAlteracao"        Biblioteca.Cliente.data_alteracao%TYPE
    ) AS $$

/*
Documentation
Source file.......: Autor.sql
Description.......: Selecionar autor por id
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarAutorPorId('mVoAUYZunrg');

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
    FROM Biblioteca.Autor e
        LEFT JOIN Biblioteca.Usuario uc
            ON uc.id = e.id_usuario_cadastro
        LEFT JOIN Biblioteca.Usuario ua
            ON ua.id = e.id_usuario_alteracao
    WHERE e.id = vId;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('Biblioteca', 'InserirAutor');
CREATE OR REPLACE FUNCTION Biblioteca.InserirAutor(
    pIdUsuario Biblioteca.Usuario.id%TYPE,
    pNome      Biblioteca.Autor.nome%TYPE
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Autor.sql
Description.......: Inserir a new autor
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.InserirAutor(1, '1', 'Test', null, null, '24364775000104', null, null, false, null, null,
null,
 null, null);

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;

BEGIN
    INSERT INTO Biblioteca.Autor (
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


SELECT DeleteFunctions('Biblioteca', 'AtualizarAutor');
CREATE OR REPLACE FUNCTION Biblioteca.AtualizarAutor(
    pIdUsuario Biblioteca.Usuario.id%TYPE,
    pId        TEXT,
    pNome      Biblioteca.Autor.nome%TYPE
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Autor.sql
Description.......: Atualizar a autor
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.AtualizarAutor(1, '2', '1', 'Test', null, null, '24364775000104', null, null, false, null,
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
                  FROM Biblioteca.Autor e
                  WHERE e.id = vId
                  LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 1,
            'message', 'Autor não encontrado'
        );
    END IF;

    UPDATE Biblioteca.Autor
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


SELECT DeleteFunctions('Biblioteca', 'RemoverAutor');
CREATE OR REPLACE FUNCTION Biblioteca.RemoverAutor(
    pId TEXT
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Autor.sql
Description.......: Remover a autor
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.RemoverAutor('2');

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;

BEGIN
    vId = DecryptId(pId);

    IF NOT EXISTS(SELECT 1
                  FROM Biblioteca.Autor e
                  WHERE e.id = vId
                  LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 1,
            'message', 'Autor não encontrado'
        );
    END IF;

    IF EXISTS(SELECT 1
              FROM Biblioteca.Livro l
              WHERE l.id_autor = vId
              LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 2,
            'message', 'Contém vínculo com livro'
        );
    END IF;

    DELETE FROM Biblioteca.Autor
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
