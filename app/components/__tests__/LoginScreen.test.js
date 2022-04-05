import "@testing-library/jest-dom";
import React from "react";
import renderer from "react-test-renderer";
import { cleanup, render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../../screens/LoginScreen";

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

describe("<LoginScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <NavigationContainer>
          <LoginScreen />
        </NavigationContainer>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("welcome back text element exists", () => {
    const { getByText } = render(
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
    const header = getByText("Welcome Back");
    expect(header).toBeTruthy();
  });
});
