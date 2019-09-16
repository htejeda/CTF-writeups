# __BSides Colombia 2019__

## _Bug Bounty 1_

## Información

**Categoría:** | **Autor**
--- | ---
Web | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Nos hemos sumado a un programa "Bug Bounty", así que por cada vulnerabilidad habrá una recompensa.
> El objetivo es http://portal.bsides.ctf.co

**Bandera:**

> BSidesCo{bUg1_3sT3_Es_3l_4cC3ss_C0d3_8486253159}

## Solución

La primera bandera se encuentra en la página de recuperación del código de acceso del empleado: http://portal.bsides.ctf.co/forgot
Conseguimos el flag luego de probar el SQL injection `' or 1=1`.

![](/images/BSidesCo2019/Web/BugBounty1/01.png)

![](/images/BSidesCo2019/Web/BugBounty1/02.png)

***Nota**: El código de acceso (8486253159) es necesario para registrar una nueva cuenta.*
