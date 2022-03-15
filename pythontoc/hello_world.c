#include <stdio.h>
int *test(int a[6])
{
    // printf() displays the string inside quotation
    printf("Hello, World!\n");
    for (int i = 0; i < 6; i++)
    {
        a[i]++;
    }
    return a;
}