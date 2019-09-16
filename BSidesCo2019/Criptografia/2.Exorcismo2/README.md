# __BSides Colombia 2019__

## _Exorcismo 2_

## Información

**Categoría:** | **Writeup Author**
--- | ---
Criptografía | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Un espíritu se comunicó conmigo, me decía "Yo tengo la bandera" y de repente dejé de escucharlo, así que me envió todo el mensaje.
>
> [secreto_xyV7nCp](secreto_xyV7nCp)

**Bandera:**

> BSidesCo{eX0Rc1s0_l0_D3sC0n0c1d0}

## Solución

El espíritu le decía "Yo tengo la bandera" y luego dejó de escucharlo. Podría ser XOR diferencial siendo "Yo tengo la bandera" el inicio de la clave:

![](/images/BSidesCo2019/Criptografia/Exorcismo2/01.png)

*Agregamos " que genera puntos " a la llave para obtener la bandera:

![](/images/BSidesCo2019/Criptografia/Exorcismo2/02.png)