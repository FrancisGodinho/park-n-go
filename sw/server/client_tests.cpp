#include "./utils.h"

static void print_vec(vector<vector<int>> vec) {
    for (auto i : vec) {
        cout << '[';
        for (int j = 0;  j < i.size(); j++) {
            cout << i[j];
            if (j != i.size() - 1) {
                cout << ", ";
            }
        }
        cout << "], ";
    }
    cout << endl;
}

static int parse_response_tests(){
    string test1 = "[[1, 2, 3, 4, 5, 7, 6, 8]]";
    string test2 = "[[1, 2, 3, 4], [5, 7, 6, 8]]";
    string test3 = "[[1, 2], [3, 4], [5, 7], [6, 8]]";
    string test4 = "[[1], [2], [3], [4], [5], [7], [6], [8]]";
	vector<vector<int>> img;
    
    vector<string> tests = {test1, test2, test3, test4}; 

    for (int i = 0; i < tests.size(); i++) {
        cout << "----------- TEST " + to_string(i+1) + " ------------" << endl;
        parse_response(tests[i], img);
        print_vec(img);
        img.clear();
    }

    return 0;
}

static int form_reply_tests(){
    ofstream f;
    vector<vector<int>> test_vec;

    // normal test
    f.open("form_reply_test1.txt"); 
    test_vec = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    form_reply(test_vec, f);
    f.close();

    // large numbers and zeros
    f.open("form_reply_test2.txt"); 
    test_vec = {{103, 3422, 5435}, {754, 0, 2}, {0, 0, 1}};
    form_reply(test_vec, f);
    f.close();

    // larger vector
    f.open("form_reply_test3.txt"); 
    test_vec = {{103, 3422, 5435, 234}, {754, 0, 2, 0}, {0, 0, 1, 2}, {12,3,45,6}};
    form_reply(test_vec, f);
    f.close();

    // a rectangular vector
    f.open("form_reply_test4.txt"); 
    test_vec = {{103, 3422, 5435, 234}, {754, 0, 2, 0}};
    form_reply(test_vec, f);
    f.close();

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