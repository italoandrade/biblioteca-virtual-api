/**/


SELECT DeleteFunctions('Biblioteca', 'SelecionarLivro');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarLivro(
    pSearch           VARCHAR(200),
    pPage             INTEGER,
    pLines            INTEGER,
    pOrderTitulo      VARCHAR,
    pOrderNomeAutor   VARCHAR,
    pOrderNomeEditora VARCHAR,
    pOrderEstoque     VARCHAR
)
    RETURNS TABLE(
        "lineCount"   BIGINT,
        "id"          TEXT,
        "titulo"      Biblioteca.Livro.titulo%TYPE,
        "nomeAutor"   Biblioteca.Autor.nome%TYPE,
        "nomeEditora" Biblioteca.Editora.nome%TYPE,
        "estoque"     Biblioteca.Livro.estoque%TYPE
    ) AS $$

/*
Documentation
Source file.......: Livro.sql
Description.......: Selecionar livros
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarLivro(null, 1, 10, null);

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
        EncryptId(l.id)      id,
        l.titulo,
        a.nome               nomeAutor,
        e.nome               nomeEditora,
        l.estoque
    FROM Biblioteca.Livro l
        INNER JOIN Biblioteca.Autor a
            ON a.id = l.id_autor
        LEFT JOIN Biblioteca.Editora e
            ON e.id = l.id_editora
    WHERE CASE
          WHEN pSearch IS NOT NULL
              THEN
                  unaccent(l.titulo) ILIKE '%' || pSearch || '%'
                  OR unaccent(a.nome) ILIKE '%' || pSearch || '%'
                  OR unaccent(e.nome) ILIKE '%' || pSearch || '%'
          ELSE
              TRUE
          END
    ORDER BY
        (CASE
         WHEN pOrderTitulo = 'ASC'
             THEN l.titulo
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderTitulo = 'DESC'
             THEN l.titulo
         ELSE NULL END) DESC,
        (CASE
         WHEN pOrderNomeAutor = 'ASC'
             THEN a.nome
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderNomeAutor = 'DESC'
             THEN a.nome
         ELSE NULL END) DESC,
        (CASE
         WHEN pOrderNomeEditora = 'ASC'
             THEN e.nome
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderNomeEditora = 'DESC'
             THEN e.nome
         ELSE NULL END) DESC,
        (CASE
         WHEN pOrderEstoque = 'ASC'
             THEN l.estoque
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderEstoque = 'DESC'
             THEN l.estoque
         ELSE NULL END) DESC,
        (COALESCE(l.data_alteracao, l.data_cadastro)) DESC
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


SELECT DeleteFunctions('Biblioteca', 'SelecionarLivroPorId');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarLivroPorId(
    pS3Bucket VARCHAR(50),
    pId       TEXT
)
    RETURNS TABLE(
        "id"                   TEXT,
        "imagem"               TEXT,
        "titulo"               Biblioteca.Livro.titulo%TYPE,
        "idAutor"              TEXT,
        "nomeAutor"            Biblioteca.Autor.nome%TYPE,
        "idEditora"            TEXT,
        "nomeEditora"          Biblioteca.Editora.nome%TYPE,
        "sinopse"              Biblioteca.Livro.sinopse%TYPE,
        "estoque"              Biblioteca.Livro.estoque%TYPE,
        "estoqueDisponivel"    INTEGER,
        "nomeUsuarioCadastro"  Biblioteca.Usuario.nome%TYPE,
        "dataCadastro"         Biblioteca.Livro.data_cadastro%TYPE,
        "nomeUsuarioAlteracao" Biblioteca.Usuario.nome%TYPE,
        "dataAlteracao"        Biblioteca.Cliente.data_alteracao%TYPE
    ) AS $$

/*
Documentation
Source file.......: Livro.sql
Description.......: Selecionar livro por id
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarLivroPorId('', 'CbqlpohNZ94');

*/

DECLARE vId INTEGER;

BEGIN
    vId = DecryptId(pId);

    RETURN QUERY
    SELECT
        EncryptId(l.id)                                               id,
        iif(l.imagem IS NOT NULL, (pS3Bucket || 'livro/' || l.imagem), NULL),
        l.titulo,
        EncryptId(l.id_autor)                                         idAutor,
        a.nome                                                        nomeAutor,
        EncryptId(l.id_editora)                                       idEditora,
        e.nome                                                        nomeEditora,
        l.sinopse,
        l.estoque,
        (l.estoque - (SELECT COUNT(1)
                      FROM Biblioteca.Emprestimo e
                      WHERE e.id_livro = l.id
                            AND e.data_devolucao IS NULL)) :: INTEGER estoqueDisponivel,
        uc.nome                                                       nomeUsuarioCadastro,
        l.data_cadastro,
        ua.nome                                                       nomeUsuarioAlteracao,
        l.data_alteracao
    FROM Biblioteca.Livro l
        INNER JOIN Biblioteca.Autor a
            ON a.id = l.id_autor
        LEFT JOIN Biblioteca.Editora e
            ON e.id = l.id_editora
        LEFT JOIN Biblioteca.Usuario uc
            ON uc.id = l.id_usuario_cadastro
        LEFT JOIN Biblioteca.Usuario ua
            ON ua.id = l.id_usuario_alteracao
    WHERE l.id = vId;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('Biblioteca', 'InserirLivro');
