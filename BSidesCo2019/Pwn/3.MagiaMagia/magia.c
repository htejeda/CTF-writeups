#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>


char buf[11];

int main(int argc, char **argv) {
    
    puts("Prueba que eres mago y lees mentes!");
    puts("Primero dime tu nombre (hasta 10 letras): ");
    fflush(stdout);
    fgets(buf, 11, stdin);
        
    strcat(buf, "has tu prediccion: ");  
    puts("Estoy pensando un numero entre 0 y 1000000, puedes decirme cual es?");
    
    srand(time(NULL));
    int secretnum = rand() % 1000000;

    printf(buf);
    fflush(stdout);
    int prediction;
    char num[8];
    fgets(num,8,stdin);
    sscanf(num,"%d",&prediction);

    if (prediction == secretnum){
        printf("Sorprendente! Aca esta la bandera: BSidesCo{flag}\n");
    } else {
        printf("HA! la respuesta era %d lo que comprueba que no lees mentes\n", secretnum); 
    }
    fflush(stdout);
    return 0;
}