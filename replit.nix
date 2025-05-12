{ pkgs }: {
	deps = [
    pkgs.php
    pkgs.phpExtensions.mbstring
    pkgs.phpExtensions.pdo
    pkgs.phpExtensions.opcache
    pkgs.phpExtensions.mysqli
    pkgs.mariadb
	];
}