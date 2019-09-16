/* OPTIXAL EMAIL SERVICES
 * INBOX AUTHENTICATOR v1.0 */

// Compile and run this program using the following command:
//   gcc inbox.c -o inbox -fno-stack-protector
// ./inbox

#include <stdio.h>
#include <string.h>

void displayInbox() {
    printf("\nCargando la bandeja de entrada...\n");
    printf("BSidesCo{%s}\n", "");
}

void main() {
    setvbuf(stdin, NULL, _IONBF, 0);
    setvbuf(stdout, NULL, _IONBF, 0);
    
    char password[8];
    char authenticated = 'N';

    printf("====================|==|====================\n");
    printf("SERVICIO DE CORREO SIN MEDIDA\n");
    printf("%-11s : %s", "Usuario", "Rodolfo\n");
    printf("%-11s : %s", "Bandeja", "1 nuevo correo\n");
    printf("====================|==|====================\n\n");

    printf("Se requiere una clave para observar el correo...\n");
    printf("ADVERTENCIA: SE RECOMIENA UNA CLAVE DE 7 DIGITOS\n");
    printf("Entre su clave: ");
    scanf("%s", password);

    // LA CLAVE SE CAMBIO ("EJEMPLO" ES UNA MUESTRA)
    if (!strcmp(password, "EJEMPLO")) authenticated = 'Y';

    if (authenticated == 'Y') {
        displayInbox();
    } else {
        printf("\nClave incorrecta...\n");
    }
}
