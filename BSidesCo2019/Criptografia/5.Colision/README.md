# __BSides Colombia 2019__

## _Colision_

## Información

**Categoría:** | **Autor**
--- | ---
Criptografía | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Se dice que dos archivos diferentes generan un valor HASH diferente, bueno, se sabe que existe una probabilidad (así sea pequeña) de que esto sea mentira, es decir, pueden existir dos archivos diferentes que generen el mismo valor SHA1.
>
> Usa http://retos.bsides.ctf.co:18080 para que demuestres tu habilidad generando colisiones, pero ¡ten cuidado!, una vez un par de archivos sean aceptados no serán válidos de nuevo.

**Bandera:**

> BSidesCo{l4s_c0l1s10N3s_CrIpT0Gr4f1C4s_eX1st3n}

## Solución

Utilizamos el servicio https://alf.nu/SHA1 para subir dos imágenes y este va a generar dos PDFs con el mismo SHA1:

![](/images/BSidesCo2019/Criptografia/Colision/01.png)

![](/images/BSidesCo2019/Criptografia/Colision/02.png)
