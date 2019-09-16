# __BSides Colombia 2019__

## _Exorcismo 3_

## Información

**Categoría:** | **Autor**
--- | ---
Criptografía | Huascar Tejeda <<htejeda@f2tc.com>>

**Descripción:**

> Se me quedó mi tabla ouija así que el espíritu no me pudo señalar la clave, tocará averiguarla de otra forma :(
>
> [secreto_gsyzfhV](secreto_gsyzfhV)

**Bandera:**

> BSidesCo{M1r4b1l3_d1Ctu.N0_cre3s?}

## Solución

Utilizando xortool podemos ver que la clave tiene 4 caracteres:

```bash
❯❯❯ xortool encrypted.bin
The most probable key lengths:
   2:   18.1%
   4:   19.6%
   6:   15.4%
   8:   11.7%
  12:   13.5%
  14:   5.2%
  16:   4.8%
  18:   5.8%
  22:   3.7%
  24:   2.2%
```

Para ganar tiempo generamos una lista de posibles claves con `crunch` y luego un script que compara el resultado con el texto conocido "BSides":

```perl
#!/usr/bin/perl

open INF, 'crunched.txt';
while (<INF>) {
    chomp();

    my $key = $_;
    open(IN, "<encrypted.bin");
    binmode(IN);

    my $decr = '';
    while( sysread(IN, my $in, length($key))) {
        $decr .= $in ^ substr($key, 0, length($in));
    }

    if ($decr =~  /BSidesCo/) {
        print "Key = $key\n";
        print "Decr = $decr\n";
        last;
    }
}
```

```bash
❯❯❯ perl crack.pl
Key = BSCo
Decr = Excelente dia para un exorcismo en BSidesCo{M1r4b1l3_d1Ctu.N0_cre3s?}
```
