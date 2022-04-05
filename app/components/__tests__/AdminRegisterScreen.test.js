import React from "react";
import renderer from "react-test-renderer";
import { cleanup, render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import AdminRegisterScreen from "../../screens/AdminRegisterScreen";

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

describe("<AdminRegisterScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <NavigationContainer>
          <AdminRegisterScreen />
        </NavigationContainer>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("title text element exists", () => {
    const { getByText } = render(
      <NavigationContainer>
        <AdminRegisterScreen />
      </NavigationContainer>
    );
    const text = getByText("Create Admin Account");
    expect(text).toBeTruthy();
  });
});
