import React from "react";
import renderer from "react-test-renderer";
import { cleanup, render } from "@testing-library/react-native";
import { fireEvent } from "@testing-library/react";
import { NavigationContainer } from "@react-navigation/native";
import UserRegisterScreen from "../../screens/UserRegisterScreen";

beforeAll((done) => {
  done();
});

afterAll((done) => {
  done();
});

let findTextElement = function (tree, element) {
  console.warn(tree);
  return true;
};

describe("<UserRegisterScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <NavigationContainer>
          <UserRegisterScreen />
        </NavigationContainer>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("title text element exists", () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserRegisterScreen />
      </NavigationContainer>
    );
    const text = getByText("Create Account");
    expect(text).toBeTruthy();
  });
});
