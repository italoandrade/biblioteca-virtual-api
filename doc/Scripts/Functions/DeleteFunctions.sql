/**/


CREATE OR REPLACE FUNCTION public.DeleteFunctions(
    schema TEXT,
    name TEXT
)
    RETURNS TEXT AS $BODY$

/*
Documentation
Source file.......: DeleteFunctions.sql
Description.......: Identify all functions with the schema and name specified and deletes them
Author............: Ítalo Andrade
Date..............: 16/09/2016
Ex................:

SELECT public.DeleteFunctions('public', 'DeleteFunctions');

*/

DECLARE funcrow       RECORD;
        numfunctions  SMALLINT := 0;
        numparameters INT;
        i             INT;
        paramtext     TEXT;

BEGIN
    schema := lower(schema);
    name := lower(name);
    -- noinspection SqlResolve
    FOR funcrow IN SELECT proargtypes
                   FROM pg_proc
                   WHERE proname = name LOOP

        numparameters = array_upper(funcrow.proargtypes, 1) + 1;

        i = 0;
        paramtext = '';

        LOOP
            IF i < numparameters
            THEN
                IF i > 0
                THEN
                    paramtext = paramtext || ', ';
                END IF;
                -- noinspection SqlResolve
                paramtext = paramtext || (SELECT typname
                                          FROM pg_type
                                          WHERE oid = funcrow.proargtypes [i]);
                i = i + 1;
            ELSE
                EXIT;
            END IF;
        END LOOP;

        EXECUTE 'DROP FUNCTION ' || schema || '.' || name || '(' || paramtext || ');';
        numfunctions = numfunctions + 1;

    END LOOP;

    RETURN '0';
END;
$BODY$
LANGUAGE plpgsql;


/**/
