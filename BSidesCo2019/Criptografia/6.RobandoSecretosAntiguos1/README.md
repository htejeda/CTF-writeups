# __BSides Colombia 2019__

## _Robando Secretos Antiguos 1_

## Información

**Categoría:** | **Autor**
--- | ---
Criptografía | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Un amigo logró robar un secreto pero necesitamos alguien que lo descifre.

**Bandera:**

> BSidesCo{l4s_c0l1s10N3s_CrIpT0Gr4f1C4s_eX1st3n}

## Solución

```bash
❯❯❯ openssl rsa -in secreto_4w0rH5o.dms -pubout -outform pem > id_rsa.pub.pem
❯❯❯ openssl rsa -in secreto_4w0rH5o.dms -outform pem > id_rsa.pem
❯❯❯ openssl rsautl -decrypt -inkey id_rsa.pem -in mensaje.dms -out out.txt
❯❯❯ cat out.txt
BSidesCo{uN_s3Cr3T0_P0c0_S3cR3t0}
```
