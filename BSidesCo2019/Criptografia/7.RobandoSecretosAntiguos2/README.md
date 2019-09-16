# __BSides Colombia 2019__

## _Robando Secretos Antiguos 2_

## Información

**Categoría:** | **Autor**
--- | ---
Criptografía | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Un amigo logró robar un secreto pero necesitamos alguien que lo descifre.

**Bandera:**

> BSidesCo{s1_f4cT0r1Z4r_pU3d3s_3L_S3cR3t0_T1En3S}

## Solución

Obtenemos p y q de factordb.com:

![](/images/BSidesCo2019/Criptografia/RobandoSecretosAntiguos2/01.png)

```python
import binascii

e = 65537
n = 17969491597941066732916128449573246156367561808012600070888918835531726460341490933493372247868650755230855864199929221814436684722874052065257937495694348389263171152522525654410980819170611742509702440718010364831638288518852689
c = 8382677377417690792647309334972678504553852050050779935757197325208228189153474044257884138855505295719871116383347211553669166112453955032323909483846529790382855788519196995584434049684834034557152752461623881787006129923216774
p = 3968132623150957588532394439049887341769533966621957829426966084093049516953598120833228447171744337427374763106901
q = 4528450358010492026612439739120166758911246047493700040073956759261590397250033699357694507193523000343088601688589

def egcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, y, x = egcd(b % a, a)
        return (g, x - (b // a) * y, y)

def modinv(a, m):
    g, x, y = egcd(a, m)
    if g != 1:
        raise Exception('modular inverse does not exist')
    else:
        return x % m

phi=(p-1)*(q-1)
d = modinv(e,phi)
m = pow(c,d,n)

print(binascii.unhexlify(hex(m)[2:]).decode())
```

```bash
❯❯❯ python solve.py
BSidesCo{s1_f4cT0r1Z4r_pU3d3s_3L_S3cR3t0_T1En3S}
```