CREATE OR REPLACE FUNCTION Biblioteca.InserirLivro(
    pIdUsuario Biblioteca.Usuario.id%TYPE,
    pImagem    Biblioteca.Livro.imagem%TYPE,
    pTitulo    Biblioteca.Livro.titulo%TYPE,
    pIdAutor   TEXT,
    pIdEditora TEXT,
    pSinopse   Biblioteca.Livro.sinopse%TYPE,
    pEstoque   Biblioteca.Livro.estoque%TYPE
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Livro.sql
Description.......: Inserir a new livro
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.InserirLivro(1, '1', 'Test', null, null, '24364775000104', null, null, false, null, null,
null,
 null, null);

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;
    vIdAutor        INTEGER;
    vIdEditora      INTEGER;

BEGIN
    IF pIdAutor IS NOT NULL
    THEN
        vIdAutor = DecryptId(pIdAutor);

        IF NOT EXISTS(SELECT 1
                      FROM Biblioteca.Autor a
                      WHERE a.id = vIdAutor
                      LIMIT 1)
        THEN
            RETURN
            json_build_object(
                'executionCode', 1,
                'message', 'Autor não encontrado'
            );
        END IF;
    END IF;

    IF pIdEditora IS NOT NULL
    THEN
        vIdEditora = DecryptId(pIdEditora);

        IF NOT EXISTS(SELECT 1
                      FROM Biblioteca.Editora e
                      WHERE e.id = vIdEditora
                      LIMIT 1)
        THEN
            RETURN
            json_build_object(
                'executionCode', 2,
                'message', 'Editora não encontrada'
            );
        END IF;
    END IF;

    INSERT INTO Biblioteca.Livro (
        imagem,
        titulo,
        id_autor,
        id_editora,
        sinopse,
        estoque,
        id_usuario_cadastro
    ) VALUES (
        pImagem,
        pTitulo,
        vIdAutor,
        vIdEditora,
        pSinopse,
        pEstoque,
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


SELECT DeleteFunctions('Biblioteca', 'AtualizarLivro');
CREATE OR REPLACE FUNCTION Biblioteca.AtualizarLivro(
    pIdUsuario Biblioteca.Usuario.id%TYPE,
    pId        TEXT,
    pImagem    Biblioteca.Livro.imagem%TYPE,
    pTitulo    Biblioteca.Livro.titulo%TYPE,
    pIdAutor   TEXT,
    pIdEditora TEXT,
    pSinopse   Biblioteca.Livro.sinopse%TYPE,
    pEstoque   Biblioteca.Livro.estoque%TYPE
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Livro.sql
Description.......: Atualizar a livro
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.AtualizarLivro(1, '2', '1', 'Test', null, null, '24364775000104', null, null, false, null,
null,
null, null, null);

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;
    vIdAutor        INTEGER;
    vIdEditora      INTEGER;

BEGIN
    vId = DecryptId(pId);

    IF NOT EXISTS(SELECT 1
                  FROM Biblioteca.Livro e
                  WHERE e.id = vId
                  LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 1,
            'message', 'Livro não encontrado'
        );
    END IF;

    IF pIdAutor IS NOT NULL
    THEN
        vIdAutor = DecryptId(pIdAutor);

        IF NOT EXISTS(SELECT 1
                      FROM Biblioteca.Autor a
                      WHERE a.id = vIdAutor
                      LIMIT 1)
        THEN
            RETURN
            json_build_object(
                'executionCode', 2,
                'message', 'Autor não encontrado'
            );
        END IF;
    END IF;

    IF pIdEditora IS NOT NULL
    THEN
        vIdEditora = DecryptId(pIdEditora);

        IF NOT EXISTS(SELECT 1
                      FROM Biblioteca.Editora e
                      WHERE e.id = vIdEditora
                      LIMIT 1)
        THEN
            RETURN
            json_build_object(
                'executionCode', 3,
                'message', 'Editora não encontrada'
            );
        END IF;
    END IF;

    UPDATE Biblioteca.Livro
    SET imagem               = iif(pImagem IS NOT NULL, imagem, NULL),
        titulo               = pTitulo,
        id_autor             = vIdAutor,
        id_editora           = vIdEditora,
        sinopse              = pSinopse,
        estoque              = pEstoque,
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


SELECT DeleteFunctions('Biblioteca', 'RemoverLivro');
CREATE OR REPLACE FUNCTION Biblioteca.RemoverLivro(
    pId TEXT
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Livro.sql
Description.......: Remover a livro
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.RemoverLivro('2');

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;

BEGIN
    vId = DecryptId(pId);

    IF NOT EXISTS(SELECT 1
                  FROM Biblioteca.Livro e
                  WHERE e.id = vId
                  LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 1,
            'message', 'Livro não encontrado'
        );
    END IF;

    IF EXISTS(SELECT 1
              FROM Biblioteca.Emprestimo e
              WHERE e.id_livro = vId
              LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 2,
            'message', 'Contém vínculo com empréstimo'
        );
    END IF;

    DELETE FROM Biblioteca.Livro
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


SELECT DeleteFunctions('Biblioteca', 'UploadImagemLivro');
CREATE OR REPLACE FUNCTION Biblioteca.UploadImagemLivro(
    pId     TEXT,
    pImagem TEXT
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Livro.sql
Description.......: Trocar imagem de um livro
Author............: Ítalo Andrade
Date..............: 16/09/2017
Ex................:

SELECT * FROM Biblioteca.UploadImagemLivro(1, '2');

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;

BEGIN
    IF pId IS NOT NULL
    THEN
        vId = DecryptId(pId);
    END IF;

    UPDATE Biblioteca.Livro
    SET imagem = pImagem
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
