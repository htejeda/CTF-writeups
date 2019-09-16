# __BSides Colombia 2019__

## _Irreversible_

## Información

**Categoría:** | **Autor**
--- | ---
Criptografía | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Me compartieron un archivo con un mensaje irreversible, de estar en texto plano se podría sumar con la bandera.
>
> [secreto_ENqLQHW](secreto_ENqLQHW)

**Bandera:**

> BSidesCo{Cifrar_usando_MD5_parece_inutil}

## Solución

Es posible conseguir la bandera al crackear los hashes por un rainbow table online:

```
d3533c8a56a9325ab32af80bb99d652b MD5 Cifrar 
70e79d498d7885d565ab2c75d3062fc7 MD5 usando 
7f138a09169b250e9dcb378140907378 MD5 MD5 
337a4834d0dda8ea2f43d9e10d6dd730 MD5 parece 
fc985ff116f0a3325ae2b57e19ca68ea MD5 inutil 
```
