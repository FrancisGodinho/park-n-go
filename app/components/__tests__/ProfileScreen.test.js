import React from "react";
import renderer from "react-test-renderer";
import { cleanup, render } from "@testing-library/react-native";
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
  it.skip("renders correctly", () => {
    const tree = renderer
      .create(
        <NavigationContainer>
          <ProfileScreen />
        </NavigationContainer>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it.skip("screen view exists", () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );
    const item = getByTestId("screen-view");
    expect(item).toBeTruthy();
  });
});
