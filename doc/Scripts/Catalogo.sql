/**/


SELECT DeleteFunctions('Biblioteca', 'SelecionarCatalogo');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarCatalogo(
    pS3Bucket  VARCHAR(50),
    pSearch    VARCHAR(200),
    pIdAutor   TEXT,
    pIdEditora TEXT,
    pUnless    TEXT []
)
    RETURNS TABLE(
        "id"       TEXT,
        "imagem"   TEXT,
        "titulo"   Biblioteca.Livro.titulo%TYPE,
        "esgotado" BOOLEAN
    ) AS $$

/*
Documentation
Source file.......: Livro.sql
Description.......: Selecionar livros
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarCatalogo('', null, 1, 10, null);

*/

DECLARE
    vIdAutor   INTEGER;
    vIdEditora INTEGER;

BEGIN
    IF pSearch IS NOT NULL
    THEN
        pSearch = unaccent(pSearch);
    END IF;

    IF pIdAutor IS NOT NULL
    THEN
        vIdAutor = DecryptId(pIdAutor);
    END IF;

    IF pIdEditora IS NOT NULL
    THEN
        vIdEditora = DecryptId(pIdEditora);
    END IF;

    RETURN QUERY
    SELECT
        EncryptId(l.id) id,
        iif(l.imagem IS NOT NULL, (pS3Bucket || 'livro/' || l.imagem), NULL),
        l.titulo,
        NOT (l.estoque - (SELECT COUNT(1)
                          FROM Biblioteca.Emprestimo e
                          WHERE e.id_livro = l.id
                                AND e.data_devolucao IS NULL)) > 0
    FROM Biblioteca.Livro l
    WHERE CASE
          WHEN pSearch IS NOT NULL
              THEN
                  unaccent(l.titulo) ILIKE '%' || pSearch || '%'
          ELSE
              TRUE
          END
          AND (pUnless IS NULL OR EncryptId(l.id) != ALL (pUnless))
          AND (vIdAutor IS NULL OR l.id_autor = vIdAutor)
          AND (vIdEditora IS NULL OR l.id_editora = vIdEditora)
    ORDER BY l.titulo
    LIMIT 20;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('Biblioteca', 'EfetuarReservaLivro');
CREATE OR REPLACE FUNCTION Biblioteca.EfetuarReservaLivro(
    pIdUsuario Biblioteca.Usuario.id%TYPE,
    pId        TEXT
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Catalogo.sql
Description.......: Inserir a new livro
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.EfetuarReservaLivro(1, '1');

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;
    vIdCliente      INTEGER;

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

    SELECT id
    INTO vIdCliente
    FROM Biblioteca.Cliente
    WHERE id_usuario = pIdUsuario;

    INSERT INTO Biblioteca.Emprestimo (
        id_cliente,
        id_livro
    ) VALUES (
        vIdCliente,
        vId
    )
    RETURNING id
        INTO vId;

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
