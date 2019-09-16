# __BSides Colombia 2019__

## _Diffiere delmanual_

## Información

**Categoría:** | **Autor**
--- | ---
Criptografía | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Nuestro sistema automatizado que intercambia claves ya no funciona, por suerte tenemos un plan B, un proceso manual disponible en retos.bsides.ctf.co:18081

**Bandera:**

> BSidesCo{n0_H4Y_cRyPT0_qU3_mE_R3s1St4}

## Solución

Inicialmente hice una implementación simple de Diffie–Hellman Key Exchange para generar la llave privada, pero por alguna razón no podía conseguir la bandera a pesar de confirmar que la llave privada estaba correcta. Para no perder más tiempo decidí hacer un ataque de fuerza bruta con el que saque la bandera en menos de un segundo:

```bash
❯❯❯ nc retos.bsides.ctf.co 18081                                                                                                                                                                              ⏎
Secuencia de intercambio de claves iniciado
===============================

Estos son los dos valores base en los que estaremos de acuerdo:
p: 39019
g: 2719
Su valor calculado : 123
Valor computado por el servidor : 24527

Convierta la cadena de la clave compartida en sus bytes MD5 para crear una clave AES-128-ECB-PKCS7 para descifrar el siguiente mensaje codificado en base64:
h/Hg1M9hC+3CbBuD4btBPr3FqC7wSlxq32BDALD7TsSgTKIxT0RplUQaqZgVTrqB
```

```python
import math
import hashlib
from Crypto.Cipher import AES

encrypted = "h/Hg1M9hC+3CbBuD4btBPr3FqC7wSlxq32BDALD7TsSgTKIxT0RplUQaqZgVTrqB".decode('base64')

for n in range(1, 99999):

    m = hashlib.md5()
    m.update(str(n))

    key = m.digest()
    cipher = AES.new(key, AES.MODE_ECB)
    decrypted = cipher.decrypt(encrypted)

    if decrypted.find("BSide") != -1:
        print decrypted
        break
```

```bash
❯❯❯ time python2 crack.py
BSidesCo{n0_H4Y_cRyPT0_qU3_mE_R3s1St4}

python2 crack.py  0.60s user 0.07s system 97% cpu 0.685 total
```
