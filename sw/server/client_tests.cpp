#include "./utils.h"

static int parse_response_tests(){
    return 0;
}
static int form_reply_tests(){
    return 0;
}
int main(){

    cout << "Running Client Tests!" << endl;
    if(parse_response_tests()){
        cout << "Parse Reponse Tests Failed!" << endl;
        return 1;
    }
    if(form_reply_tests()){
        cout << "Form Reply Tests Failed!" << endl;
        return 1;
    }
    cout << "All Tests Passed!" << endl;
    return 0;
}