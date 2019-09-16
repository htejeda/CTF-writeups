# __BSides Colombia 2019__

## _Bug Bounty 6_

## Información

**Categoría:** | **Autor**
--- | ---
Web | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Nos hemos sumado a un programa "Bug Bounty", así que por cada vulnerabilidad habrá una recompensa.
> El objetivo es http://portal.bsides.ctf.co

**Bandera:**

> BSidesCo{bUg6_w3b_Qu3_4cc3d0_W3B_qUe_PwN30}

## Solución

En el archivo backup.sql podemos ver dos cuentas con hashes md5 sin salt. Pudimos encontrar el password de la cuenta **john** y al hacer login, conseguimos la sexta bandera:

![](/images/BSidesCo2019/Web/BugBounty6/01.png)

![](/images/BSidesCo2019/Web/BugBounty6/02.png)

![](/images/BSidesCo2019/Web/BugBounty6/03.png)
