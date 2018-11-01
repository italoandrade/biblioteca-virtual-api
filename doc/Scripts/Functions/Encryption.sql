/*
    CREATE EXTENSION pgcrypto;
*/


SELECT DeleteFunctions('public', 'EncryptText');
CREATE OR REPLACE FUNCTION public.EncryptText(
    pPlain TEXT
)
    RETURNS TEXT AS $$

/*
Documentation
Source file.......: Encryption.sql
Description.......: Encrypt text
Autor.............: Ítalo Andrade
Data..............: 08/04/2017
Ex................:

SELECT public.EncryptText('1');

*/

DECLARE
    vKey VARCHAR(3) = 'rnb';

BEGIN
    SET bytea_output TO 'escape';

    -- Criptografando
    RETURN replace(
        replace(
            replace(
                (
                    encode(
                        public.encrypt(pPlain :: BYTEA, vKey :: BYTEA, 'bf' :: TEXT),
                        'base64'
                    ) :: TEXT
                ),
                '=', ''),
            '+', '-'),
        '/', '_');
END;
$$
LANGUAGE plpgsql;

SELECT DeleteFunctions('public', 'EncryptId');
CREATE OR REPLACE FUNCTION public.EncryptId(
    pPlain INTEGER
)
    RETURNS TEXT AS $$

/*
Documentation
Source file.......: Encryption.sql
Description.......: Encrypt id
Autor.............: Ítalo Andrade
Data..............: 08/04/2017
Ex................:

SELECT public.EncryptId(1);

*/

BEGIN
    RETURN EncryptText(pPlain :: TEXT);
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('public', 'DecryptText');
CREATE OR REPLACE FUNCTION public.DecryptText(pSalt TEXT)

    RETURNS TEXT AS $$

/*
Documentation
Source file.......: Encryption.sql
Description.......: Decrypt text
Autor.............: Ítalo Andrade
Data..............: 08/04/2017
Ex................:

SELECT public.EncryptText('1');
SELECT public.DecryptText('Ewgyw6Zj1Lo');

*/
DECLARE
    vKey VARCHAR(3) = 'rnb';
    vRet TEXT;

BEGIN
    SET bytea_output TO 'escape';

    WHILE (4 * (length(pSalt) / 3.0)) % 1 <> 0
    LOOP
        pSalt := CONCAT(pSalt, '=');
    END LOOP;

    vRet = public.decrypt(
        decode(
            replace(
                replace(
                    pSalt,
                    '-',
                    '+'
                ),
                '_',
                '/'
            ), 'base64'
        ) :: BYTEA,
        vKey :: BYTEA,
        'bf'
    );

    RETURN vRet;

    EXCEPTION WHEN OTHERS
    THEN
        RETURN NULL;
END;
$$
LANGUAGE plpgsql;


SELECT DeleteFunctions('public', 'DecryptId');
CREATE OR REPLACE FUNCTION public.DecryptId(pSalt TEXT)

    RETURNS INTEGER AS $$

/*
Documentation
Source file.......: Encryption.sql
Description.......: Decrypt id
Autor.............: Ítalo Andrade
Data..............: 08/04/2017
Ex................:

SELECT public.EncryptId(1);
SELECT public.DecryptId('Ewgyw6Zj1Lo');

*/

DECLARE
    vRet TEXT;

BEGIN
    IF pSalt ~ '^[0-9]+$'
    THEN
        RETURN pSalt :: INTEGER;
    END IF;

    vRet = public.DecryptText(pSalt);

    IF vRet ~ '^[0-9]+$'
    THEN
        RETURN vRet :: INTEGER;
    ELSE
        RETURN NULL;
    END IF;
END;
$$
LANGUAGE plpgsql;


/**/
