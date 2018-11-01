/**/


SELECT DeleteFunctions('Biblioteca', 'UsuarioLogin');
CREATE OR REPLACE FUNCTION Biblioteca.UsuarioLogin(
    pId       INTEGER,
    pEmail    Biblioteca.Usuario.email%TYPE,
    pPassword VARCHAR(40)
)
    RETURNS TABLE(
        "id"            TEXT,
        "idTipoUsuario" Biblioteca.Tipo_Usuario.id%TYPE,
        "cor"           Biblioteca.Usuario.id%TYPE,
        "nome"          Biblioteca.Usuario.nome%TYPE,
        "letra"         TEXT,
        "email"         Biblioteca.Usuario.email%TYPE,
        "senhaCorreta"  BOOLEAN,
        "token"         JSON
    ) AS $$

/*
Documentation
Source file.......: Usuario.sql
Description.......: Usuario login
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.UsuarioLogin(null, 'italo@unifran.com.br', 'teste123');

*/

BEGIN
    RETURN QUERY
    SELECT
        EncryptId(u.id)            id,
        u.id_tipo_usuario,
        u.id                       cor,
        u.nome,
        left(u.nome, 1)            letra,
        u.email,
        (u.senha = MD5(pPassword)) senhaCorreta,
        json_build_object(
            'id', u.id,
            'idTipoUsuario', u.id_tipo_usuario
        )                          token
    FROM Biblioteca.Usuario u
    WHERE CASE
          WHEN pId IS NULL
              THEN u.email = pEmail
          ELSE u.id = pId END;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('Biblioteca', 'UsuarioCadastrar');
CREATE OR REPLACE FUNCTION Biblioteca.UsuarioCadastrar(
    pNome  Biblioteca.Usuario.nome%TYPE,
    pEmail Biblioteca.Usuario.email%TYPE,
    pSenha Biblioteca.Usuario.senha%TYPE
)
    RETURNS JSON AS $$

/*
Documentation
Source file.......: Usuario.sql
Description.......: Registrar novo usuário
Author............: Ítalo Andrade
Date..............: 17/09/2017
Ex................:

SELECT * FROM Biblioteca.UsuarioCadastrar('Usuario test', 'user@test', 'test123');

*/

DECLARE
    vErrorProcedure TEXT;
    vErrorMessage   TEXT;

BEGIN
    IF EXISTS(SELECT 1
              FROM Biblioteca.Usuario
              WHERE email = pEmail)
    THEN
        RETURN
        json_build_object(
            'executionCode', 2,
            'message', 'E-mail existente'
        );
    END IF;

    INSERT INTO Biblioteca.Usuario (
        nome,
        email,
        senha,
        id_tipo_usuario
    ) VALUES (
        pNome,
        pEmail,
        MD5(pSenha),
        2
    );

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
