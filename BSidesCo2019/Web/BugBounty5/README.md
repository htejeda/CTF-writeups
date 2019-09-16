# __BSides Colombia 2019__

## _Bug Bounty 5_

## Información

**Categoría:** | **Autor**
--- | ---
Web | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Nos hemos sumado a un programa "Bug Bounty", así que por cada vulnerabilidad habrá una recompensa.
> El objetivo es http://portal.bsides.ctf.co

**Bandera:**

> BSidesCo{bUg5_eN_l0c4L_n0_SiEmPr3_3s_M4S_s3GurO}

## Solución

En el código fuente HTML aparte de la cuarta bandera, vemos una indicación de que podemos conseguir el backup de la base de datos en el directorio raiz de la aplicación.
A través de una vulnerabilidad LFI en el query string `page` podemos acceder al archivo backup.sql y conseguir la quinta bandera:

![](/images/BSidesCo2019/Web/BugBounty5/01.png)
