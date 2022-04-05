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

int main(){

    cout << "Running Client Tests!" << endl;
    cout << "----- Running Parse Response Tests -----" << endl;
    if(parse_response_tests()){
        cout << "Parse Reponse Tests Failed!" << endl;
        return 1;
    }

    cout << endl;
    cout << "\033[0;32mFinished all Tests!\033[0m" << endl;
    return 0;
}