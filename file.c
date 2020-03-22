#include <stdio.h>
#include <unistd.h>

int main(){

  setvbuf(stdout, NULL, _IONBF, 0); //disable unbuffered io/put output streams directly to buffer so node can capture it
  printf("hello from c program\n");
  sleep(1);
  printf("hello from c program\n");
  sleep(1);
  printf("hello from c program\n");
  sleep(1);
  printf("hello from c program\n");
  sleep(1);
  printf("hello from c program\n");
  sleep(1);
  printf("hello from c program\n");
  sleep(1);
  printf("hello from c program\n");
  sleep(1);
  printf("hello from c program\n");

  return 0;
}
