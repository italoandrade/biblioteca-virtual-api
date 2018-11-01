/**/


SELECT DeleteFunctions('Biblioteca', 'SelecionarHistoricoEmprestimoLivro');
CREATE OR REPLACE FUNCTION Biblioteca.SelecionarHistoricoEmprestimoLivro(
    pIdUsuario           INTEGER,
    pSearch              VARCHAR(200),
    pPage                INTEGER,
    pLines               INTEGER,
    pOrderLivro          VARCHAR,
    pOrderCliente        VARCHAR,
    pOrderDataReserva    VARCHAR,
    pOrderDataEmprestimo VARCHAR,
    pOrderDataDevolucao  VARCHAR,
    pOrderStatus         VARCHAR
)
    RETURNS TABLE(
        "lineCount"      BIGINT,
        "id"             TEXT,
        "livro"          Biblioteca.Livro.titulo%TYPE,
        "nomeCliente"    Biblioteca.Usuario.nome%TYPE,
        "dataReserva"    Biblioteca.Emprestimo.data_reserva%TYPE,
        "dataEmprestimo" Biblioteca.Emprestimo.data_emprestimo%TYPE,
        "dataDevolucao"  Biblioteca.Emprestimo.data_devolucao%TYPE,
        "status"         TEXT
    ) AS $$

/*
Documentation
Source file.......: Emprestimo.sql
Description.......: Selecionar histórico de empréstimo de livros
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.SelecionarHistoricoEmprestimoLivro(null, 1, 10, null, null, null, null);

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
            PARTITION BY 1 )           lineCount,
        EncryptId(e.id)                id,
        l.titulo,
        u.nome                         nomeCliente,
        e.data_reserva,
        e.data_emprestimo,
        e.data_devolucao,
        (CASE
         WHEN e.data_devolucao IS NULL AND e.data_emprestimo IS NOT NULL
             THEN iif(CURRENT_TIMESTAMP > (e.data_emprestimo + INTERVAL '1 week'), 'Atrasado' :: TEXT,
                      'No prazo' :: TEXT)
         WHEN e.data_emprestimo IS NULL
             THEN 'Para retirar'
         ELSE 'Devolvido' :: TEXT END) status
    FROM Biblioteca.Emprestimo e
        INNER JOIN Biblioteca.Livro l
            ON l.id = e.id_livro
        INNER JOIN Biblioteca.Cliente c
            ON c.id = e.id_cliente
        INNER JOIN Biblioteca.Usuario u
            ON u.id = c.id_usuario
    WHERE CASE
          WHEN pSearch IS NOT NULL
              THEN
                  unaccent(l.titulo) ILIKE '%' || pSearch || '%'
                  OR unaccent(u.nome) ILIKE '%' || pSearch || '%'
                  OR c.cpf :: TEXT ILIKE '%' || regexp_replace(pSearch, '[.\- 	]', '', 'g') || '%'
                  OR c.rg :: TEXT ILIKE '%' || regexp_replace(pSearch, '[.\- 	]', '', 'g') || '%'
          ELSE
              TRUE
          END
          AND (pIdUsuario IS NULL OR u.id = pIdUsuario)
    ORDER BY
        (CASE
         WHEN pOrderLivro = 'ASC'
             THEN l.titulo
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderLivro = 'DESC'
             THEN l.titulo
         ELSE NULL END) DESC,
        (CASE
         WHEN pOrderCliente = 'ASC'
             THEN u.nome
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderCliente = 'DESC'
             THEN u.nome
         ELSE NULL END) DESC,
        (CASE
         WHEN pOrderDataReserva = 'ASC'
             THEN e.data_reserva
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderDataReserva = 'DESC'
             THEN e.data_reserva
         ELSE NULL END) DESC,
        (CASE
         WHEN pOrderDataEmprestimo = 'ASC'
             THEN e.data_emprestimo
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderDataEmprestimo = 'DESC'
             THEN e.data_emprestimo
         ELSE NULL END) DESC,
        (CASE
         WHEN pOrderDataDevolucao = 'ASC'
             THEN e.data_devolucao
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderDataDevolucao = 'DESC'
             THEN e.data_devolucao
         ELSE NULL END) DESC,
        (CASE
         WHEN pOrderStatus = 'ASC'
             THEN status
         ELSE NULL END) ASC,
        (CASE
         WHEN pOrderStatus = 'DESC'
             THEN status
         ELSE NULL END) DESC,
        e.id DESC
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


SELECT DeleteFunctions('Biblioteca', 'CancelarReservaLivro');
CREATE OR REPLACE FUNCTION Biblioteca.CancelarReservaLivro(
    pIdUsuario Biblioteca.Usuario.id%TYPE,
    pId        TEXT
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Emprestimo.sql
Description.......: Cancelar reserva de livro
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.CancelarReservaLivro(1, '1');

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;
    vIdCliente      INTEGER;

BEGIN
    vId = DecryptId(pId);

    IF pIdUsuario IS NOT NULL
    THEN
        SELECT id
        INTO vIdCliente
        FROM Biblioteca.Cliente
        WHERE id_usuario = pIdUsuario;
    END IF;

    IF NOT EXISTS(SELECT 1
                  FROM Biblioteca.Emprestimo e
                  WHERE e.id = vId
                        OR id_cliente = vIdCliente
                  LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 1,
            'message', 'Reserva não encontrada'
        );
    END IF;

    DELETE FROM Biblioteca.Emprestimo
    WHERE id = vId
          AND (pIdUsuario IS NULL OR id_cliente = vIdCliente);

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


SELECT DeleteFunctions('Biblioteca', 'MarcarEmprestadoLivro');
CREATE OR REPLACE FUNCTION Biblioteca.MarcarEmprestadoLivro(
    pId        TEXT
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Emprestimo.sql
Description.......: Marcar livro como emprestado
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.MarcarEmprestadoLivro(1, '1');

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;

BEGIN
    vId = DecryptId(pId);

    IF NOT EXISTS(SELECT 1
                  FROM Biblioteca.Emprestimo e
                  WHERE e.id = vId
                  LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 1,
            'message', 'Empréstimo não encontrado'
        );
    END IF;

    UPDATE Biblioteca.Emprestimo
    SET data_emprestimo = CURRENT_TIMESTAMP
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


SELECT DeleteFunctions('Biblioteca', 'MarcarDevolvidoLivro');
CREATE OR REPLACE FUNCTION Biblioteca.MarcarDevolvidoLivro(
    pId        TEXT
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Emprestimo.sql
Description.......: Marcar livro como devolvido
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.MarcarDevolvidoLivro(1, '1');

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;
    vId             INTEGER;

BEGIN
    vId = DecryptId(pId);

    IF NOT EXISTS(SELECT 1
                  FROM Biblioteca.Emprestimo e
                  WHERE e.id = vId
                  LIMIT 1)
    THEN
        RETURN
        json_build_object(
            'executionCode', 1,
            'message', 'Empréstimo não encontrado'
        );
    END IF;

    UPDATE Biblioteca.Emprestimo
    SET data_devolucao = CURRENT_TIMESTAMP
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
