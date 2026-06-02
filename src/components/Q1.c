#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#define MAX_LINE 256
#define MAX_KEYWORDS 32
const char *keywords[MAX_KEYWORDS] = {
"auto", "break", "case", "char", "const", "continue", "default",
"do", "double", "else", "enum", "extern", "float", "for",
"goto", "if", "int", "long", "register", "return", "short",
"signed", "sizeof", "static", "struct", "switch", "typedef",
"union", "unsigned", "void", "volatile", "while"
};
void print_table() {
printf("%-15s %-20s %-15s\n", "Reg No", "Token Type", "Token");
printf("--------------------------------------------------------\n");
}
int is_keyword(const char *token) {
for (int i = 0; i < MAX_KEYWORDS; i++) {
if (strcmp(token, keywords[i]) == 0) return 1;
}
return 0;
int is_operator_or_delimiter(char ch) {
return strchr("+-*/=;{}()", ch) != NULL;
}
}
void identify_tokens(char *line) {
char *token = strtok(line, " \t\n");
while (token != NULL) {
if (is_keyword(token)) {
printf("%-15s %-20s %-15s\n", "23BCT0051", "Keyword", token);
}
else if (strlen(token) == 1 && is_operator_or_delimiter(token[0])) {
printf("%-15s %-20s %-15s\n", "23BCT0051", "Operator/Delimiter", token);
}
else if (isalpha(token[0]) || token[0] == '_') {
printf("%-15s %-20s %-15s\n", "23BCT0051", "Identifier", token);
}
else {
printf("%-15s %-20s %-15s\n", "23BCT0051", "Unknown", token);
}
token = strtok(NULL, " \t\n");
}
}
int main() {
FILE *file;
char line[MAX_LINE];
char filename[256];
printf("Enter source file path: ");
scanf("%s", filename);
file = fopen(filename, "r");
if (file == NULL) {
perror("Error opening file");
return EXIT_FAILURE;
}
print_table();
while (fgets(line, sizeof(line), file)) {
identify_tokens(line);
}
fclose(file);
return EXIT_SUCCESS;
}