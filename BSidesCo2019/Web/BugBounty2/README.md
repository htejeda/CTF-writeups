# __BSides Colombia 2019__

## _Bug Bounty 2_

## Información

**Categoría:** | **Autor**
--- | ---
Web | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Nos hemos sumado a un programa "Bug Bounty", así que por cada vulnerabilidad habrá una recompensa.
> El objetivo es http://portal.bsides.ctf.co

**Bandera:**

> BSidesCo{bUg2_3l_p0d3r_D3_iR_C0n_RuMB0_d3sC0N0c1D0}

## Solución

Luego de acceder acceder al formulario de login, si apuntamos el query string **redirect** a un lugar diferente de `http://portal.bsides.ctf.co/employee?page=dashboard.html`:

![](/images/BSidesCo2019/Web/BugBounty2/01.png)

![](/images/BSidesCo2019/Web/BugBounty2/02.png)
