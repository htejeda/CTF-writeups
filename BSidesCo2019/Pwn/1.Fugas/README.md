# __BSides Colombia 2019__

## _Fugas_

## Información

**Categoría:** | **Writeup Author**
--- | ---
Pwn | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Tengo a todos mis usuarios identificados pero hay algunos que se me fugan!
> Puedes capturar tres de ellos por mi?
> retos.bsides.ctf.co:31331
>
> [fugas.js](fugas.js)

**Bandera:**

> BSidesCo{n0_M4s_fUg4_d3_C3rEBr0S}

## Solución

El programa solicita tres números en secuencia, que no se repitan y que cumplan con la condición: `(a(num) === true && b(num) === false)`.
Para solucionarlo rápidamente podemos reutilizar el código de `flag.js` para generar los primeros tres números:

```javascript
#!/usr/bin/env node

const BigNumber = require('bignumber.js');

function a(num) {
    if (num === 1) { return false; }
    for (var i=2; i < 11; i++) {
        x = new BigNumber(i);
        if (x.exponentiatedBy(num).minus(i).mod(num).isEqualTo(0) !== true) {
            return false;
        }
    }
    return true;
}

function b(num) {
    if (num === 2) { return true; }
    if (num % 2 === 0) { return false; }
    for(let i = 3, s = Math.sqrt(num); i <= s; i += 2) {
        if (num % i === 0) { return false; }
    }
    return num !== 1;
}


count = 0
for (r=1; r < 131337; r++) {
    if (a(r) === true && b(r) === false) {
        console.log(r);

        if (++count == 3)
            break
    }
}
```

```bash
❯❯❯ node gen.js
561
1105
1729

❯❯❯ nc retos.bsides.ctf.co 31331                                                                                                                                                                                          ⏎
####### #     #  #####     #     #####
#       #     # #     #   # #   #     #
#       #     # #        #   #  #
#####   #     # #  #### #     #  #####
#       #     # #     # #######       #
#       #     # #     # #     # #     #
#        #####   #####  #     #  #####

Dame un número mayor a 0 y menor a 131337!
> 561
Evitaste 1 fuga
> 1105
Evitaste 2 fuga
> 1729
Gracias! Esta es tu recompensa. BSidesCo{n0_M4s_fUg4_d3_C3rEBr0S}
```
