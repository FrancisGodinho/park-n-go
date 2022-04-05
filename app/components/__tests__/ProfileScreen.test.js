import React from "react";
import renderer from "react-test-renderer";
import { cleanup } from "@testing-library/react-native";
import { fireEvent, render } from "@testing-library/react";
import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "../../screens/ProfileScreen";

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

describe("<ProfileScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <NavigationContainer>
          <ProfileScreen />
        </NavigationContainer>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
